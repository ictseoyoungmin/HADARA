#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const args = process.argv.slice(2);
const repoRoot = process.cwd();
const cliPath = path.resolve(readOption('--cli') ?? path.join(repoRoot, 'dist', 'cli', 'main.js'));
const profile = readOption('--profile') ?? 'standard';
const requestedProject = readOption('--project');
const projectRoot = requestedProject ? path.resolve(requestedProject) : fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-primary-workflow-'));
const totalTargetMs = Number(readOption('--target-ms') ?? 15000);
const installationMode = readOption('--installation-mode') ?? 'preinstalled-built-cli';
const installationDurationMs = Number(readOption('--installation-duration-ms') ?? 0);
const primaryMeasurements = [];
const cliCalls = [];
const recommendationEvents = [];
const manualDocumentEdits = [];
const completedStages = [];
let dropoutPoint = 'init';
let taskId = null;
let capsule = null;
let firstCorrectFile = null;
let firstCapsuleElapsedMs = null;
const workflowStarted = performance.now();

try {
  const init = invokeCli('init', 'setup', ['init', '--profile', profile, '--project', projectRoot, '--json']);
  assertOk('init', init);
  completedStages.push('init');

  dropoutPoint = 'first-correct-file';
  firstCorrectFile = measureFirstCorrectFile();
  completedStages.push('first-correct-file');

  dropoutPoint = 'inspect-empty';
  const emptyStatus = measurePrimary('inspect-empty', 'task.status', ['task', 'status', '--project', projectRoot, '--json']);
  completedStages.push('inspect-empty');

  dropoutPoint = 'create';
  const created = measurePrimary('create', 'task.create', ['task', 'create', 'Measured primary workflow', '--project', projectRoot, '--json']);
  taskId = created.taskId;
  capsule = created.task?.capsule;
  if (!taskId || !capsule) throw new Error('task.create did not return taskId and capsule.');
  firstCapsuleElapsedMs = round(installationDurationMs + performance.now() - workflowStarted);
  recordRecommendation('inspect-empty', emptyStatus, 'task.create');
  completedStages.push('create');

  dropoutPoint = 'inspect-task';
  const inspectedTask = measurePrimary('inspect-task', 'task.status', ['task', 'status', '--task', taskId, '--project', projectRoot, '--json']);
  recordNonCommandRecommendation('inspect-task', inspectedTask);
  completedStages.push('inspect-task');

  dropoutPoint = 'validate';
  const validation = measurePrimary('validate', 'validation.run', [
    'validation', 'run', '--task', taskId, '--check', 'Measured primary workflow',
    '--direct-result', 'passed', '--direct-summary', 'Disposable workflow authoring and CLI routing passed.',
    '--update-task', '--project', projectRoot, '--json'
  ]);
  const evidenceId = validation.evidence?.id;
  if (!evidenceId) throw new Error('validation.run did not return an evidence id.');
  completedStages.push('validate');

  dropoutPoint = 'author-capsule';
  manualDocumentEdits.push(...authorDisposableCapsule({ projectRoot, capsule, taskId, evidenceId, profile }));
  completedStages.push('author-capsule');

  dropoutPoint = 'close-review';
  const review = measurePrimary(
    'close-review',
    'task.close',
    ['task', 'close', '--task', taskId, '--project', projectRoot, '--dry-run', '--json'],
    (result) => result.planHash && result.primaryNextAction?.id === 'append-close-evidence'
  );
  completedStages.push('close-review');

  dropoutPoint = 'close-execute';
  const execution = measurePrimary('close-execute', 'task.close', [
    'task', 'close', '--task', taskId, '--execute', '--plan-hash', review.planHash, '--project', projectRoot, '--json'
  ]);
  recordRecommendation('close-review', review, 'task.close');
  completedStages.push('close-execute');

  dropoutPoint = 'currentness-probe';
  const docsDoctor = invokeCli('docs-doctor', 'measurement-probe', ['docs', 'doctor', '--project', projectRoot, '--json']);
  assertOk('docs-doctor', docsDoctor);
  completedStages.push('currentness-probe');

  const report = buildReport({ execution, docsDoctor, error: null });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!report.ok) process.exitCode = 1;
} catch (error) {
  const report = buildReport({ execution: null, docsDoctor: null, error });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = 1;
}

