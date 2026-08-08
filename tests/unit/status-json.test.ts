import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import {
  createOpsStatusReport,
  createOpsStatusSummaryReport
} from '../../src/services/operations-status-service';
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
        '- Docker task close --task T-0053 --dry-run --json returned done-level validation ok.'
      ].join('\n'),
      'utf8'
    );

    const report = createOpsStatusReport(root);

    expect(report.project.phase).toBe('bootstrap-development');
    expect(report.validation).toEqual({
      latestFullCheck: 'Docker check after T-0053: 28 test files passed, 144 tests passed',
      latestDoneLevelValidation: null
    });
    expect(report.issues).toEqual([]);
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
