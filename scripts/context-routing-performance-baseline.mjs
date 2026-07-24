#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { performance } from 'node:perf_hooks';

const args = parseArgs(process.argv.slice(2));
const cwd = process.cwd();
const mountedProject = path.resolve(cwd, String(args.get('--mounted') ?? cwd));
const ext4Project = args.has('--ext4') ? path.resolve(cwd, String(args.get('--ext4'))) : null;
const cliPath = path.resolve(cwd, String(args.get('--cli') ?? 'dist/cli/main.js'));
const taskId = String(args.get('--task') ?? 'T-0373');
const sampleCount = numberArg('--samples', 1);
const timeoutMs = numberArg('--timeout-ms', 75_000);
const killGraceMs = numberArg('--kill-grace-ms', 3_000);
const markdownPath = args.has('--markdown') ? path.resolve(cwd, String(args.get('--markdown'))) : null;
const thresholdsPath = args.has('--thresholds') ? path.resolve(cwd, String(args.get('--thresholds'))) : null;
const failOnRegression = args.has('--fail-on-regression');
const selectedWorkloads = args.has('--workloads')
  ? new Set(String(args.get('--workloads')).split(',').map((value) => value.trim()).filter(Boolean))
  : null;

if (!fs.existsSync(cliPath)) {
  throw new Error(`CLI path does not exist: ${cliPath}`);
}
const thresholds = thresholdsPath ? readThresholds(thresholdsPath) : null;

const targets = [
  { label: 'mounted', projectRoot: mountedProject },
  ...(ext4Project ? [{ label: 'ext4', projectRoot: ext4Project }] : [])
];

const workloads = [
  {
    label: 'cache_status',
    args: (projectRoot) => ['context', 'cache', 'status', '--project', projectRoot, '--json']
  },
  {
    label: 'cache_warm_dry_run',
    args: (projectRoot) => ['context', 'cache', 'warm', '--project', projectRoot, '--json']
  },
  {
    label: 'session_start',
    args: (projectRoot) => ['session', 'start', '--task', taskId, '--project', projectRoot, '--max-read-first', '5', '--max-items', '12', '--json']
  },
  {
    label: 'session_start_include_code',
    args: (projectRoot) => ['session', 'start', '--task', taskId, '--include-code', '--project', projectRoot, '--max-read-first', '5', '--max-items', '12', '--json']
  },
  {
    label: 'graph',
    args: (projectRoot) => ['context', 'graph', '--project', projectRoot, '--json']
  },
  {
    label: 'graph_include_code',
    args: (projectRoot) => ['context', 'graph', '--include-code', '--project', projectRoot, '--json']
  }
].filter((workload) => !selectedWorkloads || selectedWorkloads.has(workload.label));

if (workloads.length === 0) {
  throw new Error('--workloads did not match any known workload.');
}

const results = [];
for (const target of targets) {
  const targetResults = [];
  for (const workload of workloads) {
    const samples = [];
    for (let index = 0; index < sampleCount; index += 1) {
      samples.push(await measureCommand(workload.label, workload.args(target.projectRoot), target.projectRoot));
    }
    targetResults.push(summarizeWorkload(workload.label, samples));
  }
  results.push({
    label: target.label,
    projectRoot: target.projectRoot,
    source: describePath(target.projectRoot),
    workloads: targetResults
  });
}

const commandOk = results.every((target) => target.workloads.every((workload) => workload.ok));
const regression = thresholds ? compareThresholds(results, thresholds, thresholdsPath) : null;
const report = {
  schemaVersion: 'hadara.contextRouting.performanceBaseline.v1',
  command: 'context.routing.performance.baseline',
  ok: commandOk && (!failOnRegression || !regression || regression.ok),
  generatedAt: new Date().toISOString(),
  cliPath: path.relative(cwd, cliPath) || cliPath,
  taskId,
  sampleCount,
  timeoutMs,
  killGraceMs,
  ...(selectedWorkloads ? { selectedWorkloads: [...selectedWorkloads].sort() } : {}),
  ...(regression ? { regression } : {}),
  targets: results,
  notes: [
    'Measurements invoke the built CLI and suppress raw command output.',
    'context cache warm is measured in dry-run mode only; this script does not write cache records.',
    'Durations are local observations for comparing mounted and ext4 behavior, not stable CI gates.',
    'Threshold comparison is advisory unless --fail-on-regression is provided.'
  ]
};