function buildReport({ execution, docsDoctor, error }) {
  const totalDurationMs = round(primaryMeasurements.reduce((sum, item) => sum + item.durationMs, 0));
  const accepted = recommendationEvents.filter((event) => event.outcome === 'accepted').length;
  const ignored = recommendationEvents.filter((event) => event.outcome === 'ignored').length;
  const corrected = recommendationEvents.filter((event) => event.outcome === 'corrected').length;
  const observed = accepted + ignored + corrected;
  const staleReferenceCount = docsDoctor?.summary?.currentnessIssues ?? null;
  const semanticDriftCount = docsDoctor?.summary?.semanticDriftIssues ?? null;
  const finalState = execution?.state ?? 'unknown';
  const ok = !error && primaryMeasurements.length === 6 && finalState === 'closed-valid' && staleReferenceCount === 0;
  return {
    schemaVersion: 'hadara.primaryWorkflow.measurement.v2',
    command: 'primary.workflow.measurement',
    ok,
    profile,
    projectRoot,
    taskId,
    budget: {
      uniquePrimaryCommandIds: ['task.status', 'task.create', 'validation.run', 'task.close'],
      maxInvocations: 6,
      actualInvocations: primaryMeasurements.length,
      totalTargetMs,
      withinTarget: totalDurationMs <= totalTargetMs
    },
    totalDurationMs,
    finalState,
    measurements: primaryMeasurements,
    metrics: {
      installationToFirstCapsule: {
        durationMs: firstCapsuleElapsedMs,
        installationMode,
        installationDurationMs,
        includesPackageInstallation: installationMode !== 'preinstalled-built-cli'
      },
      firstCorrectFile: firstCorrectFile ?? {
        path: null,
        durationMs: null,
        method: 'generated-instruction-following-simulation',
        correct: false
      },
      cliCallsToCleanClose: {
        primaryInvocations: primaryMeasurements.length,
        setupInvocations: cliCalls.filter((call) => call.kind === 'setup').length,
        measurementProbeInvocations: cliCalls.filter((call) => call.kind === 'measurement-probe').length,
        withinPrimaryBudget: primaryMeasurements.length <= 6
      },
      manualDocumentEdits: {
        count: manualDocumentEdits.length,
        edits: manualDocumentEdits
      },
      staleReferences: {
        count: staleReferenceCount,
        semanticDriftCount,
        verdict: docsDoctor?.summary?.currentnessVerdict ?? 'unknown'
      },
      profileDropout: {
        point: error ? dropoutPoint : null,
        completedStages
      },
      recommendationBehavior: {
        observed,
        accepted,
        ignored,
        corrected,
        acceptanceRate: observed > 0 ? round(accepted / observed) : null,
        events: recommendationEvents
      }
    },
    cliCalls,
    issues: [
      ...(error ? [{ severity: 'error', code: 'PRIMARY_WORKFLOW_DROPOUT', message: error instanceof Error ? error.message : String(error), stage: dropoutPoint }] : []),
      ...(primaryMeasurements.length === 6 ? [] : [{ severity: 'error', code: 'PRIMARY_INVOCATION_BUDGET_DRIFT', message: `Expected 6 invocations, observed ${primaryMeasurements.length}.` }]),
      ...(finalState === 'closed-valid' ? [] : [{ severity: 'error', code: 'PRIMARY_FINAL_STATE_INVALID', message: `Expected closed-valid, observed ${finalState}.` }]),
      ...(staleReferenceCount === null || staleReferenceCount === 0 ? [] : [{ severity: 'error', code: 'PRIMARY_STALE_REFERENCE_DRIFT', message: `Observed ${staleReferenceCount} currentness issue(s).` }]),
      ...(totalDurationMs <= totalTargetMs ? [] : [{ severity: 'warning', code: 'PRIMARY_TOTAL_TARGET_EXCEEDED', message: `Observed ${totalDurationMs} ms, above the ${totalTargetMs} ms observational target.` }]),
      ...(installationMode === 'preinstalled-built-cli' ? [{ severity: 'warning', code: 'PRIMARY_PACKAGE_INSTALL_NOT_INCLUDED', message: 'This run starts from an available built CLI; run an installed-package measurement before release readiness.' }] : [])
    ]
  };
}

function measurePrimary(step, commandId, commandArgs, accepts = (result) => result.exitCode === 0 && result.ok === true) {
  const result = invokeCli(step, 'primary', commandArgs);
  if (!accepts(result)) assertOk(step, result);
  primaryMeasurements.push({ order: primaryMeasurements.length + 1, step, commandId, durationMs: result.__durationMs, ok: true });
  return result;
}

function invokeCli(step, kind, commandArgs) {
  const started = performance.now();
  const result = runCli(commandArgs);
  const durationMs = round(performance.now() - started);
  cliCalls.push({ order: cliCalls.length + 1, step, kind, durationMs, exitCode: result.exitCode });
  return { ...result, __durationMs: durationMs };
}

function runCli(commandArgs) {
  const result = spawnSync(process.execPath, [cliPath, ...commandArgs], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024
  });
  if (result.error) throw result.error;
  const output = result.stdout.trim();
  const jsonStart = output.indexOf('{');
  try {
    return { ...JSON.parse(jsonStart >= 0 ? output.slice(jsonStart) : output), exitCode: result.status ?? 1 };
  } catch (error) {
    throw new Error(`Could not parse CLI JSON for ${commandArgs.join(' ')}: ${error.message}\n${output}\n${result.stderr}`);
  }
}

