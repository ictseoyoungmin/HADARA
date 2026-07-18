import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { initProject } from '../../src/cli/init';
import { handleTaskCommand } from '../../src/cli/task';
import { validateSchema } from '../../src/core/schema';
import { managedSectionBlock } from '../../src/services/managed-sections';
import { createTaskCreateReport } from '../../src/task/task-create';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-create-'));
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('task create templates', () => {
  it('fills known scaffold dates and points authors to schema tokens', () => {
    const root = tempProject();

    const report = createTaskCreateReport(root, 'Default scaffold');

    expect(report.ok).toBe(true);
    const taskMd = fs.readFileSync(path.join(root, report.task?.capsule ?? '', 'TASK.md'), 'utf8');
    const today = new Date().toISOString().slice(0, 10);
    expect(taskMd).toMatch(new RegExp(`\\| Created \\| ${today}T\\d{2}:\\d{2} \\|`));
    expect(taskMd).toMatch(new RegExp(`\\| Updated \\| ${today}T\\d{2}:\\d{2} \\|`));
    expect(taskMd).toContain('Schema hint: use `hadara schema --json`');
    expect(taskMd).not.toContain('| Created | TBD |');
    expect(validateSchema('hadara.task.create.v1', report).ok).toBe(true);
  });

  it('creates a release-read-model capsule with release boundaries and schema-valid metadata', () => {
    const root = tempProject();

    const report = createTaskCreateReport(root, 'Release dry-run service', { templateId: 'release-read-model' });

    expect(report.ok).toBe(true);
    expect(report.taskId).toBe('T-0001');
    expect(report.template).toMatchObject({
      id: 'release-read-model',
      applied: true,
      recommendedActorRole: 'worker',
      expectedEvidence: ['focused release/schema tests', 'full Docker check', 'built CLI dry-run smoke']
    });
    expect(report.template?.outOfScope).toContain('No token loading');
    expect(report.task?.capsule).toBe('tasks/T-0001-release-dry-run-service');
    const taskDir = path.join(root, report.task?.capsule ?? '');
    expect(fs.readFileSync(path.join(taskDir, 'TASK.md'), 'utf8')).toContain('No registry mutation');
    expect(fs.readdirSync(taskDir).sort()).toEqual(['EVIDENCE.md', 'HANDOFF.md', 'TASK.md', 'evidence.jsonl']);
    expect(fs.existsSync(path.join(taskDir, 'TESTS.md'))).toBe(false);
    expect(fs.readFileSync(path.join(taskDir, 'evidence.jsonl'), 'utf8')).toBe('');
    expect(validateSchema('hadara.task.create.v1', report).ok).toBe(true);
  });

  it('creates a lifecycle-hardening capsule with finish ready close audit expectations', () => {
    const root = tempProject();

    const report = createTaskCreateReport(root, 'Close audit hardening', { templateId: 'lifecycle-hardening' });

    expect(report.ok).toBe(true);
    const taskDir = path.join(root, report.task?.capsule ?? '');
    expect(fs.readFileSync(path.join(taskDir, 'TASK.md'), 'utf8')).toContain('No hidden task completion execution');
    expect(fs.existsSync(path.join(taskDir, 'ACCEPTANCE.md'))).toBe(false);
    expect(validateSchema('hadara.task.create.v1', report).ok).toBe(true);
  });

  it('retries when the selected task directory appears before mkdir', () => {
    const root = tempProject();
    let raced = false;

    const report = createTaskCreateReport(root, 'Collision retry task', {
      onBeforeCreateAttempt: ({ dir, attempt }) => {
        if (attempt !== 1 || raced) return;
        raced = true;
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    expect(report.ok).toBe(true);
    expect(report.task?.id).toBe('T-0002');
    expect(report.task?.capsule).toBe('tasks/T-0002-collision-retry-task');
    expect(fs.existsSync(path.join(root, 'tasks', 'T-0001-collision-retry-task', 'TASK.md'))).toBe(false);
    expect(fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8')).toContain('| T-0002 | Collision retry task | Draft | tasks/T-0002-collision-retry-task | |');
    expect(validateSchema('hadara.task.create.v1', report).ok).toBe(true);
  });

  it('fails clearly when task create collision retries are exhausted', () => {
    const root = tempProject();

    const report = createTaskCreateReport(root, 'Collision exhausted task', {
      maxCreateRetries: 1,
      onBeforeCreateAttempt: ({ dir }) => {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    expect(report.ok).toBe(false);
    expect(report.task).toBeUndefined();
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'TASK_CREATE_COLLISION_RETRIES_EXHAUSTED' }));
    expect(fs.existsSync(path.join(root, 'docs', 'TASK_BOARD.md'))).toBe(false);
    expect(validateSchema('hadara.task.create.v1', report).ok).toBe(true);
  });

  it('skips task ids already present in the Task Board even when no capsule directory exists', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(
      rootTaskBoard(root),
      `# TASK_BOARD\n\n${managedSectionBlock(
        'task-board',
        { schema: 'hadara.managedSection.v1', owner: 'task.board.projection', kind: 'markdown-table', mode: 'update-row', version: 1, required: true, closeSourceRole: 'included' },
        '| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n| T-0001 | Existing board row | Draft | tasks/T-0001-existing-board-row | |\n'
      )}\n`,
      'utf8'
    );

    const report = createTaskCreateReport(root, 'Board collision task');

    expect(report.ok).toBe(true);
    expect(report.task?.id).toBe('T-0002');
    expect(fs.readFileSync(rootTaskBoard(root), 'utf8')).toContain('| T-0002 | Board collision task | Draft | tasks/T-0002-board-collision-task | |');
    expect(validateSchema('hadara.task.create.v1', report).ok).toBe(true);
  });

  it('supports legacy Task Board tables that do not yet use a managed section', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(rootTaskBoard(root), '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n', 'utf8');

    const report = createTaskCreateReport(root, 'Legacy board task');

    expect(report.ok).toBe(true);
    expect(report.task?.id).toBe('T-0001');
    expect(fs.readFileSync(rootTaskBoard(root), 'utf8')).toContain('| T-0001 | Legacy board task | Draft | tasks/T-0001-legacy-board-task | |');
    expect(validateSchema('hadara.task.create.v1', report).ok).toBe(true);
  });

  it('fails closed instead of appending to a malformed legacy Task Board', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(rootTaskBoard(root), '# TASK_BOARD\n\nLost table frame.\n', 'utf8');

    const report = createTaskCreateReport(root, 'Malformed board task');

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'TASK_BOARD_MANAGED_SECTION_INVALID' }));
    expect(fs.readFileSync(rootTaskBoard(root), 'utf8')).not.toContain('Malformed board task');
    expect(validateSchema('hadara.task.create.v1', report).ok).toBe(true);
  });

  it('fails closed when the Task Board has duplicate managed task-board sections', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    const block = managedSectionBlock(
      'task-board',
      { schema: 'hadara.managedSection.v1', owner: 'task.board.projection', kind: 'markdown-table', mode: 'update-row', version: 1, required: true, closeSourceRole: 'included' },
      '| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n'
    );
    fs.writeFileSync(rootTaskBoard(root), `# TASK_BOARD\n\n${block}\n\n${block}\n`, 'utf8');

    const report = createTaskCreateReport(root, 'Duplicate managed block');

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'TASK_BOARD_MANAGED_SECTION_INVALID' }));
    expect(fs.readdirSync(path.join(root, 'tasks'))).toEqual([]);
    expect(fs.readFileSync(rootTaskBoard(root), 'utf8')).not.toContain('Duplicate managed block');
    expect(validateSchema('hadara.task.create.v1', report).ok).toBe(true);
  });

  it('fails closed when another task create holds the project lock', () => {
    const root = tempProject();
    const lockDir = path.join(root, '.hadara', 'local', 'locks', 'task-create.lock');
    fs.mkdirSync(lockDir, { recursive: true });
    fs.writeFileSync(path.join(lockDir, 'lock.json'), '{"pid":12345,"command":"test"}\n', 'utf8');

    const report = createTaskCreateReport(root, 'Locked create', { lockTimeoutMs: 25 });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'TASK_CREATE_LOCK_TIMEOUT' }));
    expect(fs.existsSync(path.join(root, 'tasks'))).toBe(false);
    expect(validateSchema('hadara.task.create.v1', report).ok).toBe(true);
  });

  it('rejects unknown templates without creating a capsule', () => {
    const root = tempProject();

    const report = createTaskCreateReport(root, 'Unknown template task', { templateId: 'banana' });

    expect(report.ok).toBe(false);
    expect(report.template).toMatchObject({ id: 'banana', applied: false });
    expect(report.supportedTemplates).toContain('release-read-model');
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'TASK_TEMPLATE_UNKNOWN' }));
    expect(fs.existsSync(path.join(root, 'tasks'))).toBe(false);
    expect(validateSchema('hadara.task.create.v1', report).ok).toBe(true);
  });

  it('routes CLI JSON create with --from and --title', () => {
    const root = tempProject();
    initProject(root, 'basic', { silent: true });
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(handleTaskCommand({ args: ['task', 'create', '--from', 'release-read-model', '--title', 'Release Model', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    expect(report.schemaVersion).toBe('hadara.task.create.v1');
    expect(report.task.title).toBe('Release Model');
    expect(report.template.id).toBe('release-read-model');
    expect(fs.readFileSync(path.join(root, report.task.capsule, 'TASK.md'), 'utf8')).toContain('No publish execution');
    expect(fs.readdirSync(path.join(root, report.task.capsule)).sort()).toEqual(['EVIDENCE.md', 'HANDOFF.md', 'TASK.md', 'evidence.jsonl']);
  });
});

function rootTaskBoard(root: string): string {
  return path.join(root, 'docs', 'TASK_BOARD.md');
}