if (markdownPath) {
  fs.writeFileSync(markdownPath, toMarkdown(report));
}

console.log(JSON.stringify(report, null, 2));
if (failOnRegression && regression && !regression.ok) {
  process.exitCode = 1;
}

async function measureCommand(label, commandArgs, projectRoot) {
  const started = performance.now();
  const result = await runProcess(process.execPath, [cliPath, ...commandArgs], { timeoutMs, killGraceMs });
  const durationMs = round(performance.now() - started);
  const outputBytes = Buffer.byteLength(result.stdout);
  let parsed = null;
  let parseError = null;
  try {
    parsed = JSON.parse(result.stdout);
  } catch (error) {
    parseError = error instanceof Error ? error.message : String(error);
  }

  return {
    label,
    projectRoot,
    command: `node ${path.relative(cwd, cliPath)} ${commandArgs.map(quoteArg).join(' ')}`,
    exitCode: result.code,
    timedOut: result.timedOut,
    killedSignal: result.killedSignal,
    processError: result.error,
    durationMs,
    outputBytes,
    ok: parsed?.ok ?? false,
    schemaVersion: parsed?.schemaVersion ?? null,
    parseError,
    summary: summarizeJson(parsed),
    stderrBytes: Buffer.byteLength(result.stderr)
  };
}

function summarizeWorkload(label, samples) {
  const durations = samples.map((sample) => sample.durationMs);
  return {
    label,
    samples,
    minMs: round(Math.min(...durations)),
    avgMs: round(durations.reduce((sum, value) => sum + value, 0) / durations.length),
    maxMs: round(Math.max(...durations)),
    ok: samples.every((sample) => sample.ok && sample.exitCode === 0 && !sample.timedOut),
    timedOut: samples.some((sample) => sample.timedOut)
  };
}

function summarizeJson(data) {
  if (!data || typeof data !== 'object') return null;
  const nodeCounts = data.summary?.nodeCounts && typeof data.summary.nodeCounts === 'object' ? data.summary.nodeCounts : null;
  const edgeCounts = data.summary?.edgeCounts && typeof data.summary.edgeCounts === 'object' ? data.summary.edgeCounts : null;
  return {
    command: data.command ?? null,
    issueCodes: Array.isArray(data.issues) ? data.issues.map((issue) => issue.code).filter(Boolean).slice(0, 12) : [],
    cacheMode: data.summary?.mode ?? data.summary?.cacheMode ?? data.cache?.mode ?? null,
    cacheFresh: data.summary?.cacheFresh ?? data.manifest?.status === 'fresh' ?? null,
    fastPath: data.summary?.fastPath ?? data.manifest?.fastPath ?? data.cache?.sourceManifestFastPath ?? null,
    currentSourceCount: data.manifest?.currentSourceCount ?? null,
    cachedSourceCount: data.manifest?.cachedSourceCount ?? null,
    sourcesRead: data.summary?.sourcesRead ?? data.sourceSummary?.sourcesRead ?? null,
    degraded: data.summary?.degraded ?? data.sourceSummary?.degraded ?? null,
    nodeCount: nodeCounts ? sumObjectValues(nodeCounts) : null,
    edgeCount: edgeCounts ? sumObjectValues(edgeCounts) : null,
    readFirstCount: Array.isArray(data.readFirst) ? data.readFirst.length : null,
    contextPackReadFirstCount: Array.isArray(data.contextPack?.readFirst) ? data.contextPack.readFirst.length : null,
    includeCode: Boolean(data.sourceSummary?.codeIndexAvailable)
  };
}

