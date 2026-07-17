import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appendEvidence, appendEvidenceWithResult } from '../../src/evidence/evidence';
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
    expect(report.summary.semantics).toMatchObject({
      total: 1,
      byStrength: expect.objectContaining({ 'substantive-positive': 1 }),
      byCategory: expect.objectContaining({ operation: 1 }),
      byOutcome: expect.objectContaining({ passed: 1 }),
      publicRecords: 1,
      privateRecords: 0,
      legacyRecords: 0
    });
  });

  it('compares EVIDENCE.md rows against generated projection rows instead of raw JSONL records', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence lint projection count');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Focused validation passed.',
      result: 'passed',
      visibility: 'public',
      category: 'validation'
    });
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Task close validation returned ok:true.',
      result: 'passed',
      visibility: 'public',
      category: 'audit',
      tags: ['close-proof']
    });

    const report = createEvidenceLintReport(root, task.id);

    expect(report.ok).toBe(true);
    expect(report.summary).toMatchObject({
      records: 2,
      markdownRows: 2,
      projectedRows: 2,
      omittedRows: 0,
      issueCounts: { error: 0, warning: 0, info: 0 }
    });
    expect(report.issues).not.toContainEqual(expect.objectContaining({ code: 'EVIDENCE_MARKDOWN_JSONL_COUNT_DRIFT' }));
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

  it('reports semantic errors for Done tasks with only weak evidence', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence lint weak done');
    markTaskDone(root, task.id, task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'Operator note recorded for closure.',
      result: 'passed',
      visibility: 'public'
    });

    const report = createEvidenceLintReport(root, task.id);

    expect(report.ok).toBe(false);
    expect(report.summary.semantics).toMatchObject({
      total: 1,
      byStrength: expect.objectContaining({ 'record-only': 1 })
    });
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ severity: 'error', code: 'TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE' }),
        expect.objectContaining({ severity: 'error', code: 'TASK_DONE_WITH_ONLY_WEAK_EVIDENCE' })
      ])
    );
  });

  it('keeps failed evidence unresolved when later evidence only uses free-text resolution wording', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence lint unresolved failed done');
    markTaskDone(root, task.id, task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Focused vitest failed.',
      result: 'failed',
      visibility: 'public'
    });
    appendEvidence(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'fixed and rerun passed',
      result: 'passed',
      visibility: 'public'
    });

    const report = createEvidenceLintReport(root, task.id);

    expect(report.ok).toBe(false);
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: 'error',
          code: 'TASK_DONE_WITH_FAILED_EVIDENCE',
          expected: expect.stringContaining('supersedes:')
        })
      ])
    );
  });

  it('uses actual JSONL line numbers for generated semantic evidence ids', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence lint source line done');
    markTaskDone(root, task.id, task.dir);
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      [
        'not-json',
        JSON.stringify({
          schemaVersion: 'hadara.evidence.v1',
          time: '2026-05-31T00:00:00.000Z',
          taskId: task.id,
          kind: 'test-log',
          summary: 'Focused vitest failed.',
          result: 'failed',
          visibility: 'public'
        })
      ].join('\n') + '\n',
      'utf8'
    );

    const report = createEvidenceLintReport(root, task.id);

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'EVIDENCE_INDEX_JSON_INVALID', line: 1 }));
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: 'TASK_DONE_WITH_FAILED_EVIDENCE',
        evidenceId: expect.stringMatching(new RegExp(`^legacy:${task.id}:2:[a-f0-9]{12}$`))
      })
    );
  });

  it('accepts exact v2 resolution markers for failed evidence resolution', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence lint resolved failed done');
    markTaskDone(root, task.id, task.dir);
    const failed = appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Focused vitest failed.',
      result: 'failed',
      visibility: 'public'
    });
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Focused vitest rerun passed.',
      result: 'passed',
      visibility: 'public',
      tags: failed.evidence.schemaVersion === 'hadara.evidence.v2' ? [`resolves:${failed.evidence.id}`] : []
    });

    const report = createEvidenceLintReport(root, task.id);

    expect(report.ok).toBe(true);
    expect(report.issues).not.toContainEqual(expect.objectContaining({ code: 'TASK_DONE_WITH_FAILED_EVIDENCE' }));
    expect(report.summary.semantics).toMatchObject({ legacyRecords: 0 });
  });

  it('uses current TASK.md risks as residual documentation for failed evidence', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence lint task risk residual');
    markTaskDone(root, task.id, task.dir);
    const failed = appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Optional broad check failed.',
      result: 'failed',
      visibility: 'public'
    });
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Focused required check passed.',
      result: 'passed',
      visibility: 'public'
    });
    fs.writeFileSync(
      path.join(task.dir, 'TASK.md'),
      fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8').replace(
        '| RF-1 | Follow-up | TBD | Open | TBD |',
        `| RF-1 | Risk | Accepted risk for ${failed.evidence.id}; optional broad check remains outside required gate. | Accepted | ${failed.evidence.id} |`
      ),
      'utf8'
    );

    const report = createEvidenceLintReport(root, task.id);

    expect(report.issues).not.toContainEqual(expect.objectContaining({ code: 'TASK_DONE_WITH_FAILED_EVIDENCE' }));
  });

  it('does not accept failed exact v2 resolution markers for failed evidence resolution', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence lint failed marker does not resolve');
    markTaskDone(root, task.id, task.dir);
    const failed = appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Focused vitest failed.',
      result: 'failed',
      visibility: 'public'
    });
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Another failed result with a marker.',
      result: 'failed',
      visibility: 'public',
      tags: failed.evidence.schemaVersion === 'hadara.evidence.v2' ? [`resolves:${failed.evidence.id}`] : []
    });
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Unrelated substantive pass.',
      result: 'passed',
      visibility: 'public'
    });

    const report = createEvidenceLintReport(root, task.id);

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'TASK_DONE_WITH_FAILED_EVIDENCE', evidenceId: failed.evidence.id }));
  });

  it('reports semantic errors for Done tasks with unexplained blocked evidence', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence lint blocked done');
    markTaskDone(root, task.id, task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'runner unavailable',
      result: 'blocked',
      visibility: 'public'
    });

    const report = createEvidenceLintReport(root, task.id);

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'TASK_DONE_WITH_UNEXPLAINED_BLOCKED_EVIDENCE'
      })
    );
  });

  it('warns but does not fail when Done substantive evidence is private-only', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence lint private proof done');
    markTaskDone(root, task.id, task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Focused vitest passed.',
      result: 'passed',
      visibility: 'private'
    });

    const report = createEvidenceLintReport(root, task.id);

    expect(report.ok).toBe(true);
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        severity: 'warning',
        code: 'TASK_DONE_WITH_PRIVATE_ONLY_EVIDENCE'
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

function markTaskDone(root: string, taskId: string, taskDir: string): void {
  const taskPath = path.join(taskDir, 'TASK.md');
  const taskContent = fs
    .readFileSync(taskPath, 'utf8')
    .replace(/\| Status \| Draft \|/g, '| Status | Done |')
    .replace(/^## Status\s*\n+[\s\S]*?(?=\n## Status History)/m, '## Status\n\nDone\n');
  fs.writeFileSync(taskPath, taskContent, 'utf8');

  const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
  const boardContent = fs
    .readFileSync(boardPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => (line.startsWith(`| ${taskId} |`) ? line.replace('| Draft |', '| Done |') : line))
    .join('\n');
  fs.writeFileSync(boardPath, boardContent, 'utf8');
}
