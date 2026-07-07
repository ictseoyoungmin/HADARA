import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleStateCommand } from '../../src/cli/state';
import { appendEvidence } from '../../src/evidence/evidence';
import { validateSchema } from '../../src/core/schema';
import { createStateProjectionReport } from '../../src/services/state-projection';
import { createTaskCloseSourceReport } from '../../src/task/task-close';
import { createTaskCapsule, TaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-state-projection-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('state consistency projection', () => {
  it('summarizes a clean project state without writing files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Projection clean task');
    completeTask(root, task);
    writeSharedState(root, task.id);
    writeDocsRegistry(root);
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), '# RELEASE_READINESS\n\nReady.\n', 'utf8');
    appendCloseEvidence(root, task, currentSourceHash(root, task.dir));
    const before = snapshotProject(root);

    const report = createStateProjectionReport(root, new Date('2026-06-15T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.stateProjection.v1',
      command: 'state.projection',
      ok: true,
      semantics: {
        ok: 'report-generated',
        consistent: 'no-error-or-warning-issues'
      },
      summary: {
        consistent: true,
        latestDoneTaskId: task.id,
        activeTaskIds: [],
        checkedTasks: 1
      },
      sources: {
        projectState: { path: 'docs/PROJECT_STATE.md', exists: true, latestCompletedTaskId: task.id, activeTaskId: null },
        agentHandoff: { path: 'docs/AGENT_HANDOFF.md', exists: true, latestCompletedTaskId: task.id, activeTaskId: null },
        taskBoard: { path: 'docs/TASK_BOARD.md', exists: true, rows: 1, latestDoneTaskId: task.id },
        developmentSlices: { path: 'docs/DEVELOPMENT_SLICES.md', exists: true, latestDoneTaskId: task.id },
        docsRegistry: { path: '.hadara/docs-registry.json', exists: true, registeredDocuments: 2 },
        releaseReadiness: { path: 'docs/RELEASE_READINESS.md', exists: true }
      },
      tasks: [
        {
          id: task.id,
          task: { exists: true, status: 'Done' },
          taskBoard: { present: true, status: 'Done' },
          handoff: { exists: true, taskStatus: 'Done', closeState: null },
          plan: { pendingRows: 0, inProgressRows: 0 },
          closeProof: { state: 'closed-valid' }
        }
      ],
      issues: []
    });
    expect(validateSchema('hadara.stateProjection.v1', report).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('reports high-value state drift with paths and fix hints', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Projection drift task');
    setTaskStatus(task.dir, 'Done');
    setTaskHandoff(task.dir, 'Done pending lifecycle close', 'almost-closed');
    replaceTaskBoardRow(root, task.id, `| ${task.id} | Projection drift task | Draft | tasks/${task.id}-wrong | |`);
    writeSharedState(root, 'T-0000');
    writeDocsRegistry(root);
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), '# RELEASE_READINESS\n\nReady.\n', 'utf8');
    appendCloseEvidence(root, task, 'sha256:0000000000000000000000000000000000000000000000000000000000000000');

    const report = createStateProjectionReport(root, new Date('2026-06-15T00:00:00.000Z'));
    const codes = report.issues.map((issue) => issue.code);

    expect(report.summary.consistent).toBe(false);
    expect(codes).toEqual(expect.arrayContaining([
      'STATE_PROJECT_STATE_LATEST_MISMATCH',
      'STATE_HANDOFF_LATEST_MISMATCH',
      'STATE_DEVELOPMENT_SLICES_LATEST_MISMATCH',
      'STATE_TASK_BOARD_STATUS_DRIFT',
      'STATE_TASK_BOARD_CAPSULE_DRIFT',
      'STATE_TASK_HANDOFF_STATUS_INVALID',
      'STATE_TASK_HANDOFF_STATUS_CLOSE_STATE_MIXED',
      'STATE_TASK_HANDOFF_CLOSE_STATE_PERSISTED',
      'STATE_TASK_HANDOFF_CLOSE_STATE_INVALID',
      'STATE_TASK_PLAN_DRIFT',
      'STATE_LATEST_CLOSE_PROOF_STALE'
    ]));
    expect(report.issues.every((issue) => issue.path && issue.fixHint)).toBe(true);
    expect(report.tasks[0].closeProof).toMatchObject({ state: 'closed-stale' });
    expect(validateSchema('hadara.stateProjection.v1', report).ok).toBe(true);
  });

  it('degrades missing optional sources to non-throwing diagnostics', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Projection partial project');

    const report = createStateProjectionReport(root, new Date('2026-06-15T00:00:00.000Z'));
    const codes = report.issues.map((issue) => issue.code);

    expect(report.ok).toBe(true);
    expect(report.semantics).toEqual({
      ok: 'report-generated',
      consistent: 'no-error-or-warning-issues'
    });
    expect(report.summary.consistent).toBe(false);
    expect(codes).toEqual(expect.arrayContaining([
      'STATE_SOURCE_MISSING',
      'STATE_DEVELOPMENT_SLICES_MISSING',
      'STATE_DOCS_REGISTRY_MISSING',
      'STATE_RELEASE_READINESS_MISSING'
    ]));
    expect(validateSchema('hadara.stateProjection.v1', report).ok).toBe(true);
  });

  it('prints full projection JSON through state verify', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Projection CLI task');
    completeTask(root, task);
    writeSharedState(root, task.id);
    writeDocsRegistry(root);
    fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), '# RELEASE_READINESS\n\nReady.\n', 'utf8');
    appendCloseEvidence(root, task, currentSourceHash(root, task.dir));
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleStateCommand({ args: ['state', 'verify', '--json'], projectRoot: root, jsonOutput: true });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0]?.[0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.stateProjection.v1',
      command: 'state.projection',
      semantics: {
        ok: 'report-generated',
        consistent: 'no-error-or-warning-issues'
      },
      summary: {
        consistent: true,
        latestDoneTaskId: task.id
      },
      issues: []
    });
    expect(validateSchema('hadara.stateProjection.v1', payload).ok).toBe(true);
  });
});

