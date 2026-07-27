#!/usr/bin/env node
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { performance } from 'node:perf_hooks';

const args = parseArgs(process.argv.slice(2));
const cwd = process.cwd();
const projectRoot = path.resolve(cwd, String(args.get('--project') ?? cwd));
const cliPath = path.resolve(cwd, String(args.get('--cli') ?? 'dist/cli/main.js'));
const taskId = String(args.get('--task') ?? 'T-0383');
const timeoutMs = numberArg('--timeout-ms', 60_000);
const killGraceMs = numberArg('--kill-grace-ms', 3_000);
const profile = String(args.get('--profile') ?? 'fast');
const fastWorkloads = new Set([
  'status_ingress',
  'task_status',
  'context_slice_range',
  'context_slice_symbol'
]);
const fullWorkloads = new Set([
  'cache_status',
  'cache_warm_dry_run',
  'graph_task',
  'graph_task_include_code',
  'status_ingress',
  'task_status',
  'context_slice_range',
  'context_slice_symbol'
]);
const selectedWorkloads = args.has('--workloads')
  ? new Set(String(args.get('--workloads')).split(',').map((value) => value.trim()).filter(Boolean))
  : profile === 'fast'
    ? fastWorkloads
    : profile === 'full'
      ? fullWorkloads
      : null;

if (!fs.existsSync(cliPath)) {
  throw new Error(`CLI path does not exist: ${cliPath}`);
}
if (!selectedWorkloads) {
  throw new Error('--profile must be fast or full.');
}

const workloads = [
  {
    label: 'cache_status',
    args: ['context', 'cache', 'status', '--project', projectRoot, '--json'],
    expect: (data) => [
      expectEqual(data.schemaVersion, 'hadara.context.cacheStatus.v1', 'schemaVersion'),
      expectEqual(data.command, 'context.cache.status', 'command'),
      expectEqual(data.readOnly, true, 'readOnly')
    ]
  },
  {
    label: 'cache_warm_dry_run',
    args: ['context', 'cache', 'warm', '--project', projectRoot, '--json'],
    expect: (data) => [
      expectEqual(data.schemaVersion, 'hadara.context.cacheWarm.v1', 'schemaVersion'),
      expectEqual(data.command, 'context.cache.warm', 'command'),
      expectEqual(data.mode, 'dry-run', 'mode'),
      expectEqual(data.summary?.writeExecuted, false, 'summary.writeExecuted')
    ]
  },
  {
    label: 'graph_task',
    args: ['context', 'graph', '--task', taskId, '--project', projectRoot, '--json'],
    expect: (data) => [
      expectEqual(data.schemaVersion, 'hadara.contextGraph.v1', 'schemaVersion'),
      expectEqual(data.command, 'context.graph', 'command'),
      expectEqual(data.taskId, taskId, 'taskId'),
      expectArray(data.nodes, 'nodes'),
      expectArray(data.edges, 'edges')
    ]
  },
  {
    label: 'graph_task_include_code',
    args: ['context', 'graph', '--task', taskId, '--include-code', '--project', projectRoot, '--json'],
    expect: (data) => [
      expectEqual(data.schemaVersion, 'hadara.contextGraph.v1', 'schemaVersion'),
      expectEqual(data.command, 'context.graph', 'command'),
      expectEqual(data.taskId, taskId, 'taskId'),
      expectArray(data.nodes, 'nodes')
    ]
  },
  {
    label: 'status_ingress',
    args: ['status', '--project', projectRoot, '--json'],
    expect: (data) => [
      expectEqual(data.schemaVersion, 'hadara.project.status.v2', 'schemaVersion'),
      expectEqual(data.command, 'status', 'command'),
      expectEqual(data.scope, 'project', 'scope')
    ]
  },
  {
    label: 'task_status',
    args: ['task', 'status', '--task', taskId, '--project', projectRoot, '--json'],
    expect: (data) => [
      expectEqual(data.schemaVersion, 'hadara.task.status.v2', 'schemaVersion'),
      expectEqual(data.command, 'task.status', 'command'),
      expectEqual(data.taskId, taskId, 'taskId')
    ]
  },
  {
    label: 'context_slice_range',
    args: [
      'context', 'slice',
      '--path', 'docs/archive/retired-2026-07-26/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md',
      '--from', '1',
      '--to', '8',
      '--project', projectRoot,
      '--json'
    ],
    expect: (data) => [
      expectEqual(data.schemaVersion, 'hadara.contextSlice.v1', 'schemaVersion'),
      expectEqual(data.command, 'context.slice', 'command'),
      expectEqual(data.strategy, 'explicit-range', 'strategy'),
      expectArray(data.slices, 'slices'),
      expectTruthy(data.slices?.[0]?.text, 'slices[0].text')
    ]
  },
  {
    label: 'context_slice_symbol',
    args: [
      'context', 'slice',
      '--path', 'src/services/project-status-v2.ts',
      '--symbol', 'createProjectStatusV2Report',
      '--window', '2',
      '--project', projectRoot,
      '--json'
    ],
    expect: (data) => [
      expectEqual(data.schemaVersion, 'hadara.contextSlice.v1', 'schemaVersion'),
      expectEqual(data.command, 'context.slice', 'command'),
      expectEqual(data.strategy, 'symbol-neighborhood', 'strategy'),
      expectArray(data.slices, 'slices'),
      expectTruthy(data.slices?.[0]?.text, 'slices[0].text')
    ]
  }
].filter((workload) => selectedWorkloads.has(workload.label));

