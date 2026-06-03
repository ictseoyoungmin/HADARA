import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDashboardServerResponse } from '../../src/cli/dashboard';
import { clearDashboardRefreshStateForTests, warmDashboardProjections } from '../../src/services/dashboard-refresh';
import { resolveDashboardProjectionStoreRoot } from '../../src/services/dashboard-projection-store';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-dashboard-refresh-'));
  roots.push(dir);
  return dir;
}

beforeEach(() => {
  clearDashboardRefreshStateForTests();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  clearDashboardRefreshStateForTests();
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('dashboard background refresh and projection status', () => {
  it('warms core projection in the background without blocking the trigger response', async () => {
    const root = tempProject();
    writeProjectDocs(root);

    const trigger = warmDashboardProjections(root);
    const during = createDashboardServerResponse(root, '/api/dashboard/projection/status');

    expect(trigger).toMatchObject({
      command: 'dashboard.refresh',
      accepted: true,
      refresh: expect.objectContaining({ state: 'refreshing', reason: 'serve-start', runs: 0 })
    });
    expect(JSON.parse(during.body)).toMatchObject({
      schemaVersion: 'hadara.dashboard.projection_status.v1',
      command: 'dashboard.projection.status',
      refresh: expect.objectContaining({ state: 'refreshing' }),
      projections: { core: expect.objectContaining({ present: false, freshness: 'missing' }) }
    });

    await vi.runAllTimersAsync();
    const after = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/projection/status').body);

    expect(after).toMatchObject({
      refresh: expect.objectContaining({ state: 'idle', runs: 1 }),
      projections: { core: expect.objectContaining({ present: true, freshness: 'fresh', completeness: 'core' }) }
    });
    expect(fs.existsSync(path.join(resolveDashboardProjectionStoreRoot(root), 'core', 'index.json'))).toBe(true);
  });

  it('coalesces refresh triggers and exposes metadata without cached bodies', async () => {
    const root = tempProject();
    writeProjectDocs(root);
    vi.useRealTimers();

    const first = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/refresh').body);
    const second = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/refresh').body);
    const bodyText = createDashboardServerResponse(root, '/api/dashboard/projection/status').body;

    expect(first).toMatchObject({ command: 'dashboard.refresh', accepted: true });
    expect(second).toMatchObject({ command: 'dashboard.refresh', accepted: false });
    expect(bodyText).not.toContain('Core route fixture.');
    expect(bodyText).not.toContain('First done');

    const after = await waitForRefreshRuns(root, 1);
    expect(after.refresh.runs).toBe(1);
  });

  it('runs manual full refresh through async staged projections', async () => {
    const root = tempProject();
    writeProjectDocs(root);
    vi.useRealTimers();

    const first = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/refresh').body);
    expect(first).toMatchObject({ command: 'dashboard.refresh', accepted: true });

    const after = await waitForRefreshRuns(root, 1);
    expect(fs.existsSync(path.join(resolveDashboardProjectionStoreRoot(root), 'source-signals', 'tasks.json'))).toBe(true);
    expect(fs.existsSync(path.join(resolveDashboardProjectionStoreRoot(root), 'timeline', 'overview.json'))).toBe(true);
    expect(fs.existsSync(path.join(resolveDashboardProjectionStoreRoot(root), 'debt', 'summary.json'))).toBe(true);
    expect(fs.existsSync(path.join(resolveDashboardProjectionStoreRoot(root), 'core', 'index.json'))).toBe(true);
    expect(after.refresh).toMatchObject({
      state: 'idle',
      runs: 1,
      currentStage: null,
      processed: null,
      total: null
    });
  });

  it('exposes current stage, progress, and yield metadata while manual refresh is running', async () => {
    const root = tempProject();
    writeProjectDocs(root);
    for (let index = 1; index <= 80; index += 1) {
      const id = String(index).padStart(4, '0');
      writeTask(root, `T-${id}-progress-${id}`, index % 2 === 0 ? 'Done' : 'Draft');
    }
    vi.useRealTimers();

    JSON.parse(createDashboardServerResponse(root, '/api/dashboard/refresh').body);
    const during = await waitForRefreshProgress(root);

    expect(during.refresh).toMatchObject({
      state: 'refreshing',
      currentStage: expect.any(String),
      processed: expect.any(Number),
      total: expect.any(Number),
      lastYieldAt: expect.any(String)
    });

    const after = await waitForRefreshRuns(root, 1);
    expect(after.refresh).toMatchObject({ state: 'idle', currentStage: null, processed: null, total: null });
  });
});

async function waitForRefreshRuns(root: string, runs: number): Promise<Record<string, any>> {
  let latest: Record<string, any> = {};
  for (let attempt = 0; attempt < 60; attempt += 1) {
    latest = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/projection/status').body);
    if (latest.refresh?.runs >= runs && latest.refresh?.state === 'idle') return latest;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  return latest;
}

async function waitForRefreshProgress(root: string): Promise<Record<string, any>> {
  let latest: Record<string, any> = {};
  for (let attempt = 0; attempt < 120; attempt += 1) {
    latest = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/projection/status').body);
    if (
      latest.refresh?.state === 'refreshing' &&
      latest.refresh?.currentStage &&
      typeof latest.refresh?.processed === 'number' &&
      typeof latest.refresh?.total === 'number' &&
      typeof latest.refresh?.lastYieldAt === 'string'
    ) {
      return latest;
    }
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  return latest;
}

function writeProjectDocs(root: string): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'docs', 'PROJECT_STATE.md'),
    '# PROJECT_STATE\n\n## Current Phase\n\nPhase 5.7 refresh fixture.\n',
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
      '## Next Recommended Step',
      '',
      '- Start T-0002.',
      '',
      '## Validation Baseline',
      '',
      '- Latest full check: Docker check passed'
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
      '| T-0002 | Next draft | Draft | tasks/T-0002-next-draft | |'
    ].join('\n'),
    'utf8'
  );
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n', 'utf8');
}

function writeTask(root: string, directoryName: string, status: string): void {
  const taskId = directoryName.slice(0, 6);
  const dir = path.join(root, 'tasks', directoryName);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'TASK.md'), [`# ${taskId} ${directoryName.slice(7)}`, '', '## Status', '', status, ''].join('\n'), 'utf8');
  fs.writeFileSync(path.join(dir, 'evidence.jsonl'), '', 'utf8');
}
