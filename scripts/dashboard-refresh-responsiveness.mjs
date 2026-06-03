#!/usr/bin/env node
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { performance } from 'node:perf_hooks';

const require = createRequire(import.meta.url);
const { createDashboardServerResponse } = require('../dist/cli/dashboard.js');
const { clearDashboardRefreshStateForTests } = require('../dist/services/dashboard-refresh.js');

const args = parseArgs(process.argv.slice(2));
const projectRoot = path.resolve(String(args.get('--project') ?? process.cwd()));
const sampleTarget = Math.max(1, Number(args.get('--samples') ?? 20));
const pollMs = Math.max(1, Number(args.get('--poll-ms') ?? 5));
const timeoutMs = Math.max(1_000, Number(args.get('--timeout-ms') ?? 120_000));
const compareTmp = args.has('--compare-tmp');
const keepTmp = args.has('--keep-tmp');

const tmpRoots = [];

try {
  const measurements = [await measureProject('workspace', projectRoot, { sampleTarget, pollMs, timeoutMs })];
  if (compareTmp) {
    const tmpRoot = copyMeasurementProjectToTmp(projectRoot);
    tmpRoots.push(tmpRoot);
    measurements.push(await measureProject('tmp-ext4', tmpRoot, { sampleTarget, pollMs, timeoutMs }));
  }

  const report = {
    schemaVersion: 'hadara.dashboard.refresh_responsiveness_measurement.v1',
    command: 'dashboard.refresh.responsiveness',
    ok: measurements.every((measurement) => measurement.ok),
    generatedAt: new Date().toISOString(),
    projectRootRedacted: true,
    sampleTarget,
    pollMs,
    timeoutMs,
    compareTmp,
    measurements,
    issues: measurements.flatMap((measurement) => measurement.issues.map((issue) => ({ ...issue, label: measurement.label }))),
    notes: [
      'Measures the built dashboard route handler directly through createDashboardServerResponse.',
      'Core latency samples count calls made while refresh status is still refreshing before or after the core read.',
      'Stage duration metadata identifies synchronous work that prevented extra core samples during a blocking stage.',
      'The tmp-ext4 comparison copies docs/ and tasks/ only; it isolates project data read costs, not full repository build costs.'
    ]
  };

  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.ok ? 0 : 1;
} finally {
  if (!keepTmp) {
    for (const tmpRoot of tmpRoots) fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
}

async function measureProject(label, root, options) {
  clearDashboardRefreshStateForTests();
  const trigger = jsonRoute(root, '/api/dashboard/refresh');
  const coreSamples = [];
  const observationGaps = [];
  const progressSamples = [];
  const started = performance.now();
  let previousObservationAt = started;
  let latestStatus = jsonRoute(root, '/api/dashboard/projection/status');

  while (performance.now() - started < options.timeoutMs) {
    const beforeStatus = latestStatus;
    const sampleStarted = performance.now();
    const core = jsonRoute(root, '/api/dashboard/core');
    const durationMs = performance.now() - sampleStarted;
    latestStatus = jsonRoute(root, '/api/dashboard/projection/status');
    const observedAt = performance.now();
    observationGaps.push(round(observedAt - previousObservationAt));
    previousObservationAt = observedAt;

    if (beforeStatus.refresh?.state === 'refreshing' || latestStatus.refresh?.state === 'refreshing') {
      coreSamples.push(round(durationMs));
    }
    if (latestStatus.refresh?.currentStage) {
      progressSamples.push({
        stage: latestStatus.refresh.currentStage,
        processed: latestStatus.refresh.processed,
        total: latestStatus.refresh.total,
        lastYieldAt: latestStatus.refresh.lastYieldAt,
        observedAt: new Date().toISOString()
      });
    }
    if (core?.projection?.refreshState === 'failed' || latestStatus.refresh?.state === 'failed') break;
    if (latestStatus.refresh?.state === 'idle' && latestStatus.refresh?.runs >= 1) break;
    if (coreSamples.length >= options.sampleTarget && latestStatus.refresh?.state !== 'refreshing') break;
    await sleep(options.pollMs);
  }

  const taskSignalSamples = progressSamples.filter((sample) => sample.stage === 'task-signals');
  const taskSignalsProcessedIncreased = hasIncreasingProcessedSamples(taskSignalSamples);
  const stageDurations = Array.isArray(latestStatus.refresh?.stageDurations) ? latestStatus.refresh.stageDurations : [];
  const slowStageWarnings = Array.isArray(latestStatus.refresh?.slowStageWarnings) ? latestStatus.refresh.slowStageWarnings : [];
  const issues = [];
  if (!trigger.accepted) {
    issues.push({ severity: 'warning', code: 'REFRESH_NOT_ACCEPTED', message: 'Refresh trigger was coalesced or rejected.' });
  }
  if (latestStatus.refresh?.state !== 'idle') {
    issues.push({ severity: 'warning', code: 'REFRESH_NOT_IDLE', message: `Refresh ended measurement in state ${latestStatus.refresh?.state}.` });
  }
  if (taskSignalSamples.length > 1 && !taskSignalsProcessedIncreased) {
    issues.push({ severity: 'warning', code: 'TASK_SIGNAL_PROGRESS_STATIC', message: 'Task-signals progress samples did not increase.' });
  }

  return {
    label,
    ok: !issues.some((issue) => issue.severity === 'error'),
    projectRootKind: root.startsWith(os.tmpdir()) ? 'tmp-ext4' : 'workspace',
    projectRootRedacted: true,
    refreshAccepted: Boolean(trigger.accepted),
    refreshState: latestStatus.refresh?.state ?? 'unknown',
    refreshRuns: latestStatus.refresh?.runs ?? 0,
    elapsedMs: round(performance.now() - started),
    coreDuringRefresh: summarizeSamples(coreSamples),
    observationGapsMs: summarizeSamples(observationGaps),
    taskSignals: {
      sampleCount: taskSignalSamples.length,
      processedIncreased: taskSignalsProcessedIncreased,
      samples: taskSignalSamples
    },
    stages: {
      durations: stageDurations,
      slowStageWarnings
    },
    issues
  };
}

function jsonRoute(root, route) {
  const response = createDashboardServerResponse(root, route, 'GET');
  try {
    return JSON.parse(response.body);
  } catch (error) {
    throw new Error(`Route ${route} returned non-JSON status ${response.statusCode}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function copyMeasurementProjectToTmp(root) {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-dashboard-refresh-measure-'));
  for (const relative of ['AGENTS.md', 'docs', 'tasks']) {
    const source = path.join(root, relative);
    const target = path.join(tmpRoot, relative);
    if (!fs.existsSync(source)) continue;
    fs.cpSync(source, target, {
      recursive: true,
      filter: (candidate) => !candidate.includes(`${path.sep}.hadara${path.sep}`) && !candidate.includes(`${path.sep}node_modules${path.sep}`)
    });
  }
  return tmpRoot;
}

function summarizeSamples(samples) {
  if (samples.length === 0) {
    return {
      sampleCount: 0,
      p50Ms: null,
      p95Ms: null,
      minMs: null,
      maxMs: null,
      samples: []
    };
  }
  const sorted = [...samples].sort((left, right) => left - right);
  return {
    sampleCount: samples.length,
    p50Ms: percentile(sorted, 0.5),
    p95Ms: percentile(sorted, 0.95),
    minMs: round(sorted[0]),
    maxMs: round(sorted[sorted.length - 1]),
    samples: samples.map(round)
  };
}

function percentile(sorted, percentileValue) {
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * percentileValue) - 1));
  return round(sorted[index]);
}

function hasIncreasingProcessedSamples(samples) {
  let previous = null;
  for (const sample of samples) {
    if (typeof sample.processed !== 'number') continue;
    if (previous !== null && sample.processed > previous) return true;
    previous = sample.processed;
  }
  return samples.length <= 1;
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function round(value) {
  return Math.round(value * 10) / 10;
}
