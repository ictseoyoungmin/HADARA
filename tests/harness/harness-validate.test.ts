import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appendEvidence } from '../../src/evidence/evidence';
import { validateTaskCapsule } from '../../src/harness/validate';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { parseHarnessValidationLevel } from '../../src/cli/harness';

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
      level: 'draft',
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

  it('keeps draft-level validation structural for incomplete capsules', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Draft level');

    const result = validateTaskCapsule(root, task.id, { level: 'draft' });

    expect(result.ok).toBe(true);
    expect(result.level).toBe('draft');
    expect(result.issues).toEqual([]);
  });

  it('reports done-level completion gaps', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Incomplete done');

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(false);
    expect(result.level).toBe('done');
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['TASK_STATUS_NOT_DONE', 'ACCEPTANCE_INCOMPLETE', 'EVIDENCE_REQUIRED', 'HANDOFF_PLACEHOLDER'])
    );
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'ACCEPTANCE_INCOMPLETE',
          path: `tasks/${task.id}-incomplete-done/TASK.md`,
          heading: 'Acceptance Criteria',
          fixHint: expect.stringContaining('acceptance criterion'),
          remediationHint: expect.objectContaining({
            path: `tasks/${task.id}-incomplete-done/TASK.md`,
            heading: 'Acceptance Criteria',
            blocking: true
          })
        })
      ])
    );
  });

  it('adds heading and fix hints to missing TASK.md section issues', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Missing task heading');
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(taskPath, fs.readFileSync(taskPath, 'utf8').replace('## Goal', '## Missing Goal'), 'utf8');

    const result = validateTaskCapsule(root, task.id, { level: 'draft' });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: 'TASK_SECTION_MISSING',
        path: `tasks/${task.id}-missing-task-heading/TASK.md`,
        heading: '## Goal',
        fixHint: expect.stringContaining('Add the ## Goal section'),
        remediationHint: expect.objectContaining({
          path: `tasks/${task.id}-missing-task-heading/TASK.md`,
          heading: '## Goal',
          blocking: true
        })
      })
    );
  });

  it('rejects invalid 0.4 TASK.md controlled table values at draft level', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Invalid task table tokens');
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(
      taskPath,
      fs
        .readFileSync(taskPath, 'utf8')
        .replace('| Status | Draft |', '| Status | Ready |')
        .replace('| 1 | Define the task contract. | Pending | TBD |', '| 1 | Define the task contract. | Working | TBD |')
        .replace('| AC-1 | Scope is implemented. | Yes | Pending | TBD | Required | TBD |', '| AC-1 | Scope is implemented. | Maybe | Started | TBD | Maybe | TBD |')
        .replace('| TBD | TBD | Yes | Not Run | TBD |', '| TBD | TBD | Maybe | Green | TBD |')
        .replace('| RF-1 | Follow-up | TBD | Open | TBD |', '| RF-1 | Decision | TBD | Maybe | TBD |'),
      'utf8'
    );

    const result = validateTaskCapsule(root, task.id, { level: 'draft' });

    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'TASK_STATUS_INVALID_TOKEN',
        'TASK_PLAN_STATUS_INVALID_TOKEN',
        'ACCEPTANCE_REQUIRED_INVALID_TOKEN',
        'ACCEPTANCE_STATUS_INVALID_TOKEN',
        'ACCEPTANCE_DISPOSITION_INVALID_TOKEN',
        'VALIDATION_REQUIRED_INVALID_TOKEN',
        'VALIDATION_RESULT_INVALID_TOKEN',
        'TASK_RISK_KIND_INVALID_TOKEN',
        'TASK_RISK_STATE_INVALID_TOKEN'
      ])
    );
  });

  it('accepts ergonomic Change Summary line ranges at draft level', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Change line ranges');
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(
      taskPath,
      fs
        .readFileSync(taskPath, 'utf8')
        .replace(
          '| TBD | N/A | TBD | TBD | TBD |',
          '| src/one.ts | L7 | Single final-state line. | Fixture. | Harness. |\n| src/two.ts | 7-25, L30-L40 | Mixed range syntax. | Fixture. | Harness. |\n| src/new.ts | new-file | New file marker. | Fixture. | Harness. |'
        ),
      'utf8'
    );

    const result = validateTaskCapsule(root, task.id, { level: 'draft' });

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it('reports Change Summary line range examples for invalid values', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Bad line range');
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(
      taskPath,
      fs
        .readFileSync(taskPath, 'utf8')
        .replace('| TBD | N/A | TBD | TBD | TBD |', '| src/bad.ts | L7- | Invalid range. | Fixture. | Harness. |'),
      'utf8'
    );

    const result = validateTaskCapsule(root, task.id, { level: 'draft' });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: 'CHANGE_SUMMARY_LINE_RANGE_INVALID',
        example: 'L7-L25, L30-L40',
        message: expect.stringContaining('comma-separated ranges')
      })
    );
  });

  it('reports changed or missing Source Documents when a concrete hash is recorded', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Source doc drift');
    const sourcePath = path.join(root, 'docs', 'source.md');
    fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
    fs.writeFileSync(sourcePath, 'original\n', 'utf8');
    const recordedHash = hashText('original\n');
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(
      taskPath,
      fs
        .readFileSync(taskPath, 'utf8')
        .replace('| TBD | reference | exploratory | draft | TBD | TBD |', `| docs/source.md | implementation-source | approved | implementing | ${recordedHash} | Fixture source. |`),
      'utf8'
    );
    fs.writeFileSync(sourcePath, 'changed\n', 'utf8');

    const changed = validateTaskCapsule(root, task.id, { level: 'draft' });
    fs.rmSync(sourcePath);
    const missing = validateTaskCapsule(root, task.id, { level: 'draft' });

    expect(changed.issues).toContainEqual(expect.objectContaining({ code: 'TASK_SOURCE_DOCUMENT_CHANGED' }));
    expect(missing.issues).toContainEqual(expect.objectContaining({ code: 'TASK_SOURCE_DOCUMENT_CHANGED' }));
  });

  it('normalizes markdown-wrapped Source Document paths before hash validation', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Markdown source doc path');
    const sourcePath = path.join(root, 'docs', 'source.md');
    fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
    fs.writeFileSync(sourcePath, 'source\n', 'utf8');
    const recordedHash = hashText('source\n');
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(
      taskPath,
      fs
        .readFileSync(taskPath, 'utf8')
        .replace('| TBD | reference | exploratory | draft | TBD | TBD |', `| \`docs/source.md\` | implementation-source | approved | implementing | ${recordedHash} | Fixture source. |`),
      'utf8'
    );

    const result = validateTaskCapsule(root, task.id, { level: 'draft' });

    expect(result.issues).not.toContainEqual(expect.objectContaining({
      code: 'TASK_SOURCE_DOCUMENT_CHANGED',
      message: expect.stringContaining('`docs/source.md`')
    }));
  });

  it('requires concrete Source Document hashes at done level', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Source doc missing hash');
    const sourcePath = path.join(root, 'docs', 'source.md');
    fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
    fs.writeFileSync(sourcePath, 'source\n', 'utf8');
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(
      taskPath,
      fs
        .readFileSync(taskPath, 'utf8')
        .replace('| TBD | reference | exploratory | draft | TBD | TBD |', '| docs/source.md | implementation-source | approved | implementing | TBD | Fixture source. |'),
      'utf8'
    );

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.issues).toContainEqual(expect.objectContaining({ code: 'TASK_SOURCE_DOCUMENT_MISSING_HASH' }));
  });

  it('rejects completed capsules that still contain scaffold Markdown defaults', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Scaffold leftovers');
    markTaskDone(root, task.id);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeHandoffDone(task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Done-level validation evidence',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'TASK_SCAFFOLD_PLACEHOLDER'
      ])
    );
    expect(result.issues.map((issue) => issue.code)).not.toContain('EVIDENCE_SCAFFOLD_UNCHANGED');
  });

  it('rejects done-level capsules with placeholder TASK metadata dates', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Placeholder metadata');
    markTaskDone(root, task.id);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeCompletedCapsuleDocs(task.dir, { keepMetadataPlaceholders: true });
    writeHandoffDone(task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Done-level validation evidence',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'TASK_METADATA_PLACEHOLDER',
        message: 'Done-level validation requires TASK.md metadata field(s) to be concrete dates, not TBD: Created, Updated.',
        path: `tasks/${task.id}-placeholder-metadata/TASK.md`,
        heading: 'Identity',
        fixHint: expect.stringContaining('YYYY-MM-DD')
      })
    );
  });

  it('rejects done-level capsules whose legacy Status History does not end with Done', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'History missing done');
    markTaskDone(root, task.id);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeCompletedCapsuleDocs(task.dir, { keepStatusHistoryDraft: true });
    writeHandoffDone(task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Done-level validation evidence',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'TASK_STATUS_HISTORY_NOT_DONE',
        message: 'Done-level validation requires TASK.md Status History to end with Done.',
        path: `tasks/${task.id}-history-missing-done/TASK.md`,
        heading: 'Status History',
        fixHint: expect.stringContaining('task finish')
      })
    );
  });

  it('accepts done-level validation for completed capsules', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Completed capsule');
    markTaskDone(root, task.id);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeCompletedCapsuleDocs(task.dir);
    writeHandoffDone(task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Done-level validation evidence',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(true);
    expect(result.level).toBe('done');
    expect(result.checkedFiles).toContain('docs/TASK_BOARD.md');
    expect(result.issues).toEqual([]);
  });

  it('rejects done-level acceptance rows that remain in progress', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Acceptance still active');
    markTaskDone(root, task.id);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeCompletedCapsuleDocs(task.dir);
    writeHandoffDone(task.dir);
    const acceptancePath = path.join(task.dir, 'ACCEPTANCE.md');
    fs.writeFileSync(
      acceptancePath,
      fs.readFileSync(acceptancePath, 'utf8').replace('| AC-2 | Evidence is attached. | Met |', '| AC-2 | Evidence is attached. | In Progress |'),
      'utf8'
    );
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Done-level validation evidence',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'ACCEPTANCE_INCOMPLETE',
        path: `tasks/${task.id}-acceptance-still-active/ACCEPTANCE.md`
      })
    );
  });

  it('accepts justified deferrable v2 acceptance rows at done level', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'V2 acceptance');
    markTaskDone(root, task.id);
    markTaskBoardDone(root, task.id);
    writeCompletedCapsuleDocs(task.dir);
    writeHandoffDone(task.dir);
    fs.writeFileSync(
      path.join(task.dir, 'ACCEPTANCE.md'),
      '# Acceptance Criteria\n\n| ID | Criterion | Origin | Required | Deferrable | Status | Evidence | Decision / Risk / Follow-up |\n|---|---|---|---|---|---|---|---|\n| AC-1 | Required scope is complete. | original | Yes | No | Met | Fixture evidence. | |\n| AC-2 | Discovered polish is tracked separately. | discovered | No | Yes | Follow-up Created | Fixture evidence. | D-1; T-0999 |\n',
      'utf8'
    );
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Done-level validation evidence',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it('rejects done-level handoff status that mixes pending close wording into TaskStatus', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Pending close wording');
    markTaskDone(root, task.id);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeCompletedCapsuleDocs(task.dir);
    writeHandoffDone(task.dir);
    fs.writeFileSync(
      path.join(task.dir, 'HANDOFF.md'),
      fs.readFileSync(path.join(task.dir, 'HANDOFF.md'), 'utf8').replace('| Status | Done |', '| Status | Done pending lifecycle close |'),
      'utf8'
    );
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Done-level validation evidence',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'TASK_HANDOFF_STATUS_DRIFT',
        path: `tasks/${task.id}-pending-close-wording/HANDOFF.md`,
        heading: 'Current State',
        fixHint: expect.stringContaining('TaskStatus')
      })
    );
  });

  it('rejects explicit handoff CloseState values in close-source handoff', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Invalid close state');
    markTaskDone(root, task.id);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeCompletedCapsuleDocs(task.dir);
    writeHandoffDone(task.dir);
    fs.writeFileSync(
      path.join(task.dir, 'HANDOFF.md'),
      fs.readFileSync(path.join(task.dir, 'HANDOFF.md'), 'utf8').replace('| Status | Done |', '| TaskStatus | Done |\n| CloseState | almost-closed |'),
      'utf8'
    );
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Done-level validation evidence',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'TASK_HANDOFF_CLOSE_STATE_PERSISTED',
        path: `tasks/${task.id}-invalid-close-state/HANDOFF.md`,
        heading: 'Current State',
        fixHint: expect.stringContaining('Remove the CloseState row')
      })
    );
  });

  it('rejects done-level capsules whose plan rows are still In Progress', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Plan status drift');
    markTaskDone(root, task.id);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeCompletedCapsuleDocs(task.dir);
    writeHandoffDone(task.dir);
    fs.appendFileSync(path.join(task.dir, 'PLAN.md'), '| 3 | Commit the preparation. | In Progress | git commit pending. |\n', 'utf8');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Done-level validation evidence',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'TASK_PLAN_STATUS_DRIFT',
        path: `tasks/${task.id}-plan-status-drift/PLAN.md`,
        heading: 'Plan',
        fixHint: expect.stringContaining('In Progress')
      })
    );
  });

  it('blocks done-level validation for note-only evidence', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Weak done evidence');
    markTaskDone(root, task.id);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeCompletedCapsuleDocs(task.dir);
    writeHandoffDone(task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'Human note says this is done.',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ severity: 'error', code: 'TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE' }),
        expect.objectContaining({ severity: 'error', code: 'TASK_DONE_WITH_ONLY_WEAK_EVIDENCE' })
      ])
    );
  });

  it('warns without failing done-level validation for private-only substantive evidence', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Private evidence done');
    markTaskDone(root, task.id);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeCompletedCapsuleDocs(task.dir);
    writeHandoffDone(task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Private focused validation passed.',
      result: 'passed',
      visibility: 'private'
    });

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(true);
    expect(result.issues).toContainEqual(
      expect.objectContaining({ severity: 'warning', code: 'TASK_DONE_WITH_PRIVATE_ONLY_EVIDENCE' })
    );
  });

  it('rejects duplicate evidence table headers during done-level validation', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Duplicate evidence header');
    markTaskDone(root, task.id);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeCompletedCapsuleDocs(task.dir);
    writeHandoffDone(task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Done-level validation evidence',
      result: 'passed'
    });
    fs.appendFileSync(path.join(task.dir, 'EVIDENCE.md'), '\n| Time | Kind | Summary | Result | Visibility | JSONL |\n|---|---|---|---|---|---|\n| Time | Kind | Summary | Result | Visibility | JSONL |\n|---|---|---|---|---|---|\n', 'utf8');

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'EVIDENCE_TABLE_DUPLICATE_HEADER',
        message: 'Done-level validation requires EVIDENCE.md to contain exactly one evidence table header; found 2.',
        path: `tasks/${task.id}-duplicate-evidence-header/EVIDENCE.md`,
        heading: 'Evidence',
        fixHint: expect.stringContaining('duplicate')
      })
    );
  });

  it('rejects duplicate task board rows during done-level validation', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Duplicate board row');
    markTaskDone(root, task.id);
    markTaskBoardDone(root, task.id);
    fs.appendFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      `| ${task.id} | Duplicate board row | Draft | tasks/${task.id}-duplicate-board-row | |\n`,
      'utf8'
    );
    markAcceptanceDone(task.dir);
    writeCompletedCapsuleDocs(task.dir);
    writeHandoffDone(task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Done-level validation evidence',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'TASK_BOARD_ROW_DUPLICATE',
        message: `docs/TASK_BOARD.md contains 2 rows for ${task.id}; expected exactly one.`,
        path: 'docs/TASK_BOARD.md',
        heading: 'TASK_BOARD',
        fixHint: expect.stringContaining('duplicate')
      })
    );
  });

  it('rejects stale task board status and capsule path during done-level validation', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Stale board row');
    markTaskDone(root, task.id);
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      [
        '# TASK_BOARD',
        '',
        '| ID | Title | Status | Capsule | Notes |',
        '|---|---|---|---|---|',
        `| ${task.id} | Stale board row | Draft | tasks/${task.id}-wrong | |`
      ].join('\n') + '\n',
      'utf8'
    );
    markAcceptanceDone(task.dir);
    writeCompletedCapsuleDocs(task.dir);
    writeHandoffDone(task.dir);
    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      summary: 'Done-level validation evidence',
      result: 'passed'
    });

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['TASK_BOARD_STATUS_NOT_DONE', 'TASK_BOARD_CAPSULE_MISMATCH'])
    );
  });

  it('rejects unsupported harness validation levels', () => {
    expect(parseHarnessValidationLevel('draft')).toBe('draft');
    expect(parseHarnessValidationLevel('done')).toBe('done');
    expect(() => parseHarnessValidationLevel('release')).toThrow(/unsupported harness validation level/);
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
    fs.rmSync(path.join(task.dir, 'HANDOFF.md'));

    const result = validateTaskCapsule(root, task.id);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'MISSING_TASK_FILE',
        path: `tasks/${task.id}-broken-capsule/HANDOFF.md`
      })
    );
  });

  it('reports a missing evidence index as a schema error', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Missing evidence index');
    fs.rmSync(path.join(task.dir, 'evidence.jsonl'));

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
    fs.writeFileSync(path.join(task.dir, 'HANDOFF.md'), '# Handoff\n\nContinue later.\n', 'utf8');

    const result = validateTaskCapsule(root, task.id);

    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
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

  it('reports unsupported evidence index enum values', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Bad evidence enum');
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      `${JSON.stringify({
        schemaVersion: 'hadara.evidence.v1',
        time: '2026-05-22T00:00:00.000Z',
        taskId: task.id,
        kind: 'note',
        summary: 'Bad enum',
        result: 'success',
        visibility: 'public'
      })}\n`,
      'utf8'
    );

    const result = validateTaskCapsule(root, task.id);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'error',
        code: 'EVIDENCE_INDEX_ENUM_INVALID'
      })
    );
  });

  it('rejects evidence index records missing canonical required fields', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Evidence schema drift');
    fs.writeFileSync(
      path.join(task.dir, 'evidence.jsonl'),
      `${JSON.stringify({
        schemaVersion: 'hadara.evidence.v1',
        timestamp: '2026-05-22T00:00:00.000Z',
        taskId: task.id,
        kind: 'note',
        result: 'passed'
      })}\n`,
      'utf8'
    );

    const result = validateTaskCapsule(root, task.id);

    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['EVIDENCE_INDEX_TIME_MISSING', 'EVIDENCE_INDEX_SUMMARY_MISSING', 'EVIDENCE_INDEX_VISIBILITY_MISSING'])
    );
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