if (workloads.length === 0) {
  throw new Error('--workloads did not match any known workload.');
}

const cacheFingerprintBefore = fingerprintContextCache(projectRoot);
const results = [];
for (const workload of workloads) {
  results.push(await runWorkload(workload));
}
const cacheFingerprintAfter = fingerprintContextCache(projectRoot);
const cacheFingerprintChanged = cacheFingerprintBefore !== cacheFingerprintAfter;
const cacheBoundaryIssue = cacheFingerprintChanged
  ? [{
      severity: 'error',
      code: 'CONTEXT_ROUTING_SMOKE_CACHE_CHANGED',
      message: 'Read-only/dry-run context-routing smoke commands changed .hadara/local/cache/context.'
    }]
  : [];

const failedWorkloads = results.filter((result) => !result.ok).length;
const report = {
  schemaVersion: 'hadara.contextRouting.e2eSmoke.v1',
  command: 'context.routing.e2e.smoke',
  ok: failedWorkloads === 0 && !cacheFingerprintChanged,
  generatedAt: new Date().toISOString(),
  projectRoot,
  cliPath: path.relative(cwd, cliPath) || cliPath,
  taskId,
  profile: args.has('--workloads') ? 'custom' : profile,
  timeoutMs,
  killGraceMs,
  selectedWorkloads: [...selectedWorkloads].sort(),
  notes: [
    'The default fast profile covers status-first ingress, selected-task status, and raw slice surfaces.',
    'Use --profile full to include cache status, cache warm dry-run, task graph, and code-aware graph workloads.',
    'The smoke pack invokes read-only or dry-run commands only and verifies .hadara/local/cache/context is unchanged.'
  ],
  summary: {
    workloads: results.length,
    passed: results.length - failedWorkloads,
    failed: failedWorkloads,
    cacheFingerprintChanged
  },
  cacheBoundary: {
    path: path.join('.hadara', 'local', 'cache', 'context'),
    before: cacheFingerprintBefore,
    after: cacheFingerprintAfter,
    changed: cacheFingerprintChanged
  },
  workloads: results,
  issues: cacheBoundaryIssue
};

console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;

