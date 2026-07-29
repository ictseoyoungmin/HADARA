import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { afterEach, describe, expect, it } from 'vitest';
import { handleTaskCommand } from '../../src/cli/task';
import { appendEvidenceWithResult } from '../../src/evidence/evidence';
import { createTaskAuditCloseReport, createTaskCloseReport, createTaskCloseSourceReport, createTaskCloseTransactionReport } from '../../src/task/close';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { assertSchema } from '../../src/core/schema';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-close-source-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, '.hadara'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, '.hadara', 'slot-registry.json'),
    `${JSON.stringify({ schemaVersion: 'hadara.managedSlot.registry.v1', registryVersion: 1, slots: [], tableSchemas: [] }, null, 2)}\n`,
    'utf8'
  );
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('task close source', () => {
  it('reports normalized 0.4 close-source units without raw evidence or whole task-board hashes', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close source ready');
    completeTask(root, task.id, task.dir);

    const report = createTaskCloseSourceReport(root, task.id);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.closeSource.v1',
      command: 'task.close-source',
      ok: true,
      taskId: task.id,
      protocol: '0.4'
    });
    assertSchema('hadara.closeSource.v1', report);
    expect(report.sourceHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(report.sourceUnits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: 'file', path: `tasks/${task.id}-close-source-ready/TASK.md`, closeSourceRole: 'included' }),
        expect.objectContaining({ kind: 'registry', path: '.hadara/slot-registry.json', closeSourceRole: 'included' }),
        expect.objectContaining({ kind: 'derived-projection', path: 'docs/TASK_BOARD.md', selector: `task:${task.id}:command-owned-cells`, closeSourceRole: 'consistency-check' }),
        expect.objectContaining({ kind: 'derived-projection', path: `tasks/${task.id}-close-source-ready/evidence.jsonl`, selector: 'readiness-summary', closeSourceRole: 'snapshot' }),
        expect.objectContaining({ kind: 'derived-projection', path: `tasks/${task.id}-close-source-ready/HANDOFF.md`, selector: 'handoff-summary', closeSourceRole: 'snapshot' })
      ])
    );
    expect(report.sourceUnits.find((unit) => unit.path.endsWith('EVIDENCE.md'))).toBeUndefined();
    expect(report.sourceUnits.find((unit) => unit.path.endsWith('evidence.jsonl'))?.selector).toBe('readiness-summary');
    expect(report.sourceUnits.find((unit) => unit.path === 'docs/TASK_BOARD.md')?.selector).toBe(`task:${task.id}:command-owned-cells`);
    expect(report.excludedRawInputs).toEqual(expect.arrayContaining(['docs/PROJECT_STATE.md', 'docs/AGENT_HANDOFF.md']));
  });

  it('uses the close-source payload hash for close and audit source comparison', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close source hash');
    completeTask(root, task.id, task.dir);

    const closeSource = createTaskCloseSourceReport(root, task.id);
    const close = createTaskCloseReport(root, task.id, 'execute');
    expect(close.validation.validatedBeforeCloseEvidenceSourceHash).toBe(closeSource.sourceHash);
    const transaction = createTaskCloseTransactionReport(root, task.id);
    expect(transaction.issues).toEqual([]);
    expect(transaction.ok).toBe(true);

    const audit = createTaskAuditCloseReport(root, task.id);
    expect(audit.currentSourceHash).toBe(createTaskCloseSourceReport(root, task.id).sourceHash);
    expect(audit.auditVerdict.sourceHashMatches).toBe(true);
  });

  it('routes task close-source through the CLI', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close source CLI');
    completeTask(root, task.id, task.dir);
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(handleTaskCommand({ args: ['task', 'close-source', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }
    expect(JSON.parse(output.join('\n'))).toMatchObject({
      schemaVersion: 'hadara.closeSource.v1',
      command: 'task.close-source',
      ok: true,
      taskId: task.id
    });
  });
});

