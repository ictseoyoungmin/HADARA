import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleProofCommand } from '../../src/cli/proof';
import { appendEvidence } from '../../src/evidence/evidence';
import { createProofStatusReport } from '../../src/services/proof-status';
import { createTaskCloseReport, executeTaskCloseEvidence } from '../../src/task/task-close';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-proof-status-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('proof status reports', () => {
  it('reports sufficient proof for a closed-valid task with public substantive evidence', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Proof sufficient');
    completeTask(root, task.id, task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Focused proof validation passed',
      result: 'passed',
      visibility: 'public'
    });
    executeTaskCloseEvidence(root, createTaskCloseReport(root, task.id, 'execute'));

    const report = createProofStatusReport(root, task.id);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.proof.status.v1',
      command: 'proof.status',
      ok: true,
      taskId: task.id,
      verdict: 'sufficient',
      freshness: { status: 'fresh', closeVerdict: 'closed-valid' },
      summary: {
        passed: 3,
        failed: 0,
        blocked: 0,
        substantivePositive: 2,
        privateOnlySubstantive: 0
      },
      blockers: [],
      warnings: []
    });
    expect(report.supportingEvidence.map((record) => record.summary)).toEqual(
      expect.arrayContaining(['Focused proof validation passed'])
    );
  });

  it('reports blocked proof for unresolved failed evidence', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Proof blocked');
    completeTask(root, task.id, task.dir, { appendBaseEvidence: false });
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'pytest failed',
      result: 'failed',
      visibility: 'public'
    });

    const report = createProofStatusReport(root, task.id);

    expect(report.ok).toBe(false);
    expect(report.verdict).toBe('blocked');
    expect(report.blockers).toContainEqual(expect.objectContaining({ code: 'TASK_DONE_WITH_FAILED_EVIDENCE' }));
    expect(report.nextActions).toContainEqual(expect.objectContaining({ id: 'inspect-evidence-lint' }));
  });

  it('reports private-only substantive evidence as a warning', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Proof private only');
    completeTask(root, task.id, task.dir, { appendBaseEvidence: false });
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Private validation passed',
      result: 'passed',
      visibility: 'private'
    });

    const report = createProofStatusReport(root, task.id);

    expect(report.ok).toBe(true);
    expect(report.verdict).toBe('warning');
    expect(report.summary.privateOnlySubstantive).toBeGreaterThan(0);
    expect(report.warnings).toContainEqual(expect.objectContaining({ code: 'TASK_DONE_WITH_PRIVATE_ONLY_EVIDENCE' }));
  });

  it('prints proof explain JSON through the CLI handler', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Proof explain');
    completeTask(root, task.id, task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Done-level validation passed',
      result: 'passed',
      visibility: 'public'
    });

    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(handleProofCommand({ args: ['proof', 'explain', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    expect(JSON.parse(output.join('\n'))).toMatchObject({
      schemaVersion: 'hadara.proof.explain.v1',
      command: 'proof.explain',
      target: { kind: 'task', taskId: task.id },
      claim: 'task-readiness',
      explanation: {
        rules: expect.arrayContaining([expect.stringContaining('Substantive passed evidence')]),
        semanticIssueCodes: expect.any(Array),
        freshnessIssueCodes: expect.any(Array)
      }
    });
  });
});

function completeTask(root: string, taskId: string, taskDir: string, options: { appendBaseEvidence?: boolean } = {}): void {
  fs.writeFileSync(
    path.join(taskDir, 'TASK.md'),
    fs
      .readFileSync(path.join(taskDir, 'TASK.md'), 'utf8')
      .replace(/\| Status \| Draft \|/g, '| Status | Done |')
      .replace('| Created | TBD |', '| Created | 2026-06-09 |')
      .replace('| Updated | TBD |', '| Updated | 2026-06-09 |')
      .replace(/\nDraft\n/, '\nDone\n')
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise proof status. | Fixture verifies proof readiness. |')
      .replace('| TBD | TBD |', '| Complete fixture documents. | Needed for done-level validation. |')
      .replace('| TBD | TBD |', '| Broad workflow mutation. | Outside fixture scope. |')
      .replace('| TBD | Draft | Initial task scaffold. | TBD |', '| 2026-06-09T00:00:00.000Z | Done | Fixture complete. | Evidence. |'),
    'utf8'
  );
  updateTaskBoardDone(root, taskId);
  fs.writeFileSync(path.join(taskDir, 'PLAN.md'), '# Plan\n\n| Step | Action | Status | Evidence |\n|---|---|---|---|\n| 1 | Complete fixture. | Done | Fixture. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'CONTEXT.md'), '# Context\n\n## Required Reading Used\n\n| Document | Why It Matters | Read Status |\n|---|---|---|\n| docs/TASK_BOARD.md | Fixture. | Read |\n\n## Assumptions\n\n| Assumption | Source | Risk If Wrong |\n|---|---|---|\n| Fixture is complete. | Test | Low. |\n\n## Constraints\n\n| Constraint | Source | Notes |\n|---|---|---|\n| Proof report is read-only. | Test | No writes. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'ACCEPTANCE.md'), '# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|---|\n| AC-1 | Test acceptance. | Met | Evidence attached. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'FILES.md'), '# Files\n\n| Path | Action | Reason | Status |\n|---|---|---|---|\n| test | Modify | Test helper. | Done |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'TESTS.md'), '# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| Fixture | Exercise proof. | Yes | Passed | Evidence. |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n| None | No | Fixture. | Not Run | Not applicable. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'RISKS.md'), '# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n| Fixture drift | Low | Low | Keep local. | Mitigated |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'DECISIONS.md'), '# Decisions\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| D-1 | Use fixture. | Accepted | Test proof report. | Test. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'HANDOFF.md'), '# Handoff\n\n## Current State\n\n| Field | Value |\n|---|---|\n| Status | Done |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Fixture complete. | Evidence. |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| Continue. | Done. | docs/TASK_BOARD.md |\n', 'utf8');
  if (options.appendBaseEvidence !== false) {
    appendEvidence(root, { taskId, kind: 'test-log', summary: 'Proof-ready fixture validation passed.', result: 'passed', visibility: 'public' });
  }
}

function updateTaskBoardDone(root: string, taskId: string): void {
  const taskBoard = path.join(root, 'docs', 'TASK_BOARD.md');
  fs.writeFileSync(
    taskBoard,
    fs
      .readFileSync(taskBoard, 'utf8')
      .split(/\r?\n/)
      .map((line) => (line.startsWith(`| ${taskId} |`) ? line.replace('| Draft |', '| Done |') : line))
      .join('\n'),
    'utf8'
  );
}
