import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { appendEvidence } from '../../src/evidence/evidence';
import { handleTaskCommand } from '../../src/cli/task';
import * as harnessService from '../../src/services/harness-service';
import { createTaskWorkbenchReport } from '../../src/services/task-workbench';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-workbench-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Metadata\n\n| Field | Value |\n|---|---|\n| HADARA Profile | governed |\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\n## Current State\n\n| Area | State | Notes |\n|---|---|---|\n| Active / Next Task | T-0001 | Fixture. |\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'IMPLEMENTATION_SOP.md'), '# IMPLEMENTATION_SOP\n\n## Session Start\n\nRead docs.\n\n## Required Reading\n\n| Document | When to Read | Purpose |\n|---|---|---|\n| `docs/PROJECT_STATE.md` | Every session | State. |\n| `docs/AGENT_HANDOFF.md` | Every session | Handoff. |\n| `docs/TASK_BOARD.md` | Every session | Board. |\n| `docs/IMPLEMENTATION_SOP.md` | Every session | SOP. |\n\n## Init Profile Matrix\n\n| Profile | Scale |\n|---|---|\n| governed | Heavy |\n\n## Scaffold Document Structure\n\n| Document | Required Structure |\n|---|---|\n| docs/PROJECT_STATE.md | Product. |\n\n## Implementation\n\nWork.\n\n## Validation\n\nCheck.\n\n## Session End\n\nUpdate.\n\n## Handoff Compaction\n\nCompact.\n', 'utf8');
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

describe('task workbench status report', () => {
  it('summarizes task, evidence, close, and protocol state without writes', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench report');
    appendEvidence(root, { taskId: task.id, kind: 'note', summary: 'Fixture evidence', result: 'passed', visibility: 'public' });
    const before = snapshotProject(root);

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.workbench.v1',
      command: 'task.status',
      ok: true,
      task: {
        id: task.id,
        title: 'Workbench report',
        taskStatus: 'Draft',
        taskBoardStatus: 'Draft'
      },
      state: {
        closeState: 'not-closed',
        ready: false,
        closed: false
      },
      sources: {
        evidenceLint: { ok: true, issues: 0 },
        evidenceList: { ok: true, records: 1 },
        taskClosePlan: { ok: false, mode: 'dry-run' }
      }
    });
    expect(report.sources.evidenceList.latest).toMatchObject({ kind: 'note', result: 'passed', visibility: 'public' });
    expect(report.nextActions.length).toBeGreaterThan(0);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('returns ok false and exit code 6 for a missing task through CLI', () => {
    const root = tempProject();
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleTaskCommand({
      args: ['task', 'status', '--task', 'T-9999', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    expect(process.exitCode).toBe(6);
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.task.workbench.v1',
      command: 'task.status',
      ok: false,
      task: { id: 'T-9999', taskStatus: 'Missing', taskBoardStatus: 'Missing' }
    });
  });

  it('uses task close dry-run as the single done-level validation source', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench validation count');
    const spy = vi.spyOn(harnessService, 'createHarnessValidateReport');

    createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

function snapshotProject(root: string): Record<string, string> {
  const files = [
    'docs/TASK_BOARD.md',
    'docs/PROJECT_STATE.md',
    'docs/AGENT_HANDOFF.md',
    ...fs.readdirSync(path.join(root, 'tasks')).flatMap((taskDir) => [
      `tasks/${taskDir}/TASK.md`,
      `tasks/${taskDir}/EVIDENCE.md`,
      `tasks/${taskDir}/evidence.jsonl`
    ])
  ];
  return Object.fromEntries(files.map((file) => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
}
