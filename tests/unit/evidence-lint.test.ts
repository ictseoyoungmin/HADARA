import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appendEvidence } from '../../src/evidence/evidence';
import { createEvidenceLintReport } from '../../src/services/evidence-lint';
import { createTaskProtocolConsistencyReport } from '../../src/services/protocol-consistency';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-evidence-lint-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('evidence lint', () => {
  it('accepts canonical evidence records written through HADARA evidence helpers', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence lint ok');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Done-level harness validation returned ok:true',
      result: 'passed',
      visibility: 'public'
    });

    const report = createEvidenceLintReport(root, task.id);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.evidence.lint.v1',
      command: 'evidence.lint',
      ok: true,
      taskId: task.id,
      summary: {
        records: 1,
        markdownRows: 1,
        issueCounts: { error: 0, warning: 0, info: 0 }
      }
    });
  });

  it('reports unsupported hand-edited evidence kinds before done-level validation', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence lint bad kind');
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      JSON.stringify({
        schemaVersion: 'hadara.evidence.v1',
        time: '2026-05-31T00:00:00.000Z',
        taskId: task.id,
        kind: 'harness',
        summary: 'bad manual record',
        result: 'passed',
        visibility: 'public'
      }) + '\n',
      'utf8'
    );

    const report = createEvidenceLintReport(root, task.id);

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'EVIDENCE_INDEX_KIND_INVALID',
        actual: 'harness'
      })
    );
  });

  it('surfaces evidence lint failures through task protocol doctor', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Doctor sees evidence lint');
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      '{"schemaVersion":"hadara.evidence.v1","time":"2026-05-31T00:00:00.000Z","taskId":"' +
        task.id +
        '","kind":"harness","summary":"bad","result":"passed","visibility":"public"}\n',
      'utf8'
    );

    const report = createTaskProtocolConsistencyReport(root, task.id);

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: 'EVIDENCE_INDEX_KIND_INVALID',
        area: 'evidence',
        taskId: task.id
      })
    );
  });
});
