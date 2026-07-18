import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { appendEvidence, appendEvidenceWithResult } from '../../src/evidence/evidence';
import { handleTaskCommand } from '../../src/cli/task';
import { validateSchema } from '../../src/core/schema';
import * as harnessService from '../../src/services/harness-service';
import { createTaskSelectionStatusV2Report } from '../../src/services/task-selection-status-v2';
import { createTaskStatusV2Report } from '../../src/services/task-status-v2';
import { createTaskStatusSelectionReport, createTaskWorkbenchReport, formatTaskStatusSelectionReport, formatTaskWorkbenchReport } from '../../src/services/task-workbench';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-workbench-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Metadata\n\n| Field | Value |\n|---|---|\n| HADARA Profile | governed |\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\n## Current State\n\n| Area | State | Notes |\n|---|---|---|\n| Active / Next Task | T-0001 | Fixture. |\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'IMPLEMENTATION_SOP.md'), '# IMPLEMENTATION_SOP\n\n## Session Start\n\nRead docs.\n\n## Required Reading\n\n| Document | When to Read | Purpose |\n|---|---|---|\n| `docs/PROJECT_STATE.md` | Every session | State. |\n| `docs/AGENT_HANDOFF.md` | Every session | Handoff. |\n| `docs/TASK_BOARD.md` | Every session | Board. |\n| `docs/IMPLEMENTATION_SOP.md` | Every session | SOP. |\n\n## Init Profile Matrix\n\n| Profile | Scale |\n|---|---|\n| governed | Heavy |\n\n## Scaffold Document Structure\n\n| Document | Required Structure |\n|---|---|\n| docs/PROJECT_STATE.md | Product. |\n\n## Implementation\n\nWork.\n\n## Validation\n\nCheck.\n\n## Session End\n\nUpdate.\n\n## Handoff Compaction\n\nCompact.\n', 'utf8');
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

