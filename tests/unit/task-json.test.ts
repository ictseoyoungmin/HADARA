import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createTaskListReport, createTaskReadReport, createTaskShowReport, formatTaskListReport } from '../../src/cli/task-json';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { extractTaskCreateTitle } from '../../src/cli/task';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-json-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('CLI task JSON reports', () => {
  it('returns a stable task list envelope with portable capsule paths', () => {
    const root = tempProject();
    createTaskCapsule(root, 'First task');
    createTaskCapsule(root, 'Second task');

    const report = createTaskListReport(root);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.list.v1',
      command: 'task.list',
      ok: true,
      count: 2,
      tasks: [
        {
          id: 'T-0001',
          title: 'First task',
          status: 'Draft',
          slug: 'first-task',
          capsule: 'tasks/T-0001-first-task'
        },
        {
          id: 'T-0002',
          title: 'Second task',
          status: 'Draft',
          slug: 'second-task',
          capsule: 'tasks/T-0002-second-task'
        }
      ]
    });
    expect(formatTaskListReport(report)).toContain('T-0001\tFirst task\ttasks/T-0001-first-task');
  });

  it('returns TASK.md content for task show JSON', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Show me');

    const report = createTaskShowReport(root, task.id);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.show.v1',
      command: 'task.show',
      ok: true,
      task: {
        id: task.id,
        title: 'Show me',
        status: 'Draft',
        capsule: `tasks/${task.id}-show-me`
      },
      issues: []
    });
    expect(report.task?.taskMarkdown).toContain(`# ${task.id} Show me`);
  });

  it('normalizes task read embedded evidence records through the evidence list parser', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Read evidence normalization');
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      [
        JSON.stringify({
          schemaVersion: 'hadara.evidence.v1',
          time: '2026-05-24T00:00:00.000Z',
          taskId: task.id,
          kind: 'command-log',
          summary: 'token=secret-value',
          result: 'passed',
          visibility: 'private',
          evidencePath: 'artifacts/command-log/private.log',
          absolutePath: '/tmp/private.log'
        }),
        JSON.stringify({
          schemaVersion: 'hadara.evidence.v1',
          time: '2026-05-24T00:01:00.000Z',
          taskId: 'T-9999',
          kind: 'note',
          summary: 'wrong task',
          result: 'passed',
          visibility: 'public'
        }),
        'not-json'
      ].join('\n') + '\n',
      'utf8'
    );

    const report = createTaskReadReport(root, task.id);

    expect(report.ok).toBe(true);
    expect(report.evidenceIndex).toEqual([
      {
        schemaVersion: 'hadara.evidence.v1',
        time: '2026-05-24T00:00:00.000Z',
        taskId: task.id,
        kind: 'command-log',
        summary: 'token=[REDACTED]',
        result: 'passed',
        visibility: 'private'
      }
    ]);
    expect(report.issues).toEqual([
      {
        severity: 'warning',
        code: 'EVIDENCE_RECORD_TASK_MISMATCH',
        message: `evidence.jsonl line 2 has taskId T-9999, expected ${task.id}.`
      },
      {
        severity: 'warning',
        code: 'EVIDENCE_INDEX_JSON_INVALID',
        message: 'evidence.jsonl line 3 is not valid JSON.'
      }
    ]);
    expect(report.files?.['evidence.jsonl']).toBe(
      '{"schemaVersion":"hadara.evidence.v1","time":"2026-05-24T00:00:00.000Z","taskId":"T-0001","kind":"command-log","summary":"token=[REDACTED]","result":"passed","visibility":"private"}\n'
    );
    expect(JSON.stringify(report)).not.toContain('private.log');
    expect(JSON.stringify(report)).not.toContain('secret-value');
    expect(JSON.stringify(report)).not.toContain('absolutePath');
  });

  it('returns a stable missing task envelope', () => {
    const root = tempProject();

    const report = createTaskShowReport(root, 'T-9999');

    expect(report).toEqual({
      schemaVersion: 'hadara.task.show.v1',
      command: 'task.show',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'TASK_NOT_FOUND',
          message: 'Task Capsule not found: T-9999'
        }
      ]
    });
  });

  it('extracts task create title without global flags', () => {
    expect(extractTaskCreateTitle(['task', 'create', 'Foo', '--project', '/tmp/repo', '--json'])).toBe('Foo');
  });
});
