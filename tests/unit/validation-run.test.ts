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
    expect(report.evidence?.appendLock).toMatchObject({
      path: `.hadara/local/locks/evidence/${task.id}.lock`,
      contended: false,
      timeoutMs: 5000
    });
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

  it('matches inline-code TASK Validation check labels when updating rows', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation run task sync markdown label');
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(
      taskPath,
      fs.readFileSync(taskPath, 'utf8').replace('| TBD | Yes | Not Run | TBD |', '| `npm test` | Yes | Not Run | TBD |'),
      'utf8'
    );

    const report = createValidationRunReport(root, {
      taskId: task.id,
      check: 'npm test',
      argv: [process.execPath, '-e', 'process.exit(0)'],
      updateTask: true
    });

    expect(report.taskValidationRow).toMatchObject({ mode: 'updated', updated: true, appended: false });
    const validationRows = fs
      .readFileSync(taskPath, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line.includes('npm test'));
    expect(validationRows).toEqual([`| npm test | Yes | Passed | ${report.evidence?.id} |`]);
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
    expect(report.nextActions.map((action) => action.id)).toEqual(['run-direct-command', 'record-direct-validation-result', 'record-direct-result']);
    const evidenceJsonl = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');
    expect(evidenceJsonl).toContain('blocked because validation command could not be launched');
    expect(validateSchema('hadara.validation.run.v1', report).ok).toBe(true);
  });

  it('records an operator-supplied direct result without spawning a child process', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation run direct result');

    const blocked = createValidationRunReport(root, {
      taskId: task.id,
      check: 'Focused tests',
      argv: ['npm', 'test'],
      spawnSyncFn: () => ({
        pid: 0,
        output: [null, '', ''],
        stdout: '',
        stderr: '',
        status: null,
        signal: null,
        error: Object.assign(new Error('spawnSync npm EPERM'), { code: 'EPERM', syscall: 'spawnSync npm' })
      })
    });
    const passed = createValidationRunReport(root, {
      taskId: task.id,
      check: 'Focused tests',
      argv: ['npm', 'test'],
      directResult: 'Passed',
      directSummary: 'npm test passed directly after wrapper launch failure.',
      updateTask: true,
      spawnSyncFn: () => {
        throw new Error('direct-result mode must not spawn');
      }
    });

    expect(blocked.result).toBe('Blocked');
    expect(passed).toMatchObject({
      ok: true,
      result: 'Passed',
      execution: {
        exitCode: 0,
        commandStarted: false,
        failureKind: 'none',
        directResult: true,
        directSummary: 'npm test passed directly after wrapper launch failure.'
      },
      taskValidationRow: { mode: 'updated', updated: true }
    });
    expect(passed.attempt.previousFailedOrBlockedEvidenceIds).toEqual([blocked.evidence?.id]);
    expect(passed.evidence?.tags).toContain(`resolves:${blocked.evidence?.id}`);
    expect(fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8')).toContain(`| Focused tests | Yes | Passed | ${passed.evidence?.id} |`);
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toContain('from direct result');
    expect(validateSchema('hadara.validation.run.v1', passed).ok).toBe(true);
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
            '--direct-result',
            'passed',
            '--direct-summary',
            'CLI check passed directly.',
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
    expect(report.execution.directResult).toBe(true);
    expect(report.taskValidationRow.updated).toBe(true);
    expect(report.evidence.tags).toContain('resolves:ev:T-0000:old');
    expect(validateSchema('hadara.validation.run.v1', report).ok).toBe(true);
  });

  it('sets a non-zero wrapper exit code when the child command fails', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation CLI failure exit');
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(
        handleValidationCommand({
          args: ['validation', 'run', '--task', task.id, '--check', 'CLI failing check', '--json', '--', process.execPath, '-e', 'process.exit(3)'],
          projectRoot: root,
          jsonOutput: true
        })
      ).toBe(true);
    } finally {
      console.log = originalLog;
    }
    const report = JSON.parse(output.join('\n'));
    expect(report.result).toBe('Failed');
    expect(report.execution.exitCode).toBe(3);
    expect(process.exitCode).toBe(6);
  });

  it('prints child command and HADARA evidence boundaries in text output', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation text boundaries');
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(
        handleValidationCommand({
          args: ['validation', 'run', '--task', task.id, '--check', 'CLI check', '--', process.execPath, '-e', 'process.exit(0)'],
          projectRoot: root,
          jsonOutput: false
        })
      ).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const text = output.join('\n');
    expect(text).toContain(`[HADARA] validation run ${task.id}: Passed`);
    expect(text).toContain('[HADARA] child command');
    expect(text).toContain(`command=${process.execPath} -e process.exit(0)`);
    expect(text).toContain('childOutput=not printed; stdout/stderr hashes are recorded in HADARA evidence');
    expect(text).toContain('[HADARA] evidence');
    expect(text).toContain('taskValidationRow=skipped not-updated');
    expect(text).toContain('acceptanceRows=not-updated');
  });
});
