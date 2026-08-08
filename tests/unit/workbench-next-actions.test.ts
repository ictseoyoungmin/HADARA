import { describe, expect, it } from 'vitest';
import { buildWorkbenchNextActions } from '../../src/services/workbench-next-actions';
import { validateSchema } from '../../src/core/schema';

describe('workbench next actions', () => {
  it('suggests safe evidence.jsonl remediation as dry-run plus execute command', () => {
    const actions = buildWorkbenchNextActions({
      taskId: 'T-0172',
      closed: false,
      closePlanOk: false,
      evidenceRecords: 1,
      closeActions: [],
      issues: [{ severity: 'error', code: 'EVIDENCE_LINT_EVIDENCE_INDEX_MISSING', message: 'missing', path: 'tasks/T-0172/evidence.jsonl' }]
    });

    expect(actions).toContainEqual(
      expect.objectContaining({
        id: 'remediate-evidence-jsonl',
        kind: 'remediation',
        required: true,
        command: 'hadara protocol remediate --fix evidence-jsonl --task T-0172 --json',
        executeCommand: 'hadara protocol remediate --fix evidence-jsonl --task T-0172 --execute --before-hash <dry-run summary.beforeHash> --json',
        sourceIssueCodes: ['EVIDENCE_LINT_EVIDENCE_INDEX_MISSING']
      })
    );
  });

  it('maps invalid evidence enum issues to lint guidance instead of direct edits', () => {
    const actions = buildWorkbenchNextActions({
      taskId: 'T-0172',
      closed: false,
      closePlanOk: false,
      evidenceRecords: 1,
      closeActions: [],
      issues: [{ severity: 'error', code: 'EVIDENCE_LINT_EVIDENCE_INDEX_KIND_INVALID', message: 'bad kind' }]
    });

    expect(actions).toContainEqual(
      expect.objectContaining({
        id: 'review-evidence-index',
        kind: 'review',
        command: 'hadara evidence lint --task T-0172 --json'
      })
    );
    expect(Object.prototype.hasOwnProperty.call(actions[0], 'path')).toBe(false);
    expect(validateSchema('hadara.task.workbench.v1', fixtureReport(actions)).ok).toBe(true);
  });

  it('suggests task close dry-run with paired execute command when a task is ready', () => {
    const actions = buildWorkbenchNextActions({
      taskId: 'T-0172',
      closed: false,
      closePlanOk: true,
      evidenceRecords: 2,
      closeActions: [],
      issues: []
    });

    expect(actions).toEqual([
      expect.objectContaining({
        id: 'review-close-plan',
        command: 'hadara task close --task T-0172 --dry-run --json',
        executeCommand: 'hadara task close --task T-0172 --execute --plan-hash <planHash> --json',
        loopBoundary: true
      })
    ]);
  });

  it('does not suggest lifecycle work for closed-valid tasks', () => {
    const actions = buildWorkbenchNextActions({
      taskId: 'T-0172',
      closed: true,
      closePlanOk: true,
      evidenceRecords: 3,
      closeActions: [],
      issues: []
    });

    expect(actions).toEqual([]);
  });

  it('pairs close actions with finalize commands when converting close actions', () => {
    const actions = buildWorkbenchNextActions({
      taskId: 'T-0172',
      closed: false,
      closePlanOk: false,
      evidenceRecords: 1,
      closeActions: [
        {
          id: 'append-close-evidence',
          kind: 'command',
          required: true,
          command: 'hadara task close --task T-0172 --execute --json',
          message: 'Append close evidence.',
          loopBoundary: true
        }
      ],
      issues: []
    });

    expect(actions).toContainEqual(
      expect.objectContaining({
        id: 'review-close-plan',
        command: 'hadara task close --task T-0172 --dry-run --json',
        executeCommand: 'hadara task close --task T-0172 --execute --plan-hash <planHash> --json'
      })
    );
  });

  it('normalizes append-close-evidence actions without undefined loopBoundary fields', () => {
    const actions = buildWorkbenchNextActions({
      taskId: 'T-0172',
      closed: false,
      closePlanOk: false,
      evidenceRecords: 1,
      closeActions: [
        {
          id: 'append-close-evidence',
          kind: 'command',
          required: true,
          command: 'hadara task close --task T-0172 --execute --json',
          message: 'Append close evidence.'
        }
      ],
      issues: []
    });

    expect(actions[0]).toMatchObject({ id: 'review-close-plan' });
    expect(Object.prototype.hasOwnProperty.call(actions[0], 'loopBoundary')).toBe(false);
    expect(validateSchema('hadara.task.workbench.v1', fixtureReport(actions)).ok).toBe(true);
  });

  it('does not turn another task board warning into current-task remediation', () => {
    const actions = buildWorkbenchNextActions({
      taskId: 'T-0172',
      closed: false,
      closePlanOk: false,
      evidenceRecords: 1,
      closeActions: [],
      issues: [
        {
          severity: 'warning',
          code: 'PROTOCOL_DOCS_PROJECT_TASK_BOARD_ROW_MISSING',
          message: 'docs/TASK_BOARD.md does not contain a row for T-0073.',
          path: 'docs/TASK_BOARD.md'
        }
      ]
    });

    expect(actions.some((action) => action.id === 'remediate-task-board-row')).toBe(false);
    expect(validateSchema('hadara.task.workbench.v1', fixtureReport(actions)).ok).toBe(true);
  });

  it('suggests finalize repair when close evidence exists but is not valid', () => {
    const actions = buildWorkbenchNextActions({
      taskId: 'T-0172',
      closed: false,
      closeEvidenceFound: true,
      closePlanOk: true,
      evidenceRecords: 2,
      closeActions: [],
      issues: []
    });

    expect(actions.map((action) => action.id)).toEqual(['review-close-plan-repair']);
    expect(validateSchema('hadara.task.workbench.v1', fixtureReport(actions)).ok).toBe(true);
  });

  it('routes finish-only blockers to guarded task close instead of generic continue guidance', () => {
    const actions = buildWorkbenchNextActions({
      taskId: 'T-0001',
      closed: false,
      closeEvidenceFound: false,
      closePlanOk: false,
      evidenceRecords: 1,
      authoringStatus: 'current',
      closeActions: [],
      issues: [
        {
          severity: 'error',
          code: 'TASK_VALIDATION_TASK_BOARD_STATUS_NOT_DONE',
          message: 'Done-level validation requires docs/TASK_BOARD.md status for T-0001 to be Done.'
        },
        {
          severity: 'warning',
          code: 'WORKBENCH_TASK_BOARD_STATUS_DRIFT',
          message: 'Task Board status drift.'
        }
      ]
    });

    expect(actions[0]).toMatchObject({
      id: 'close-auto-guarded-writes',
      kind: 'command',
      command: 'hadara task close --task T-0001 --json',
      loopBoundary: true
    });
    expect(actions.map((action) => action.id)).not.toContain('continue-implementation-or-docs');
  });
});

