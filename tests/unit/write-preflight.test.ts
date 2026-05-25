import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { handleWriteCommand } from '../../src/cli/write-preflight';
import { createWritePreflightReport } from '../../src/services/write-preflight';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-write-preflight-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('CLI write boundary preflight', () => {
  it('reports task create expected files without creating the next capsule', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Existing Task');

    const before = fs.readdirSync(path.join(root, 'tasks')).sort();
    const report = createWritePreflightReport(root, ['task', 'create', 'Next Task']);
    const after = fs.readdirSync(path.join(root, 'tasks')).sort();

    expect(report).toMatchObject({
      schemaVersion: 'hadara.write.preflight.v1',
      ok: true,
      command: 'task.create',
      risk: 'low',
      requiresApproval: false,
      workspaceBoundary: 'project',
      issues: []
    });
    expect(report.writes).toContain('tasks/T-0002-next-task/TASK.md');
    expect(report.writes).toContain('tasks/T-0002-next-task/evidence.jsonl');
    expect(report.writes).toContain('docs/TASK_BOARD.md');
    expect(after).toEqual(before);
    expect(validateSchema('hadara.write.preflight.v1', report).ok).toBe(true);
  });

  it('reports evidence collect public and private write boundaries', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence Target');

    const publicReport = createWritePreflightReport(root, [
      'evidence',
      'collect',
      '--task',
      task.id,
      '--kind',
      'command-log',
      '--path',
      'tmp/result.log'
    ]);
    expect(publicReport.ok).toBe(true);
    expect(publicReport.command).toBe('evidence.collect');
    expect(publicReport.workspaceBoundary).toBe('project');
    expect(publicReport.writes).toEqual([
      `tasks/${task.id}-evidence-target/EVIDENCE.md`,
      `tasks/${task.id}-evidence-target/evidence.jsonl`,
      `tasks/${task.id}-evidence-target/artifacts/command-log/<timestamp>-result.log`
    ]);

    const privateReport = createWritePreflightReport(root, [
      'evidence',
      'collect',
      '--task',
      task.id,
      '--path',
      'tmp/private.log',
      '--private'
    ]);
    expect(privateReport).toMatchObject({
      ok: true,
      command: 'evidence.collect',
      risk: 'medium',
      requiresApproval: true,
      workspaceBoundary: 'project+private-portable'
    });
    expect(privateReport.writes).toContain(`.hadara/local/portable/data/private-evidence/${task.id}/<evidence-id>.bin`);
    expect(privateReport.writes).toContain(`.hadara/local/portable/data/private-evidence/${task.id}/manifest.jsonl`);
    expect(privateReport.writes).toContain('.hadara/local/portable/data/audit/audit.jsonl');
  });

  it('reports current and deferred CLI-owned write families', () => {
    const root = tempProject();

    expect(createWritePreflightReport(root, ['handoff', 'update', '--task', 'T-0098']).writes).toEqual(['docs/AGENT_HANDOFF.md']);

    const runStateReport = createWritePreflightReport(root, ['run-state', 'start', '--task', 'T-0098']);
    expect(runStateReport).toMatchObject({
      ok: true,
      command: 'run-state.start',
      writes: ['.hadara/local/state/active-run.json'],
      issues: [
        {
          severity: 'warning',
          code: 'WRITE_COMMAND_DEFERRED'
        }
      ]
    });

    const debtReport = createWritePreflightReport(root, ['debt', 'update', 'OD-0001']);
    expect(debtReport).toMatchObject({
      ok: true,
      command: 'debt.update',
      risk: 'medium',
      requiresApproval: true,
      writes: ['docs/OPERATIONAL_DEBT.md'],
      issues: [
        {
          severity: 'warning',
          code: 'DEBT_WRITE_STORE_DEFERRED'
        }
      ]
    });
  });

  it('returns a structured error for unsupported target commands', () => {
    const root = tempProject();

    const report = createWritePreflightReport(root, ['dashboard', 'serve']);

    expect(report).toEqual({
      schemaVersion: 'hadara.write.preflight.v1',
      ok: false,
      command: 'unknown',
      risk: 'low',
      requiresApproval: false,
      workspaceBoundary: 'project',
      writes: [],
      issues: [
        {
          severity: 'error',
          code: 'UNSUPPORTED_WRITE_COMMAND',
          message: 'Unsupported write preflight target: dashboard serve'
        }
      ]
    });
  });

  it('prints JSON through the write preflight CLI handler', () => {
    const root = tempProject();
    const output: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((value: string) => output.push(value));

    expect(handleWriteCommand({ args: ['write', 'preflight', 'task', 'create', 'CLI Task', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);

    const parsed = JSON.parse(output[0]);
    expect(parsed).toMatchObject({
      schemaVersion: 'hadara.write.preflight.v1',
      ok: true,
      command: 'task.create'
    });
    expect(parsed.writes).toContain('tasks/T-0001-cli-task/TASK.md');
  });
});
