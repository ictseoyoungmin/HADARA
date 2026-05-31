import { describe, expect, it } from 'vitest';
import { buildWorkbenchNextActions } from '../../src/services/workbench-next-actions';

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
        executeCommand: 'hadara protocol remediate --fix evidence-jsonl --task T-0172 --execute --json',
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
  });

  it('suggests close dry-run with paired execute command when a task is ready', () => {
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
        command: 'hadara task close --task T-0172 --json',
        executeCommand: 'hadara task close --task T-0172 --execute --json',
        loopBoundary: true
      })
    ]);
  });

  it('suggests audit-close for closed tasks', () => {
    const actions = buildWorkbenchNextActions({
      taskId: 'T-0172',
      closed: true,
      closePlanOk: true,
      evidenceRecords: 3,
      closeActions: [],
      issues: []
    });

    expect(actions).toEqual([
      expect.objectContaining({
        id: 'audit-close',
        kind: 'audit',
        command: 'hadara task audit-close --task T-0172 --json'
      })
    ]);
  });

  it('pairs close execute commands with dry-run commands when converting close actions', () => {
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
        command: 'hadara task close --task T-0172 --json',
        executeCommand: 'hadara task close --task T-0172 --execute --json'
      })
    );
  });
});
