#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { performance } from 'node:perf_hooks';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (!arg.startsWith('--')) continue;
  const next = process.argv[index + 1];
  if (next && !next.startsWith('--')) {
    args.set(arg, next);
    index += 1;
  } else {
    args.set(arg, true);
  }
}

const projectRoot = process.cwd();
const port = Number(args.get('--port') ?? 4173);
const host = String(args.get('--host') ?? '127.0.0.1');
const taskId = String(args.get('--task-id') ?? 'T-0204');
const baseUrl = `http://${host}:${port}`;
const markdownPath = args.get('--markdown') ? path.resolve(projectRoot, String(args.get('--markdown'))) : null;
const sampleCount = Number(args.get('--samples') ?? 3);

const budgets = {
  shellLoadMs: 500,
  uncachedBootstrapMs: 500,
  cachedBootstrapMs: 50,
  uncachedTaskDetailMs: 800,
  cachedTaskDetailMs: 80
};

const server = spawn(process.execPath, ['dist/cli/main.js', 'dashboard', 'serve', '--host', host, '--port', String(port)], {
  cwd: projectRoot,
  stdio: ['ignore', 'pipe', 'pipe']
});

const serverOutput = [];
server.stdout.on('data', (chunk) => serverOutput.push(String(chunk)));
server.stderr.on('data', (chunk) => serverOutput.push(String(chunk)));

try {
  await waitForHttp(`${baseUrl}/api/status`, 20_000);
  const chromiumPath = findChromiumExecutable();
  const shell = await measureHtmlFetch(`${baseUrl}/dashboard/`);
  const measurements = [];

  measurements.push(await measureSeries('bootstrap_uncached_bypass', `${baseUrl}/api/dashboard/bootstrap?cache=bypass`, sampleCount));
  measurements.push(await measureSeries('bootstrap_cache_miss_then_hit', `${baseUrl}/api/dashboard/bootstrap`, sampleCount));
  measurements.push(await measureSeries('task_detail_uncached_bypass', `${baseUrl}/api/dashboard/task-detail?taskId=${taskId}&cache=bypass`, sampleCount));
  measurements.push(await measureSeries('task_detail_cache_miss_then_hit', `${baseUrl}/api/dashboard/task-detail?taskId=${taskId}`, sampleCount));
  measurements.push(await measureSeries('timeline_uncached_bypass', `${baseUrl}/api/timeline?taskId=${taskId}&cache=bypass`, sampleCount));
  measurements.push(await measureSeries('timeline_cache_miss_then_hit', `${baseUrl}/api/timeline?taskId=${taskId}`, sampleCount));

  const report = {
    schemaVersion: 'hadara.dashboard.performanceMeasurement.v1',
    command: 'dashboard.performance.measure',
    ok: true,
    generatedAt: new Date().toISOString(),
    projectRoot,
    baseUrl,
    taskId,
    sampleCount,
    browser: {
      source: 'playwright-docker-node-fetch',
      executable: chromiumPath
    },
    shellLoadMs: shell.durationMs,
    shellDomBytes: shell.domBytes,
    shellContainsDashboardRuntime: shell.containsDashboardRuntime,
    budgets,
    measurements,
    notes: [
      'Measured inside Playwright Docker against hadara dashboard serve.',
      'Shell load is dashboard HTML fetch duration from the Playwright Docker container, not a browser paint metric.',
      'Route timings are Node fetch observations from the same container against the local dashboard server.',
      'Values are advisory observations, not brittle release gates.',
      'Cache hit samples are measured after the first normal read has populated the process-memory cache.'
    ]
  };

  if (markdownPath) {
    fs.writeFileSync(markdownPath, toMarkdown(report));
  }
  console.log(JSON.stringify(report, null, 2));
} finally {
  server.kill('SIGTERM');
}

async function measureHtmlFetch(url) {
  const started = performance.now();
  const response = await fetch(url, { cache: 'no-store' });
  const html = await response.text();
  const durationMs = round(performance.now() - started);
  if (!response.ok) throw new Error(`Dashboard shell fetch failed with ${response.status}`);
  return {
    durationMs,
    domBytes: Buffer.byteLength(html),
    containsDashboardRuntime: html.includes('HadaraDashboard') || html.includes('HADARA Operator Console')
  };
}

