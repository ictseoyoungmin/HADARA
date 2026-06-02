import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildHadaraContextContent } from '../../src/hermes/context-export';
import {
  createDashboardProjectionRecord,
  dashboardProjectionFilePath,
  readDashboardProjection,
  resolveDashboardProjectionStoreRoot,
  writeDashboardProjection
} from '../../src/services/dashboard-projection-store';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-dashboard-projection-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('dashboard local projection store', () => {
  it('writes redacted projection records only under .hadara/local/cache/dashboard', () => {
    const root = tempProject();
    const record = createDashboardProjectionRecord(root, 'core', 'index', {
      schemaVersion: 'hadara.dashboard.core.v1',
      ok: true,
      marker: 'projection-store-core'
    });

    const result = writeDashboardProjection({ projectRoot: root }, record);
    const storeRoot = resolveDashboardProjectionStoreRoot(root);
    const filePath = path.join(storeRoot, 'core', 'index.json');

    expect(result).toMatchObject({
      path: '.hadara/local/cache/dashboard/core/index.json',
      bytes: expect.any(Number)
    });
    expect(fs.existsSync(filePath)).toBe(true);
    expect(listProjectFiles(path.join(root, '.hadara'))).toEqual([filePath]);

    const raw = fs.readFileSync(filePath, 'utf8');
    expect(raw).toContain('hadara.dashboard.projection_record.v1');
    expect(raw).toContain('"pathRedacted": true');
    expect(raw).not.toContain(root);

    const read = readDashboardProjection<{ marker: string }>({ projectRoot: root }, 'core', 'index');
    expect(read?.body.marker).toBe('projection-store-core');
    expect(read?.project.fingerprint).toMatch(/^sha256:[a-f0-9]{12}$/);
  });

  it('rejects custom store roots outside .hadara/local/cache/dashboard', () => {
    const root = tempProject();
    const record = createDashboardProjectionRecord(root, 'timeline', 'overview', { ok: true });

    expect(() =>
      writeDashboardProjection(
        { projectRoot: root, storeRoot: path.join(root, '.hadara', 'local', 'cache', 'elsewhere') },
        record
      )
    ).toThrow('Dashboard projection store root must stay under .hadara/local/cache/dashboard.');
    expect(fs.existsSync(path.join(root, '.hadara', 'local', 'cache', 'elsewhere'))).toBe(false);
  });

  it('rejects traversal-like section and key tokens', () => {
    const root = tempProject();
    expect(() => dashboardProjectionFilePath({ projectRoot: root }, 'core', '../index')).toThrow(
      'Dashboard projection key must be a simple file-safe token.'
    );
  });

  it('uses temp-file rename for atomic replacement and cleans failed writes', () => {
    const root = tempProject();
    const first = createDashboardProjectionRecord(root, 'debt', 'summary', { version: 1 });
    const second = createDashboardProjectionRecord(root, 'debt', 'summary', { version: 2 });

    writeDashboardProjection({ projectRoot: root }, first);
    const rename = vi.spyOn(fs, 'renameSync').mockImplementationOnce(() => {
      throw new Error('rename failed');
    });

    expect(() => writeDashboardProjection({ projectRoot: root }, second)).toThrow('rename failed');
    expect(rename).toHaveBeenCalledTimes(1);
    expect(readDashboardProjection<{ version: number }>({ projectRoot: root }, 'debt', 'summary')?.body.version).toBe(1);
    expect(listProjectFiles(resolveDashboardProjectionStoreRoot(root)).filter((file) => file.endsWith('.tmp'))).toEqual([]);
  });

  it('rejects projection records that contain raw project paths', () => {
    const root = tempProject();
    const record = createDashboardProjectionRecord(root, 'task-detail', 'T-9999', {
      path: path.join(root, 'tasks', 'T-9999-example')
    });

    expect(() => writeDashboardProjection({ projectRoot: root }, record)).toThrow(
      'Dashboard projection record must not contain raw project paths.'
    );
  });

  it('keeps dashboard projections out of context export content', () => {
    const root = tempProject();
    writeProjectDocs(root);
    const record = createDashboardProjectionRecord(root, 'core', 'index', {
      marker: 'dashboard-projection-context-marker'
    });

    writeDashboardProjection({ projectRoot: root }, record);
    const content = buildHadaraContextContent(root);

    expect(content).not.toContain('.hadara/local/cache/dashboard');
    expect(content).not.toContain('hadara.dashboard.projection_record.v1');
    expect(content).not.toContain('dashboard-projection-context-marker');
  });
});

function writeProjectDocs(root: string): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  for (const fileName of [
    'PROJECT_STATE.md',
    'AGENT_HANDOFF.md',
    'IMPLEMENTATION_SOP.md',
    'TASK_BOARD.md',
    'ROADMAP.md',
    'DEVELOPMENT_SLICES.md',
    'CLI_JSON_CONTRACT.md',
    'MCP_BRIDGE_CONTRACT.md',
    'MCP_EVIDENCE_ATTACH_CONTRACT.md',
    'ARCHITECTURE.md',
    'SECURITY_MODEL.md',
    'TEST_STRATEGY.md'
  ]) {
    fs.writeFileSync(path.join(root, 'docs', fileName), `# ${fileName}\n`, 'utf8');
  }
}

function listProjectFiles(root: string): string[] {
  const files: string[] = [];
  walk(root, files);
  return files.sort();
}

function walk(dir: string, files: string[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else files.push(fullPath);
  }
}
