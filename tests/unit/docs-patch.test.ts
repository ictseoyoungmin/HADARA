import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { assertSchema } from '../../src/core/schema';
import { initProject } from '../../src/cli/init';
import { createDocsPatchPlanReport } from '../../src/services/managed-sections';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-docs-patch-'));
  roots.push(dir);
  return dir;
}

function writePatch(root: string, body: string): string {
  const patchPath = path.join(root, '.hadara', 'local', 'patches', 'task-board.md');
  fs.mkdirSync(path.dirname(patchPath), { recursive: true });
  fs.writeFileSync(patchPath, body, 'utf8');
  return '.hadara/local/patches/task-board.md';
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Phase 7.4 docs patch', () => {
  it('creates a schema-valid dry-run patch plan without changing outside markers', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    const contentFile = writePatch(root, '| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n| T-0001 | Example | Draft | tasks/T-0001-example | planned |\n');
    const before = fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8');

    const report = createDocsPatchPlanReport(root, {
      targetPath: 'docs/TASK_BOARD.md',
      sectionId: 'task-board',
      contentFile,
      mode: 'dry-run'
    });
    const after = fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8');

    expect(after).toBe(before);
    expect(report).toMatchObject({
      schemaVersion: 'hadara.docs.patchPlan.v1',
      command: 'docs.patch',
      mode: 'dry-run',
      ok: true,
      targetPath: 'docs/TASK_BOARD.md'
    });
    expect(report.sections[0]).toMatchObject({
      sectionId: 'task-board',
      changed: true,
      operation: 'update-row'
    });
    expect(report.executeCommand).toContain('--before-hash');
    assertSchema('hadara.docs.patchPlan.v1', report);
  });

  it('executes only with a matching target before hash', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    const contentFile = writePatch(root, '| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n| T-0001 | Example | Done | tasks/T-0001-example | ok |\n');
    const dryRun = createDocsPatchPlanReport(root, {
      targetPath: 'docs/TASK_BOARD.md',
      sectionId: 'task-board',
      contentFile,
      mode: 'dry-run'
    });

    const mismatch = createDocsPatchPlanReport(root, {
      targetPath: 'docs/TASK_BOARD.md',
      sectionId: 'task-board',
      contentFile,
      mode: 'execute',
      beforeHash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000'
    });
    expect(mismatch.ok).toBe(false);
    expect(mismatch.issues).toContainEqual(expect.objectContaining({ code: 'MANAGED_PATCH_BEFORE_HASH_MISMATCH' }));
    expect(fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8')).not.toContain('| T-0001 | Example | Done |');

    const executed = createDocsPatchPlanReport(root, {
      targetPath: 'docs/TASK_BOARD.md',
      sectionId: 'task-board',
      contentFile,
      mode: 'execute',
      beforeHash: dryRun.targetBeforeHash
    });
    expect(executed.ok).toBe(true);
    expect(fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8')).toContain('| T-0001 | Example | Done |');
  });

  it('preserves the target and cleans up temp files when atomic execute rename fails', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    const contentFile = writePatch(root, '| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n| T-0001 | Example | Done | tasks/T-0001-example | ok |\n');
    const targetPath = path.join(root, 'docs', 'TASK_BOARD.md');
    const before = fs.readFileSync(targetPath, 'utf8');
    const dryRun = createDocsPatchPlanReport(root, {
      targetPath: 'docs/TASK_BOARD.md',
      sectionId: 'task-board',
      contentFile,
      mode: 'dry-run'
    });
    const renameSpy = vi.spyOn(fs, 'renameSync').mockImplementationOnce(() => {
      throw new Error('simulated rename failure');
    });

    const executed = createDocsPatchPlanReport(root, {
      targetPath: 'docs/TASK_BOARD.md',
      sectionId: 'task-board',
      contentFile,
      mode: 'execute',
      beforeHash: dryRun.targetBeforeHash
    });

    renameSpy.mockRestore();
    expect(executed.ok).toBe(false);
    expect(executed.issues).toContainEqual(expect.objectContaining({ code: 'MANAGED_PATCH_WRITE_FAILED' }));
    expect(fs.readFileSync(targetPath, 'utf8')).toBe(before);
    expect(fs.readdirSync(path.dirname(targetPath)).filter((name) => name.startsWith('.hadara-atomic-write-'))).toEqual([]);
  });

  it('rejects marker-bearing patch content and missing before hash in execute mode', () => {
    const root = tempProject();
    initProject(root, 'standard', { silent: true });
    const contentFile = writePatch(root, '<!-- hadara:managed:end task-board -->\n');

    const report = createDocsPatchPlanReport(root, {
      targetPath: 'docs/TASK_BOARD.md',
      sectionId: 'task-board',
      contentFile,
      mode: 'execute'
    });

    expect(report.ok).toBe(false);
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'MANAGED_PATCH_BEFORE_HASH_REQUIRED' }),
      expect.objectContaining({ code: 'MANAGED_PATCH_OUTSIDE_BOUNDARY' })
    ]));
  });
});