function assertOk(step, result) {
  if (result.exitCode !== 0 || result.ok !== true) {
    throw new Error(`${step} failed with exit=${result.exitCode}: ${JSON.stringify(result.issues ?? result.blockingIssues ?? [])}`);
  }
}

function measureFirstCorrectFile() {
  const started = performance.now();
  const agents = fs.readFileSync(path.join(projectRoot, 'AGENTS.md'), 'utf8');
  const expected = '.hadara/state/current.json';
  const listedPaths = [...agents.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
  const pathValue = listedPaths.find((candidate) => candidate === expected || candidate === '.hadara/context/HADARA_CONTEXT.md' || candidate === 'docs/PROJECT_STATE.md') ?? null;
  const correct = pathValue === expected && fs.existsSync(path.join(projectRoot, expected));
  if (!correct) throw new Error(`Generated onboarding did not route the first current-state read to ${expected}; observed ${pathValue ?? 'none'}.`);
  fs.readFileSync(path.join(projectRoot, pathValue), 'utf8');
  return {
    path: pathValue,
    durationMs: round(performance.now() - started),
    method: 'generated-instruction-following-simulation',
    correct
  };
}

function recordRecommendation(sourceStep, report, nextCommandId) {
  const recommendation = report.primaryNextAction ?? report.loop?.primaryNextAction;
  const command = recommendation?.command ?? null;
  if (!command) return;
  const recommendedCommandId = commandIdFrom(command);
  recommendationEvents.push({
    sourceStep,
    recommendationId: recommendation.id ?? null,
    recommendedCommandId,
    actualCommandId: nextCommandId,
    outcome: recommendedCommandId === nextCommandId ? 'accepted' : 'corrected'
  });
}

function recordNonCommandRecommendation(sourceStep, report) {
  const recommendation = report.primaryNextAction ?? report.loop?.primaryNextAction;
  if (!recommendation || recommendation.command) return;
  recommendationEvents.push({
    sourceStep,
    recommendationId: recommendation.id ?? null,
    recommendedCommandId: null,
    actualCommandId: null,
    outcome: 'non-command-guidance'
  });
}

function commandIdFrom(command) {
  if (/\btask create\b/.test(command)) return 'task.create';
  if (/\btask status\b/.test(command)) return 'task.status';
  if (/\bvalidation run\b/.test(command)) return 'validation.run';
  if (/\btask close\b/.test(command)) return 'task.close';
  return 'unknown';
}

function authorDisposableCapsule({ projectRoot, capsule, taskId, evidenceId, profile }) {
  const date = new Date().toISOString().slice(0, 10);
  const capsuleRoot = path.join(projectRoot, capsule);
  const task = `# ${taskId} Measured primary workflow

## Identity

| Field | Value |
|---|---|
| ID | ${taskId} |
| Title | Measured primary workflow |
| Status | Done |
| Created | ${date} |
| Updated | ${date} |

## Goal

| Goal | Notes |
|---|---|
| Measure the ordinary HADARA lifecycle through guarded close. | Disposable ${profile} profile project. |

## Scope

| Boundary | Items |
|---|---|
| In | Status, create, validation, close review, close execute. |
| Out | Product implementation and retained artifacts. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Inspect and create one capsule. | Done |
| 2 | Record validation evidence. | Done |
| 3 | Review and execute task close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The six-invocation route is usable through close readiness. | Met | ${evidenceId} | measurement harness |
| AC-2 | The capsule is authored for guarded closed-valid execution. | Met | ${evidenceId} | close review |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Measured primary workflow | Yes | Passed | ${evidenceId} |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Generated ${profile} scaffold | reference | active | Disposable measurement only. |

## Changes

| Area | Summary |
|---|---|
| toy project | Exercised the primary lifecycle without product changes. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | None. | Closed | N/A |

## History

| Date | State | Note |
|---|---|---|
| ${date} | Draft | Initial task scaffold. |
| ${date} | Done | Primary workflow measurement prepared for task close. |
`;
  fs.writeFileSync(path.join(capsuleRoot, 'TASK.md'), task);
  fs.writeFileSync(path.join(capsuleRoot, 'HANDOFF.md'), `# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Measured primary workflow readiness | ${evidenceId} |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| No follow-up required. | Disposable measurement only. | TASK.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| None. | None. | N/A |
`);
  return [
    { path: `${capsule}/TASK.md`, reason: 'task contract and completion evidence' },
    { path: `${capsule}/HANDOFF.md`, reason: 'task continuation and closure handoff' }
  ];
}

function readOption(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function round(value) {
  return Math.round(value * 100) / 100;
}
