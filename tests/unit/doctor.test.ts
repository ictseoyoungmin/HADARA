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
    fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });

    const paths = resolveHadaraPaths({ projectRoot: root });
    const report = createDoctorReport(paths, 'v22.0.0-test');

    expect(report).toMatchObject({
      schemaVersion: 'hadara.doctor.v1',
      command: 'doctor',
      ok: true,
      runtime: {
        node: 'v22.0.0-test'
      },
      paths: {
        portableRoot: path.join(root, '.hadara', 'local', 'portable'),
        dataRoot: path.join(root, '.hadara', 'local', 'portable', 'data'),
        projectRoot: root
      },
      checks: [
        { id: 'docs', status: 'ok', path: path.join(root, 'docs') },
        { id: 'tasks', status: 'ok', path: path.join(root, 'tasks') },
        { id: 'project-context', status: 'ok', path: path.join(root, '.hadara') }
      ]
    });
  });

  it('marks missing project filesystem checks and keeps text output readable', () => {
    const root = tempProject();
    const paths = resolveHadaraPaths({ projectRoot: root });
    const report = createDoctorReport(paths, 'v22.0.0-test');

    expect(report.ok).toBe(false);
    expect(report.checks.map((check) => check.status)).toEqual(['missing', 'missing', 'missing']);
    expect(formatDoctorReport(report)).toContain('[HADARA] Doctor');
    expect(formatDoctorReport(report)).toContain('docs/:       missing');
  });
});

