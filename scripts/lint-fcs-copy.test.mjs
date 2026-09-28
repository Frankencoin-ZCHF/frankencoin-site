import { test } from "node:test";
import assert from "node:assert/strict";
import { lintCopy } from "./lint-fcs-copy.mjs";

const REQUIRED = {
  a: "the largest decentralized Swiss franc stablecoin",
  b: "No inflationary rewards.",
  c: "a share of the reserve pool",
  d: "Return on reserve pool (protocol ROE)",
};
const rules = (json, english = true) => lintCopy({ ...REQUIRED, ...json }, { english }).map((v) => v.rule);

test("clean copy passes", () => assert.deepEqual(rules({}), []));
test("banned term fails", () => assert.ok(rules({ x: "Returns are guaranteed" }).some((r) => r.includes("guaranteed"))));
test("banned term inside a URL is ignored", () => assert.deepEqual(rules({ x: "https://www.linkedin.com/company/frankencoin/" }), []));
test("'bank' outside the approved phrases fails", () => assert.ok(rules({ x: "Ask your bank" }).some((r) => r.includes("bank"))));
test("approved 'bank' phrases pass", () => assert.deepEqual(rules({ x: "an independent central bank. No bank needed." }), []));
test("market number fails", () => assert.ok(rules({ x: "Price is 1'260.85 ZCHF" }).some((r) => r.includes("hardcoded number"))));
test("allowed parameter passes", () => assert.deepEqual(rules({ x: "1% of FCS voting power" }), []));
test("contract address digits are ignored", () => assert.deepEqual(rules({ x: "0xDb861830D9Ae2d1fCF99fA0cfd3973de382B0B5b" }), []));
test("'yield' near FCS fails", () => assert.ok(rules({ x: "FCS has a yield" }).some((r) => r.includes("yield"))));
test("capitalised 'Digital Swiss Franc' fails", () => assert.ok(rules({ x: "The Digital Swiss Franc" }).some((r) => r.includes("lowercase"))));
test("missing required phrase fails", () =>
  assert.ok(lintCopy({ x: "hello" }, { english: true }).some((v) => v.rule.startsWith("required phrase missing"))));
test("German copy: numbers checked, English wording rules skipped", () => {
  assert.deepEqual(lintCopy({ x: "Keine Bank nötig" }, { english: false }), []);
  assert.ok(lintCopy({ x: "Preis 1'260.85" }, { english: false }).length > 0);
});