function markTaskDone(projectRoot: string, taskId: string): void {
  const taskDir = fs
    .readdirSync(path.join(projectRoot, 'tasks'))
    .find((entry) => entry.startsWith(`${taskId}-`));
  if (!taskDir) throw new Error(`Missing task dir for ${taskId}`);
  const taskPath = path.join(projectRoot, 'tasks', taskDir, 'TASK.md');
  fs.writeFileSync(
    taskPath,
    fs.readFileSync(taskPath, 'utf8').replace(/\| Status \| Draft \|/g, '| Status | Done |').replace(/\nDraft\n/, '\nDone\n'),
    'utf8'
  );
}

function markTaskBoardDone(projectRoot: string, taskId: string): void {
  const taskBoardPath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  const updated = fs
    .readFileSync(taskBoardPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => {
      if (!line.startsWith(`| ${taskId} |`)) return line;
      const cells = line
        .slice(1, line.endsWith('|') ? -1 : undefined)
        .split('|')
        .map((cell) => cell.trim());
      cells[2] = 'Done';
      return `| ${cells.join(' | ')} |`;
    })
    .join('\n');
  fs.writeFileSync(taskBoardPath, updated, 'utf8');
}

function markAcceptanceDone(taskDir: string): void {
  const acceptancePath = path.join(taskDir, 'ACCEPTANCE.md');
  if (!fs.existsSync(acceptancePath)) {
    const taskPath = path.join(taskDir, 'TASK.md');
    fs.writeFileSync(
      taskPath,
      fs
        .readFileSync(taskPath, 'utf8')
        .replace(/\| AC-(\d+) \| ([^|]+) \| Yes \| Pending \| TBD \| Required \| TBD \|/g, '| AC-$1 | $2 | Yes | Met | Done-level fixture evidence. | Required | Fixture evidence. |'),
      'utf8'
    );
    return;
  }
  fs.writeFileSync(
    acceptancePath,
    fs
      .readFileSync(acceptancePath, 'utf8')
      .replace(/- \[ \]/g, '- [x]')
      .replace(/\| Pending \| TBD \|/g, '| Met | Done-level fixture evidence |'),
    'utf8'
  );
}

