import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createDoctorReport, formatDoctorReport } from '../../src/cli/doctor';
import { resolveHadaraPaths } from '../../src/core/paths';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-doctor-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('CLI doctor report', () => {
  it('returns a stable JSON report for an initialized project shape', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.mkdirSync(path.join(root, 'tasks'), { recursive: true });
    fs.mkdirSync(path.join(root, '.hadara', 'context'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'), '# HADARA_CONTEXT\n', 'utf8');

    const paths = resolveHadaraPaths({ projectRoot: root });
    const cliEntry = path.join(process.cwd(), 'src', 'cli', 'doctor.ts');
    const report = createDoctorReport(paths, 'v22.0.0-test', {
      cliEntry,
      nodePath: '/usr/bin/node-test'
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.doctor.v1',
      command: 'doctor',
      ok: true,
      runtime: {
        node: 'v22.0.0-test',
        nodePath: '/usr/bin/node-test'
      },
      installation: {
        executablePath: cliEntry,
        resolvedExecutablePath: expect.any(String),
        packageRoot: process.cwd(),
        packageVersion: expect.any(String),
        registry: 'https://registry.npmjs.org',
        installCommand: expect.stringMatching(/^npm install -g hadara@/),
        latestInstallCommand: 'npm install -g hadara'
      },
      paths: {
        portableRoot: path.join(root, '.hadara', 'local', 'portable'),
        dataRoot: path.join(root, '.hadara', 'local', 'portable', 'data'),
        projectRoot: root
      },
      checks: [
        { id: 'docs', status: 'ok', path: path.join(root, 'docs') },
        { id: 'tasks', status: 'ok', path: path.join(root, 'tasks') },
        { id: 'project-context', status: 'ok', path: path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md') }
      ]
    });
  });

  it('marks missing project filesystem checks and keeps text output readable', () => {
    const root = tempProject();
    const paths = resolveHadaraPaths({ projectRoot: root });
    const report = createDoctorReport(paths, 'v22.0.0-test', {
      cliEntry: path.join(root, 'missing-bin.js'),
      nodePath: '/usr/bin/node-test'
    });

    expect(report.ok).toBe(false);
    expect(report.installation.executablePath).toBe(path.join(root, 'missing-bin.js'));
    expect(report.installation.resolvedExecutablePath).toBeNull();
    expect(report.installation.packageRoot).toBeNull();
    expect(report.checks.map((check) => check.status)).toEqual(['missing', 'missing', 'missing']);
    expect(report.checks[2]?.path).toBe(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'));
    expect(formatDoctorReport(report)).toContain('[HADARA] Doctor');
    expect(formatDoctorReport(report)).toContain('Node path:    /usr/bin/node-test');
    expect(formatDoctorReport(report)).toContain('Install:');
    expect(formatDoctorReport(report)).toContain(`  executable: ${path.join(root, 'missing-bin.js')}`);
    expect(formatDoctorReport(report)).toContain('  package:    ');
    expect(formatDoctorReport(report)).toContain('  registry:   https://registry.npmjs.org');
    expect(formatDoctorReport(report)).toContain('  install:    npm install -g hadara@');
    expect(formatDoctorReport(report)).toContain('docs/:       missing');
    expect(formatDoctorReport(report)).toContain('.hadara/context/HADARA_CONTEXT.md: missing');
  });

  it('accepts the Init v1 READ_MAP as the project context fallback', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.mkdirSync(path.join(root, 'tasks'), { recursive: true });
    fs.mkdirSync(path.join(root, '.hadara', 'context'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'context', 'READ_MAP.md'), '# READ_MAP\n', 'utf8');

    const report = createDoctorReport(resolveHadaraPaths({ projectRoot: root }));

    expect(report.ok).toBe(true);
    expect(report.checks).toContainEqual({
      id: 'project-context',
      status: 'ok',
      path: path.join(root, '.hadara', 'context', 'READ_MAP.md')
    });
  });
});