async function measureSeries(label, url, samples) {
  const results = [];
  for (let index = 0; index < samples; index += 1) {
    results.push(await measureFetch(url));
  }
  const durations = results.map((result) => result.durationMs);
  return {
    label,
    route: url.replace(/^https?:\/\/[^/]+/, ''),
    cacheStatuses: results.map((result) => result.cacheStatus),
    samples: durations.map(round),
    minMs: round(Math.min(...durations)),
    avgMs: round(durations.reduce((sum, value) => sum + value, 0) / durations.length),
    maxMs: round(Math.max(...durations))
  };
}

async function measureFetch(url) {
  const started = performance.now();
  const response = await fetch(url, { cache: 'no-store' });
  const data = await response.json();
  return {
    status: response.status,
    durationMs: performance.now() - started,
    cacheStatus: data.cache?.status ?? null,
    ok: data.ok ?? response.ok
  };
}

async function waitForHttp(url, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Keep waiting for the local dashboard server.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Dashboard server did not become ready at ${url}. Output: ${serverOutput.join('')}`);
}

function findChromiumExecutable() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const root = '/ms-playwright';
  const candidates = fs
    .readdirSync(root)
    .filter((entry) => entry.startsWith('chromium-'))
    .flatMap((entry) => [path.join(root, entry, 'chrome-linux', 'chrome'), path.join(root, entry, 'chrome-linux64', 'chrome')]);
  const executable = candidates.find((candidate) => fs.existsSync(candidate));
  if (!executable) throw new Error(`No Chromium executable found under ${root}.`);
  return executable;
}

function runProcess(command, commandArgs, timeoutMs = 20_000) {
  return new Promise((resolve) => {
    const child = spawn(command, commandArgs, { cwd: projectRoot, stdio: ['ignore', 'pipe', 'pipe'] });
    const stdout = [];
    const stderr = [];
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill('SIGTERM');
      resolve({ code: 124, stdout: stdout.join(''), stderr: `${stderr.join('')}\nTimed out after ${timeoutMs}ms.` });
    }, timeoutMs);
    child.stdout.on('data', (chunk) => stdout.push(String(chunk)));
    child.stderr.on('data', (chunk) => stderr.push(String(chunk)));
    child.on('exit', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, stdout: stdout.join(''), stderr: stderr.join('') });
    });
  });
}

function toMarkdown(report) {
  const rows = report.measurements
    .map(
      (measurement) =>
        `| ${measurement.label} | \`${measurement.route}\` | ${measurement.cacheStatuses.join(', ')} | ${measurement.minMs} | ${measurement.avgMs} | ${measurement.maxMs} |`
    )
    .join('\n');
  return `# Dashboard Performance Measurement

Generated: ${report.generatedAt}

Environment: Playwright Docker container against \`hadara dashboard serve\`.

Task id: \`${report.taskId}\`

## Summary

| Item | Observed |
|---|---:|
| Shell load | ${report.shellLoadMs} ms |
| Shell DOM bytes | ${report.shellDomBytes} |
| Dashboard runtime found | ${report.shellContainsDashboardRuntime ? 'yes' : 'no'} |

## Route Measurements

| Label | Route | Cache statuses | Min ms | Avg ms | Max ms |
|---|---|---|---:|---:|---:|
${rows}

## Budgets

| Budget | Target |
|---|---:|
| Shell load | ${report.budgets.shellLoadMs} ms |
| Uncached bootstrap | ${report.budgets.uncachedBootstrapMs} ms |
| Cached bootstrap | ${report.budgets.cachedBootstrapMs} ms |
| Uncached task detail | ${report.budgets.uncachedTaskDetailMs} ms |
| Cached task detail | ${report.budgets.cachedTaskDetailMs} ms |

## Notes

${report.notes.map((note) => `- ${note}`).join('\n')}
`;
}

function round(value) {
  return Math.round(value * 10) / 10;
}
