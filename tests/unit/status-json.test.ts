import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createOpsStatusReport } from '../../src/cli/status-json';
import { handleOpsCommand, handleStatusCommand } from '../../src/cli/status';
import { createTaskCapsule } from '../../src/task/task-capsule';

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
        lastCompleted: ['T-0050', 'T-0051', 'T-0052'],
        nextRecommended: 'Do T-0053 Operations Status JSON before dashboard implementation.'
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

  it('prints JSON for both status command forms', () => {
    const root = tempProject();
    writeProjectDocs(root);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(handleStatusCommand({ args: ['status', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(handleOpsCommand({ args: ['ops', 'status', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);

    const first = JSON.parse(String(log.mock.calls[0]?.[0]));
    const second = JSON.parse(String(log.mock.calls[1]?.[0]));
    expect(first.schemaVersion).toBe('hadara.ops.status.v1');
    expect(second.schemaVersion).toBe('hadara.ops.status.v1');
    expect(first.command).toBe('ops.status');
    expect(second.command).toBe('ops.status');
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
  fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
}

function writeGitBranch(root: string, branch: string): void {
  fs.mkdirSync(path.join(root, '.git'), { recursive: true });
  fs.writeFileSync(path.join(root, '.git', 'HEAD'), `ref: refs/heads/${branch}\n`, 'utf8');
}

function setTaskStatus(taskDir: string, status: string): void {
  const taskPath = path.join(taskDir, 'TASK.md');
  const content = fs.readFileSync(taskPath, 'utf8');
  fs.writeFileSync(taskPath, content.replace(/## Status\s*\n\nDraft/, `## Status\n\n${status}`), 'utf8');
}