function completeTask(root: string, taskId: string, taskDir: string): void {
  updateTaskBoardDone(root, taskId);
  const evidence = appendEvidenceWithResult(root, { taskId, kind: 'test-log', summary: 'Close-source fixture validation passed.', result: 'passed', visibility: 'public', category: 'validation', outcome: 'passed' });
  const evidenceId = evidence.evidence.schemaVersion === 'hadara.evidence.v2' ? evidence.evidence.id : 'evidence.jsonl';
  const taskBoardHash = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'))).digest('hex');
  fs.writeFileSync(
    path.join(taskDir, 'TASK.md'),
    fs
      .readFileSync(path.join(taskDir, 'TASK.md'), 'utf8')
      .replace(/\| Status \| Draft \|/g, '| Status | Done |')
      .replace('| Created | TBD |', '| Created | 2026-06-30 |')
      .replace('| Updated | TBD |', '| Updated | 2026-06-30 |')
      .replace(/\nDraft\n/, '\nDone\n')
      .replace(/## Scope\n\n[\s\S]*?(?=## Plan)/, '## Scope\n\n| Boundary | Items |\n|---|---|\n| In | Close-source fixture. |\n| Out | Unrelated workflow changes. |\n\n')
      .replace(
        '## Inputs / Constraints\n\n| Source | Role | State | Notes |\n|---|---|---|---|\n| TBD | reference | active | TBD |',
        `## Inputs / Constraints\n\n| Path / Source | Type | Authority | State | Notes | Hash |\n|---|---|---|---|---|---|\n| docs/TASK_BOARD.md | reference | approved | implemented | Fixture. | sha256:${taskBoardHash} |`
      )
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise close source. | Fixture verifies source units. |')
      .replace('| 1 | Define the task contract. | Pending |', '| 1 | Define the task contract. | Done |')
      .replace('| 2 | Implement the smallest useful slice. | Pending |', '| 2 | Implement fixture. | Done |')
      .replace('| 3 | Validate and record evidence. | Pending |', '| 3 | Validate and record evidence. | Done |')
      .replace(/## Acceptance\n\n[\s\S]*?(?=## Validation)/, `## Acceptance\n\n| ID | Criterion | State | Evidence | Reference |\n|---|---|---|---|---|\n| AC-1 | Scope is implemented. | Done | ${evidenceId} | docs/TASK_BOARD.md |\n| AC-2 | Validation evidence is recorded. | Done | ${evidenceId} | docs/TASK_BOARD.md |\n\n`)
      .replace(/## Validation\n\n[\s\S]*?(?=## Inputs \/ Constraints)/, `## Validation\n\n| Check | Gate | Status | Detail | Evidence |\n|---|---|---|---|---|\n| Fixture | Yes | Passed | Fixture. | ${evidenceId} |\n\n`)
      .replace(/## Changes\n\n[\s\S]*?(?=## Risks \/ Follow-ups)/, '## Changes\n\n| Area | Summary |\n|---|---|\n| src/task/close/proof.ts | Fixture. |\n\n')
      .replace(/## Risks \/ Follow-ups\n\n[\s\S]*?(?=## Close Summary)/, '## Risks / Follow-ups\n\n| ID | Type | Summary | State | Link |\n|---|---|---|---|---|\n| RF-1 | Follow-up | None. | Deferred | docs/TASK_BOARD.md |\n\n')
      .replace(/## History\n\n[\s\S]*$/, '## History\n\n| Date | State | Note |\n|---|---|---|\n| 2026-07-29 | Draft | Initial task scaffold. |\n| 2026-06-30 | Done | Fixture complete. |\n'),
    'utf8'
  );
  fs.writeFileSync(path.join(taskDir, 'HANDOFF.md'), `# Handoff

## Identity

| Field | Value |
|---|---|
| ID | ${taskId} |
| Title | ${taskId} |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Last Completed

| Item | Evidence |
|---|---|
| Fixture complete. | Fixture. |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| None. | terminal | no | Done. | docs/TASK_BOARD.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
`, 'utf8');
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
