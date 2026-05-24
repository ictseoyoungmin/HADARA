import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appendEvidence } from '../../src/evidence/evidence';
import { createEvidenceListReport } from '../../src/services/evidence-list';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-evidence-list-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('evidence list read model', () => {
  it('lists public evidence records for a Task Capsule', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence list public');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'First public record',
      result: 'passed',
      visibility: 'public'
    });

    const report = createEvidenceListReport(root, { taskId: task.id });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.evidence.list.v1',
      command: 'evidence.list',
      ok: true,
      taskId: task.id,
      count: 1,
      records: [
        {
          schemaVersion: 'hadara.evidence.v1',
          taskId: task.id,
          kind: 'note',
          summary: 'First public record',
          result: 'passed',
          visibility: 'public'
        }
      ],
      issues: []
    });
  });

  it('excludes private evidence by default and includes private metadata when requested', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence list private');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'Public record',
      result: 'passed',
      visibility: 'public'
    });
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      path: '/tmp/private.log',
      summary: 'Private token=secret-value',
      result: 'unknown',
      visibility: 'private'
    });

    const publicOnly = createEvidenceListReport(root, { taskId: task.id });
    const withPrivate = createEvidenceListReport(root, { taskId: task.id, includePrivate: true });

    expect(publicOnly.count).toBe(1);
    expect(publicOnly.records.map((record) => record.visibility)).toEqual(['public']);
    expect(withPrivate.count).toBe(2);
    expect(withPrivate.records[1]).toMatchObject({
      kind: 'command-log',
      summary: 'Private token=[REDACTED]',
      visibility: 'private'
    });
    expect(withPrivate.records[1]).not.toHaveProperty('evidencePath');
    expect(JSON.stringify(withPrivate)).not.toContain('/tmp/private.log');
    expect(JSON.stringify(withPrivate)).not.toContain('secret-value');
  });

  it('applies a stable limit after visibility filtering', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence list limit');
    for (const summary of ['one', 'two', 'three']) {
      appendEvidence(root, {
        taskId: task.id,
        kind: 'note',
        summary,
        result: 'passed',
        visibility: 'public'
      });
    }

    const report = createEvidenceListReport(root, { taskId: task.id, limit: 2 });

    expect(report.count).toBe(2);
    expect(report.records.map((record) => record.summary)).toEqual(['one', 'two']);
  });

  it('returns warning issues for malformed JSONL lines without dropping valid records', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence list degraded');
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      [
        '{"schemaVersion":"hadara.evidence.v1","time":"2026-05-24T00:00:00.000Z","taskId":"T-0001","kind":"note","summary":"valid","result":"passed","visibility":"public"}',
        'not-json',
        '{"schemaVersion":"wrong"}'
      ].join('\n') + '\n',
      'utf8'
    );

    const report = createEvidenceListReport(root, { taskId: task.id });

    expect(report.ok).toBe(true);
    expect(report.count).toBe(1);
    expect(report.records[0].summary).toBe('valid');
    expect(report.issues).toEqual([
      {
        severity: 'warning',
        code: 'EVIDENCE_INDEX_JSON_INVALID',
        message: 'evidence.jsonl line 2 is not valid JSON.'
      },
      {
        severity: 'warning',
        code: 'EVIDENCE_RECORD_INVALID',
        message: 'evidence.jsonl line 3 is not a supported evidence record.'
      }
    ]);
  });

  it('returns a stable missing task report', () => {
    const root = tempProject();

    const report = createEvidenceListReport(root, { taskId: 'T-9999' });

    expect(report).toEqual({
      schemaVersion: 'hadara.evidence.list.v1',
      command: 'evidence.list',
      ok: false,
      taskId: 'T-9999',
      count: 0,
      records: [],
      issues: [
        {
          severity: 'error',
          code: 'TASK_NOT_FOUND',
          message: 'Task Capsule not found: T-9999'
        }
      ]
    });
  });
});
