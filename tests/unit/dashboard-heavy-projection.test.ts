import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDashboardServerResponse } from '../../src/cli/dashboard';
import { refreshDashboardHeavyProjections } from '../../src/services/dashboard-heavy-projection';
import { resolveDashboardProjectionStoreRoot } from '../../src/services/dashboard-projection-store';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-dashboard-heavy-projection-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('dashboard timeline/debt projections', () => {
  it('writes redacted timeline and debt projections for dashboard routes', () => {
    const root = tempProject();
    writeProjectDocs(root);
    writeTask(root, 'T-0001-first', 'Done');

    const result = refreshDashboardHeavyProjections(root);
    const timeline = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/timeline').body);
    const debt = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/debt').body);
    const timelinePath = path.join(resolveDashboardProjectionStoreRoot(root), 'timeline', 'overview.json');
    const debtPath = path.join(resolveDashboardProjectionStoreRoot(root), 'debt', 'summary.json');

    expect(result.timeline.events.length).toBeGreaterThan(0);
    expect(timeline).toMatchObject({
      schemaVersion: 'hadara.dashboard.timeline.v1',
      command: 'dashboard.timeline',
      source: expect.objectContaining({ projectRoot: '.', projectRootRedacted: true, live: false }),
      events: expect.arrayContaining([expect.objectContaining({ readOnly: true })])
    });
    expect(debt).toMatchObject({
      schemaVersion: 'hadara.dashboard.debt_projection.v1',
      command: 'dashboard.debt',
      aggregate: expect.objectContaining({ total: expect.any(Number), open: expect.any(Number) })
    });
    expect(fs.readFileSync(timelinePath, 'utf8')).not.toContain(root);
    expect(fs.readFileSync(debtPath, 'utf8')).not.toContain(root);
  });

  it('returns missing projection metadata without request-time task scans', () => {
    const root = tempProject();
    writeProjectDocs(root);
    writeTask(root, 'T-0001-first', 'Done');

    const reads = observeTaskCapsuleReads(root);
    const timeline = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/timeline').body);
    const debt = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/debt').body);
    const status = JSON.parse(createDashboardServerResponse(root, '/api/dashboard/projection/status').body);

    expect(timeline.issues).toEqual([expect.objectContaining({ code: 'TIMELINE_PROJECTION_MISSING' })]);
    expect(debt.issues).toEqual([expect.objectContaining({ code: 'DEBT_PROJECTION_MISSING' })]);
    expect(status.projections.timeline.present).toBe(false);
    expect(status.projections.debt.present).toBe(false);
    expect(reads()).toEqual([]);
  });
});

function observeTaskCapsuleReads(root: string): () => string[] {
  const tasksDir = path.join(root, 'tasks');
  const originalReaddir = fs.readdirSync;
  const originalReadFile = fs.readFileSync;
  const reads: string[] = [];
  vi.spyOn(fs, 'readdirSync').mockImplementation(((...args: Parameters<typeof fs.readdirSync>) => {
    const filePath = path.normalize(String(args[0]));
    if (filePath.startsWith(tasksDir)) reads.push(filePath);
    return originalReaddir(...args);
  }) as typeof fs.readdirSync);
  vi.spyOn(fs, 'readFileSync').mockImplementation(((...args: Parameters<typeof fs.readFileSync>) => {
    const filePath = path.normalize(String(args[0]));
    if (filePath.startsWith(tasksDir)) reads.push(filePath);
    return originalReadFile(...args);
  }) as typeof fs.readFileSync);
  return () => reads;
}

function writeProjectDocs(root: string): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Phase\n\nPhase 5.7 heavy projection fixture.\n', 'utf8');
  fs.writeFileSync(
    path.join(root, 'docs', 'AGENT_HANDOFF.md'),
    [
      '# AGENT_HANDOFF',
      '',
      '## Current State',
      '',
      '- Heavy projection fixture.',
      '',
      '## Current Known Problems',
      '',
      '- None.',
      '',
      '## Next Recommended Step',
      '',
      '- Continue.',
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
      '| T-0001 | First | Done | tasks/T-0001-first | |'
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
  fs.writeFileSync(path.join(dir, 'TASK.md'), [`# ${taskId} First`, '', '## Status', '', status, ''].join('\n'), 'utf8');
  fs.writeFileSync(path.join(dir, 'evidence.jsonl'), '', 'utf8');
}
