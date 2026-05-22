import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appendEvidence } from '../../src/evidence/evidence';
import { validateTaskCapsule } from '../../src/harness/validate';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-validate-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Harness Task Capsule validation', () => {
  it('returns a stable successful JSON envelope for a complete capsule', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Validate capsule');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'Validation evidence row',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id);

    expect(result).toMatchObject({
      schemaVersion: 'hadara.harness.validate.v1',
      command: 'harness.validate',
      ok: true,
      task: {
        id: task.id,
        title: 'Validate capsule',
        capsule: `tasks/${task.id}-validate-capsule`
      },
      issues: []
    });
    expect(result.checkedFiles).toContain(`tasks/${task.id}-validate-capsule/TASK.md`);
    expect(result.checkedFiles).toContain(`tasks/${task.id}-validate-capsule/EVIDENCE.md`);
    expect(result.checkedFiles).toContain(`tasks/${task.id}-validate-capsule/evidence.jsonl`);
  });

  it('reports missing required capsule files as schema errors', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Broken capsule');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'Validation evidence row',
      result: 'passed'
    });
    fs.rmSync(path.join(task.dir, 'TESTS.md'));

    const result = validateTaskCapsule(root, task.id);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'MISSING_TASK_FILE',
        path: `tasks/${task.id}-broken-capsule/TESTS.md`
      })
    );
  });

  it('reports a missing evidence index as a schema error', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Missing evidence index');

    const result = validateTaskCapsule(root, task.id);

    expect(result.ok).toBe(false);
    expect(result.checkedFiles).toContain(`tasks/${task.id}-missing-evidence-index/evidence.jsonl`);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'MISSING_TASK_FILE',
        path: `tasks/${task.id}-missing-evidence-index/evidence.jsonl`
      })
    );
  });

  it('reports invalid evidence markdown and JSONL records', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Bad evidence');
    fs.writeFileSync(path.join(task.dir, 'EVIDENCE.md'), '# Evidence\n\nwrong table\n', 'utf8');
    fs.writeFileSync(path.join(task.dir, 'evidence.jsonl'), '{"schemaVersion":"wrong"}\nnot-json\n', 'utf8');

    const result = validateTaskCapsule(root, task.id);

    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'EVIDENCE_TABLE_INVALID',
        'EVIDENCE_INDEX_SCHEMA_INVALID',
        'EVIDENCE_INDEX_RECORD_INVALID',
        'EVIDENCE_INDEX_JSON_INVALID'
      ])
    );
  });

  it('reports Task Capsule Markdown format drift', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Format drift');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'Validation evidence row',
      result: 'passed'
    });
    fs.writeFileSync(path.join(task.dir, 'ACCEPTANCE.md'), '# Acceptance\n\n- done\n', 'utf8');
    fs.writeFileSync(path.join(task.dir, 'FILES.md'), '# Files\n\n- src/example.ts\n', 'utf8');
    fs.writeFileSync(path.join(task.dir, 'TESTS.md'), '# Tests\n\n- npm test\n', 'utf8');
    fs.writeFileSync(path.join(task.dir, 'RISKS.md'), '# Risks\n\n- Risk: drift\n', 'utf8');
    fs.writeFileSync(path.join(task.dir, 'HANDOFF.md'), '# Handoff\n\nContinue later.\n', 'utf8');

    const result = validateTaskCapsule(root, task.id);

    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'ACCEPTANCE_HEADING_INVALID',
        'ACCEPTANCE_CHECKLIST_MISSING',
        'FILES_TABLE_INVALID',
        'TESTS_SECTION_MISSING',
        'RISKS_TABLE_INVALID',
        'HANDOFF_SECTION_MISSING'
      ])
    );
  });

  it('accepts evidence index records produced by the evidence store', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Indexed evidence');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'Validation evidence row',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id);

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it('returns a validation envelope when the task is missing', () => {
    const root = tempProject();

    const result = validateTaskCapsule(root, 'T-9999');

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual([
      expect.objectContaining({
        severity: 'error',
        code: 'TASK_NOT_FOUND'
      })
    ]);
  });
});
