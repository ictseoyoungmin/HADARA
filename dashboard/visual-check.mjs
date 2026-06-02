// T-0214 — Dashboard visual + accessibility gate.
//
// Renders the BUILT operator console (docs/design/dashboard/index.html) via
// file:// with the read-only aggregate/projection APIs deterministically
// stubbed from committed fixtures, captures screenshot baselines for
// projection-ready/detail/offline/stale/refreshing/missing/degraded, and runs
// axe-core for accessibility. Read-only: it never executes commands and never
// mutates project state.
//
// Run inside the Playwright Docker image (see scripts/dashboard-visual-check.sh).
// Requires: playwright, @axe-core/playwright (installed by the runner script).
//
// Env:
//   DASH_HTML   path to built index.html (default: repo docs/design/dashboard/index.html)
//   DASH_OUT    output dir for screenshots (default: ./.dashboard-visual)
//   DASH_FIX    dir with committed dashboard fixtures (default: dashboard/visual-fixtures)

import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const htmlPath = process.env.DASH_HTML || path.join(repoRoot, 'docs', 'design', 'dashboard', 'index.html');
const outDir = process.env.DASH_OUT || path.join(repoRoot, '.dashboard-visual');
const fixDir = process.env.DASH_FIX || path.join(repoRoot, 'dashboard', 'visual-fixtures');

mkdirSync(outDir, { recursive: true });

const fixtures = {
  bootstrap: readFixture('bootstrap.json'),
  core: readFixture('core.json'),
  debt: readFixture('debt.json'),
  projectionMissing: readFixture('projection-status-missing.json'),
  projectionReady: readFixture('projection-status-ready.json'),
  projectionRefreshing: readFixture('projection-status-refreshing.json'),
  projectionStale: readFixture('projection-status-stale.json'),
  taskDetail: readFixture('task-detail.json'),
  timeline: readFixture('timeline.json')
};
const fileUrl = `file://${htmlPath}`;

const failures = [];

