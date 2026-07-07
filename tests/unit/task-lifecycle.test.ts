import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleTaskCommand } from '../../src/cli/task';
import { validateSchema } from '../../src/core/schema';
import { appendEvidence } from '../../src/evidence/evidence';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTaskCloseReport, executeTaskCloseEvidence } from '../../src/task/task-close';
import { createTaskLifecycleReport } from '../../src/task/task-lifecycle';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-lifecycle-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('task lifecycle read model', () => {
  it('reports a draft task as finish-required without writing files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Lifecycle draft');
    const before = snapshotFiles(root);

    const report = createTaskLifecycleReport(root, task.id);

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.lifecycle.v1',
      command: 'task.lifecycle',
      ok: true,
      readOnly: true,
      phase: 'finish-required',
      checks: {
        finish: { status: 'required', sourceReport: 'hadara.task.finish.v1' }
      },
      primaryNextAction: {
        id: 'execute-finish',
        command: `hadara task finish --task ${task.id} --execute --json`,
        writeBoundary: 'task-local'
      },
      authoringGuidance: {
        readOnly: true,
        writesProse: false,
        status: 'needs-authoring'
      }
    });
    expect(report.authoringGuidance.items).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'goal', status: 'placeholder' })]));
    expect(validateSchema('hadara.task.lifecycle.v1', report).ok).toBe(true);
  });

  it('reports close-required after finish, shared docs, and readiness are satisfied', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Lifecycle close required');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);

    const report = createTaskLifecycleReport(root, task.id);

    expect(report.phase).toBe('close-required');
    expect(report.repair).toMatchObject({
      classification: 'not-closed',
      nextCommand: `hadara task close --task ${task.id} --json`
    });
    expect(report.satisfied).toEqual(expect.arrayContaining(['finish', 'sharedDocs', 'ready']));
    expect(report.checks.close.status).toBe('required');
    expect(report.primaryNextAction).toMatchObject({
      id: 'append-close-evidence',
      command: `hadara task close --task ${task.id} --execute --json`,
      writeBoundary: 'evidence-append'
    });
  });

  it('reports closed-valid after close evidence matches current source and validation hashes', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Lifecycle closed');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    appendCloseEvidence(root, task.id);

    const report = createTaskLifecycleReport(root, task.id);

    expect(report.phase).toBe('closed-valid');
    expect(report.repair).toMatchObject({ classification: 'closed-valid' });
    expect(report.primaryNextAction).toBeUndefined();
    expect(report.nextActions).toEqual([]);
    expect(report.satisfied).toEqual(expect.arrayContaining(['finish', 'sharedDocs', 'ready', 'close', 'audit']));
  });

  it('reports repair-required when close-source docs changed after close evidence', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Lifecycle close-source drift');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    appendCloseEvidence(root, task.id);
    fs.appendFileSync(path.join(task.dir, 'HANDOFF.md'), '\nPost-close close-source edit.\n', 'utf8');

    const report = createTaskLifecycleReport(root, task.id);

    expect(report.phase).toBe('repair-required');
    expect(report.checks.audit).toMatchObject({
      status: 'required',
      summary: 'Close audit requires repair.'
    });
    expect(report.repair).toMatchObject({
      classification: 'closed-stale',
      nextCommand: `hadara task close --task ${task.id} --json`
    });
    expect(report.primaryNextAction).toMatchObject({
      id: 'repair-close-proof',
      command: `hadara task close --task ${task.id} --json`,
      writeBoundary: 'read-only'
    });
    expect(validateSchema('hadara.task.lifecycle.v1', report).ok).toBe(true);
  });

});

function appendCloseEvidence(root: string, taskId: string): void {
  const closePlan = createTaskCloseReport(root, taskId, 'dry-run');
  executeTaskCloseEvidence(root, { ...closePlan, mode: 'execute' });
}

function snapshotFiles(root: string): Record<string, string> {
  const files: Record<string, string> = {};
  walk(root, (filePath) => {
    files[toPortablePath(path.relative(root, filePath))] = fs.readFileSync(filePath, 'utf8');
  });
  return files;
}

function walk(dir: string, visit: (filePath: string) => void): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, visit);
    if (entry.isFile()) visit(fullPath);
  }
}

function completeTask(root: string, taskId: string, taskDir: string): void {
  fs.writeFileSync(
    path.join(taskDir, 'TASK.md'),
    fs
      .readFileSync(path.join(taskDir, 'TASK.md'), 'utf8')
      .replace(/\| Status \| Draft \|/g, '| Status | Done |')
      .replace('| Created | TBD |', '| Created | 2026-06-20 |')
      .replace('| Updated | TBD |', '| Updated | 2026-06-20 |')
      .replace(/\nDraft\n/, '\nDone\n')
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise task lifecycle report. | Fixture verifies lifecycle phase projection. |')
      .replace('| TBD | TBD |', '| Complete fixture capsule. | Needed for done-level validation. |')
      .replace('| TBD | TBD |', '| Broad workflow mutation. | Outside fixture scope. |')
      .replace('| TBD | Draft | Initial task scaffold. | TBD |', '| 2026-06-20T00:00:00.000Z | Done | Fixture complete. | Evidence. |'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'TASK_BOARD.md'),
    fs
      .readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8')
      .split(/\r?\n/)
      .map((line) => (line.startsWith(`| ${taskId} |`) ? line.replace('| Draft |', '| Done |') : line))
      .join('\n'),
    'utf8'
  );
  fs.writeFileSync(path.join(taskDir, 'PLAN.md'), '# Plan\n\n| Step | Action | Status | Evidence |\n|---|---|---|---|\n| 1 | Complete fixture. | Done | Fixture. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'CONTEXT.md'), '# Context\n\n## Required Reading Used\n\n| Document | Why It Matters | Read Status |\n|---|---|---|\n| docs/TASK_BOARD.md | Fixture. | Read |\n\n## Assumptions\n\n| Assumption | Source | Risk If Wrong |\n|---|---|---|\n| Fixture is complete. | Test | Low. |\n\n## Constraints\n\n| Constraint | Source | Notes |\n|---|---|---|\n| Read-only lifecycle report. | Test | No writes. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'FILES.md'), '# Files\n\n| Path | Action | Reason | Status |\n|---|---|---|---|\n| src/task/task-lifecycle.ts | Add | Lifecycle report. | Done |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'ACCEPTANCE.md'), '# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|\n| AC-1 | Fixture complete. | Met | Evidence. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'TESTS.md'), '# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| Fixture | Exercise lifecycle report. | Yes | Passed | Evidence. |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n| None | No | Fixture. | Not Run | Not applicable. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'RISKS.md'), '# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n| Fixture drift | Low | Low | Keep local. | Mitigated |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'DECISIONS.md'), '# Decisions\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| D-1 | Use read-model composition. | Accepted | Test shared lifecycle reports. | Test. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'HANDOFF.md'), '# Handoff\n\n## Current State\n\n| Field | Value |\n|---|---|\n| TaskStatus | Done |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Fixture complete. | Evidence. |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| Continue. | Done. | docs/TASK_BOARD.md |\n', 'utf8');
  appendEvidence(root, { taskId, kind: 'test-log', summary: 'Lifecycle fixture validation passed.', result: 'passed', visibility: 'public' });
}

function markStateDocsCurrent(root: string, taskId: string): void {
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), `# Development Slices\n\n| ID | Task |\n|---|---|\n| 1 | ${taskId} |\n`, 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), `# Project State\n\nLatest completed task: ${taskId}.\n`, 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# Agent Handoff\n\nActive task context includes ${taskId}.\n`, 'utf8');
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
