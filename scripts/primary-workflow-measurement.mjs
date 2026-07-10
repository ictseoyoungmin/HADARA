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
const projectRoot = requestedProject
  ? path.resolve(requestedProject)
  : fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-primary-workflow-'));
const totalTargetMs = Number(readOption('--target-ms') ?? 15000);
const measurements = [];

const init = runCli(['init', '--profile', profile, '--project', projectRoot, '--json']);
assertOk('init', init);

measure('inspect-empty', 'task.status', ['task', 'status', '--project', projectRoot, '--json']);
const created = measure('create', 'task.create', ['task', 'create', 'Measured primary workflow', '--project', projectRoot, '--json']);
const taskId = created.taskId;
const capsule = created.task?.capsule;
if (!taskId || !capsule) throw new Error('task.create did not return taskId and capsule.');

measure('inspect-task', 'task.status', ['task', 'status', '--task', taskId, '--project', projectRoot, '--json']);
const validation = measure('validate', 'validation.run', [
  'validation', 'run', '--task', taskId, '--check', 'Measured primary workflow',
  '--direct-result', 'passed', '--direct-summary', 'Disposable workflow authoring and CLI routing passed.',
  '--update-task', '--project', projectRoot, '--json'
]);
const evidenceId = validation.evidence?.id;
if (!evidenceId) throw new Error('validation.run did not return an evidence id.');

authorDisposableCapsule({ projectRoot, capsule, taskId, evidenceId, profile });
const review = measure(
  'finalize-review',
  'task.finalize',
  ['task', 'finalize', '--task', taskId, '--project', projectRoot, '--json'],
  (result) => result.summary?.executeSupported === true && result.primaryNextAction?.id === 'finalize-execute-reviewed-plan'
);
const execution = measure('finalize-execute', 'task.finalize', [
  'task', 'finalize', '--task', taskId, '--execute', '--auto', '--project', projectRoot, '--json'
]);

const totalDurationMs = round(measurements.reduce((sum, item) => sum + item.durationMs, 0));
const report = {
  schemaVersion: 'hadara.primaryWorkflow.measurement.v1',
  command: 'primary.workflow.measurement',
  ok: measurements.length === 6 && execution.state === 'closed-valid',
  profile,
  projectRoot,
  taskId,
  budget: {
    uniquePrimaryCommandIds: ['task.status', 'task.create', 'validation.run', 'task.finalize'],
    maxInvocations: 6,
    actualInvocations: measurements.length,
    totalTargetMs,
    withinTarget: totalDurationMs <= totalTargetMs
  },
  totalDurationMs,
  finalState: execution.state ?? 'unknown',
  measurements,
  issues: [
    ...(measurements.length === 6 ? [] : [{ severity: 'error', code: 'PRIMARY_INVOCATION_BUDGET_DRIFT', message: `Expected 6 invocations, observed ${measurements.length}.` }]),
    ...(execution.state === 'closed-valid' ? [] : [{ severity: 'error', code: 'PRIMARY_FINAL_STATE_INVALID', message: `Expected closed-valid, observed ${execution.state ?? 'unknown'}.` }]),
    ...(totalDurationMs <= totalTargetMs ? [] : [{ severity: 'warning', code: 'PRIMARY_TOTAL_TARGET_EXCEEDED', message: `Observed ${totalDurationMs} ms, above the ${totalTargetMs} ms observational target.` }])
  ]
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (!report.ok) process.exitCode = 1;

function measure(step, commandId, commandArgs, accepts = (result) => result.exitCode === 0 && result.ok === true) {
  const started = performance.now();
  const result = runCli(commandArgs);
  const durationMs = round(performance.now() - started);
  if (!accepts(result)) assertOk(step, result);
  measurements.push({ order: measurements.length + 1, step, commandId, durationMs, ok: true });
  return result;
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
  let parsed;
  try {
    parsed = JSON.parse(jsonStart >= 0 ? output.slice(jsonStart) : output);
  } catch (error) {
    throw new Error(`Could not parse CLI JSON for ${commandArgs.join(' ')}: ${error.message}\n${output}\n${result.stderr}`);
  }
  return { ...parsed, exitCode: result.status ?? 1 };
}

function assertOk(step, result) {
  if (result.exitCode !== 0 || result.ok !== true) {
    throw new Error(`${step} failed with exit=${result.exitCode}: ${JSON.stringify(result.issues ?? result.blockingIssues ?? [])}`);
  }
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
| In | Status, create, validation, finalize review, finalize execute. |
| Out | Product implementation and retained artifacts. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Inspect and create one capsule. | Done |
| 2 | Record validation evidence. | Done |
| 3 | Review and execute finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The six-invocation route is usable through finalize readiness. | Met | ${evidenceId} | measurement harness |
| AC-2 | The capsule is authored for guarded closed-valid execution. | Met | ${evidenceId} | finalize review |

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
| ${date} | Done | Primary workflow measurement prepared for finalize. |
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

  replaceInFile(path.join(projectRoot, 'docs', 'PROJECT_STATE.md'), [
    ['| Name | TBD |', '| Name | Primary workflow measurement toy |'],
    ['| Purpose | Describe the project in one or two sentences. |', '| Purpose | Measure the ordinary HADARA lifecycle in a disposable project. |'],
    ['| Active Task | TBD |', `| Active Task | ${taskId} Measured primary workflow |`],
    ['| Task Capsule | Not selected | Create or select the first Task Capsule. |', `| Task Capsule | Ready to finalize | ${taskId} measurement capsule is authored and validated. |`]
  ]);
  const handoffPath = path.join(projectRoot, 'docs', 'AGENT_HANDOFF.md');
  if (fs.existsSync(handoffPath)) {
    replaceInFile(handoffPath, [
      ['| Required Reading | Pending | Read `PROJECT_STATE`, `AGENT_HANDOFF`, `TASK_BOARD`, and `HADARA_WORKFLOW` before starting. |', `| Required Reading | Complete | ${taskId} uses the generated current-state route. |`],
      ['|---|---|---|\n\n## Current Known Problems', `|---|---|---|\n| ${taskId} | Primary workflow measurement readiness. | ${evidenceId} |\n\n## Current Known Problems`],
      ['| Create or select first Task Capsule | Establish one bounded unit of work. | Task Capsule exists and is referenced from `docs/TASK_BOARD.md`. |', `| Finalize ${taskId}. | Complete the disposable measurement. | ${evidenceId} |`],
      ['|---|---|---|\n\n## Historical Index', `|---|---|---|\n| Primary workflow | ${evidenceId} | Disposable measurement readiness. |\n\n## Historical Index`],
      ['| Completed tasks | TBD | Add when handoff grows too large. |', '| Completed tasks | `docs/TASK_BOARD.md` | Disposable task index. |'],
      ['| Validation history | TBD | Add when validation notes grow too large. |', '| Validation history | `tasks/T-*/evidence.jsonl` | Canonical disposable evidence. |']
    ]);
  }
}

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of replacements) content = content.replace(from, to);
  fs.writeFileSync(filePath, content);
}

function readOption(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function round(value) {
  return Math.round(value * 100) / 100;
}