function check(name, cond) {
  if (!cond) failures.push(name);
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`);
}

function readFixture(name) {
  return readFileSync(path.join(fixDir, name), 'utf8');
}

async function a11y(page, label) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  check(`a11y[${label}] no critical/serious violations`, critical.length === 0);
  if (critical.length) {
    for (const v of critical) {
      console.log(`   - ${v.id} (${v.impact}): ${v.nodes.length} nodes`);
      for (const n of v.nodes) console.log(`       target=${JSON.stringify(n.target)} ${(n.failureSummary || '').replace(/\n/g, ' ')}`);
    }
  }
}

async function makePage(browser, stub) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.addInitScript(
    ({ fixtures, mode }) => {
      const json = (s) => new Response(s, { status: 200, headers: { 'content-type': 'application/json' } });
      const fail = () => Promise.reject(new Error('stub network failure'));
      const statusFixture =
        mode === 'projection-refreshing'
          ? fixtures.projectionRefreshing
          : mode === 'projection-stale'
            ? fixtures.projectionStale
          : mode === 'projection-missing'
            ? fixtures.projectionMissing
            : fixtures.projectionReady;
      window.fetch = async (url) => {
        const u = String(url);
        if (mode === 'degraded') return fail();
        if (mode === 'offline' && !u.includes('fixtures/hadara.ops.status.sample.json')) return new Response('', { status: 404 });
        if (u.includes('/api/dashboard/projection/status')) return json(statusFixture);
        if (u.includes('/api/dashboard/refresh')) return json(fixtures.projectionRefreshing);
        if (u.includes('/api/dashboard/task-detail')) return json(fixtures.taskDetail);
        if (u.includes('/api/dashboard/timeline')) return mode === 'projection-missing' ? new Response('', { status: 404 }) : json(fixtures.timeline);
        if (u.includes('/api/dashboard/debt')) return mode === 'projection-missing' ? new Response('', { status: 404 }) : json(fixtures.debt);
        if (u.includes('/api/dashboard/core')) return mode === 'empty' ? json(JSON.stringify({})) : json(fixtures.core);
        if (u.includes('/api/dashboard/bootstrap')) return mode === 'empty' ? json(JSON.stringify({})) : json(fixtures.bootstrap);
        return new Response('', { status: 404 });
      };
    },
    { fixtures, mode: stub }
  );
  return page;
}

const browser = await chromium.launch();

try {
  // --- projection-ready home (populated) -----------------------------------
  const home = await makePage(browser, 'projection-ready');
  await home.goto(fileUrl, { waitUntil: 'load' });
  await home.waitForSelector('.metric', { timeout: 8000 });
  await home.waitForTimeout(400);
  await home.screenshot({ path: path.join(outDir, 'projection-ready.png'), fullPage: true });

  check('one health verdict rendered', (await home.locator('.verdict').count()) >= 1);
  check('ambient provenance badge present', (await home.locator('.provenance').count()) === 1);
  check('projection provenance is labeled explicitly', (await home.locator('.provenance', { hasText: /projection/i }).count()) === 1);
  check('metrics carry context', (await home.locator('.metric-context').count()) >= 1);
  check('activity feed renders events', (await home.locator('.feed-item').count()) >= 1);
  check('copy-only command affordance present', (await home.locator('.copy-btn').count()) >= 1);
  const execButtons = await home.locator('button', { hasText: /execute|run check|close task|finish task|publish/i }).count();
  check('no command-execution button', execButtons === 0);
  const hasStorage = await home.evaluate(() => {
    try {
      return localStorage.length > 0 || sessionStorage.length > 0;
    } catch {
      return false;
    }
  });
  check('no browser-persisted project state written', hasStorage === false);
  await a11y(home, 'projection-ready');

  // --- detail (proof verdict) ----------------------------------------------
  await home.locator('.recent-item').first().click();
  await home.waitForSelector('.proof-verdict', { timeout: 8000 });
  await home.waitForTimeout(300);
  await home.screenshot({ path: path.join(outDir, 'projection-detail.png'), fullPage: true });
  check('proof verdict rendered on selection', (await home.locator('.proof-verdict').count()) >= 1);
  await a11y(home, 'projection-detail');

  // --- stale projections (stale metadata remains visible/nonblank) ----------
  const stale = await makePage(browser, 'projection-stale');
  await stale.goto(fileUrl, { waitUntil: 'load' });
  await stale.waitForSelector('.metric', { timeout: 8000 });
  await stale.waitForTimeout(400);
  await stale.screenshot({ path: path.join(outDir, 'projection-stale.png'), fullPage: true });
  await a11y(stale, 'projection-stale');

  // --- refreshing projection status ----------------------------------------
  const refreshing = await makePage(browser, 'projection-refreshing');
  await refreshing.goto(fileUrl, { waitUntil: 'load' });
  await refreshing.waitForSelector('.metric', { timeout: 8000 });
  await refreshing.waitForTimeout(400);
  await refreshing.screenshot({ path: path.join(outDir, 'projection-refreshing.png'), fullPage: true });
  await a11y(refreshing, 'projection-refreshing');

  // --- missing heavy projections (core remains usable) ---------------------
  const missing = await makePage(browser, 'projection-missing');
  await missing.goto(fileUrl, { waitUntil: 'load' });
  await missing.waitForSelector('.metric', { timeout: 8000 });
  await missing.waitForTimeout(400);
  await missing.screenshot({ path: path.join(outDir, 'projection-missing.png'), fullPage: true });
  const missingBodyLen = await missing.evaluate(() => document.getElementById('app')?.innerHTML.length || 0);
  check('missing projections keep the core view usable', missingBodyLen > 200);
  await a11y(missing, 'projection-missing');

  // --- offline (live projection/bootstrap reads unavailable) ---------------
  const offline = await makePage(browser, 'offline');
  await offline.goto(fileUrl, { waitUntil: 'load' });
  await offline.waitForTimeout(1500);
  await offline.screenshot({ path: path.join(outDir, 'offline.png'), fullPage: true });
  await a11y(offline, 'offline');

  // --- degraded (all reads fail -> retains shell, no blank) ----------------
  const degraded = await makePage(browser, 'degraded');
  await degraded.goto(fileUrl, { waitUntil: 'load' });
  await degraded.waitForTimeout(1500);
  await degraded.screenshot({ path: path.join(outDir, 'degraded.png'), fullPage: true });
  const bodyLen = await degraded.evaluate(() => document.getElementById('app')?.innerHTML.length || 0);
  check('degraded view never blanks the screen', bodyLen > 200);
  await a11y(degraded, 'degraded');
} finally {
  await browser.close();
}

console.log(`\nScreenshots written to ${outDir}`);
if (failures.length) {
  console.error(`\n${failures.length} visual/a11y check(s) failed:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('\nAll visual/a11y checks passed.');