function writeSharedState(root: string, latestTaskId: string): void {
  fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), `# PROJECT_STATE

## Metadata

| Field | Value |
|---|---|
| HADARA Profile | governed |
| Latest Completed Task | ${latestTaskId} Projection fixture |
| Active Task | None |

## Current Status

- Latest completed task is ${latestTaskId}.
`, 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Latest Completed Task | ${latestTaskId} Projection fixture | Fixture. |
| Active / Next Task | Phase 8.5 | Fixture. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| ${latestTaskId} Projection fixture | Fixture. | Fixture. |
`, 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), `# DEVELOPMENT_SLICES

| Order | Slice | Capsule | Purpose | Done Evidence |
|---|---|---|---|---|
| 1 | Projection fixture | ${latestTaskId} | Fixture. | Done: fixture. |
`, 'utf8');
}

function writeDocsRegistry(root: string): void {
  fs.writeFileSync(path.join(root, '.hadara', 'docs-registry.json'), `${JSON.stringify({
    schemaVersion: 'hadara.docs.registry.v1',
    registryVersion: 1,
    projectProfile: 'governed',
    documents: [
      { path: 'docs/PROJECT_STATE.md', status: 'canonical' },
      { path: 'docs/AGENT_HANDOFF.md', status: 'canonical' }
    ]
  }, null, 2)}\n`, 'utf8');
}

function completeTask(root: string, task: TaskCapsule): void {
  setTaskStatus(task.dir, 'Done');
  setTaskHandoff(task.dir, 'Done');
  fs.writeFileSync(path.join(task.dir, 'PLAN.md'), `# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Fixture step. | Done | Fixture. |
`, 'utf8');
  replaceTaskBoardRow(root, task.id, `| ${task.id} | ${task.title} | Done | ${relative(root, task.dir)} | |`);
}

function setTaskStatus(taskDir: string, status: string): void {
  const taskPath = path.join(taskDir, 'TASK.md');
  const current = fs.readFileSync(taskPath, 'utf8');
  fs.writeFileSync(taskPath, current
    .replace(/\| Status \| [^|]+ \|/, `| Status | ${status} |`)
    .replace(/## Status\n\n[\s\S]*?\n\n## Status History/, `## Status\n\n${status}\n\n## Status History`), 'utf8');
}

function setTaskHandoff(taskDir: string, taskStatus: string, closeState?: string): void {
  const handoffPath = path.join(taskDir, 'HANDOFF.md');
  const current = fs.readFileSync(handoffPath, 'utf8');
  let next = current.includes('| TaskStatus |')
    ? current
    .replace(/\| TaskStatus \| [^|]+ \|/, `| TaskStatus | ${taskStatus} |`)
    .replace(/\| CloseState \| [^|]+ \|\r?\n?/g, '')
    : `${current.trimEnd()}\n\n## Current State\n\n| Field | Value |\n|---|---|\n| TaskStatus | ${taskStatus} |\n`;
  if (closeState) {
    next = next.replace(
      new RegExp(`\\| TaskStatus \\| ${escapeRegExp(taskStatus)} \\|\\r?\\n`),
      `| TaskStatus | ${taskStatus} |\n| CloseState | ${closeState} |\n`
    );
  }
  fs.writeFileSync(handoffPath, next, 'utf8');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceTaskBoardRow(root: string, taskId: string, row: string): void {
  const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
  const current = fs.readFileSync(boardPath, 'utf8');
  fs.writeFileSync(boardPath, current.replace(new RegExp(`\\| ${taskId} \\|[^\\n]+`), row), 'utf8');
}

function appendCloseEvidence(root: string, task: TaskCapsule, sourceHash: string): void {
  appendEvidence(root, {
    taskId: task.id,
    kind: 'command-log',
    summary: `Task close validation for ${task.id} returned ok:true before close evidence append; reportHash sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff; sourceHash ${sourceHash}.`,
    result: 'passed',
    visibility: 'public'
  });
}

function currentSourceHash(root: string, taskDir: string): string {
  const taskId = path.basename(taskDir).match(/^(T-\d{4})-/)?.[1] ?? '';
  return createTaskCloseSourceReport(root, taskId).sourceHash;
}

function snapshotProject(root: string): Record<string, string> {
  const files = [
    'docs/TASK_BOARD.md',
    'docs/PROJECT_STATE.md',
    'docs/AGENT_HANDOFF.md',
    'docs/DEVELOPMENT_SLICES.md',
    'docs/RELEASE_READINESS.md',
    '.hadara/docs-registry.json'
  ];
  const taskDirs = fs.existsSync(path.join(root, 'tasks')) ? fs.readdirSync(path.join(root, 'tasks')) : [];
  for (const taskDir of taskDirs) {
    for (const file of ['TASK.md', 'PLAN.md', 'HANDOFF.md', 'EVIDENCE.md', 'evidence.jsonl']) files.push(path.join('tasks', taskDir, file));
  }
  return Object.fromEntries(files.map((file) => [relative(root, path.join(root, file)), fs.existsSync(path.join(root, file)) ? fs.readFileSync(path.join(root, file), 'utf8') : '']));
}

function relative(root: string, value: string): string {
  return path.relative(root, value).split(path.sep).join('/');
}