function fixtureReport(nextActions: ReturnType<typeof buildWorkbenchNextActions>): object {
  return {
    schemaVersion: 'hadara.task.workbench.v1',
    command: 'task.status',
    ok: true,
    generatedAt: '2026-05-31T00:00:00.000Z',
    projectRoot: '/tmp/hadara',
    task: {
      id: 'T-0172',
      title: 'Fixture',
      capsule: 'tasks/T-0172-fixture',
      taskStatus: 'Draft',
      taskBoardStatus: 'Draft',
      taskBoardPath: 'docs/TASK_BOARD.md',
      taskBoardPresent: true
    },
    state: {
      closeState: 'not-closed',
      ready: false,
      closeEvidenceFound: false,
      closedValid: false,
      closed: false,
      auditable: false
    },
    summary: {
      blockers: 0,
      warnings: 0,
      evidenceRecords: 1,
      nextActions: nextActions.length
    },
    sources: {
      taskClosePlan: { ok: false, mode: 'dry-run', blockers: 0, warnings: 0 },
      evidenceLint: { ok: true, issues: 0 },
      evidenceList: { ok: true, records: 1 },
      protocolTask: { ok: true, issues: 0 },
      protocolDocs: { ok: true, issues: 0 },
      protocolProfile: { ok: true, issues: 0 }
    },
    loop: {
      phase: 'finalize-dry-run',
      summary: 'Fixture loop.',
      statusCommand: 'hadara task status --task T-0172 --json',
      deprecatedCommands: []
    },
    issues: [],
    nextActions
  };
}