function writeCompletedCapsuleDocs(taskDir: string, options: { keepMetadataPlaceholders?: boolean; keepStatusHistoryDraft?: boolean } = {}): void {
  const taskPath = path.join(taskDir, 'TASK.md');
  const projectRoot = path.dirname(path.dirname(taskDir));
  const fixtureSourcePath = path.join(projectRoot, 'docs', 'fixture-source.md');
  fs.mkdirSync(path.dirname(fixtureSourcePath), { recursive: true });
  fs.writeFileSync(fixtureSourcePath, 'fixture source\n', 'utf8');
  const fixtureSourceHash = hashText('fixture source\n');
  let taskContent = fs
    .readFileSync(taskPath, 'utf8')
    .replace('| TBD | reference | exploratory | draft | TBD | TBD |', `| docs/fixture-source.md | implementation-source | approved | implementing | ${fixtureSourceHash} | Fixture source. |`)
    .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Validate done-level completion gates. | Fixture verifies completed capsule docs. |')
    .replace('| 1 | Define the task contract. | Pending | TBD |', '| 1 | Define the task contract. | Done | Fixture setup. |')
    .replace('| 2 | Implement the smallest useful slice. | Pending | TBD |', '| 2 | Implement the smallest useful slice. | Done | Fixture setup. |')
    .replace('| 3 | Validate and record evidence. | Pending | TBD |', '| 3 | Validate and record evidence. | Done | Fixture setup. |')
    .replace(/\| AC-(\d+) \| ([^|]+) \| Yes \| Pending \| TBD \| Required \| TBD \|/g, '| AC-$1 | $2 | Yes | Met | Fixture evidence. | Required | Fixture evidence. |')
    .replace('| TBD | TBD | Yes | Not Run | TBD |', '| Harness done-level fixture | validateTaskCapsule(..., done) | Yes | Passed | Harness result. |')
    .replace('| TBD | N/A | TBD | TBD | TBD |', '| src/harness/validate.ts | L1-L20 | Exercise fixture validation. | Done-level harness coverage. | Harness result. |')
    .replace('| RF-1 | Follow-up | TBD | Open | TBD |', '| RF-1 | Follow-up | Fixture follow-up. | Closed | Harness result. |')
    .replace('## Goal\n\nTBD.', '## Goal\n\nValidate done-level completion gates.')
    .replace('## Scope\n\nTBD.', '## Scope\n\n- Exercise task-specific completed capsule documentation.')
    .replace('## Out of Scope\n\nTBD.', '## Out of Scope\n\n- Broad workflow changes.');
  if (!options.keepMetadataPlaceholders) {
    taskContent = taskContent.replace('| Created | TBD |', '| Created | 2026-06-02 |').replace('| Updated | TBD |', '| Updated | 2026-06-02 |');
  }
  if (options.keepStatusHistoryDraft) {
    taskContent = `${taskContent.trimEnd()}\n\n## Status History\n\n| Time | Status | Note | Evidence |\n|---|---|---|---|\n| 2026-06-02 | Draft | Legacy fixture. | Harness fixture. |\n`;
  }
  fs.writeFileSync(taskPath, taskContent, 'utf8');
  fs.writeFileSync(path.join(taskDir, 'PLAN.md'), '# Plan\n\n| Step | Action | Status | Evidence |\n|---|---|---|---|\n| 1 | Prepare completed capsule fixture. | Done | Test fixture setup. |\n| 2 | Run done-level validation. | Done | Harness result. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'CONTEXT.md'), '# Context\n\n## Required Reading Used\n\n| Document | Why It Matters | Read Status |\n|---|---|---|\n| src/harness/validate.ts | Harness validator behavior. | Read |\n\n## Assumptions\n\n| Assumption | Source | Risk If Wrong |\n|---|---|---|\n| Fixture represents a completed task. | Test setup | Done-level regression would be noisy. |\n\n## Constraints\n\n| Constraint | Source | Notes |\n|---|---|---|\n| No broad workflow changes. | Fixture scope | Keep assertions focused. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'FILES.md'), '# Files\n\n| Path | Action | Reason | Status |\n|---|---|---|---|\n| src/harness/validate.ts | read | Exercise done-level validation. | Done |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'ACCEPTANCE.md'), '# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|---|\n| AC-1 | Done-level fixture is complete. | Met | Fixture content. |\n| AC-2 | Evidence is attached. | Met | evidence.jsonl record. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'TESTS.md'), '# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| Focused harness validation fixture | Exercise validation. | Yes | Passed | Harness result. |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n| None | No | Fixture only. | Not Run | Not applicable |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'RISKS.md'), '# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n| Fixture drift | Medium | Low | Keep assertions focused. | Mitigated |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'DECISIONS.md'), '# Decisions\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| TD-1 | Use task-specific completed fixture content. | Accepted | Keeps scaffold detection meaningful. | Test fixture. |\n', 'utf8');
}

function hashText(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content, 'utf8').digest('hex')}`;
}

function writeHandoffDone(taskDir: string): void {
  fs.writeFileSync(
    path.join(taskDir, 'HANDOFF.md'),
    '# Handoff\n\n## Current State\n\n| Field | Value |\n|---|---|\n| Status | Done |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Done-level validation fixture completed. | Harness result. |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| Continue with the next task. | Fixture complete. | docs/TASK_BOARD.md |\n',
    'utf8'
  );
}
