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
  it('executes a passing command, appends evidence, refreshes projection, and updates TASK Validation row', () => {
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
      taskValidationRow: { updated: true },
      acceptanceRows: { updated: false }
    });
    expect(report.evidence?.id).toMatch(new RegExp(`^ev:${task.id}:`));
    expect(validateSchema('hadara.validation.run.v1', report).ok).toBe(true);
    const taskMd = fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8');
    expect(taskMd).toContain(`| Focused tests | ${process.execPath} -e process.stdout.write("ok"); process.exit(0) | Yes | Passed | ${report.evidence?.id} |`);
    expect(fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')).toContain(report.evidence?.id);
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toContain('"category":"validation"');
  });

  it('records failed validation evidence without changing acceptance disposition', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validation run fail');

    const report = createValidationRunReport(root, {
      taskId: task.id,
      check: 'Focused tests',
      argv: [process.execPath, '-e', 'process.exit(2)']
    });

    expect(report.ok).toBe(false);
    expect(report.result).toBe('Failed');
    expect(report.evidence?.result).toBe('failed');
    const taskMd = fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8');
    expect(taskMd).toContain(`| Focused tests | ${process.execPath} -e process.exit(2) | Yes | Failed | ${report.evidence?.id} |`);
    expect(taskMd).toContain('| AC-1 | Scope is implemented. | Yes | Pending | TBD | Required | TBD |');
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
    const evidenceJsonl = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');
    expect(evidenceJsonl).toContain('blocked because validation command execution error');
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
          args: ['validation', 'run', '--task', task.id, '--check', 'CLI check', '--resolves', 'ev:T-0000:old', '--json', '--', process.execPath, '-e', 'process.exit(0)'],
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
    expect(report.evidence.tags).toContain('resolves:ev:T-0000:old');
    expect(validateSchema('hadara.validation.run.v1', report).ok).toBe(true);
  });
});
