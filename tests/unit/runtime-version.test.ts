import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { main } from '../../src/cli/main';
import { handleVersionCommand } from '../../src/cli/version';
import { validateSchema } from '../../src/core/schema';
import { createRuntimeVersionReport } from '../../src/services/runtime-version';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-runtime-version-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'src', 'cli'), { recursive: true });
  fs.mkdirSync(path.join(root, 'dist', 'cli'), { recursive: true });
  fs.writeFileSync(path.join(root, 'src', 'cli', 'main.ts'), 'console.log("source");\n', 'utf8');
  fs.writeFileSync(path.join(root, 'dist', 'cli', 'main.js'), 'console.log("dist");\n', 'utf8');
  fs.writeFileSync(path.join(root, 'package.json'), '{"name":"hadara","version":"0.0.0"}\n', 'utf8');
  fs.writeFileSync(path.join(root, 'tsconfig.json'), '{}\n', 'utf8');
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe('runtime version report', () => {
  it('reports CLI origin, node, package, git, and build freshness fields', () => {
    const root = process.cwd();
    const report = createRuntimeVersionReport(root, { cliEntry: path.join(root, 'dist', 'cli', 'main.js'), cwd: root });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.runtime.version.v1',
      command: 'version.verbose',
      ok: true,
      projectRoot: root,
      packageVersion: expect.any(String),
      node: { version: process.version }
    });
    expect(report.cliEntry).toContain('dist/cli/main.js');
    if (report.git.branch === null || report.git.head === null) {
      expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'GIT_METADATA_UNAVAILABLE' })]));
    } else {
      expect(report.git).toMatchObject({ branch: expect.any(String), head: expect.any(String) });
    }
    expect(typeof report.build.distLooksStale).toBe('boolean');
    expect(validateSchema('hadara.runtime.version.v1', report).ok).toBe(true);
  });

  it('flags a stale dist entry when source is newer', () => {
    const root = tempProject();
    const dist = path.join(root, 'dist', 'cli', 'main.js');
    const source = path.join(root, 'src', 'cli', 'main.ts');
    const oldTime = new Date('2026-05-31T00:00:00.000Z');
    const newTime = new Date('2026-05-31T00:00:05.000Z');
    fs.utimesSync(dist, oldTime, oldTime);
    fs.utimesSync(source, newTime, newTime);

    const report = createRuntimeVersionReport(root, { cliEntry: dist, cwd: root });

    expect(report.build.distLooksStale).toBe(true);
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'DIST_LOOKS_STALE' })]));
    expect(validateSchema('hadara.runtime.version.v1', report).ok).toBe(true);
  });

  it('does not compare installed CLI entry mtimes against an external target project', () => {
    const root = tempProject();
    const installedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-installed-cli-'));
    roots.push(installedRoot);
    const cliEntry = path.join(installedRoot, 'node_modules', 'hadara', 'dist', 'cli', 'main.js');
    fs.mkdirSync(path.dirname(cliEntry), { recursive: true });
    fs.writeFileSync(cliEntry, 'console.log("installed");\n', 'utf8');
    const oldTime = new Date('2026-05-31T00:00:00.000Z');
    const newTime = new Date('2026-05-31T00:00:05.000Z');
    fs.utimesSync(cliEntry, oldTime, oldTime);
    fs.utimesSync(path.join(root, 'src', 'cli', 'main.ts'), newTime, newTime);

    const report = createRuntimeVersionReport(root, { cliEntry, cwd: root });

    expect(report.build.sourceMtime).toBe(null);
    expect(report.build.distLooksStale).toBe(false);
    expect(report.issues).not.toContainEqual(expect.objectContaining({ code: 'DIST_LOOKS_STALE' }));
    expect(validateSchema('hadara.runtime.version.v1', report).ok).toBe(true);
  });

  it('does not compare node_modules bin mtimes against a non-HADARA project source tree', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'package.json'), '{"name":"external-service","version":"1.0.0"}\n', 'utf8');
    const cliEntry = path.join(root, 'node_modules', '.bin', 'hadara');
    fs.mkdirSync(path.dirname(cliEntry), { recursive: true });
    fs.writeFileSync(cliEntry, '#!/usr/bin/env node\n', 'utf8');
    const oldTime = new Date('2026-05-31T00:00:00.000Z');
    const newTime = new Date('2026-05-31T00:00:05.000Z');
    fs.utimesSync(cliEntry, oldTime, oldTime);
    fs.utimesSync(path.join(root, 'src', 'cli', 'main.ts'), newTime, newTime);

    const report = createRuntimeVersionReport(root, { cliEntry, cwd: root });

    expect(report.build.sourceMtime).toBe(null);
    expect(report.build.distLooksStale).toBe(false);
    expect(report.issues).not.toContainEqual(expect.objectContaining({ code: 'DIST_LOOKS_STALE' }));
    expect(validateSchema('hadara.runtime.version.v1', report).ok).toBe(true);
  });

  it('prints JSON for version --verbose --json', () => {
    const root = process.cwd();
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleVersionCommand({
      args: ['version', '--verbose', '--json'],
      projectRoot: root,
      jsonOutput: true,
      cliEntry: path.join(root, 'dist', 'cli', 'main.js')
    });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload.schemaVersion).toBe('hadara.runtime.version.v1');
    expect(validateSchema('hadara.runtime.version.v1', payload).ok).toBe(true);
  });

  it('routes --version and -v aliases to the version command', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await main(['--version']);
    await main(['-v']);

    expect(log.mock.calls).toHaveLength(2);
    expect(String(log.mock.calls[0][0])).toMatch(/^\d+\.\d+\.\d+/);
    expect(log.mock.calls[1][0]).toBe(log.mock.calls[0][0]);
  });
});