describe('task workbench status report', () => {
  it('summarizes task, evidence, close, and protocol state without writes', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench report');
    appendEvidence(root, { taskId: task.id, kind: 'note', summary: 'Fixture evidence', result: 'passed', visibility: 'public' });
    const before = snapshotProject(root);

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.workbench.v1',
      command: 'task.status',
      ok: true,
      taskId: task.id,
      task: {
        id: task.id,
        title: 'Workbench report',
        taskStatus: 'Draft',
        taskBoardStatus: 'Draft',
        taskBoardPath: 'docs/TASK_BOARD.md',
        taskBoardPresent: true
      },
      state: {
        closeState: 'not-closed',
        ready: false,
        readiness: {
          status: 'current-blocked',
          currentReady: false,
          closeProofValid: false
        },
        closeEvidenceFound: false,
        closedValid: false,
        closed: false
      },
      sources: {
        evidenceLint: { ok: true, issues: 0 },
        evidenceList: { ok: true, records: 1 },
        taskClosePlan: { ok: false, mode: 'dry-run' }
      },
      authoringGuidance: {
        readOnly: true,
        writesProse: false,
        status: 'needs-authoring'
      },
      authoringSuggestions: {
        readOnly: true,
        writesProse: false,
        status: 'suggested',
        sourceDocuments: {
          status: 'placeholder'
        },
        acceptance: {
          status: 'placeholder'
        },
        title: {
          status: 'ok'
        }
      },
      loop: {
        phase: 'author-task',
        deprecatedCommands: expect.arrayContaining([
          expect.objectContaining({ command: 'hadara task lifecycle --task T-XXXX --json', replacement: 'hadara task status --task T-XXXX --json' })
        ])
      }
    });
    expect(report.authoringGuidance.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'source-documents', path: `tasks/${task.id}-workbench-report/TASK.md`, status: 'placeholder' }),
        expect.objectContaining({ id: 'goal', status: 'placeholder' }),
        expect.objectContaining({ id: 'acceptance', status: 'placeholder' })
      ])
    );
    expect(report.sources.evidenceList.latest).toMatchObject({ kind: 'note', result: 'passed', visibility: 'public' });
    expect(report.authoringSuggestions.sourceDocuments.guidance).toContain('Keep source drift hashes out of the human TASK.md table unless working with a legacy hash-enabled capsule.');
    expect(report.authoringSuggestions.acceptance.draftAcceptanceExamples[0]).toMatchObject({
      confidence: 'low',
      source: 'generic-pattern'
    });
    expect(report.authoringSuggestions.acceptance.candidateSignals.filter((item) => item.source === 'task-title')).toHaveLength(1);
    expect(report.nextActions.length).toBeGreaterThan(0);
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
    expect(formatTaskWorkbenchReport(report)).toContain('Loop phase: author-task');
    expect(formatTaskWorkbenchReport(report)).toContain('State\n- Capsule:');
    expect(formatTaskWorkbenchReport(report)).toContain('Readiness note: Fast task status skipped done-level readiness checks');
    expect(formatTaskWorkbenchReport(report)).toContain('Evidence\n- Lint: ok');
    expect(formatTaskWorkbenchReport(report)).toContain('Protocol\n- Task doctor:');
    expect(formatTaskWorkbenchReport(report)).toContain('Close\n- Close plan:');
    expect(formatTaskWorkbenchReport(report)).toContain('Authoring\n- ');
    expect(formatTaskWorkbenchReport(report)).toContain('Suggested next');
    expect(snapshotProject(root)).toEqual(before);
  });

  it('suggests title cleanup and legacy source document hash rows without writing TASK.md', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'src', 'cli'), { recursive: true });
    fs.writeFileSync(path.join(root, 'src', 'cli', 'main.ts'), 'export const cli = true;\n', 'utf8');
    const task = createTaskCapsule(root, 'Consider a small CLI global-option parsing capsule');
    const taskPath = path.join(task.dir, 'TASK.md');
    const taskMarkdown = fs.readFileSync(taskPath, 'utf8').replace(
      '## Inputs / Constraints\n\n| Source | Role | State | Notes |\n|---|---|---|---|\n| TBD | reference | active | TBD |',
      '## Inputs / Constraints\n\n| Path / Source | Type | Authority | State | Notes | Hash |\n|---|---|---|---|---|---|\n| `src/cli/main.ts` | implementation-source | approved | implementing | CLI entry point. | TBD |'
    );
    fs.writeFileSync(taskPath, taskMarkdown, 'utf8');
    const before = snapshotProject(root);

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.authoringSuggestions).toMatchObject({
      readOnly: true,
      writesProse: false,
      status: 'suggested',
      title: {
        status: 'looks-like-handoff-sentence',
        suggestedTitle: 'CLI Global-option Parsing'
      },
      sourceDocuments: {
        status: 'needs-hash',
        hashRows: [
          expect.objectContaining({
            path: 'src/cli/main.ts',
            status: 'ready',
            sourceHash: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
            row: expect.stringMatching(/^\| src\/cli\/main\.ts \| reference \| approved \| implemented \| Source document for this capsule\. \| sha256:/)
          })
        ],
        candidateSignals: expect.arrayContaining([
          expect.objectContaining({ path: 'src/cli/main.ts', suggestedConcern: 'CLI command behavior' })
        ])
      }
    });
    expect(report.authoringSuggestions.acceptance.guidance).toContain('Replace generic acceptance rows with behavior-specific criteria.');
    expect(report.authoringSuggestions.acceptance.candidateSignals.filter((item) => item.source === 'task-title')).toHaveLength(1);
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('keeps Change Summary suggestions read-only without git scanning', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'src'), { recursive: true });
    fs.mkdirSync(path.join(root, '.git'), { recursive: true });
    const task = createTaskCapsule(root, 'Change summary suggestions');
    fs.writeFileSync(path.join(root, 'src', 'changed.ts'), 'export const after = true;\n', 'utf8');
    fs.writeFileSync(path.join(root, 'src', 'new-file.ts'), 'export const created = true;\n', 'utf8');
    const before = snapshotProject(root);

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.authoringSuggestions.changeSummary).toMatchObject({
      status: 'placeholder',
      guidance: expect.arrayContaining([expect.stringContaining('HADARA does not infer or write the final rows')])
    });
    expect(report.authoringSuggestions.changeSummary.candidateRows).toEqual([]);
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('uses task status without --task as the next-work selection cockpit', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench next selection');

    const v2Report = createTaskSelectionStatusV2Report(root, new Date('2026-05-31T00:00:00.000Z'));
    const report = createTaskStatusSelectionReport(root, new Date('2026-05-31T00:00:00.000Z'));

    expect(v2Report).toMatchObject({
      schemaVersion: 'hadara.taskSelection.status.v2',
      command: 'task.status',
      scope: 'task-selection',
      mode: 'select-work',
      phase: 'select-work',
      selection: {
        selectedTaskId: task.id,
        selectedSource: 'docs/TASK_BOARD.md',
        primaryActionId: 'inspect-recommended-task',
        precedence: expect.arrayContaining([
          expect.objectContaining({ id: 'active-task', source: '.hadara/state/current.json' }),
          expect.objectContaining({ id: 'task-board', source: 'docs/TASK_BOARD.md' })
        ])
      },
      primaryNextAction: {
        command: `hadara task status --task ${task.id} --json`,
        writeBoundary: 'read-only',
        writes: false
      },
      compatibility: {
        legacyCommand: 'hadara task status --compat v1 --json'
      }
    });
    expect(v2Report.recommendations[0]).toMatchObject({ taskId: task.id, taskCapsulePresent: true });
    expect(validateSchema('hadara.taskSelection.status.v2', v2Report).ok).toBe(true);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.status.v1',
      command: 'task.status',
      ok: true,
      mode: 'select-work',
      loop: {
        phase: 'select-work',
        statusCommand: 'hadara task status --json',
        primaryNextAction: {
          command: `hadara task status --task ${task.id} --json`
        },
        deprecatedCommands: expect.not.arrayContaining([
          expect.objectContaining({ command: 'hadara task next --json' })
        ])
      }
    });
    expect(report.recommendations[0]).toMatchObject({ taskId: task.id, taskCapsulePresent: true });
    expect(validateSchema('hadara.task.status.v1', report).ok).toBe(true);
    expect(formatTaskStatusSelectionReport(report)).toContain('Task Status: select work');
  });

  it('maps selected-task v2 cockpit phases from explicit task-local signals', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench v2 phases');
    makeTaskAuthored(task.dir, { planStatus: 'Pending' });

    const planWork = createTaskStatusV2Report(root, task.id, new Date('2026-05-31T00:00:00.000Z'));
    expect(planWork).toMatchObject({
      schemaVersion: 'hadara.task.status.v2',
      phase: 'plan-work',
      readiness: { intent: 'plan', status: 'needs-review' },
      cockpit: {
        sourcePhase: 'author-task',
        planState: 'not-started',
        terminal: false
      }
    });
    expect(validateSchema('hadara.task.status.v2', planWork).ok).toBe(true);

    makeTaskAuthored(task.dir, { planStatus: 'In Progress' });
    const implement = createTaskStatusV2Report(root, task.id, new Date('2026-05-31T00:00:00.000Z'));
    expect(implement).toMatchObject({
      phase: 'implement',
      cockpit: { planState: 'in-progress' }
    });

    makeTaskAuthored(task.dir, { planStatus: 'Done' });
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Validation "Focused tests" failed; command: npm test; exitCode: 1',
      result: 'failed',
      visibility: 'public',
      tags: ['validation-check:phase-test']
    });
    const repair = createTaskStatusV2Report(root, task.id, new Date('2026-05-31T00:00:00.000Z'));
    expect(repair).toMatchObject({
      phase: 'repair-evidence',
      readiness: { intent: 'close', status: 'needs-review' },
      cockpit: {
        planState: 'done',
        validation: { checks: 1, unresolvedFailedOrBlocked: 1 }
      }
    });
    expect(validateSchema('hadara.task.status.v2', repair).ok).toBe(true);
  });

  it('maps selected-task v2 terminal and stale close states without active-work guidance', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench v2 closed phases');
    makeTaskAuthored(task.dir, { planStatus: 'Done' });
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Task close validation for T-0001 returned ok:true before close evidence append; reportHash sha256:test; sourceHash sha256:test.',
      result: 'passed',
      visibility: 'public'
    });

    const fast = createTaskStatusV2Report(root, task.id, new Date('2026-05-31T00:00:00.000Z'));
    expect(fast).toMatchObject({
      phase: 'closed-valid',
      readiness: { status: 'terminal' },
      cockpit: {
        terminal: true,
        hiddenSections: expect.arrayContaining(['authoringGuidance', 'authoringSuggestions', 'nextActions'])
      }
    });
    expect(validateSchema('hadara.task.status.v2', fast).ok).toBe(true);

    const full = createTaskStatusV2Report(root, task.id, new Date('2026-05-31T00:00:00.000Z'), { detail: 'full' });
    expect(full).toMatchObject({
      phase: 'closed-stale',
      readiness: { status: 'needs-review' },
      cockpit: {
        terminal: false,
        closeState: 'closed-valid'
      }
    });
    expect(validateSchema('hadara.task.status.v2', full).ok).toBe(true);
  });

  it('returns ok false and exit code 6 for a missing task through CLI', () => {
    const root = tempProject();
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleTaskCommand({
      args: ['task', 'status', '--task', 'T-9999', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    expect(process.exitCode).toBe(6);
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.task.status.v2',
      command: 'task.status',
      ok: false,
      scope: 'task',
      mode: 'selected-task',
      taskId: 'T-9999',
      task: { id: 'T-9999', taskStatus: 'Missing', taskBoardStatus: 'Missing', taskBoardPresent: false },
      readiness: { status: 'blocked', currentReady: false, closeProofValid: false },
      diagnostics: {
        generatedBy: 'cli',
        commandPath: 'task.status',
        slowThresholdMs: 10000,
        slow: false
      }
    });
    expect(payload.diagnostics.durationMs).toEqual(expect.any(Number));
    expect(validateSchema('hadara.task.status.v2', payload).ok).toBe(true);
  });

  it('routes task status without --task through v2 by default and v1 through compat', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Workbench CLI selection');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleTaskCommand({
      args: ['task', 'status', '--json'],
      projectRoot: root,
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.taskSelection.status.v2',
      command: 'task.status',
      scope: 'task-selection',
      mode: 'select-work',
      phase: 'select-work',
      diagnostics: {
        generatedBy: 'cli',
        commandPath: 'task.status',
        slowThresholdMs: 10000,
        slow: false
      }
    });
    expect(payload.diagnostics.durationMs).toEqual(expect.any(Number));
    expect(validateSchema('hadara.taskSelection.status.v2', payload).ok).toBe(true);

    const compatHandled = handleTaskCommand({
      args: ['task', 'status', '--compat', 'v1', '--json'],
      projectRoot: root,
      jsonOutput: true
    });
    expect(compatHandled).toBe(true);
    const compat = JSON.parse(String(log.mock.calls[1][0]));
    expect(compat).toMatchObject({
      schemaVersion: 'hadara.task.status.v1',
      command: 'task.status',
      mode: 'select-work',
      compatibility: {
        defaultSchemaVersion: 'hadara.taskSelection.status.v2',
        recommendedCommand: 'hadara task status --json'
      }
    });
    expect(validateSchema('hadara.task.status.v1', compat).ok).toBe(true);
  });

  it('uses fast selected-task CLI status by default and full diagnostics only on request', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench CLI detail');
    const spy = vi.spyOn(harnessService, 'createHarnessValidateReport');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const fastHandled = handleTaskCommand({
      args: ['task', 'status', '--task', task.id, '--json'],
      projectRoot: root,
      jsonOutput: true
    });
    const fastPayload = JSON.parse(String(log.mock.calls.at(-1)?.[0]));

    const fullHandled = handleTaskCommand({
      args: ['task', 'status', '--task', task.id, '--detail', 'full', '--json'],
      projectRoot: root,
      jsonOutput: true
    });
    const fullPayload = JSON.parse(String(log.mock.calls.at(-1)?.[0]));

    expect(fastHandled).toBe(true);
    expect(fullHandled).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(fastPayload).toMatchObject({
      schemaVersion: 'hadara.task.status.v2',
      scope: 'task',
      mode: 'selected-task',
      compatibility: { legacySchemaVersion: 'hadara.task.workbench.v1' }
    });
    expect(fullPayload.schemaVersion).toBe('hadara.task.status.v2');
    expect(fastPayload.readiness.reason).toContain('Fast task status skipped done-level readiness checks');
    expect(fullPayload.readiness.reason).toContain('Current done-level readiness is blocked');
    expect(validateSchema('hadara.task.status.v2', fastPayload).ok).toBe(true);
    expect(validateSchema('hadara.task.status.v2', fullPayload).ok).toBe(true);

    const compatHandled = handleTaskCommand({
      args: ['task', 'status', '--task', task.id, '--compat', 'v1', '--json'],
      projectRoot: root,
      jsonOutput: true
    });
    expect(compatHandled).toBe(true);
    const compatPayload = JSON.parse(String(log.mock.calls.at(-1)?.[0]));
    expect(compatPayload).toMatchObject({
      schemaVersion: 'hadara.task.workbench.v1',
      compatibility: {
        defaultSchemaVersion: 'hadara.task.status.v2',
        recommendedCommand: `hadara task status --task ${task.id} --json`
      }
    });
    expect(validateSchema('hadara.task.workbench.v1', compatPayload).ok).toBe(true);
  });

  it('prints compact selected-task status with --summary-json', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench compact status');
    appendEvidence(root, { taskId: task.id, kind: 'note', summary: 'Fixture evidence', result: 'passed', visibility: 'public' });
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleTaskCommand({
      args: ['task', 'status', '--task', task.id, '--summary-json'],
      projectRoot: root,
      jsonOutput: false
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls.at(-1)?.[0]));
    expect(payload).toMatchObject({
      schemaVersion: 'hadara.task.status.summary.v1',
      command: 'task.status',
      ok: true,
      mode: 'selected-task',
      taskId: task.id,
      task: {
        title: 'Workbench compact status',
        capsule: `tasks/${task.id}-workbench-compact-status`,
        taskStatus: 'Draft',
        taskBoardStatus: 'Draft'
      },
      phase: 'author-task',
      counts: {
        evidenceRecords: 1,
        validationChecks: 0,
        unresolvedValidation: 0
      },
      diagnostics: {
        generatedBy: 'cli',
        commandPath: 'task.status',
        slow: false
      }
    });
    expect(payload).not.toHaveProperty('sources');
    expect(payload).not.toHaveProperty('authoringSuggestions');
    expect(payload).not.toHaveProperty('authoringGuidance');
  });

  it('reports Task Board status drift from the actual docs/TASK_BOARD.md row', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench board drift');
    setTaskStatus(task.dir, 'Done');
    replaceTaskBoardRow(root, task.id, `| ${task.id} | Workbench board drift | Active | ${path.relative(root, task.dir)} | |`);

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.ok).toBe(true);
    expect(report.state.ready).toBe(false);
    expect(report.task).toMatchObject({
      taskStatus: 'Done',
      taskBoardStatus: 'Active',
      taskBoardPath: 'docs/TASK_BOARD.md',
      taskBoardPresent: true
    });
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'WORKBENCH_TASK_BOARD_STATUS_DRIFT' })]));
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });

  it('reports missing Task Board rows without falling back to TASK.md status', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench board missing');
    setTaskStatus(task.dir, 'Done');
    removeTaskBoardRow(root, task.id);

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.task).toMatchObject({
      taskStatus: 'Done',
      taskBoardStatus: 'Missing',
      taskBoardPresent: false
    });
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'WORKBENCH_TASK_BOARD_ROW_MISSING' })]));
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });

  it('reports Task Board capsule drift explicitly', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench capsule drift');
    replaceTaskBoardRow(root, task.id, `| ${task.id} | Workbench capsule drift | Draft | tasks/T-0000-wrong | |`);

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'WORKBENCH_TASK_BOARD_CAPSULE_DRIFT' })]));
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });

  it('separates blocked close evidence from valid closure', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench blocked close evidence');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Task close validation for T-0001 returned ok:false before close evidence append; reportHash sha256:test; sourceHash sha256:test.',
      result: 'blocked',
      visibility: 'public'
    });

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.state).toMatchObject({
      closeState: 'close-evidence-found-invalid',
      closeEvidenceFound: true,
      closedValid: false,
      closed: false,
      auditable: true
    });
    expect(report.nextActions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'review-finalize-repair-plan',
          command: `hadara task close --task ${task.id} --dry-run --json`
        })
      ])
    );
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });

  it('treats passed close evidence as valid closure', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench passed close evidence');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Task close validation for T-0001 returned ok:true before close evidence append; reportHash sha256:test; sourceHash sha256:test.',
      result: 'passed',
      visibility: 'public'
    });

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.state).toMatchObject({
      closeState: 'closed-valid',
      ready: false,
      readiness: {
        status: 'closed-valid-current-not-checked',
        currentReady: false,
        closeProofValid: true
      },
      closeEvidenceFound: true,
      closedValid: true,
      closed: true,
      auditable: true
    });
    expect(report.nextActions).toEqual([]);
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });

  it('skips task close dry-run on the default fast service path', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench validation count');
    const spy = vi.spyOn(harnessService, 'createHarnessValidateReport');

    createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(spy).not.toHaveBeenCalled();
  });

  it('uses task close dry-run as the single done-level validation source for full detail', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench validation count');
    const spy = vi.spyOn(harnessService, 'createHarnessValidateReport');

    createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'), { detail: 'full' });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('projects latest validation attempts by check with resolved failed attempts', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench validation attempts');
    const failed = appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Validation "Focused tests" failed; command: npm test',
      result: 'failed',
      visibility: 'public',
      category: 'validation',
      outcome: 'failed',
      tags: ['validation-check:focused123']
    });
    const failedId = failed.evidence.schemaVersion === 'hadara.evidence.v2' ? failed.evidence.id : '';
    const passed = appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Validation "Focused tests" passed; command: npm test',
      result: 'passed',
      visibility: 'public',
      category: 'validation',
      outcome: 'passed',
      tags: ['validation-check:focused123', `resolves:${failedId}`]
    });
    const passedId = passed.evidence.schemaVersion === 'hadara.evidence.v2' ? passed.evidence.id : '';

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.sources.evidenceList.validationAttempts).toMatchObject({
      checks: 1,
      unresolvedFailedOrBlocked: 0,
      latest: [
        {
          check: 'Focused tests',
          checkKey: 'focused123',
          attempts: 2,
          status: 'passed',
          latestEvidenceId: passedId,
          unresolvedFailedOrBlockedEvidenceIds: [],
          resolutionEvidenceIds: [passedId]
        }
      ]
    });
    expect(formatTaskWorkbenchReport(report)).toContain('Validation checks: 1 | unresolved: 0');
    expect(formatTaskWorkbenchReport(report)).toContain('Focused tests: passed');
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });

  it('marks blocked validation attempts as resolved when later explicit evidence resolves them', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench resolved blocked attempt');
    const blocked = appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Validation "Done-level harness validation" blocked; command: hadara harness validate',
      result: 'blocked',
      visibility: 'public',
      category: 'validation',
      outcome: 'blocked',
      tags: ['validation-check:harness123']
    });
    const blockedId = blocked.evidence.schemaVersion === 'hadara.evidence.v2' ? blocked.evidence.id : '';
    const resolver = appendEvidenceWithResult(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: 'Direct done-level harness validation passed.',
      result: 'passed',
      visibility: 'public',
      category: 'validation',
      outcome: 'passed',
      tags: [`resolves:${blockedId}`]
    });
    const resolverId = resolver.evidence.schemaVersion === 'hadara.evidence.v2' ? resolver.evidence.id : '';

    const report = createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

    expect(report.sources.evidenceList.validationAttempts?.latest).toEqual([
      expect.objectContaining({
        check: 'Done-level harness validation',
        checkKey: 'harness123',
        attempts: 1,
        status: 'resolved',
        latestEvidenceId: blockedId,
        unresolvedFailedOrBlockedEvidenceIds: [],
        resolutionEvidenceIds: [resolverId]
      })
    ]);
    expect(report.sources.evidenceList.validationAttempts?.unresolvedFailedOrBlocked).toBe(0);
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });
});

