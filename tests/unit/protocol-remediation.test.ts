import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createProtocolRemediateReport } from '../../src/services/protocol-remediation';
import { validateSchema } from '../../src/core/schema';
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
  vi.restoreAllMocks();
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
    expect(validateSchema('hadara.protocol.remediation.v1', dryRun).ok).toBe(true);
    expect(dryRun.actions[0]).toMatchObject({
      expectedBeforeExists: true,
      expectedBeforeHash: expect.stringMatching(/^[a-f0-9]{64}$/),
      afterHash: expect.stringMatching(/^[a-f0-9]{64}$/)
    });
    expect(fs.readFileSync(boardPath, 'utf8')).not.toContain(`| ${task.id} |`);

    const executed = createProtocolRemediateReport({ projectRoot: root, fix: 'task-board-row', mode: 'execute', taskId: task.id });

    expect(executed.actions[0]).toMatchObject({ status: 'updated', path: 'docs/TASK_BOARD.md' });
    expect(validateSchema('hadara.protocol.remediation.v1', executed).ok).toBe(true);
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

  it('upserts the Project State profile inside Metadata without dropping existing rows or sections', () => {
    const root = tempProject();
    const projectStatePath = path.join(root, 'docs', 'PROJECT_STATE.md');
    fs.writeFileSync(
      projectStatePath,
      '# PROJECT_STATE\n\n## Metadata\n\n| Field | Value |\n|---|---|\n| Owner | Team A |\n\n## Current Status\n\nStable.\n',
      'utf8'
    );

    createProtocolRemediateReport({ projectRoot: root, fix: 'project-state-profile', mode: 'execute', profile: 'governed' });

    const content = fs.readFileSync(projectStatePath, 'utf8');
    expect(content).toContain('| Owner | Team A |');
    expect(content).toContain('| HADARA Profile | governed |');
    expect(content).toContain('## Current Status');
    expect(content.match(/\| Field \| Value \|/g)).toHaveLength(1);
  });

  it('skips Task Board row append when the canonical table frame is missing', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Frame missing');
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
    fs.writeFileSync(boardPath, '# TASK_BOARD\n\nLost table frame.\n', 'utf8');

    const report = createProtocolRemediateReport({ projectRoot: root, fix: 'task-board-row', mode: 'execute', taskId: task.id });

    expect(report.ok).toBe(true);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'TASK_BOARD_TABLE_FRAME_MISSING', severity: 'warning' }));
    expect(report.actions[0]).toMatchObject({ status: 'skipped', path: 'docs/TASK_BOARD.md' });
    expect(fs.readFileSync(boardPath, 'utf8')).not.toContain(`| ${task.id} |`);
  });

  it('skips Decisions frame insertion when a non-canonical decision table already exists', () => {
    const root = tempProject();
    const decisionsPath = path.join(root, 'docs', 'DECISIONS.md');
    fs.writeFileSync(decisionsPath, '# DECISIONS\n\n| ID | Decision | Status | Evidence |\n|---|---|---|---|\n| D-1 | Keep legacy table. | Accepted | Existing. |\n', 'utf8');

    const report = createProtocolRemediateReport({ projectRoot: root, fix: 'decisions-table-frame', mode: 'execute' });

    expect(report.ok).toBe(true);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'DECISIONS_TABLE_FRAME_AMBIGUOUS', severity: 'warning' }));
    expect(report.actions[0]).toMatchObject({ status: 'skipped', path: 'docs/DECISIONS.md' });
    expect(fs.readFileSync(decisionsPath, 'utf8')).not.toContain('| ID | Date | Decision | Status | Rationale | Evidence |');
  });

  it('detects write conflicts before applying a planned remediation write', () => {
    const root = tempProject();
    const projectStatePath = path.join(root, 'docs', 'PROJECT_STATE.md');
    const originalReadFileSync = fs.readFileSync;
    let projectStateReads = 0;
    vi.spyOn(fs, 'readFileSync').mockImplementation((file, options) => {
      if (String(file) === projectStatePath) {
        projectStateReads += 1;
        return projectStateReads === 1 ? '# PROJECT_STATE\n' : '# PROJECT_STATE\n\nExternal change.\n';
      }
      return originalReadFileSync(file, options);
    });

    const report = createProtocolRemediateReport({ projectRoot: root, fix: 'project-state-profile', mode: 'execute', profile: 'governed' });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'PROTOCOL_REMEDIATION_WRITE_CONFLICT', severity: 'error' }));
    expect(report.actions[0]).toMatchObject({ status: 'skipped' });
    expect(validateSchema('hadara.protocol.remediation.v1', report).ok).toBe(true);
  });

  it('reports atomic write failures and leaves the original file unchanged', () => {
    const root = tempProject();
    const projectStatePath = path.join(root, 'docs', 'PROJECT_STATE.md');
    const before = fs.readFileSync(projectStatePath, 'utf8');
    vi.spyOn(fs, 'renameSync').mockImplementation(() => {
      throw new Error('simulated rename failure');
    });

    const report = createProtocolRemediateReport({ projectRoot: root, fix: 'project-state-profile', mode: 'execute', profile: 'governed' });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'PROTOCOL_REMEDIATION_ATOMIC_WRITE_FAILED', severity: 'error' }));
    expect(fs.readFileSync(projectStatePath, 'utf8')).toBe(before);
    expect(fs.readdirSync(path.dirname(projectStatePath)).filter((entry) => entry.includes('.hadara-remediate-'))).toHaveLength(0);
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
