/**
 * Live figures for the FCS page, read on the server (no CSP change needed).
 *
 * - FCS price and the reserve pool come from the Frankencoin API (`/ecosystem/fps/info`): FCS is priced
 *   at the FPS valuation, and the pool figure is the protocol's equity.
 * - Protocol ROE (last 12 months) comes from the API daily log, same method as
 *   app.frankencoin.com (EquityFPSDetailsCard).
 *
 * Any failed read leaves that value null, which the page renders as "—". Results are cached in memory
 * for 5 minutes, matching the page's Cache-Control.
 */

export interface FcsStats {
  /** Unix seconds of the read the price and pool figures come from. */
  timestamp: number | null;
  fcsPrice: number | null;
  reservePool: number | null;
  roe12m: number | null;
}

const EMPTY: FcsStats = { timestamp: null, fcsPrice: null, reservePool: null, roe12m: null };

/** Ethereum mainnet. Source: Frankencoin-ZCHF/Frankencoin exports/address.config.ts; FCS verified on Sourcify. */
export const FCS_ADDRESS = "0xDb861830D9Ae2d1fCF99fA0cfd3973de382B0B5b";

const API_BASE = process.env.FRANKENCOIN_API_URL ?? "https://api.frankencoin.com";
const TIMEOUT_MS = 8000;
const TTL_MS = 5 * 60 * 1000;
const MAX_LOG_AGE_DAYS = 3; // API data older than this counts as a failed read
const YEAR_S = 365 * 24 * 3600;

const num = (v: bigint) => Number(v) / 1e18;

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return (await res.json()) as T;
}

const finite = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

interface FpsInfo {
  token?: { price?: number };
  reserve?: { equity?: number };
}

/** FCS price (the FPS valuation) and the reserve pool (protocol equity). */
async function readInfo(): Promise<Partial<FcsStats>> {
  const info = await getJson<FpsInfo>("/ecosystem/fps/info");
  const fcsPrice = finite(info.token?.price);
  const reservePool = finite(info.reserve?.equity);
  if (fcsPrice === null && reservePool === null) throw new Error("fps/info has no price or equity");
  return { timestamp: Math.floor(Date.now() / 1000), fcsPrice, reservePool };
}

interface DailyLog {
  date: string;
  timestamp: string;
  totalInflow: string;
  totalOutflow: string;
  totalEquity: string;
}

/** Trailing-12-month realised earnings divided by average equity. */
async function readRoe(): Promise<Partial<FcsStats>> {
  const { logs } = await getJson<{ logs?: DailyLog[] }>("/analytics/dailyLog/json");
  if (!logs?.length) throw new Error("empty daily log");
  const last = logs[logs.length - 1];
  const lastTs = Number(last.timestamp);
  if (Date.now() / 1000 - lastTs > MAX_LOG_AGE_DAYS * 86400) throw new Error(`daily log stale (${last.date})`);
  const start = logs.find((l) => Number(l.timestamp) >= lastTs - YEAR_S);
  if (!start || lastTs - Number(start.timestamp) < YEAR_S - 7 * 86400) throw new Error("less than 12 months of history");

  const net = (l: DailyLog) => num(BigInt(l.totalInflow)) - num(BigInt(l.totalOutflow));
  const avgEquity = (num(BigInt(start.totalEquity)) + num(BigInt(last.totalEquity))) / 2;
  return { roe12m: avgEquity > 0 ? (net(last) - net(start)) / avgEquity : null };
}

let cache: { at: number; value: FcsStats } | null = null;
let inflight: Promise<FcsStats> | null = null;

async function load(): Promise<FcsStats> {
  const results = await Promise.allSettled([readInfo(), readRoe()]);
  const s: FcsStats = { ...EMPTY };
  for (const r of results) {
    if (r.status === "fulfilled") Object.assign(s, r.value);
    else console.warn("[fcs stats] read failed:", r.reason instanceof Error ? r.reason.message : r.reason);
  }
  return s;
}

export async function getFcsStats(): Promise<FcsStats> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;
  // One refresh at a time, however many requests arrive while it runs.
  inflight ??= load()
    .then((value) => {
      // Only cache a complete read, so a transient API failure is retried on the next request.
      if (value.fcsPrice !== null && value.reservePool !== null && value.roe12m !== null) cache = { at: Date.now(), value };
      return value;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Swiss grouping with an apostrophe, as elsewhere on frankencoin.com (e.g. 3'578'924). */
export function formatAmount(n: number | null, digits = 0): string {
  if (n === null || !Number.isFinite(n)) return "—";
  const [i, d] = Math.abs(n).toFixed(digits).split(".");
  return `${n < 0 ? "−" : ""}${i.replace(/\B(?=(\d{3})+(?!\d))/g, "'")}${d ? `.${d}` : ""}`;
}

export function formatPct(fraction: number | null, digits = 1): string {
  if (fraction === null || !Number.isFinite(fraction)) return "—";
  return `${(fraction * 100).toFixed(digits)}%`;
}

/** "{time}" in the template is replaced; null when the price/pool read failed. */
export function formatStamp(template: string, timestamp: number | null): string | null {
  if (timestamp === null) return null;
  const iso = new Date(timestamp * 1000).toISOString();
  return template.replace("{time}", `${iso.slice(0, 10)} ${iso.slice(11, 16)}`);
}