function snapshotProject(root: string): Record<string, string> {
  const files = [
    'docs/TASK_BOARD.md',
    'docs/PROJECT_STATE.md',
    'docs/AGENT_HANDOFF.md',
    ...fs.readdirSync(path.join(root, 'tasks')).flatMap((taskDir) => [
      `tasks/${taskDir}/TASK.md`,
      `tasks/${taskDir}/EVIDENCE.md`,
      `tasks/${taskDir}/evidence.jsonl`
    ])
  ];
  return Object.fromEntries(files.map((file) => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
}

function setTaskStatus(taskDir: string, status: string): void {
  const taskPath = path.join(taskDir, 'TASK.md');
  const content = fs.readFileSync(taskPath, 'utf8');
  fs.writeFileSync(taskPath, content.replace(/\| Status \| Draft \|/g, `| Status | ${status} |`), 'utf8');
}

function makeTaskAuthored(taskDir: string, options: { planStatus: 'Pending' | 'In Progress' | 'Done' }): void {
  const taskPath = path.join(taskDir, 'TASK.md');
  let content = fs.readFileSync(taskPath, 'utf8');
  content = content
    .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Verify selected-task v2 phase mapping. | Use task-local Plan state as the explicit plan-work signal. |')
    .replace(/\| 1 \| Define the task contract\. \| (Pending|In Progress|Done) \|/g, `| 1 | Define the task contract. | ${options.planStatus} |`)
    .replace(/\| 2 \| Implement the smallest useful slice\. \| (Pending|In Progress|Done) \|/g, `| 2 | Implement the smallest useful slice. | ${options.planStatus === 'Done' ? 'Done' : 'Pending'} |`)
    .replace(/\| 3 \| Validate and record evidence\. \| (Pending|In Progress|Done) \|/g, `| 3 | Validate and record evidence. | ${options.planStatus === 'Done' ? 'Done' : 'Pending'} |`)
    .replace('| AC-1 | Scope is implemented. | Pending | TBD | TBD |', '| AC-1 | Selected-task v2 phase is explicit. | Met | ev:fixture | `tests/unit/task-workbench.test.ts` |')
    .replace('| AC-2 | Validation evidence is recorded. | Pending | TBD | TBD |', '| AC-2 | Validation evidence is recorded. | Met | ev:fixture | `tests/unit/task-workbench.test.ts` |')
    .replace('| TBD | Yes | Not Run | TBD |', '| Fixture validation | Yes | Passed | ev:fixture |')
    .replace('| TBD | reference | active | TBD |', '| `tests/unit/task-workbench.test.ts` | implementation-source | active | Fixture source. |')
    .replace('| N/A | TBD |', '| `src/services/task-status-v2.ts` | Fixture change summary. |')
    .replace('| RF-1 | Follow-up | TBD | Open | TBD |', '| RF-1 | Follow-up | None. | Closed | N/A |');
  fs.writeFileSync(taskPath, content, 'utf8');
}

function replaceTaskBoardRow(root: string, taskId: string, replacement: string): void {
  const taskBoardPath = path.join(root, 'docs', 'TASK_BOARD.md');
  const content = fs.readFileSync(taskBoardPath, 'utf8');
  fs.writeFileSync(
    taskBoardPath,
    content
      .split(/\r?\n/)
      .map((line) => (line.startsWith(`| ${taskId} |`) ? replacement : line))
      .join('\n'),
    'utf8'
  );
}

function removeTaskBoardRow(root: string, taskId: string): void {
  const taskBoardPath = path.join(root, 'docs', 'TASK_BOARD.md');
  const content = fs.readFileSync(taskBoardPath, 'utf8');
  fs.writeFileSync(
    taskBoardPath,
    content
      .split(/\r?\n/)
      .filter((line) => !line.startsWith(`| ${taskId} |`))
      .join('\n'),
    'utf8'
  );
}
