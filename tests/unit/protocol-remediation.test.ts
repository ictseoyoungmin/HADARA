import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createProtocolRemediateReport } from '../../src/services/protocol-remediation';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-protocol-remediation-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Status\n\nDraft.\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'DECISIONS.md'), '# DECISIONS\n\n## D-1 Legacy\n\nKeep prose.\n', 'utf8');
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('protocol remediation service', () => {
  it('dry-runs a missing Task Board row without writing, then executes the bounded row insert', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Missing board row');
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
    fs.writeFileSync(boardPath, fs.readFileSync(boardPath, 'utf8').replace(new RegExp(`\\| ${task.id} \\|[^\\n]+\\n`), ''), 'utf8');

    const dryRun = createProtocolRemediateReport({ projectRoot: root, fix: 'task-board-row', mode: 'dry-run', taskId: task.id });

    expect(dryRun).toMatchObject({
      schemaVersion: 'hadara.protocol.remediation.v1',
      command: 'protocol.remediate',
      ok: true,
      mode: 'dry-run',
      fix: 'task-board-row',
      actions: [expect.objectContaining({ status: 'planned', path: 'docs/TASK_BOARD.md' })]
    });
    expect(fs.readFileSync(boardPath, 'utf8')).not.toContain(`| ${task.id} |`);

    const executed = createProtocolRemediateReport({ projectRoot: root, fix: 'task-board-row', mode: 'execute', taskId: task.id });

    expect(executed.actions[0]).toMatchObject({ status: 'updated', path: 'docs/TASK_BOARD.md' });
    expect(fs.readFileSync(boardPath, 'utf8')).toContain(`| ${task.id} | Missing board row | Draft | tasks/${task.id}-missing-board-row |`);
  });

  it('inserts a Decisions table frame without deleting legacy prose', () => {
    const root = tempProject();
    const decisionsPath = path.join(root, 'docs', 'DECISIONS.md');

    const report = createProtocolRemediateReport({ projectRoot: root, fix: 'decisions-table-frame', mode: 'execute' });

    const content = fs.readFileSync(decisionsPath, 'utf8');
    expect(report.actions[0]).toMatchObject({ status: 'updated', path: 'docs/DECISIONS.md' });
    expect(content).toContain('| ID | Date | Decision | Status | Rationale | Evidence |');
    expect(content).toContain('## D-1 Legacy');
  });

  it('adds and updates the exact Project State HADARA profile row', () => {
    const root = tempProject();
    const projectStatePath = path.join(root, 'docs', 'PROJECT_STATE.md');

    const created = createProtocolRemediateReport({ projectRoot: root, fix: 'project-state-profile', mode: 'execute', profile: 'standard' });
    expect(created.actions[0]).toMatchObject({ status: 'updated', path: 'docs/PROJECT_STATE.md' });
    expect(fs.readFileSync(projectStatePath, 'utf8')).toContain('| HADARA Profile | standard |');

    const updated = createProtocolRemediateReport({ projectRoot: root, fix: 'project-state-profile', mode: 'execute', profile: 'governed' });
    expect(updated.actions[0]).toMatchObject({ status: 'updated', path: 'docs/PROJECT_STATE.md' });
    expect(fs.readFileSync(projectStatePath, 'utf8')).toContain('| HADARA Profile | governed |');
    expect(fs.readFileSync(projectStatePath, 'utf8')).not.toContain('| HADARA Profile | standard |');
  });

  it('creates a missing evidence.jsonl file for an existing Task Capsule', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Missing evidence index');
    const evidencePath = path.join(task.dir, 'evidence.jsonl');
    fs.rmSync(evidencePath);

    const report = createProtocolRemediateReport({ projectRoot: root, fix: 'evidence-jsonl', mode: 'execute', taskId: task.id });

    expect(report.actions[0]).toMatchObject({ status: 'created', path: `tasks/${task.id}-missing-evidence-index/evidence.jsonl` });
    expect(fs.existsSync(evidencePath)).toBe(true);
    expect(fs.readFileSync(evidencePath, 'utf8')).toBe('');
  });

  it('returns errors for required missing options', () => {
    const root = tempProject();

    expect(createProtocolRemediateReport({ projectRoot: root, fix: 'task-board-row', mode: 'dry-run' })).toMatchObject({
      ok: false,
      issues: [expect.objectContaining({ code: 'PROTOCOL_REMEDIATION_TASK_REQUIRED' })]
    });
    expect(createProtocolRemediateReport({ projectRoot: root, fix: 'project-state-profile', mode: 'dry-run' })).toMatchObject({
      ok: false,
      issues: [expect.objectContaining({ code: 'PROTOCOL_REMEDIATION_PROFILE_REQUIRED' })]
    });
  });
});
