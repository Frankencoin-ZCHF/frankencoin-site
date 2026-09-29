/**
 * Copy linter for the FCS page: src/content/{en,de}/fcs.json.
 *
 *   yarn lint:fcs
 *
 * Wording rules agreed for the FCS page (compliance): no banned claims, no hardcoded market numbers
 * (live figures come from Ethereum at request time), required phrases present in the English copy.
 * English copy gets every rule; German copy gets the number rule (numbers are language-independent).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** Case-insensitive. Word boundaries where a short token could hide inside other words. */
const BANNED = [
  { rule: "banned: company", re: /company/gi },
  { rule: "banned: Swiss bank", re: /swiss\s+bank/gi },
  { rule: "banned: APY", re: /\bAPY\b/gi },
  { rule: "banned: guaranteed", re: /guarantee/gi },
  { rule: "banned: only Swiss franc stablecoin", re: /only\s+(decentralized\s+)?swiss\s+franc\s+stablecoin/gi },
  { rule: "banned: no peg break", re: /no\s+peg\s+break/gi },
  { rule: "banned: zero emissions", re: /zero\s+emissions?/gi },
  { rule: "banned: limited", re: /limited/gi },
  { rule: "banned: early access", re: /early\s+access/gi },
  { rule: "banned: countdown", re: /count\s*down/gi },
  { rule: "banned: honestly", re: /honest(ly)?\b/gi },
  { rule: "use 'share of the reserve pool', never 'shares'", re: /shares\s+of\s+the\s+(equity\s+)?reserve\s+pool/gi },
  { rule: "banned: performance superlative", re: /\b(best|highest|top[- ]performing|outperform\w*|record[- ]high)\b/gi },
];

/** "bank" may only appear inside these exact phrases (team-approved "Why the Swiss franc" text). */
const BANK_ALLOWED_PHRASES = ["an independent central bank", "No bank needed."];

/** The English copy must contain these, exactly. */
const REQUIRED_EN = [
  "largest decentralized Swiss franc stablecoin",
  "no inflationary rewards",
  "share of the reserve pool",
  "Return on reserve pool (protocol ROE)",
];

/** Numbers allowed in copy: protocol parameters and dates, never market data. */
const ALLOWED_NUMBERS = new Set([
  "1", // "1 CHF"
  "1%", // FCS veto quorum (Governance.sol QUORUM = 100 bps)
  "3", // valuation factor (VALUATION_FACTOR = 3)
  "12", // "Last 12 months"
  "2023", // launch year
  // "Why the Swiss franc" (team-approved historical facts, not market data):
  "1971", // end of the dollar's gold convertibility
  "80%", // USD lost about 80% against CHF since 1971 (~4.3 -> ~0.8 CHF per USD)
  "26", // cantons
  "2003", // debt brake in force
  "40%", // statutory gold cover of the franc
  "2000", // gold cover abolished
]);

/** Every string value in the JSON, with its path. */
function strings(node, path = "") {
  if (typeof node === "string") return [{ path, value: node }];
  if (Array.isArray(node)) return node.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (node && typeof node === "object") return Object.entries(node).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  return [];
}

function numberViolations({ path, value }) {
  if (/^(https?:|\/|#)/.test(value)) return []; // URLs, paths, anchors
  const text = value.replace(/0x[0-9a-fA-F]+/g, (h) => " ".repeat(h.length));
  const out = [];
  const re = /(?<![\w.])\d[\d,.']*%?(?![A-Za-z])/g;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const token = m[0].replace(/[.,]$/, "");
    if (!ALLOWED_NUMBERS.has(token)) out.push({ path, rule: "hardcoded number (live numbers come from chain reads)", match: token });
  }
  return out;
}

function englishViolations({ path, value }) {
  const out = [];
  const push = (rule, match) => out.push({ path, rule, match });
  const prose = value.replace(/https?:\/\/\S+/g, (u) => " ".repeat(u.length));
  for (const { rule, re } of BANNED) {
    re.lastIndex = 0;
    for (let m = re.exec(prose); m; m = re.exec(prose)) push(rule, m[0]);
  }
  for (let m, re = /bank/gi; (m = re.exec(value)); ) {
    const ok = BANK_ALLOWED_PHRASES.some((phrase) => {
      const offset = phrase.toLowerCase().indexOf("bank");
      return value.slice(m.index - offset, m.index - offset + phrase.length) === phrase;
    });
    if (!ok) push("'bank' only in the approved phrases", m[0]);
  }
  for (let m, re = /digital\s+swiss\s+franc/gi; (m = re.exec(value)); ) {
    if (m[0] !== "digital Swiss franc") push("write 'digital Swiss franc' (lowercase, not a name)", m[0]);
  }
  for (let m, re = /yield/gi; (m = re.exec(value)); ) {
    if (/FCS/.test(value.slice(Math.max(0, m.index - 40), m.index + 45))) push("'yield' within 40 chars of 'FCS'", m[0]);
  }
  return out;
}

/** Lint one content object. `english` enables the wording rules and required phrases. */
export function lintCopy(json, { english }) {
  const all = strings(json);
  const v = all.flatMap(numberViolations);
  if (english) {
    v.push(...all.flatMap(englishViolations));
    const text = all.map((s) => s.value).join("\n").toLowerCase();
    for (const phrase of REQUIRED_EN) {
      if (!text.includes(phrase.toLowerCase())) v.push({ path: "(file)", rule: `required phrase missing: "${phrase}"`, match: "" });
    }
  }
  return v;
}

function main() {
  const files = [
    { file: "src/content/en/fcs.json", english: true },
    { file: "src/content/de/fcs.json", english: false },
  ];
  let failures = 0;
  for (const { file, english } of files) {
    const violations = lintCopy(JSON.parse(readFileSync(file, "utf8")), { english });
    for (const x of violations) console.error(`${file}  ${x.path}  ${x.rule}${x.match ? `  → "${x.match}"` : ""}`);
    failures += violations.length;
  }
  if (failures) {
    console.error(`\nlint:fcs failed with ${failures} violation(s).`);
    process.exit(1);
  }
  console.log(`lint:fcs passed (${files.length} files).`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
