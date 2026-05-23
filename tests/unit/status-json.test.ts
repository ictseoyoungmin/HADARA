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
      project: {
        branch: 'main',
        phase: 'bootstrap-development'
      },
      tasks: {
        counts: {
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
