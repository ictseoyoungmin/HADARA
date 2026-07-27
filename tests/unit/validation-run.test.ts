import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
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
      execution: {
        failureClass: 'none',
        capture: {
          mode: 'file',
          stdoutBytes: 2,
          stderrBytes: 0,
          fallbackUsed: false
        }
      },
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

  it('reports evidence append lock contention as a warning issue', async () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation lock diagnostics');
    const lockDir = path.join(root, '.hadara', 'local', 'locks', 'evidence', `${task.id}.lock`);
    fs.mkdirSync(lockDir, { recursive: true });
    fs.writeFileSync(path.join(lockDir, 'lock.json'), `${JSON.stringify({ pid: 12345, taskId: task.id, command: 'test-holder' })}\n`, 'utf8');
    const releaser = spawn(
      process.execPath,
      [
        '-e',
        'setTimeout(() => require("node:fs").rmSync(process.argv[1], { recursive: true, force: true }), 750)',
        lockDir
      ],
      { stdio: 'ignore' }
    );
    const releaserExit = new Promise<void>((resolve) => releaser.once('close', () => resolve()));

    try {
      const report = createValidationRunReport(root, {
        taskId: task.id,
        check: 'Focused tests',
        argv: [process.execPath, '-e', 'process.exit(0)']
      });

      expect(report.ok).toBe(true);
      expect(report.evidence?.appendLock).toMatchObject({
        path: `.hadara/local/locks/evidence/${task.id}.lock`,
        contended: true,
        timeoutMs: 5000
      });
      expect(report.issues).toContainEqual(
        expect.objectContaining({
          severity: 'warning',
          code: 'EVIDENCE_APPEND_LOCK_CONTENDED'
        })
      );
      expect(validateSchema('hadara.validation.run.v1', report).ok).toBe(true);
    } finally {
      fs.rmSync(lockDir, { recursive: true, force: true });
      await releaserExit;
    }
  });

  it('auto-resolves earlier failed attempts for the same validation check and command when a later attempt passes', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation run attempt resolution');
    const scriptPath = path.join(root, 'validation-check.js');
    fs.writeFileSync(scriptPath, 'process.exit(Number(process.env.HADARA_TEST_EXIT_CODE ?? "0"));', 'utf8');
    const argv = [process.execPath, scriptPath];

    process.env.HADARA_TEST_EXIT_CODE = '2';
    const failed = createValidationRunReport(root, { taskId: task.id, check: 'Focused tests', argv });
    process.env.HADARA_TEST_EXIT_CODE = '0';
    const passed = createValidationRunReport(root, { taskId: task.id, check: 'Focused tests', argv });
    delete process.env.HADARA_TEST_EXIT_CODE;

    expect(failed.result).toBe('Failed');
    expect(passed.result).toBe('Passed');
    expect(passed.attempt.previousFailedOrBlockedEvidenceIds).toEqual([failed.evidence?.id]);
    expect(passed.attempt.autoResolvedEvidenceIds).toEqual([failed.evidence?.id]);
    expect(passed.evidence?.tags).toContain(`resolves:${failed.evidence?.id}`);
    expect(passed.evidence?.tags).toContain(`validation-check:${failed.attempt.checkKey}`);
    expect(validateSchema('hadara.validation.run.v1', passed).ok).toBe(true);
  });

  it('does not auto-resolve an earlier failed attempt when a later attempt reuses the check name with a different command', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation run attempt identity');

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
    expect(passed.attempt.checkKey).not.toBe(failed.attempt.checkKey);
    expect(passed.attempt.previousFailedOrBlockedEvidenceIds).toEqual([]);
    expect(passed.attempt.autoResolvedEvidenceIds).toEqual([]);
    expect(passed.evidence?.tags).not.toContain(`resolves:${failed.evidence?.id}`);
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
    expect(report).toMatchObject({ status: 'Passed', detail: expect.stringMatching(/^exit 0 in \d+ms$/), result: 'Passed' });
    const taskMd = fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8');
    expect(taskMd).toContain(`| Focused tests | Yes | Passed | ${report.detail} | ${report.evidence?.id} |`);
    expect(validateSchema('hadara.validation.run.v1', report).ok).toBe(true);
  });

  it('matches inline-code TASK Validation check labels when updating rows', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation run task sync markdown label');
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(
      taskPath,
      fs.readFileSync(taskPath, 'utf8').replace(
        '| TBD | Yes | Not Run | Not executed. | TBD |',
        '| `npm test` | Yes | Not Run | Not executed. | TBD |'
      ),
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
    expect(validationRows).toEqual([`| npm test | Yes | Passed | ${report.detail} | ${report.evidence?.id} |`]);
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
    expect(report.execution.failureClass).toBe('assertion');
    expect(report.evidence?.result).toBe('failed');
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toContain('failureClass: assertion');
    const taskMd = fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8');
    expect(taskMd).toContain(`| Focused tests | Yes | Failed | ${report.detail} | ${report.evidence?.id} |`);
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
      failureClass: 'environment-setup',
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
        failureClass: 'none',
        capture: {
          mode: 'direct',
          fallbackUsed: false
        },
        directResult: true,
        directSummary: 'npm test passed directly after wrapper launch failure.'
      },
      taskValidationRow: { mode: 'updated', updated: true }
    });
    expect(passed.attempt.previousFailedOrBlockedEvidenceIds).toEqual([blocked.evidence?.id]);
    expect(passed.evidence?.tags).toContain(`resolves:${blocked.evidence?.id}`);
    expect(fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8')).toContain(
      `| Focused tests | Yes | Passed | ${passed.detail} | ${passed.evidence?.id} |`
    );
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
      updateTask: true,
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
        failureClass: 'environment-setup',
        capture: {
          mode: 'injected',
          fallbackUsed: false
        },
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
        id: 'record-direct-validation-result',
        command: expect.stringContaining('--update-task')
      })
    );
    expect(report.nextActions).toContainEqual(
      expect.objectContaining({
        id: 'record-direct-result',
        command: expect.stringContaining(`--summary 'Validation "Done-level harness" was blocked by permission-denied.'`)
      })
    );
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toContain('could not be launched (EPERM)');
    expect(validateSchema('hadara.validation.run.v1', report).ok).toBe(true);
  });

  it('classifies validation timeouts separately from assertions and environment setup', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation timeout classification');
    const timeoutError = Object.assign(new Error('spawnSync node ETIMEDOUT'), { code: 'ETIMEDOUT' });

    const report = createValidationRunReport(root, {
      taskId: task.id,
      check: 'Slow check',
      argv: [process.execPath, '-e', 'setTimeout(() => {}, 1000)'],
      spawnSyncFn: () => ({
        pid: 1,
        output: [null, '', ''],
        stdout: '',
        stderr: '',
        status: null,
        signal: 'SIGTERM',
        error: timeoutError
      })
    });

    expect(report).toMatchObject({
      status: 'Blocked',
      execution: {
        timedOut: true,
        failureKind: 'timeout',
        failureClass: 'timeout'
      }
    });
    expect(report.nextActions).toContainEqual(expect.objectContaining({
      id: 'run-direct-command',
      message: expect.stringContaining('--timeout-ms')
    }));
    expect(report.nextActions).toContainEqual(expect.objectContaining({
      id: 'record-direct-validation-result',
      command: expect.stringContaining('after wrapper timeout')
    }));
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
    expect(text).toContain('failureClass=none');
    expect(text).toContain('childOutput=not printed; stdout/stderr hashes are recorded in HADARA evidence');
    expect(text).toContain('[HADARA] evidence');
    expect(text).toContain('taskValidationRow=skipped not-updated');
    expect(text).toContain('acceptanceRows=not-updated');
  });

  it('prints a single updated token for explicit TASK Validation row updates', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation text update wording');
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
            '--',
            process.execPath,
            '-e',
            'process.exit(0)'
          ],
          projectRoot: root,
          jsonOutput: false
        })
      ).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const text = output.join('\n');
    expect(text).toContain('taskValidationRow=updated');
    expect(text).not.toContain('taskValidationRow=updated updated');
  });
});
