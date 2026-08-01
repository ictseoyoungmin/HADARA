import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleStatusCommand } from '../../src/cli/status';
import { assertSchema } from '../../src/core/schema';
import {
  createOpsStatusReport,
  createOpsStatusSummaryReport
} from '../../src/services/operations-status-service';
import { createProjectStatusV2Report } from '../../src/services/project-status-v2';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { writeCanonicalTaskBoard } from '../helpers/task-board';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-status-json-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Operations Status JSON', () => {
  it('emits lifecycle-aware project status v2 as the default status ingress', () => {
    const root = tempProject();
    writeProjectDocs(root);

    const report = createProjectStatusV2Report(root);

    assertSchema('hadara.project.status.v2', report);
    expect(report).toMatchObject({
      schemaVersion: 'hadara.project.status.v2',
      command: 'status',
      ok: true,
      scope: 'project',
      health: 'ok',
      compatibility: {
        legacySchemaVersion: 'hadara.ops.status.v1',
        legacyCommand: 'hadara status --compat v1 --json'
      }
    });
    expect(report.readiness).toMatchObject({
      intent: expect.any(String),
      status: expect.any(String),
      reason: expect.any(String)
    });
    expect(report.evaluations.length).toBeGreaterThan(0);
  });

  it('routes active Task Board work to task status', () => {
    const root = tempProject();
    writeProjectDocs(root);
    const task = createTaskCapsule(root, 'Active task');
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      `# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n| ${task.id} | Active task | In Progress | ${path.relative(root, task.dir)} | Active. |\n`,
      'utf8'
    );
    const report = createProjectStatusV2Report(root);

    expect(report.phase).toBe('active-work');
    expect(report.readiness).toMatchObject({
      intent: 'orient',
      status: 'ready',
      reason: 'An active task is selected; inspect selected-task status before editing.'
    });
    expect(report.primaryNextAction).toMatchObject({
      id: 'inspect-recommended-task',
      command: `hadara task status --task ${task.id} --json`,
      writeBoundary: 'read-only',
      writes: false
    });
    expect(report.sources).not.toHaveProperty('currentState');
  });

  it('does not use global handoff continuation when Task Board has no next work', () => {
    const root = tempProject();
    writeProjectDocs(root);
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n| T-0677 | Structured Continuation Semantics and rc2 Baseline Rollup | Done | tasks/T-0677-x | |\n',
      'utf8'
    );
    const report = createProjectStatusV2Report(root);

    expect(report.phase).toBe('idle');
    expect(report.readiness).toMatchObject({
      intent: 'orient',
      status: 'terminal'
    });
    expect(report.primaryNextAction).toBe(null);
    expect(assertSchema('hadara.project.status.v2', report)).toBeUndefined();
  });

  it('routes uninitialized projects to init before task creation recommendations', () => {
    const root = tempProject();

    const report = createProjectStatusV2Report(root);

    expect(report.phase).toBe('uninitialized');
    expect(report.primaryNextAction).toMatchObject({
      id: 'initialize-project',
      command: 'hadara init --json',
      writeBoundary: 'project-config',
      requiresReview: true,
      writes: true
    });
    expect(report.primaryNextAction?.command).not.toContain('task create');
    expect(assertSchema('hadara.project.status.v2', report)).toBeUndefined();
  });

  it('honors status --detail full on the default v2 report path', () => {
    const root = tempProject();
    writeProjectDocs(root);

    const fast = createProjectStatusV2Report(root, new Date('2026-05-31T00:00:00.000Z'));
    const full = createProjectStatusV2Report(root, new Date('2026-05-31T00:00:00.000Z'), { detail: 'full' });

    expect(fast.sources.opsStatusV1.detail).toBe('fast');
    expect(full.sources.opsStatusV1.detail).toBe('full');
    expect(full.sources.opsStatusV1).toMatchObject({
      debt: {
        evaluation: 'repo-local-only',
        summary: expect.any(String),
        open: expect.any(Number),
        highOpen: expect.any(Number)
      },
      stateConsistency: {
        evaluated: true,
        consistent: expect.any(Boolean),
        errors: expect.any(Number),
        warnings: expect.any(Number)
      },
      activeRun: {
        present: expect.any(Boolean)
      },
      knownProblems: expect.any(Number)
    });
    expect(assertSchema('hadara.project.status.v2', full)).toBeUndefined();
  });

  it('builds a dashboard-ready status snapshot from project docs and task capsules', () => {
    const root = tempProject();
    writeProjectDocs(root);
    writeGitBranch(root, 'main');
    const done = createTaskCapsule(root, 'Done task');
    const draft = createTaskCapsule(root, 'Draft task');
    const partial = createTaskCapsule(root, 'Partial task');
    const superseded = createTaskCapsule(root, 'Superseded task');
    setTaskStatus(done.dir, 'Done');
    setTaskStatus(draft.dir, 'Draft');
    setTaskStatus(partial.dir, 'Partial');
    setTaskStatus(superseded.dir, 'Superseded');

    const report = createOpsStatusReport(root);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.ops.status.v1',
      command: 'ops.status',
      ok: true,
      health: 'ok',
      project: {
        branch: 'main',
        phase: 'bootstrap-development'
      },
      tasks: {
        counts: {
          done: 1,
          draft: 1,
          partial: 1,
          superseded: 1,
          inProgress: 0,
          unknown: 0
        },
        rawStatusCounts: {
          Done: 1,
          Draft: 1,
          Partial: 1,
          Superseded: 1
        },
        normalizedStatusCounts: {
          done: 1,
          draft: 1,
          partial: 1,
          superseded: 1
        },
        lastCompleted: [],
        nextRecommended: 'Start T-0002 Draft task (tasks/T-0002-draft-task).'
      },
      handoff: {
        currentState: [
          'T-0001: Draft - Done task',
          'T-0002: Draft - Draft task',
          'T-0003: Draft - Partial task',
          'T-0004: Draft - Superseded task'
        ],
        knownProblems: [],
        nextRecommendedStep: []
      },
      validation: {
        latestFullCheck: null,
        latestDoneLevelValidation: null
      },
      debt: {
        total: 0,
        open: 0,
        tracked: 0,
        mitigated: 0,
        candidate: 0,
        highOpen: 0
      },
      mcp: {
        defaultMode: 'read-only',
        evidenceAttach: {
          enabledByDefault: false,
          requiresFlag: '--enable-evidence-attach',
          requiresApproval: true,
          audited: true
        }
      },
      issues: []
    });
  });

  it('keeps stable task count keys and reports raw and normalized status counts separately', () => {
    const root = tempProject();
    writeProjectDocs(root);
    const active = createTaskCapsule(root, 'Active task');
    const custom = createTaskCapsule(root, 'Custom task');
    setTaskStatus(active.dir, 'In Progress');
    setTaskStatus(custom.dir, 'Needs Review');

    const report = createOpsStatusReport(root);

    expect(report.tasks.counts).toEqual({
      done: 0,
      draft: 0,
      partial: 0,
      superseded: 0,
      inProgress: 1,
      unknown: 1
    });
    expect(report.tasks.rawStatusCounts).toEqual({
      'In Progress': 1,
      'Needs Review': 1
    });
    expect(report.tasks.normalizedStatusCounts).toEqual({
      inProgress: 1,
      needsReview: 1
    });
  });

  it('reports warning issues for missing source documents and validation baseline', () => {
    const root = tempProject();

    const report = createOpsStatusReport(root);

    expect(report.ok).toBe(true);
    expect(report.health).toBe('degraded');
    expect(report.project.phase).toBe('bootstrap-development');
    expect(report.issues).toEqual([
      {
        severity: 'warning',
        code: 'TASK_BOARD_MISSING',
        message: 'docs/TASK_BOARD.md is missing.'
      },
      {
        severity: 'warning',
        code: 'DEVELOPMENT_SLICES_MISSING',
        message: 'docs/DEVELOPMENT_SLICES.md is missing.'
      },
      {
        severity: 'warning',
        code: 'VALIDATION_BASELINE_MISSING',
        message: 'No latest validation baseline was found in task evidence or validation history.'
      }
    ]);
  });

  it('does not require governed-only handoff docs for basic profile status', () => {
    const root = tempProject();
    writeProfileProjectDocs(root, 'basic');

    const report = createOpsStatusReport(root, { includeDebt: false, taskStatusSource: 'task-board' });

    expect(report.health).toBe('ok');
    expect(report.handoff.currentState).toEqual([]);
    expect(report.validation).toEqual({
      latestFullCheck: null,
      latestDoneLevelValidation: null
    });
    expect(report.issues).toEqual([]);
  });

  it('degrades instead of failing when active run local state is malformed', () => {
    const root = tempProject();
    writeProjectDocs(root);
    const activeRunPath = path.join(root, '.hadara', 'local', 'state', 'active-run.json');
    fs.mkdirSync(path.dirname(activeRunPath), { recursive: true });
    fs.writeFileSync(activeRunPath, '{not json', 'utf8');

    const report = createOpsStatusReport(root);

    expect(report.ok).toBe(true);
    expect(report.health).toBe('degraded');
    expect(report.activeRun).toMatchObject({
      schemaVersion: 'hadara.active_run.projection.v1',
      activeRun: null,
      handoff: {
        fresh: false,
        staleReason: '.hadara/local/state/active-run.json could not be read.'
      },
      issues: [
        {
          severity: 'warning',
          code: 'ACTIVE_RUN_MANIFEST_INVALID'
        }
      ]
    });
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        severity: 'warning',
        code: 'ACTIVE_RUN_MANIFEST_INVALID'
      })
    );
  });

  it('uses default phase and falls back to validation history', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
    fs.writeFileSync(
      path.join(root, 'docs', 'VALIDATION_HISTORY.md'),
      [
        '# VALIDATION_HISTORY',
        '',
        '- Docker check after T-0053: 28 test files passed, 144 tests passed.',
        '- Docker node dist/cli/main.js harness validate --task T-0053 --level done --json returned ok true.'
      ].join('\n'),
      'utf8'
    );

    const report = createOpsStatusReport(root);

    expect(report.project.phase).toBe('bootstrap-development');
    expect(report.validation).toEqual({
      latestFullCheck: 'Docker check after T-0053: 28 test files passed, 144 tests passed',
      latestDoneLevelValidation: 'Docker node dist/cli/main.js harness validate --task T-0053 --level done --json returned ok true'
    });
    expect(report.issues).toEqual([]);
  });

  it('aliases default status to task status and keeps legacy diagnostics explicit', () => {
    const root = tempProject();
    writeProjectDocs(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(handleStatusCommand({ args: ['status', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleStatusCommand({ args: ['status', '--compat', 'v1', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleStatusCommand({ args: ['status', '--detail', 'full', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleStatusCommand({ args: ['status', '--compat', 'v1', '--detail', 'full', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(() => handleStatusCommand({ args: ['status', '--state-only', '--json'], projectRoot: root, jsonOutput: true })).toThrow('Top-level status diagnostics were retired');
    expect(() => handleStatusCommand({ args: ['status', '--summary-json'], projectRoot: root, jsonOutput: false })).toThrow('Top-level status diagnostics were retired');

    const first = JSON.parse(String(log.mock.calls[0]?.[0]));
    const compat = JSON.parse(String(log.mock.calls[1]?.[0]));
    const full = JSON.parse(String(log.mock.calls[2]?.[0]));
    const compatFull = JSON.parse(String(log.mock.calls[3]?.[0]));
    expect(first.schemaVersion).toBe('hadara.task.status.summary.v1');
    expect(first.command).toBe('task.status');
    expect(first.detailCommand).toBe('hadara task status --detail full --json');
    expect(compat.schemaVersion).toBe('hadara.ops.status.v1');
    expect(compat.command).toBe('ops.status');
    expect(compat.compatibility).toMatchObject({
      defaultSchemaVersion: 'hadara.task.status.summary.v1',
      recommendedCommand: 'hadara task status --json'
    });
    expect(compat.stateConsistency).toBeUndefined();
    expect(compat.handoff.knownProblems).toEqual([]);
    expect(compat.debtEvaluation).toMatchObject({
      state: 'not-evaluated'
    });
    expect(compat.debt).toMatchObject({
      total: 0,
      open: 0,
      highOpen: 0
    });
    expect(full.schemaVersion).toBe('hadara.taskSelection.status.v2');
    expect(full.command).toBe('task.status');
    expect(compatFull.schemaVersion).toBe('hadara.ops.status.v1');
    expect(compatFull.stateConsistency).toMatchObject({
      mode: 'advisory',
      strictBlocking: false,
      issueCounts: expect.any(Object),
      issues: expect.any(Array)
    });
    expect(compatFull.handoff.knownProblems).toEqual([]);
  });

  it('does not keep validation-baseline mutation under the deprecated status alias', () => {
    const root = tempProject();
    writeProjectDocs(root);

    expect(() => handleStatusCommand({
      args: ['status', 'baseline', 'promote', '--json'],
      projectRoot: root,
      jsonOutput: true
    })).toThrow('status baseline promote was removed before 0.5 stable');
  });

  it('can count task board statuses without scanning task capsules', () => {
    const root = tempProject();
    writeProjectDocs(root);
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      [
        '# TASK_BOARD',
        '',
        '| ID | Title | Status | Path | Notes |',
        '|---|---|---|---|---|',
        '| T-0001 | Done task | Done | tasks/T-0001-done-task | Closed. |',
        '| T-0002 | Active task | In Progress | tasks/T-0002-active-task | Active. |',
        '| T-0003 | Weird task | Needs Review | tasks/T-0003-weird-task | Custom. |'
      ].join('\n'),
      'utf8'
    );

    const report = createOpsStatusReport(root, { taskStatusSource: 'task-board', includeDebt: false, includeKnownProblems: false });

    expect(report.tasks.counts).toEqual({
      done: 1,
      draft: 0,
      partial: 0,
      superseded: 0,
      inProgress: 1,
      unknown: 1
    });
    expect(report.tasks.rawStatusCounts).toEqual({
      Done: 1,
      'In Progress': 1,
      'Needs Review': 1
    });
  });

  it('uses the active-capsule task cockpit through the deprecated status alias', () => {
    const root = tempProject();
    writeProjectDocs(root);
    const task = createTaskCapsule(root, 'Status alias active capsule');
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(handleStatusCommand({ args: ['status', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);

    expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toMatchObject({
      schemaVersion: 'hadara.task.status.summary.v1',
      command: 'task.status',
      mode: 'selected-task',
      taskId: task.id
    });
  });

  it('prefers current Task Board work over stale handoff recommendations', () => {
    const root = tempProject();
    writeProjectDocs(root);
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      [
        '# TASK_BOARD',
        '',
        '| ID | Title | Status | Path | Notes |',
        '|---|---|---|---|---|',
        '| T-0001 | Completed task | Done | tasks/T-0001-completed-task | Closed. |',
        '| T-0002 | Current repair | Draft | tasks/T-0002-current-repair | Active capsule. |'
      ].join('\n'),
      'utf8'
    );

    const report = createOpsStatusSummaryReport(root);

    expect(report.tasks.nextRecommended).toBe('Start T-0002 Current repair (tasks/T-0002-current-repair).');
    expect(report.tasks.nextRecommended).not.toContain('T-0053 Operations Status JSON');
  });

  it('uses Task Board partial work instead of legacy handoff guidance', () => {
    const root = tempProject();
    writeProjectDocs(root);
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      [
        '# TASK_BOARD',
        '',
        '| ID | Title | Status | Path | Notes |',
        '|---|---|---|---|---|',
        '| T-0001 | Historical partial | Partial | tasks/T-0001-historical-partial | Old residual. |'
      ].join('\n'),
      'utf8'
    );

    const report = createOpsStatusSummaryReport(root);

    expect(report.tasks.nextRecommended).toBe('Resume partial T-0001 Historical partial (tasks/T-0001-historical-partial).');
  });

  it('builds a compact summary report without debt, known problems, or state checks by default', () => {
    const root = tempProject();
    writeProjectDocs(root);

    const report = createOpsStatusSummaryReport(root);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.ops.statusSummary.v1',
      command: 'status.summary',
      ok: true,
      health: 'ok',
      project: {
        phase: 'bootstrap-development'
      },
      tasks: {
        lastCompleted: [],
        nextRecommended: null
      },
      validation: {
        latestDoneLevelValidation: null
      },
      issues: []
    });
    expect(report.stateConsistency).toBeUndefined();
  });

  it('keeps the dashboard sample fixture aligned with the status schema', () => {
    const fixture = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'docs', 'archive', 'retired-2026-07-26', 'design', 'fixtures', 'hadara.ops.status.sample.json'), 'utf8'));

    expect(fixture).toMatchObject({
      schemaVersion: 'hadara.ops.status.v1',
      command: 'ops.status',
      ok: true,
      health: expect.stringMatching(/^(ok|degraded|error)$/),
      tasks: {
        counts: {
          done: expect.any(Number),
          draft: expect.any(Number),
          partial: expect.any(Number),
          superseded: expect.any(Number),
          inProgress: expect.any(Number),
          unknown: expect.any(Number)
        },
        rawStatusCounts: expect.any(Object),
        normalizedStatusCounts: expect.any(Object)
      },
      debt: {
        total: expect.any(Number),
        open: expect.any(Number),
        tracked: expect.any(Number),
        mitigated: expect.any(Number),
        candidate: expect.any(Number),
        highOpen: expect.any(Number),
        bySeverity: {
          high: expect.any(Number),
          medium: expect.any(Number),
          low: expect.any(Number)
        }
      },
      issues: expect.any(Array)
    });
  });
});

function writeProjectDocs(root: string): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  writeCanonicalTaskBoard(root);
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
}

function writeProfileProjectDocs(root: string, profile: 'basic' | 'standard' | 'governed', extraRegisteredDocs: string[] = []): void {
  fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(
    path.join(root, '.hadara', 'scaffold.json'),
    `${JSON.stringify({ schemaVersion: 'hadara.scaffold.v1', hadaraProtocol: '0.4', profile }, null, 2)}\n`,
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, '.hadara', 'docs-registry.json'),
    `${JSON.stringify({
      schemaVersion: 'hadara.docsRegistry.v2',
      registryVersion: 1,
      projectProfile: profile,
      documents: [
        { path: 'docs/TASK_BOARD.md', status: 'canonical' },
        ...extraRegisteredDocs.map((docPath) => ({ path: docPath, status: 'canonical' }))
      ]
    }, null, 2)}\n`,
    'utf8'
  );
  writeCanonicalTaskBoard(root);
}

function writeGitBranch(root: string, branch: string): void {
  fs.mkdirSync(path.join(root, '.git'), { recursive: true });
  fs.writeFileSync(path.join(root, '.git', 'HEAD'), `ref: refs/heads/${branch}\n`, 'utf8');
}

function setTaskStatus(taskDir: string, status: string): void {
  const taskPath = path.join(taskDir, 'TASK.md');
  const content = fs.readFileSync(taskPath, 'utf8');
  fs.writeFileSync(taskPath, content.replace(/\| Status \| Draft \|/, `| Status | ${status} |`), 'utf8');
}
