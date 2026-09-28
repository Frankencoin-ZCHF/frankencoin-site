/**
 * Live figures for the FCS page, read on the server (no CSP change needed).
 *
 * - FCS price and the reserve pool are read from Ethereum in one multicall, pinned to a single block,
 *   so the block number and time shown on the page belong to exactly these values.
 * - Protocol ROE (last 12 months) comes from the Frankencoin API daily log, same method as
 *   app.frankencoin.com (EquityFPSDetailsCard).
 *
 * Any failed read leaves that value null, which the page renders as "—". Results are cached in memory
 * for 5 minutes, matching the page's Cache-Control.
 */
import { createPublicClient, formatUnits, http, parseAbi } from "viem";
import { mainnet } from "viem/chains";

export interface FcsStats {
  block: number | null;
  timestamp: number | null;
  fcsPrice: number | null;
  reservePool: number | null;
  roe12m: number | null;
}

const EMPTY: FcsStats = { block: null, timestamp: null, fcsPrice: null, reservePool: null, roe12m: null };

/** Ethereum mainnet. Source: Frankencoin-ZCHF/Frankencoin exports/address.config.ts; FCS verified on Sourcify. */
export const FCS_ADDRESS = "0xDb861830D9Ae2d1fCF99fA0cfd3973de382B0B5b";
const ZCHF = "0xB58E61C3098d85632Df34EecfB899A1Ed80921cB";
const FPS = "0x1bA26788dfDe592fec8bcB0Eaff472a42BE341B2";

const API_BASE = process.env.FRANKENCOIN_API_URL ?? "https://api.frankencoin.com";
const RPC_URL = process.env.ETH_RPC_URL || "https://ethereum-rpc.publicnode.com";
const TIMEOUT_MS = 8000;
const TTL_MS = 5 * 60 * 1000;
const MAX_LOG_AGE_DAYS = 3; // API data older than this counts as a failed read
const YEAR_S = 365 * 24 * 3600;

const client = createPublicClient({ chain: mainnet, transport: http(RPC_URL, { timeout: TIMEOUT_MS, retryCount: 1 }) });

const ABI = {
  zchf: parseAbi(["function equity() view returns (uint256)"]),
  fps: parseAbi(["function price() view returns (uint256)"]),
  fcs: parseAbi(["function ask() view returns (uint256)"]),
};

const num = (v: bigint) => Number(formatUnits(v, 18));

async function readChain(): Promise<Partial<FcsStats>> {
  const block = await client.getBlock({ blockTag: "latest" });
  const [equity, fcsAsk, fpsPrice] = await client.multicall({
    blockNumber: block.number,
    allowFailure: true,
    contracts: [
      { address: ZCHF, abi: ABI.zchf, functionName: "equity" },
      { address: FCS_ADDRESS, abi: ABI.fcs, functionName: "ask" },
      { address: FPS, abi: ABI.fps, functionName: "price" },
    ],
  });
  const val = (r: { status: string; result?: unknown }) => (r.status === "success" ? num(r.result as bigint) : null);
  return {
    block: Number(block.number),
    timestamp: Number(block.timestamp),
    reservePool: val(equity),
    // FCS.ask() is the FCS price; FPS.price() is the same valuation and serves as a fallback.
    fcsPrice: val(fcsAsk) ?? val(fpsPrice),
  };
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
  const res = await fetch(`${API_BASE}/analytics/dailyLog/json`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`dailyLog → ${res.status}`);
  const { logs } = (await res.json()) as { logs?: DailyLog[] };
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
  const results = await Promise.allSettled([readChain(), readRoe()]);
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
      // Only cache a complete read, so a transient RPC failure is retried on the next request.
      if (value.block !== null && value.roe12m !== null) cache = { at: Date.now(), value };
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

/** "{block}" and "{time}" in the template are replaced; null when the chain read failed. */
export function formatStamp(template: string, block: number | null, timestamp: number | null): string | null {
  if (block === null || timestamp === null) return null;
  const iso = new Date(timestamp * 1000).toISOString();
  return template.replace("{block}", formatAmount(block)).replace("{time}", `${iso.slice(0, 10)} ${iso.slice(11, 16)}`);
}
