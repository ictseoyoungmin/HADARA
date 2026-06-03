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
      expect.arrayContaining(['TASK_STATUS_NOT_DONE', 'TASK_STATUS_HISTORY_NOT_DONE', 'ACCEPTANCE_INCOMPLETE', 'EVIDENCE_REQUIRED', 'HANDOFF_PLACEHOLDER'])
    );
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
        'TASK_SCAFFOLD_PLACEHOLDER',
        'PLAN_SCAFFOLD_UNCHANGED',
        'CONTEXT_SCAFFOLD_UNCHANGED',
        'FILES_SCAFFOLD_UNCHANGED',
        'ACCEPTANCE_SCAFFOLD_UNCHANGED',
        'TESTS_SCAFFOLD_UNCHANGED',
        'RISKS_SCAFFOLD_UNCHANGED',
        'DECISIONS_SCAFFOLD_UNCHANGED'
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
    expect(result.issues).toContainEqual({
      severity: 'error',
      code: 'TASK_METADATA_PLACEHOLDER',
      message: 'Done-level validation requires TASK.md metadata field(s) to be concrete dates, not TBD: Created, Updated.',
      path: `tasks/${task.id}-placeholder-metadata/TASK.md`
    });
  });

  it('rejects done-level capsules whose Status History does not end with Done', () => {
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
    expect(result.issues).toContainEqual({
      severity: 'error',
      code: 'TASK_STATUS_HISTORY_NOT_DONE',
      message: 'Done-level validation requires TASK.md Status History to end with Done.',
      path: `tasks/${task.id}-history-missing-done/TASK.md`
    });
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
    fs.appendFileSync(path.join(task.dir, 'EVIDENCE.md'), '\n| Time | Kind | Summary | Result | Visibility | JSONL |\n|---|---|---|---|---|---|\n', 'utf8');

    const result = validateTaskCapsule(root, task.id, { level: 'done' });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual({
      severity: 'error',
      code: 'EVIDENCE_TABLE_DUPLICATE_HEADER',
      message: 'Done-level validation requires EVIDENCE.md to contain exactly one evidence table header; found 2.',
      path: `tasks/${task.id}-duplicate-evidence-header/EVIDENCE.md`
    });
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
    expect(result.issues).toContainEqual({
      severity: 'error',
      code: 'TASK_BOARD_ROW_DUPLICATE',
      message: `docs/TASK_BOARD.md contains 2 rows for ${task.id}; expected exactly one.`,
      path: 'docs/TASK_BOARD.md'
    });
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
  let taskContent = fs
    .readFileSync(taskPath, 'utf8')
    .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Validate done-level completion gates. | Fixture verifies completed capsule docs. |')
    .replace('| TBD | TBD |', '| Exercise task-specific completed capsule documentation. | Needed for done-level validation. |')
    .replace('| TBD | TBD |', '| Broad workflow changes. | Outside fixture scope. |')
    .replace('## Goal\n\nTBD.', '## Goal\n\nValidate done-level completion gates.')
    .replace('## Scope\n\nTBD.', '## Scope\n\n- Exercise task-specific completed capsule documentation.')
    .replace('## Out of Scope\n\nTBD.', '## Out of Scope\n\n- Broad workflow changes.');
  if (!options.keepMetadataPlaceholders) {
    taskContent = taskContent.replace('| Created | TBD |', '| Created | 2026-06-02 |').replace('| Updated | TBD |', '| Updated | 2026-06-02 |');
  }
  if (!options.keepStatusHistoryDraft) {
    taskContent = `${taskContent.trimEnd()}\n| 2026-06-02 | Done | Fixture completed. | Harness fixture. |\n`;
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

function writeHandoffDone(taskDir: string): void {
  fs.writeFileSync(
    path.join(taskDir, 'HANDOFF.md'),
    '# Handoff\n\n## Current State\n\n| Field | Value |\n|---|---|\n| Status | Done |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Done-level validation fixture completed. | Harness result. |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| Continue with the next task. | Fixture complete. | docs/TASK_BOARD.md |\n',
    'utf8'
  );
}