async function runWorkload(workload) {
  const started = performance.now();
  const result = await runProcess(process.execPath, [cliPath, ...workload.args], { timeoutMs, killGraceMs });
  const durationMs = round(performance.now() - started);
  let parsed = null;
  let parseError = null;
  try {
    parsed = JSON.parse(result.stdout);
  } catch (error) {
    parseError = error instanceof Error ? error.message : String(error);
  }

  const expectationIssues = parsed ? workload.expect(parsed).filter(Boolean) : [];
  const issues = [
    ...(result.code === 0 ? [] : [issue('error', 'CONTEXT_ROUTING_SMOKE_EXIT_CODE', `Expected exit code 0 but got ${result.code}.`)]),
    ...(result.timedOut ? [issue('error', 'CONTEXT_ROUTING_SMOKE_TIMEOUT', `Workload timed out after ${timeoutMs} ms.`)] : []),
    ...(result.error ? [issue('error', 'CONTEXT_ROUTING_SMOKE_PROCESS_ERROR', result.error)] : []),
    ...(parseError ? [issue('error', 'CONTEXT_ROUTING_SMOKE_PARSE_ERROR', parseError)] : []),
    ...(parsed?.ok === true ? [] : [issue('error', 'CONTEXT_ROUTING_SMOKE_REPORT_NOT_OK', 'Expected child report ok:true.')]),
    ...expectationIssues
  ];

  return {
    label: workload.label,
    ok: issues.length === 0,
    command: `node ${path.relative(cwd, cliPath) || cliPath} ${workload.args.map(quoteArg).join(' ')}`,
    durationMs,
    exitCode: result.code,
    timedOut: result.timedOut,
    killedSignal: result.killedSignal,
    processError: result.error,
    schemaVersion: parsed?.schemaVersion ?? null,
    childOk: parsed?.ok ?? null,
    stdoutBytes: Buffer.byteLength(result.stdout),
    stderrBytes: Buffer.byteLength(result.stderr),
    issues
  };
}

function runProcess(command, commandArgs, options) {
  return new Promise((resolve) => {
    const stdoutPath = path.join('/tmp', `hadara-context-routing-smoke-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
    const stdoutFd = fs.openSync(stdoutPath, 'w');
    const stderr = [];
    let timedOut = false;
    let killedSignal = null;
    let settled = false;
    let killTimer = null;
    const child = spawn(command, commandArgs, {
      cwd,
      stdio: ['ignore', stdoutFd, 'pipe']
    });
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
    // Process startup can fail before stdout is fully established.
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

function fingerprintContextCache(root) {
  const cacheRoot = path.join(root, '.hadara', 'local', 'cache', 'context');
  if (!fs.existsSync(cacheRoot)) return 'missing';
  const hash = crypto.createHash('sha256');
  for (const filePath of listFiles(cacheRoot)) {
    const relative = path.relative(cacheRoot, filePath).replace(/\\/g, '/');
    hash.update(relative);
    hash.update('\0');
    hash.update(fs.readFileSync(filePath));
    hash.update('\0');
  }
  return `sha256:${hash.digest('hex')}`;
}

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(entryPath));
    if (entry.isFile()) files.push(entryPath);
  }
  return files.sort();
}

function expectEqual(actual, expected, field) {
  return actual === expected ? null : issue('error', 'CONTEXT_ROUTING_SMOKE_EXPECTATION_FAILED', `Expected ${field} to equal ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}.`);
}

function expectArray(value, field) {
  return Array.isArray(value) ? null : issue('error', 'CONTEXT_ROUTING_SMOKE_EXPECTATION_FAILED', `Expected ${field} to be an array.`);
}

function expectMaxLength(value, maxLength, field) {
  if (!Array.isArray(value)) return issue('error', 'CONTEXT_ROUTING_SMOKE_EXPECTATION_FAILED', `Expected ${field} to be an array.`);
  return value.length <= maxLength ? null : issue('error', 'CONTEXT_ROUTING_SMOKE_EXPECTATION_FAILED', `Expected ${field} length to be <= ${maxLength} but got ${value.length}.`);
}

function expectTruthy(value, field) {
  return value ? null : issue('error', 'CONTEXT_ROUTING_SMOKE_EXPECTATION_FAILED', `Expected ${field} to be present.`);
}

function issue(severity, code, message) {
  return { severity, code, message };
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

function quoteArg(value) {
  return value.includes(' ') ? JSON.stringify(value) : value;
}

function round(value) {
  return Math.round(value * 10) / 10;
}
