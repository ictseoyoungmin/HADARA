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

    const executed = createProtocolRemediateReport({ projectRoot: root, fix: 'task-board-row', mode: 'execute', taskId: task.id, beforeHash: dryRun.summary.beforeHash ?? undefined });

    expect(executed.actions[0]).toMatchObject({ status: 'updated', path: 'docs/TASK_BOARD.md' });
    expect(validateSchema('hadara.protocol.remediation.v1', executed).ok).toBe(true);
    expect(fs.readFileSync(boardPath, 'utf8')).toContain(`| ${task.id} | Missing board row | Draft | tasks/${task.id}-missing-board-row |`);
  });

  it('inserts a Decisions table frame without deleting legacy prose', () => {
    const root = tempProject();
    const decisionsPath = path.join(root, 'docs', 'DECISIONS.md');

    const dryRun = createProtocolRemediateReport({ projectRoot: root, fix: 'decisions-table-frame', mode: 'dry-run' });
    const report = createProtocolRemediateReport({ projectRoot: root, fix: 'decisions-table-frame', mode: 'execute', beforeHash: dryRun.summary.beforeHash ?? undefined });

    const content = fs.readFileSync(decisionsPath, 'utf8');
    expect(report.actions[0]).toMatchObject({ status: 'updated', path: 'docs/DECISIONS.md' });
    expect(content).toContain('| ID | Date | Decision | Status | Rationale | Evidence |');
    expect(content).toContain('## D-1 Legacy');
  });

  it('refuses execute with planned writes when before-hash is missing or stale', () => {
    const root = tempProject();
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
    const task = createTaskCapsule(root, 'Hash guard fixture');
    fs.writeFileSync(boardPath, fs.readFileSync(boardPath, 'utf8').replace(new RegExp(`\\| ${task.id} \\|[^\\n]+\\n`), ''), 'utf8');
    const before = fs.readFileSync(boardPath, 'utf8');

    const missingHash = createProtocolRemediateReport({ projectRoot: root, fix: 'task-board-row', mode: 'execute', taskId: task.id });
    expect(missingHash.ok).toBe(false);
    expect(missingHash.issues).toContainEqual(expect.objectContaining({ code: 'PROTOCOL_REMEDIATION_BEFORE_HASH_REQUIRED', severity: 'error' }));
    expect(fs.readFileSync(boardPath, 'utf8')).toBe(before);

    const staleHash = createProtocolRemediateReport({ projectRoot: root, fix: 'task-board-row', mode: 'execute', taskId: task.id, beforeHash: '0'.repeat(64) });
    expect(staleHash.ok).toBe(false);
    expect(staleHash.issues).toContainEqual(expect.objectContaining({ code: 'PROTOCOL_REMEDIATION_BEFORE_HASH_MISMATCH', severity: 'error' }));
    expect(fs.readFileSync(boardPath, 'utf8')).toBe(before);
    expect(validateSchema('hadara.protocol.remediation.v1', staleHash).ok).toBe(true);
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
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
    const task = createTaskCapsule(root, 'Conflict fixture');
    fs.writeFileSync(boardPath, fs.readFileSync(boardPath, 'utf8').replace(new RegExp(`\\| ${task.id} \\|[^\\n]+\\n`), ''), 'utf8');
    const dryRun = createProtocolRemediateReport({ projectRoot: root, fix: 'task-board-row', mode: 'dry-run', taskId: task.id });
    const originalReadFileSync = fs.readFileSync;
    let boardReads = 0;
    vi.spyOn(fs, 'readFileSync').mockImplementation((file, options) => {
      if (String(file) === boardPath) {
        boardReads += 1;
        return boardReads === 1 ? originalReadFileSync(file, options) : '# TASK_BOARD\n\nExternal change.\n';
      }
      return originalReadFileSync(file, options);
    });

    const report = createProtocolRemediateReport({ projectRoot: root, fix: 'task-board-row', mode: 'execute', taskId: task.id, beforeHash: dryRun.summary.beforeHash ?? undefined });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'PROTOCOL_REMEDIATION_WRITE_CONFLICT', severity: 'error' }));
    expect(report.actions[0]).toMatchObject({ status: 'skipped' });
    expect(validateSchema('hadara.protocol.remediation.v1', report).ok).toBe(true);
  });

  it('reports atomic write failures and leaves the original file unchanged', () => {
    const root = tempProject();
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
    const task = createTaskCapsule(root, 'Atomic fixture');
    fs.writeFileSync(boardPath, fs.readFileSync(boardPath, 'utf8').replace(new RegExp(`\\| ${task.id} \\|[^\\n]+\\n`), ''), 'utf8');
    const before = fs.readFileSync(boardPath, 'utf8');
    vi.spyOn(fs, 'renameSync').mockImplementation(() => {
      throw new Error('simulated rename failure');
    });

    const dryRun = createProtocolRemediateReport({ projectRoot: root, fix: 'task-board-row', mode: 'dry-run', taskId: task.id });
    const report = createProtocolRemediateReport({ projectRoot: root, fix: 'task-board-row', mode: 'execute', taskId: task.id, beforeHash: dryRun.summary.beforeHash ?? undefined });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'PROTOCOL_REMEDIATION_ATOMIC_WRITE_FAILED', severity: 'error' }));
    expect(fs.readFileSync(boardPath, 'utf8')).toBe(before);
    expect(fs.readdirSync(path.dirname(boardPath)).filter((entry) => entry.includes('.hadara-remediate-'))).toHaveLength(0);
  });

  it('creates a missing evidence.jsonl file for an existing Task Capsule', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Missing evidence index');
    const evidencePath = path.join(task.dir, 'evidence.jsonl');
    fs.rmSync(evidencePath);

    const dryRun = createProtocolRemediateReport({ projectRoot: root, fix: 'evidence-jsonl', mode: 'dry-run', taskId: task.id });
    const report = createProtocolRemediateReport({ projectRoot: root, fix: 'evidence-jsonl', mode: 'execute', taskId: task.id, beforeHash: dryRun.summary.beforeHash ?? undefined });

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
  });
});
