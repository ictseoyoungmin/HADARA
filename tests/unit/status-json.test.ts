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

  it('routes active current-state work to task status without duplicating local task phase', () => {
    const root = tempProject();
    writeProjectDocs(root);
    fs.mkdirSync(path.join(root, '.hadara', 'state'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'state', 'current.json'), `${JSON.stringify({
      schemaVersion: 'hadara.projectCurrentState.v1',
      rev: 1,
      profile: 'governed',
      currentRelease: '0.5.0-dev',
      latestCompletedTaskBasis: 'highest-done-task-id',
      latestCompletedTask: null,
      activeTask: { id: 'T-0002', title: 'Active task' },
      nextWork: null,
      nextOperatorIntent: 'Inspect active task.',
      currentKnownProblems: [],
      validationBaseline: { summary: 'Fixture baseline.', evidence: [] }
    })}\n`, 'utf8');

    const report = createProjectStatusV2Report(root);

    expect(report.phase).toBe('active-work');
    expect(report.readiness.intent).toBe('edit');
    expect(report.primaryNextAction).toMatchObject({
      id: 'inspect-active-task',
      command: 'hadara task status --task T-0002 --json',
      writeBoundary: 'read-only',
      writes: false
    });
  });

  it('surfaces malformed current-state canon in project status v2', () => {
    const root = tempProject();
    writeProjectDocs(root);
    fs.mkdirSync(path.join(root, '.hadara', 'state'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'state', 'current.json'), '{not-json', 'utf8');

    const report = createProjectStatusV2Report(root);

    expect(report.phase).toBe('degraded');
    expect(report.health).toBe('blocked');
    expect(report.evaluations).toContainEqual(
      expect.objectContaining({
        id: 'current-state',
        state: 'invalid',
        health: 'blocked'
      })
    );
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'PROJECT_CURRENT_STATE_INVALID_JSON', severity: 'error' })
      ])
    );
    expect(report.primaryNextAction).toMatchObject({
      id: 'inspect-status-full',
      command: 'hadara status --detail full --json',
      writes: false
    });
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
        lastCompleted: ['T-0050', 'T-0051', 'T-0052'],
        nextRecommended: 'Start T-0002 Draft task (tasks/T-0002-draft-task).'
      },
      handoff: {
        currentState: ['MCP guard layer is complete.'],
        knownProblems: ['Docker is the working validation path for now.'],
        nextRecommendedStep: ['Do T-0053 Operations Status JSON before dashboard implementation.']
      },
      validation: {
        latestFullCheck: 'Docker npm ci && npm run check passed with 27 test files and 142 tests',
        latestDoneLevelValidation: 'T-0052 ok'
      },
      debt: {
        total: 8,
        open: 4,
        tracked: 2,
        mitigated: 4,
        candidate: 2,
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
    expect(report.project.phase).toBe('unknown');
    expect(report.issues).toEqual([
      {
        severity: 'warning',
        code: 'PROJECT_STATE_MISSING',
        message: 'docs/PROJECT_STATE.md is missing.'
      },
      {
        severity: 'warning',
        code: 'AGENT_HANDOFF_MISSING',
        message: 'docs/AGENT_HANDOFF.md is missing.'
      },
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
        message: 'No latest validation baseline was found in handoff or validation history.'
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

  it('requires AGENT_HANDOFF only when the profile or registry expects it', () => {
    const governed = tempProject();
    writeProfileProjectDocs(governed, 'governed');

    const governedReport = createOpsStatusReport(governed, { includeDebt: false, taskStatusSource: 'task-board' });

    expect(governedReport.health).toBe('degraded');
    expect(governedReport.issues).toContainEqual({
      severity: 'warning',
      code: 'AGENT_HANDOFF_MISSING',
      message: 'docs/AGENT_HANDOFF.md is missing.'
    });
    expect(governedReport.issues).not.toContainEqual(expect.objectContaining({ code: 'DEVELOPMENT_SLICES_MISSING' }));

    const standardWithRegisteredHandoff = tempProject();
    writeProfileProjectDocs(standardWithRegisteredHandoff, 'standard', ['docs/AGENT_HANDOFF.md']);

    const registeredReport = createOpsStatusReport(standardWithRegisteredHandoff, { includeDebt: false, taskStatusSource: 'task-board' });

    expect(registeredReport.issues).toContainEqual({
      severity: 'warning',
      code: 'AGENT_HANDOFF_MISSING',
      message: 'docs/AGENT_HANDOFF.md is missing.'
    });
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

  it('parses explicit phase markers and falls back to validation history', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Phase\n\nPhase: release-hardening\n', 'utf8');
    fs.writeFileSync(
      path.join(root, 'docs', 'AGENT_HANDOFF.md'),
      '# AGENT_HANDOFF\n\n## Current State\n\n- Handoff exists.\n',
      'utf8'
    );
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

    expect(report.project.phase).toBe('release-hardening');
    expect(report.validation).toEqual({
      latestFullCheck: 'Docker check after T-0053: 28 test files passed, 144 tests passed',
      latestDoneLevelValidation: 'Docker node dist/cli/main.js harness validate --task T-0053 --level done --json returned ok true'
    });
    expect(report.issues).toEqual([]);
  });

  it('parses table-first Project State current phase rows', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(
      path.join(root, 'docs', 'PROJECT_STATE.md'),
      [
        '# PROJECT_STATE',
        '',
        '## Current Phase',
        '',
        '| Field | Value |',
        '|---|---|',
        '| Phase | bootstrap-development |',
        '| Status | initialized |'
      ].join('\n'),
      'utf8'
    );
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\n## Current State\n\n- Ready.\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n', 'utf8');

    const report = createOpsStatusReport(root);

    expect(report.project.phase).toBe('bootstrap-development');
  });

  it('prefers table-first handoff validation over older validation history', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Phase\n\nPhase: dashboard-refresh\n', 'utf8');
    fs.writeFileSync(
      path.join(root, 'docs', 'AGENT_HANDOFF.md'),
      [
        '# AGENT_HANDOFF',
        '',
        '## Current State',
        '',
        '| Area | State | Notes |',
        '|---|---|---|',
        '| Branch | main | current |',
        '',
        '## Next Recommended Step',
        '',
        '| Step | Reason | Done Evidence |',
        '|---|---|---|',
        '| Continue | current task | evidence |',
        '',
        '## Validation Baseline',
        '',
        '| Check | Latest Evidence | Notes |',
        '|---|---|---|',
        '| Full repository check | Docker `npm run dev:docker-sync-build` passed with 90 files and 586 tests during T-0224. | Current |'
      ].join('\n'),
      'utf8'
    );
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'VALIDATION_HISTORY.md'), '- Docker check after T-0096 follow-up hardening: 39 test files passed, 249 tests passed.\n', 'utf8');

    const report = createOpsStatusReport(root);

    expect(report.validation.latestFullCheck).toBe('Docker `npm run dev:docker-sync-build` passed with 90 files and 586 tests during T-0224');
    expect(report.validation.latestFullCheck).not.toContain('T-0096');
  });

  it('parses handoff table sections as data rows instead of Markdown headers', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Phase\n\nPhase: table-parser\n', 'utf8');
    fs.writeFileSync(
      path.join(root, 'docs', 'AGENT_HANDOFF.md'),
      [
        '# AGENT_HANDOFF',
        '',
        '## Current State',
        '',
        '| Area | State | Notes |',
        '|---|---|---|',
        '| Branch | main | table fixture |',
        '',
        '## Current Known Problems',
        '',
        '| Issue | Impact | Next Step |',
        '|---|---|---|',
        '| None | None | Continue |',
        '',
        '## Next Recommended Step',
        '',
        '| Step | Reason | Done Evidence |',
        '|---|---|---|',
        '| Continue | table parser works | status evidence |',
        '',
        '## Validation Baseline',
        '',
        '| Check | Latest Evidence | Notes |',
        '|---|---|---|',
        '| Latest full check | Docker sync-build passed | fixture |',
        '| Latest done-level validation | harness validate passed | fixture |'
      ].join('\n'),
      'utf8'
    );
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
    fs.writeFileSync(path.join(root, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n', 'utf8');

    const report = createOpsStatusReport(root);

    expect(report.handoff.currentState[0]).toBe('Branch · main · table fixture');
    expect(report.handoff.nextRecommendedStep[0]).toBe('Continue · table parser works · status evidence');
    expect(report.tasks.nextRecommended).toBe('Continue · table parser works · status evidence');
    expect(report.validation.latestFullCheck).toBe('Docker sync-build passed');
    expect(report.validation.latestDoneLevelValidation).toBe('harness validate passed');
    expect(report.handoff.currentState).not.toContain('Area · State · Notes');
    expect(report.handoff.nextRecommendedStep).not.toContain('Step · Reason · Done Evidence');
  });

  it('prints v2 fast JSON by default and keeps v1 compatibility and diagnostics explicit', () => {
    const root = tempProject();
    writeProjectDocs(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(handleStatusCommand({ args: ['status', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleStatusCommand({ args: ['status', '--compat', 'v1', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleStatusCommand({ args: ['status', '--detail', 'full', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleStatusCommand({ args: ['status', '--state-only', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleStatusCommand({ args: ['status', '--summary-json'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(handleStatusCommand({ args: ['status', '--compat', 'v1', '--detail', 'full', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);

    const first = JSON.parse(String(log.mock.calls[0]?.[0]));
    const compat = JSON.parse(String(log.mock.calls[1]?.[0]));
    const full = JSON.parse(String(log.mock.calls[2]?.[0]));
    const stateOnly = JSON.parse(String(log.mock.calls[3]?.[0]));
    const summary = JSON.parse(String(log.mock.calls[4]?.[0]));
    const compatFull = JSON.parse(String(log.mock.calls[5]?.[0]));
    expect(first.schemaVersion).toBe('hadara.project.status.v2');
    expect(first.command).toBe('status');
    expect(first.compatibility.legacyCommand).toBe('hadara status --compat v1 --json');
    expect(compat.schemaVersion).toBe('hadara.ops.status.v1');
    expect(compat.command).toBe('ops.status');
    expect(compat.compatibility).toMatchObject({
      defaultSchemaVersion: 'hadara.project.status.v2',
      recommendedCommand: 'hadara status --json'
    });
    expect(compat.stateConsistency).toBeUndefined();
    expect(compat.handoff.knownProblems).toEqual([]);
    expect(compat.debt).toMatchObject({
      total: 0,
      open: 0,
      highOpen: 0
    });
    expect(full.schemaVersion).toBe('hadara.project.status.v2');
    expect(full.command).toBe('status');
    expect(compatFull.schemaVersion).toBe('hadara.ops.status.v1');
    expect(compatFull.stateConsistency).toMatchObject({
      mode: 'advisory',
      strictBlocking: false,
      issueCounts: expect.any(Object),
      issues: expect.any(Array)
    });
    expect(compatFull.handoff.knownProblems).toEqual(['Docker is the working validation path for now.']);
    expect(stateOnly).toMatchObject({
      schemaVersion: 'hadara.ops.statusState.v1',
      command: 'status.state',
      ok: true,
      stateConsistency: {
        mode: 'advisory',
        strictBlocking: false,
        issueCounts: expect.any(Object),
        issues: expect.any(Array)
      }
    });
    expect(summary).toMatchObject({
      schemaVersion: 'hadara.ops.statusSummary.v1',
      command: 'status.summary',
      ok: true,
      tasks: {
        counts: expect.any(Object),
        lastCompleted: ['T-0050', 'T-0051', 'T-0052'],
        nextRecommended: 'Do T-0053 Operations Status JSON before dashboard implementation.'
      }
    });
    expect(summary.stateConsistency).toBeUndefined();
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

  it('uses handoff guidance before old partial Task Board rows', () => {
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

    expect(report.tasks.nextRecommended).toBe('Do T-0053 Operations Status JSON before dashboard implementation.');
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
        lastCompleted: ['T-0050', 'T-0051', 'T-0052'],
        nextRecommended: 'Do T-0053 Operations Status JSON before dashboard implementation.'
      },
      validation: {
        latestDoneLevelValidation: 'T-0052 ok'
      },
      issues: []
    });
    expect(report.stateConsistency).toBeUndefined();
  });

  it('keeps the dashboard sample fixture aligned with the status schema', () => {
    const fixture = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'docs', 'design', 'fixtures', 'hadara.ops.status.sample.json'), 'utf8'));

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
  fs.writeFileSync(
    path.join(root, 'docs', 'PROJECT_STATE.md'),
    `# PROJECT_STATE

## Current Phase

Phase 0 / Phase 1 boundary.
`,
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'AGENT_HANDOFF.md'),
    `# AGENT_HANDOFF

## Current State

- MCP guard layer is complete.

## Last 3 Completed Tasks

- T-0050 MCP Write Audit Log: done.
- T-0051 MCP Phase/Mode Config: done.
- T-0052 MCP Evidence Attach Approval Record: done.

## Current Known Problems

- Docker is the working validation path for now.

## Next Recommended Step

1. Do T-0053 Operations Status JSON before dashboard implementation.

## Validation Baseline

- Latest full check: Docker npm ci && npm run check passed with 27 test files and 142 tests.
- Latest done-level validation: T-0052 ok.
`,
    'utf8'
  );
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
        { path: 'docs/PROJECT_STATE.md', status: 'canonical' },
        { path: 'docs/TASK_BOARD.md', status: 'canonical' },
        ...extraRegisteredDocs.map((docPath) => ({ path: docPath, status: 'canonical' }))
      ]
    }, null, 2)}\n`,
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'PROJECT_STATE.md'),
    [
      '# PROJECT_STATE',
      '',
      '## Metadata',
      '',
      '| Field | Value |',
      '|---|---|',
      `| HADARA Profile | ${profile} |`,
      '',
      '## Current Phase',
      '',
      'Phase: initialized'
    ].join('\n'),
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
