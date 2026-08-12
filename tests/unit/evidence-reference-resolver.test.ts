import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appendEvidenceWithResult } from '../../src/evidence/evidence';
import { resolveTaskEvidenceReferences } from '../../src/evidence/reference-resolver';
import { createEvidenceLintReport } from '../../src/services/evidence-lint';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('structured evidence reference resolver', () => {
  it('resolves same-task and cross-task structured fields while excluding free prose', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Reference consumer');
    const external = createTaskCapsule(root, 'Reference producer');
    const localEvidence = appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Local reference fixture passed.',
      result: 'passed'
    }).evidence;
    const externalEvidence = appendEvidenceWithResult(root, {
      taskId: external.id,
      kind: 'test-log',
      summary: 'Cross-task reference fixture passed.',
      result: 'passed'
    }).evidence;

    rewrite(path.join(task.dir, 'TASK.md'), (content) => content
      .replace('| AC-1 | Scope is implemented. | Pending | TBD | TBD |', `| AC-1 | Scope is implemented. | Met | ${localEvidence.id} | Resolver fixture |`)
      .replace('| AC-2 | Validation evidence is recorded. | Pending | TBD | TBD |', `| AC-2 | Cross-task evidence resolves. | Met | ${externalEvidence.id} | Resolver fixture |`)
      .replace('## Close Summary\n\n', '## Close Summary\n\nFree prose example ev:T-9999:aaaaaaaaaaaaaaaaaaaaaaaa is not readiness authority.\n\n'));
    rewrite(path.join(task.dir, 'HANDOFF.md'), (content) => content
      .replace('| TBD | TBD |', `| Cross-task producer completed. | ${externalEvidence.id} |`));

    const result = resolveTaskEvidenceReferences(root, task);

    expect(result.unresolved).toEqual([]);
    expect(result.resolvedIds).toEqual([externalEvidence.id, localEvidence.id].sort());
    expect(result.references).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: localEvidence.id, sourcePath: expect.stringContaining('/TASK.md'), section: 'Acceptance', rowId: 'AC-1', field: 'Evidence', resolved: true, evidenceSourceLine: 1 }),
      expect.objectContaining({ id: externalEvidence.id, sourcePath: expect.stringContaining('/HANDOFF.md'), section: 'Last Completed', field: 'Evidence', resolved: true, evidenceTaskId: external.id, evidenceSourceLine: 1 })
    ]));
    expect(result.references.some((reference) => reference.id.includes('T-9999'))).toBe(false);
    expect(createEvidenceLintReport(root, task.id).issues).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'ACCEPTANCE_EVIDENCE_NOT_FOUND' }),
      expect.objectContaining({ code: 'STRUCTURED_EVIDENCE_REF_MISSING' })
    ]));
  });

  it('preserves malformed, missing same-task, and missing cross-task source locations', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Broken references');
    rewrite(path.join(task.dir, 'TASK.md'), (content) => content
      .replace('| AC-1 | Scope is implemented. | Pending | TBD | TBD |', `| AC-1 | Scope is implemented. | Met | ev:${task.id}:abc123 | Resolver fixture |`)
      .replace('| TBD | Yes | Not Run | Not executed. | TBD |', `| Missing same task | Yes | Passed | Missing fixture. | ev:${task.id}:aaaaaaaaaaaaaaaaaaaaaaaa |`)
      .replace('| RF-1 | Follow-up | TBD | Open | TBD |', '| RF-1 | Follow-up | Missing cross task. | Open | ev:T-9999:bbbbbbbbbbbbbbbbbbbbbbbb |'));

    const result = resolveTaskEvidenceReferences(root, task);

    expect(result.resolvedIds).toEqual([]);
    expect(result.unresolved).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: `ev:${task.id}:abc123`, syntaxValid: false, section: 'Acceptance', rowId: 'AC-1' }),
      expect.objectContaining({ id: `ev:${task.id}:aaaaaaaaaaaaaaaaaaaaaaaa`, syntaxValid: true, resolved: false, section: 'Validation', rowId: 'Missing same task' }),
      expect.objectContaining({ id: 'ev:T-9999:bbbbbbbbbbbbbbbbbbbbbbbb', syntaxValid: true, resolved: false, section: 'Risks / Follow-ups', rowId: 'RF-1', field: 'Link' })
    ]));
  });
});

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-evidence-ref-'));
  roots.push(root);
  return root;
}

function rewrite(filePath: string, update: (content: string) => string): void {
  fs.writeFileSync(filePath, update(fs.readFileSync(filePath, 'utf8')), 'utf8');
}
