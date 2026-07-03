import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleValidationCommand } from '../../src/cli/validation';
import { validateSchema } from '../../src/core/schema';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createValidationRunReport } from '../../src/services/validation-run';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-validation-run-'));
  fs.mkdirSync(path.join(dir, '.hadara'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, '.hadara', 'scaffold.json'),
    JSON.stringify(
      {
        schemaVersion: 'hadara.projectScaffold.v1',
        hadaraProtocol: '0.4',
        profile: 'test'
      },
      null,
      2
    ),
    'utf8'
  );
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('validation run', () => {
  it('executes a passing command and appends evidence without TASK.md churn by default', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation run pass');

    const report = createValidationRunReport(root, {
      taskId: task.id,
      check: 'Focused tests',
      argv: [process.execPath, '-e', 'process.stdout.write("ok"); process.exit(0)']
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.validation.run.v1',
      command: 'validation.run',
      ok: true,
      result: 'Passed',
      taskValidationRow: { mode: 'skipped', updated: false },
      acceptanceRows: { updated: false }
    });
    expect(report.evidence?.id).toMatch(new RegExp(`^ev:${task.id}:`));
    expect(report.attempt.checkKey).toMatch(/^[a-f0-9]{16}$/);
    expect(report.evidence?.tags).toContain(`validation-check:${report.attempt.checkKey}`);
    expect(validateSchema('hadara.validation.run.v1', report).ok).toBe(true);
    const taskMd = fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8');
    expect(taskMd).not.toContain('Focused tests');
    expect(fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')).toContain(report.evidence?.id);
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toContain('"category":"validation"');
  });

  it('auto-resolves earlier failed attempts for the same validation check when a later attempt passes', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation run attempt resolution');

    const failed = createValidationRunReport(root, {
      taskId: task.id,
      check: 'Focused tests',
      argv: [process.execPath, '-e', 'process.exit(2)']
    });
    const passed = createValidationRunReport(root, {
      taskId: task.id,
      check: 'Focused tests',
      argv: [process.execPath, '-e', 'process.exit(0)']
    });

    expect(failed.result).toBe('Failed');
    expect(passed.result).toBe('Passed');
    expect(passed.attempt.previousFailedOrBlockedEvidenceIds).toEqual([failed.evidence?.id]);
    expect(passed.attempt.autoResolvedEvidenceIds).toEqual([failed.evidence?.id]);
    expect(passed.evidence?.tags).toContain(`resolves:${failed.evidence?.id}`);
    expect(passed.evidence?.tags).toContain(`validation-check:${failed.attempt.checkKey}`);
    expect(validateSchema('hadara.validation.run.v1', passed).ok).toBe(true);
  });

  it('updates the TASK Validation row when explicitly requested', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation run task sync');

    const report = createValidationRunReport(root, {
      taskId: task.id,
      check: 'Focused tests',
      argv: [process.execPath, '-e', 'process.stdout.write("ok"); process.exit(0)'],
      updateTask: true
    });

    expect(report.taskValidationRow).toMatchObject({ mode: 'updated', updated: true });
    const taskMd = fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8');
    expect(taskMd).toContain(`| Focused tests | Yes | Passed | ${report.evidence?.id} |`);
    expect(validateSchema('hadara.validation.run.v1', report).ok).toBe(true);
  });

  it('records failed validation evidence without changing acceptance disposition', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation run fail');

    const report = createValidationRunReport(root, {
      taskId: task.id,
      check: 'Focused tests',
      argv: [process.execPath, '-e', 'process.exit(2)'],
      updateTask: true
    });

    expect(report.ok).toBe(false);
    expect(report.result).toBe('Failed');
    expect(report.evidence?.result).toBe('failed');
    const taskMd = fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8');
    expect(taskMd).toContain(`| Focused tests | Yes | Failed | ${report.evidence?.id} |`);
    expect(taskMd).toContain('| AC-1 | Scope is implemented. | Pending | TBD | TBD |');
    expect(validateSchema('hadara.validation.run.v1', report).ok).toBe(true);
  });

  it('records blocked validation evidence with an explanation signal', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation run blocked');

    const report = createValidationRunReport(root, {
      taskId: task.id,
      check: 'Missing command',
      argv: ['definitely-not-a-real-hadara-test-command']
    });

    expect(report.ok).toBe(false);
    expect(report.result).toBe('Blocked');
    expect(report.execution).toMatchObject({
      commandStarted: false,
      failureKind: 'command-not-found',
      error: { code: 'ENOENT' }
    });
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'VALIDATION_COMMAND_NOT_FOUND' }));
    expect(report.nextActions.map((action) => action.id)).toEqual(['run-direct-command', 'record-direct-result']);
    const evidenceJsonl = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');
    expect(evidenceJsonl).toContain('blocked because validation command could not be launched');
    expect(validateSchema('hadara.validation.run.v1', report).ok).toBe(true);
  });

  it('classifies permission-denied launch failures separately from validation failures', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation run permission blocked');
    const launchError = Object.assign(new Error('spawnSync node EPERM'), {
      code: 'EPERM',
      syscall: 'spawnSync node',
      path: process.execPath
    });

    const report = createValidationRunReport(root, {
      taskId: task.id,
      check: 'Done-level harness',
      argv: [process.execPath, 'dist/cli/main.js', 'harness', 'validate', '--task', task.id, '--level', 'done', '--json'],
      spawnSyncFn: () => ({
        pid: 0,
        output: [null, '', ''],
        stdout: '',
        stderr: '',
        status: null,
        signal: null,
        error: launchError
      })
    });

    expect(report).toMatchObject({
      ok: false,
      result: 'Blocked',
      execution: {
        commandStarted: false,
        failureKind: 'permission-denied',
        error: {
          code: 'EPERM',
          message: 'spawnSync node EPERM',
          syscall: 'spawnSync node',
          path: process.execPath
        }
      }
    });
    expect(report.issues).toContainEqual(expect.objectContaining({ severity: 'error', code: 'VALIDATION_COMMAND_PERMISSION_DENIED' }));
    expect(report.nextActions).toContainEqual(
      expect.objectContaining({
        id: 'record-direct-result',
        command: expect.stringContaining(`--summary 'Validation "Done-level harness" was blocked by permission-denied.'`)
      })
    );
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toContain('could not be launched (EPERM)');
    expect(validateSchema('hadara.validation.run.v1', report).ok).toBe(true);
  });

  it('routes the CLI validation run command', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation CLI');
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(
        handleValidationCommand({
          args: [
            'validation',
            'run',
            '--task',
            task.id,
            '--check',
            'CLI check',
            '--update-task',
            '--resolves',
            'ev:T-0000:old',
            '--json',
            '--',
            process.execPath,
            '-e',
            'process.exit(0)'
          ],
          projectRoot: root,
          jsonOutput: true
        })
      ).toBe(true);
    } finally {
      console.log = originalLog;
    }
    const report = JSON.parse(output.join('\n'));
    expect(report.schemaVersion).toBe('hadara.validation.run.v1');
    expect(report.result).toBe('Passed');
    expect(report.taskValidationRow.updated).toBe(true);
    expect(report.evidence.tags).toContain('resolves:ev:T-0000:old');
    expect(validateSchema('hadara.validation.run.v1', report).ok).toBe(true);
  });
});
