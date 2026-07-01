import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { appendEvidence, appendEvidenceWithResult } from '../../src/evidence/evidence';
import { handleTaskCommand } from '../../src/cli/task';
import { validateSchema } from '../../src/core/schema';
import * as harnessService from '../../src/services/harness-service';
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
          expect.objectContaining({ command: 'hadara task next --json', replacement: 'hadara task status --json' }),
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
    expect(report.authoringSuggestions.sourceDocuments.guidance).toContain('CLI may suggest hashes for existing rows, but agents must choose the sources.');
    expect(report.authoringSuggestions.acceptance.draftAcceptanceExamples[0]).toMatchObject({
      confidence: 'low',
      source: 'generic-pattern'
    });
    expect(report.authoringSuggestions.acceptance.candidateSignals.filter((item) => item.source === 'task-title')).toHaveLength(1);
    expect(report.nextActions.length).toBeGreaterThan(0);
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
    expect(formatTaskWorkbenchReport(report)).toContain('Loop phase: author-task');
    expect(formatTaskWorkbenchReport(report)).toContain('State\n- Capsule:');
    expect(formatTaskWorkbenchReport(report)).toContain('Readiness note: Current done-level readiness is blocked');
    expect(formatTaskWorkbenchReport(report)).toContain('Evidence\n- Lint: ok');
    expect(formatTaskWorkbenchReport(report)).toContain('Protocol\n- Task doctor:');
    expect(formatTaskWorkbenchReport(report)).toContain('Close\n- Close plan:');
    expect(formatTaskWorkbenchReport(report)).toContain('Authoring\n- ');
    expect(formatTaskWorkbenchReport(report)).toContain('Suggested next');
    expect(snapshotProject(root)).toEqual(before);
  });

  it('suggests title cleanup and source document hash rows without writing TASK.md', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'src', 'cli'), { recursive: true });
    fs.writeFileSync(path.join(root, 'src', 'cli', 'main.ts'), 'export const cli = true;\n', 'utf8');
    const task = createTaskCapsule(root, 'Consider a small CLI global-option parsing capsule');
    const taskPath = path.join(task.dir, 'TASK.md');
    const taskMarkdown = fs.readFileSync(taskPath, 'utf8').replace(
      '| TBD | reference | exploratory | draft | TBD | TBD |',
      '| `src/cli/main.ts` | implementation-source | approved | implementing | TBD | CLI entry point. |'
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
            row: expect.stringContaining('| src/cli/main.ts | reference | approved | implemented | sha256:')
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

  it('uses task status without --task as the next-work selection cockpit', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench next selection');

    const report = createTaskStatusSelectionReport(root, new Date('2026-05-31T00:00:00.000Z'));

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
        deprecatedCommands: expect.arrayContaining([
          expect.objectContaining({ command: 'hadara task next --json', replacement: 'hadara task status --json' })
        ])
      }
    });
    expect(report.recommendations[0]).toMatchObject({ taskId: task.id, taskCapsulePresent: true });
    expect(validateSchema('hadara.task.status.v1', report).ok).toBe(true);
    expect(formatTaskStatusSelectionReport(report)).toContain('Task Status: select work');
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
      schemaVersion: 'hadara.task.workbench.v1',
      command: 'task.status',
      ok: false,
      task: { id: 'T-9999', taskStatus: 'Missing', taskBoardStatus: 'Missing', taskBoardPresent: false },
      state: { readiness: { status: 'missing-task', currentReady: false, closeProofValid: false } },
      diagnostics: {
        generatedBy: 'cli',
        commandPath: 'task.status',
        slowThresholdMs: 10000,
        slow: false
      }
    });
    expect(payload.diagnostics.durationMs).toEqual(expect.any(Number));
    expect(validateSchema('hadara.task.workbench.v1', payload).ok).toBe(true);
  });

  it('routes task status without --task through the CLI selection report', () => {
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
      schemaVersion: 'hadara.task.status.v1',
      command: 'task.status',
      mode: 'select-work',
      loop: { phase: 'select-work' },
      diagnostics: {
        generatedBy: 'cli',
        commandPath: 'task.status',
        slowThresholdMs: 10000,
        slow: false
      }
    });
    expect(payload.diagnostics.durationMs).toEqual(expect.any(Number));
    expect(validateSchema('hadara.task.status.v1', payload).ok).toBe(true);
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
    expect(report.nextActions).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'audit-close' })]));
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
        status: 'closed-valid-current-blocked',
        currentReady: false,
        closeProofValid: true
      },
      closeEvidenceFound: true,
      closedValid: true,
      closed: true,
      auditable: true
    });
    expect(validateSchema('hadara.task.workbench.v1', report).ok).toBe(true);
  });

  it('uses task close dry-run as the single done-level validation source', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Workbench validation count');
    const spy = vi.spyOn(harnessService, 'createHarnessValidateReport');

    createTaskWorkbenchReport(root, task.id, new Date('2026-05-31T00:00:00.000Z'));

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
