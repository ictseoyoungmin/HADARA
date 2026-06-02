import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDashboardServerResponse } from '../../src/cli/dashboard';
import { resolveDashboardProjectionStoreRoot } from '../../src/services/dashboard-projection-store';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-dashboard-core-route-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('dashboard core route from projection', () => {
  it('serves a core read model without scanning task capsule directories', () => {
    const root = tempProject();
    writeProjectDocs(root);
    writeTaskCapsuleNoise(root);

    const reads = observeTaskCapsuleFilesystemReads(root);
    const response = createDashboardServerResponse(root, '/api/dashboard/core');
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(body).toMatchObject({
      schemaVersion: 'hadara.dashboard.core.v1',
      command: 'dashboard.core',
      source: {
        kind: 'live-api',
        projectRootRedacted: true,
        project: expect.objectContaining({ pathRedacted: true, fingerprint: expect.stringMatching(/^sha256:[a-f0-9]{12}$/) })
      },
      projection: {
        freshness: 'fresh',
        completeness: 'core',
        refreshState: 'idle',
        pendingSections: expect.arrayContaining(['timeline', 'debt', 'task-detail'])
      },
      core: {
        health: 'ok',
        taskSummary: expect.objectContaining({
          total: 4,
          counts: expect.objectContaining({ done: 2, draft: 1, inProgress: 1 }),
          lastCompleted: ['T-0001', 'T-0004'],
          nextRecommended: 'Start T-0003.'
        })
      }
    });
    expect(body.core.taskSummary.recent.map((task: { id: string }) => task.id)).toEqual(['T-0001', 'T-0002', 'T-0003', 'T-0004']);
    expect(reads()).toEqual({ readdir: 0, readFile: 0 });
    expect(fs.existsSync(path.join(resolveDashboardProjectionStoreRoot(root), 'core', 'index.json'))).toBe(true);
  });

  it('returns the local core projection on warm reads and supports bypass recompute', () => {
    const root = tempProject();
    writeProjectDocs(root);

    const first = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/core').body);
    const warm = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/core').body);
    const bypass = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/core?cache=bypass').body);

    expect(first.source.kind).toBe('live-api');
    expect(warm.source.kind).toBe('projection');
    expect(warm.projection.freshness).toBe('unknown');
    expect(bypass.source.kind).toBe('live-api');
    expect(bypass.projection.freshness).toBe('fresh');
  });

  it('keeps the core route read-only over HTTP methods', () => {
    const root = tempProject();
    writeProjectDocs(root);

    const head = createDashboardServerResponse(root, '/api/dashboard/core', 'HEAD');
    const post = createDashboardServerResponse(root, '/api/dashboard/core', 'POST');

    expect(head.statusCode).toBe(200);
    expect(head.body).toBe('');
    expect(head.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(post.statusCode).toBe(405);
    expect(post.headers.allow).toBe('GET, HEAD');
  });
});

function observeTaskCapsuleFilesystemReads(root: string): () => { readdir: number; readFile: number } {
  const tasksDir = path.join(root, 'tasks');
  const originalReaddir = fs.readdirSync;
  const originalReadFile = fs.readFileSync;
  let readdir = 0;
  let readFile = 0;

  vi.spyOn(fs, 'readdirSync').mockImplementation(((...args: Parameters<typeof fs.readdirSync>) => {
    if (path.normalize(String(args[0])).startsWith(tasksDir)) readdir += 1;
    return originalReaddir(...args);
  }) as typeof fs.readdirSync);

  vi.spyOn(fs, 'readFileSync').mockImplementation(((...args: Parameters<typeof fs.readFileSync>) => {
    if (path.normalize(String(args[0])).startsWith(tasksDir)) readFile += 1;
    return originalReadFile(...args);
  }) as typeof fs.readFileSync);

  return () => ({ readdir, readFile });
}

function writeProjectDocs(root: string): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'docs', 'PROJECT_STATE.md'),
    '# PROJECT_STATE\n\n## Current Phase\n\nPhase 5.7 test fixture.\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'AGENT_HANDOFF.md'),
    [
      '# AGENT_HANDOFF',
      '',
      '## Current State',
      '',
      '- Core route fixture.',
      '',
      '## Current Known Problems',
      '',
      '- None.',
      '',
      '## Last 3 Completed Tasks',
      '',
      '- T-0001 Fixture Done.',
      '',
      '## Next Recommended Step',
      '',
      '- Start T-0003.',
      '',
      '## Validation Baseline',
      '',
      '- Latest full check: Docker check passed',
      '- Latest done-level validation: harness validate passed'
    ].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'TASK_BOARD.md'),
    [
      '# TASK_BOARD',
      '',
      '| ID | Title | Status | Capsule | Notes |',
      '|---|---|---|---|---|',
      '| T-0001 | First done | Done | tasks/T-0001-first-done | |',
      '| T-0002 | Draft item | Draft | tasks/T-0002-draft-item | |',
      '| T-0003 | Active item | In Progress | tasks/T-0003-active-item | |',
      '| T-0004 | Second done | Done | tasks/T-0004-second-done | |'
    ].join('\n'),
    'utf8'
  );
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n', 'utf8');
}

function writeTaskCapsuleNoise(root: string): void {
  for (const id of ['T-0001-first-done', 'T-0002-draft-item', 'T-0003-active-item', 'T-0004-second-done']) {
    const dir = path.join(root, 'tasks', id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'TASK.md'), `# ${id} should not be read\n`, 'utf8');
  }
}
