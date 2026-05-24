import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createOperationalDebtReport, OPERATIONAL_DEBT_RECORDS } from '../../src/services/operational-debt';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-operational-debt-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('operational debt track', () => {
  it('converts known issue themes into structured debt records', () => {
    expect(OPERATIONAL_DEBT_RECORDS).toHaveLength(8);
    expect(OPERATIONAL_DEBT_RECORDS.map((record) => record.id)).toEqual([
      'OD-0001',
      'OD-0002',
      'OD-0003',
      'OD-0004',
      'OD-0005',
      'OD-0006',
      'OD-0007',
      'OD-0008'
    ]);
    expect(OPERATIONAL_DEBT_RECORDS.find((record) => record.id === 'OD-0008')).toMatchObject({
      category: 'validation',
      targetCapability: 'Premature acceptance guard'
    });
  });

  it('reports capsule size indicators', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Large capsule');
    fs.writeFileSync(path.join(task.dir, 'CONTEXT.md'), Array.from({ length: 720 }, (_, index) => `line ${index + 1}`).join('\n'), 'utf8');

    const report = createOperationalDebtReport(root);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.operational_debt.v1',
      command: 'operational-debt.report',
      ok: true
    });
    expect(report.capsuleSizeIndicators).toContainEqual(
      expect.objectContaining({
        taskId: task.id,
        capsule: 'tasks/T-0001-large-capsule',
        size: 'large'
      })
    );
  });

  it('warns when acceptance is checked before evidence exists', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Premature acceptance');
    const acceptancePath = path.join(task.dir, 'ACCEPTANCE.md');
    fs.writeFileSync(acceptancePath, fs.readFileSync(acceptancePath, 'utf8').replace(/- \[ \]/g, '- [x]'), 'utf8');

    const report = createOperationalDebtReport(root);

    expect(report.issues).toContainEqual({
      severity: 'warning',
      code: 'PREMATURE_ACCEPTANCE_CHECKED',
      message: 'T-0001 has checked acceptance boxes before Done status or evidence records.',
      path: 'tasks/T-0001-premature-acceptance/ACCEPTANCE.md'
    });
  });
});