function readThresholds(filePath) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Failed to read performance thresholds ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.budgets)) {
    throw new Error('Performance thresholds must be a JSON object with a budgets array.');
  }
  return parsed;
}

function compareThresholds(targets, thresholdConfig, filePath) {
  const issues = [];
  let checked = 0;
  for (const budget of thresholdConfig.budgets) {
    if (!budget || typeof budget !== 'object') continue;
    const targetLabel = String(budget.target ?? '');
    const workloadLabel = String(budget.workload ?? '');
    const target = targets.find((item) => item.label === targetLabel);
    if (!target) {
      issues.push(regressionIssue('warning', 'PERFORMANCE_BUDGET_TARGET_MISSING', `No measured target named ${targetLabel}.`, budget));
      continue;
    }
    const workload = target.workloads.find((item) => item.label === workloadLabel);
    if (!workload) {
      issues.push(regressionIssue('warning', 'PERFORMANCE_BUDGET_WORKLOAD_MISSING', `No measured workload named ${workloadLabel} for target ${targetLabel}.`, budget));
      continue;
    }
    checked += 1;
    if (typeof budget.maxAvgMs === 'number' && workload.avgMs > budget.maxAvgMs) {
      issues.push(regressionIssue('error', 'PERFORMANCE_BUDGET_AVG_EXCEEDED', `${targetLabel}/${workloadLabel} avg ${workload.avgMs} ms exceeded budget ${budget.maxAvgMs} ms.`, budget, workload));
    }
    if (typeof budget.maxMaxMs === 'number' && workload.maxMs > budget.maxMaxMs) {
      issues.push(regressionIssue('error', 'PERFORMANCE_BUDGET_MAX_EXCEEDED', `${targetLabel}/${workloadLabel} max ${workload.maxMs} ms exceeded budget ${budget.maxMaxMs} ms.`, budget, workload));
    }
  }
  const errorCount = issues.filter((issue) => issue.severity === 'error').length;
  const warningCount = issues.filter((issue) => issue.severity === 'warning').length;
  return {
    schemaVersion: 'hadara.contextRouting.performanceRegression.v1',
    ok: errorCount === 0,
    thresholdsPath: path.relative(cwd, filePath) || filePath,
    checkedBudgetCount: checked,
    errorCount,
    warningCount,
    issues
  };
}

function regressionIssue(severity, code, message, budget, workload = null) {
  return {
    severity,
    code,
    message,
    target: budget.target ?? null,
    workload: budget.workload ?? null,
    budget: {
      ...(typeof budget.maxAvgMs === 'number' ? { maxAvgMs: budget.maxAvgMs } : {}),
      ...(typeof budget.maxMaxMs === 'number' ? { maxMaxMs: budget.maxMaxMs } : {})
    },
    ...(workload ? { observed: { avgMs: workload.avgMs, maxMs: workload.maxMs, ok: workload.ok, timedOut: workload.timedOut } } : {})
  };
}

