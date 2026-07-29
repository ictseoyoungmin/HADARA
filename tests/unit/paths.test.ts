import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { isInside, normalizeHadaraPath, resolveHadaraPaths } from '../../src/core/paths';

const roots: string[] = [];
const originalEnv = { ...process.env };

function tempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-paths-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  process.env = { ...originalEnv };
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('resolveHadaraPaths', () => {
  it('separates portable data root from project repo root', () => {
    const paths = resolveHadaraPaths({
      portableRoot: '/usb/HADARA',
      projectRoot: '/projects/demo'
    });

    expect(paths.dataRoot).toBe('/usb/HADARA/data');
    expect(paths.projectDocsDir).toBe('/projects/demo/docs');
    expect(paths.projectTasksDir).toBe('/projects/demo/tasks');
  });

  it('detects path containment', () => {
    expect(isInside('/repo', '/repo/src/index.ts')).toBe(true);
    expect(isInside('/repo', '/other/file.ts')).toBe(false);
  });

  it('detects symlink escape using real paths', () => {
    const root = tempDir();
    const repo = path.join(root, 'repo');
    const outside = path.join(root, 'outside');
    fs.mkdirSync(repo);
    fs.mkdirSync(outside);
    fs.writeFileSync(path.join(outside, 'secret.txt'), 'nope', 'utf8');
    fs.symlinkSync(outside, path.join(repo, 'linked-outside'), 'dir');

    expect(isInside(repo, path.join(repo, 'linked-outside', 'secret.txt'))).toBe(false);
  });

  it('detects symlink escape for missing child targets', () => {
    const root = tempDir();
    const repo = path.join(root, 'repo');
    const outside = path.join(root, 'outside');
    fs.mkdirSync(repo);
    fs.mkdirSync(outside);
    fs.symlinkSync(outside, path.join(repo, 'linked-outside'), 'dir');

    expect(isInside(repo, path.join(repo, 'linked-outside', 'new-state.json'))).toBe(false);
  });

  it('normalizes Windows drive paths without losing drive boundaries', () => {
    expect(normalizeHadaraPath('C:\\Projects\\demo\\..\\demo\\src')).toBe('C:\\Projects\\demo\\src');
  });

  it('prefers explicit input over environment and environment over defaults', () => {
    process.env.HADARA_HOME = '/env/HADARA';
    process.env.HADARA_PROJECT_ROOT = '/env/project';

    const fromEnv = resolveHadaraPaths();
    expect(fromEnv.portableRoot).toBe('/env/HADARA');
    expect(fromEnv.projectRoot).toBe('/env/project');

    const fromInput = resolveHadaraPaths({ portableRoot: '/input/HADARA', projectRoot: '/input/project' });
    expect(fromInput.portableRoot).toBe('/input/HADARA');
    expect(fromInput.projectRoot).toBe('/input/project');
  });

  it('keeps default data root out of projectRoot/data', () => {
    const root = tempDir();
    const paths = resolveHadaraPaths({ projectRoot: root });

    expect(paths.dataRoot).toBe(path.join(root, '.hadara', 'local', 'portable', 'data'));
    expect(paths.dataRoot).not.toBe(path.join(root, 'data'));
  });

  it('rejects explicit projectRoot/data as the portable store', () => {
    const root = tempDir();
    expect(() => resolveHadaraPaths({ projectRoot: root, portableRoot: root })).toThrow(/projectRoot\/data/);
  });
});
