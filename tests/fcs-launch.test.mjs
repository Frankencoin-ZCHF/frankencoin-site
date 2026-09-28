// Run against the local production build after `npm run build`:
// HOST=127.0.0.1 PORT=4327 node dist/server/entry.mjs
// FCS_TEST_ORIGIN=http://127.0.0.1:4327 node --test tests/fcs-launch.test.mjs
import assert from 'node:assert/strict';
import { before, test } from 'node:test';

const origin = process.env.FCS_TEST_ORIGIN ?? 'http://127.0.0.1:4327';
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(new URL(origin).hostname),
  'These integration tests must use a local server, not production');
const pages = new Map();

before(async () => {
  await Promise.all(['/', '/de/', '/governance', '/de/governance'].map(async (path) => {
    const response = await fetch(new URL(path, origin), {
      signal: AbortSignal.timeout(120_000),
    });
    assert.equal(response.status, 200, path);
    pages.set(path, await response.text());
  }));
});

function section(html, id) {
  const match = html.match(new RegExp(`<section\\b[^>]*id="${id}"[^>]*>[\\s\\S]*?</section>`));
  assert.ok(match, `Missing section: ${id}`);
  return match[0];
}

for (const [path, launchLabel] of [
  ['/', 'Frankencoin Share Token is live'],
  ['/de/', 'Frankencoin Share Token ist jetzt verfügbar'],
]) {
  test(`${path} announces FCS without replacing the ZCHF hero`, () => {
    const html = pages.get(path);
    const hero = section(html, 'main-page-header');
    assert.match(html, /<h1\b[^>]*>Frankencoin — Swiss Franc Stablecoin \(ZCHF\)<\/h1>/);
    assert.match(hero, /href="https:\/\/fcs\.frankencoin\.com"/);
    assert.ok(hero.includes(launchLabel));
    assert.doesNotMatch(hero, /opencover\.com/);
    assert.match(section(html, 'trust-security'), /href="(?:\/de)?\/insurance"/);
    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
    assert.ok(footer, 'Missing footer');
    assert.match(footer, /href="https:\/\/fcs\.frankencoin\.com"/);
    assert.match(footer, />\s*FCS App\s*</);
  });

  test(`${path} renders an accessible FCS section between introduction and uses`, () => {
    const html = pages.get(path);
    const launch = section(html, 'fcs-launch');
    const en = path === '/';
    const sectionIds = [...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map((match) => match[1]);
    const intro = sectionIds.indexOf('what-is');
    assert.deepEqual(sectionIds.slice(intro, intro + 3), ['what-is', 'fcs-launch', 'core-features']);
    assert.match(launch, /aria-labelledby="fcs-launch-title"/);
    assert.match(launch, /<h2\b[^>]*id="fcs-launch-title"/);
    const links = [...launch.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    assert.deepEqual(links.map((link) => link[1]), [
      'https://fcs.frankencoin.com',
      'https://swap.cow.fi/#/1/swap/USDT/FCS',
      en ? '/governance' : '/de/governance',
    ]);
    assert.ok(links[0][2].includes(en ? 'Explore FCS' : 'FCS entdecken'));
    assert.ok(links[1][2].includes(en ? 'Trade FCS on CoW Swap' : 'FCS auf CoW Swap handeln'));
    assert.ok(links[2][2].includes(en ? 'Learn about governance' : 'Mehr zur Governance'));
    assert.match(launch, en ? /canonical governance and share token/ : /massgebliche Governance- und Anteil-Token/);
    assert.match(launch, en ? /equity reserve/ : /Eigenkapitalreserve/);
    assert.match(launch, en ? /Time-weighted/ : /Zeitgewichtete/);
    assert.match(launch, en ? /delegate/ : /delegieren/);
    assert.match(launch, /1:1/);
    assert.match(launch, /FPS/);
    assert.equal([...launch.matchAll(/<dt\b/g)].length, 3);
    assert.doesNotMatch(launch, /<(script|iframe|video)\b|(?:src|srcset)="https?:/);
  });

  test(`${path} distinguishes FCS governance from underlying FPS`, () => {
    const html = pages.get(path);
    const en = path === '/';
    const faq = section(html, 'faq');
    assert.match(faq, en ? /How do FCS and FPS differ\?/ : /Wie unterscheiden sich FCS und FPS\?/);
    assert.match(faq, en ? /underlying Equity token/ : /zugrunde liegende Equity-Token/);
    assert.doesNotMatch(faq, /FPS holders|FPS-Inhabern|FPS is the governance token|FPS ist der Governance-Token/);
    const mechanics = section(html, 'how-does-it-work');
    assert.match(mechanics, /FCS/);
    assert.doesNotMatch(mechanics, /price depending on the profitability|Preis von der Profitabilität/);
    const governance = pages.get(en ? '/governance' : '/de/governance');
    assert.match(governance, en ? /Wrap existing FPS/ : /Bestehende FPS wrappen/);
    assert.match(governance, /1:1/);
    assert.match(governance, en ? /underlying FPS quorum/ : /zugrunde liegende FPS-Quorum/);
    // The existing live bar still measures FPS, not FCS.
    assert.match(governance, en ? /FPS Price/i : /FPS-Preis/i);
    assert.match(governance, en ? /FPS Supply/i : /FPS-Angebot/i);
    assert.doesNotMatch(html, /Governance \/ FPS/);
  });
}