function runProcess(command, commandArgs, options) {
  return new Promise((resolve) => {
    const stdoutPath = path.join('/tmp', `hadara-context-routing-perf-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
    const stdoutFd = fs.openSync(stdoutPath, 'w');
    let timedOut = false;
    let killedSignal = null;
    const child = spawn(command, commandArgs, {
      cwd,
      stdio: ['ignore', stdoutFd, 'pipe']
    });
    const stderr = [];
    let settled = false;
    let killTimer = null;
    const timer = setTimeout(() => {
      timedOut = true;
      if (child.kill('SIGTERM')) killedSignal = 'SIGTERM';
      killTimer = setTimeout(() => {
        if (settled || child.exitCode !== null) return;
        if (child.kill('SIGKILL')) killedSignal = 'SIGKILL';
      }, options.killGraceMs);
    }, options.timeoutMs);
    child.stderr.on('data', (chunk) => stderr.push(String(chunk)));
    child.on('error', (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (killTimer) clearTimeout(killTimer);
      resolveProcessResult({
        code: 1,
        stdoutFd,
        stdoutPath,
        stderr,
        timedOut,
        killedSignal,
        error: error instanceof Error ? error.message : String(error),
        resolve
      });
    });
    child.on('close', (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (killTimer) clearTimeout(killTimer);
      resolveProcessResult({
        code: timedOut ? 124 : code,
        stdoutFd,
        stdoutPath,
        stderr,
        timedOut,
        killedSignal: killedSignal ?? signal ?? null,
        error: null,
        resolve
      });
    });
  });
}

function resolveProcessResult({ code, stdoutFd, stdoutPath, stderr, timedOut, killedSignal, error, resolve }) {
  try {
    fs.closeSync(stdoutFd);
  } catch {
    // Process startup can fail before stdio is fully owned by the child.
  }
  let stdout = '';
  try {
    stdout = fs.readFileSync(stdoutPath, 'utf8');
  } catch {
    stdout = '';
  } finally {
    fs.rmSync(stdoutPath, { force: true });
  }
  resolve({ code, stdout, stderr: stderr.join(''), timedOut, killedSignal, error });
}

function toMarkdown(report) {
  const sections = report.targets
    .map((target) => {
      const rows = target.workloads
        .map((workload) => {
          const first = workload.samples[0];
          const summary = first.summary ?? {};
          return `| ${workload.label} | ${workload.minMs} | ${workload.avgMs} | ${workload.maxMs} | ${workload.ok ? 'yes' : 'no'} | ${workload.timedOut ? 'yes' : 'no'} | ${first.outputBytes} | ${summary.cacheMode ?? ''} | ${summary.fastPath ?? ''} | ${summary.currentSourceCount ?? ''} | ${summary.sourcesRead ?? ''} | ${summary.degraded ?? ''} | ${summary.issueCodes?.join(', ') ?? ''} |`;
        })
        .join('\n');
      return `## ${target.label}

Project root: \`${target.projectRoot}\`

Source: ${target.source}

| Workload | Min ms | Avg ms | Max ms | OK | Timeout | Output bytes | Cache mode | Fast path | Sources | Sources read | Degraded | Issue codes |
|---|---:|---:|---:|---|---|---:|---|---|---:|---:|---|---|
${rows}`;
    })
    .join('\n\n');
  const regressionSection = report.regression
    ? `\n\n## Regression Check\n\nThresholds: \`${report.regression.thresholdsPath}\`\n\nStatus: ${report.regression.ok ? 'ok' : 'regression'}\n\nChecked budgets: ${report.regression.checkedBudgetCount}\n\nErrors: ${report.regression.errorCount}\n\nWarnings: ${report.regression.warningCount}\n\n${report.regression.issues.length > 0 ? report.regression.issues.map((issue) => `- ${issue.severity}: ${issue.code} - ${issue.message}`).join('\n') : '- No threshold issues.'}`
    : '';

  return `# Context Routing Performance Baseline

Generated: ${report.generatedAt}

CLI: \`${report.cliPath}\`

Task: \`${report.taskId}\`

Samples per workload: ${report.sampleCount}

Timeout: ${report.timeoutMs} ms

Kill grace: ${report.killGraceMs} ms

${sections}
${regressionSection}

## Notes

${report.notes.map((note) => `- ${note}`).join('\n')}
`;
}

function describePath(targetPath) {
  if (targetPath.startsWith('/mnt/')) return 'mounted filesystem path';
  if (targetPath.startsWith('/tmp/')) return 'ext4 tmp path';
  return 'local path';
}

function parseArgs(argv) {
  const parsed = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) continue;
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      parsed.set(arg, next);
      index += 1;
    } else {
      parsed.set(arg, true);
    }
  }
  return parsed;
}

function numberArg(name, fallback) {
  const value = args.get(name);
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive number.`);
  }
  return parsed;
}

function sumObjectValues(values) {
  return Object.values(values).reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0);
}

function quoteArg(value) {
  return value.includes(' ') ? JSON.stringify(value) : value;
}

function round(value) {
  return Math.round(value * 10) / 10;
}
