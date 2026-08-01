import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleReleaseCloseoutCommand } from '../../tools/dev-surface-handlers';
import { validateSchema } from '../../src/core/schema';
import { createReleaseCloseoutReport } from '../../tools/dev-surface/release-closeout';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-closeout-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('release closeout read-only plan', () => {
  it('reports current, stale, and missing closeout surfaces with suggested fragments', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Release publish');
    write(root, 'docs/RELEASE_READINESS.md', `# Release Readiness\n\n0.3.4 ${task.id} readiness and publish verified.\n`);
    write(root, 'docs/RELEASE_NOTES.md', '# Release Notes\n\n0.3.4 shipped.\n');
    write(root, 'docs/DEVELOPMENT_SLICES.md', `# Slices\n\n${task.id} 0.3.4 done.\n`);
    completeTask(task.dir, task.id, '0.3.4');
    fs.rmSync(path.join(task.dir, 'HANDOFF.md'), { force: true });
    const before = snapshotFiles(root);

    const report = createReleaseCloseoutReport(root, { version: '0.3.4', taskId: task.id });

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      schemaVersion: 'hadara.releaseCloseout.v1',
      command: 'release.closeout',
      ok: true,
      taskId: task.id,
      readOnly: true,
      input: { version: '0.3.4', taskId: task.id },
      summary: { files: 7, suggestedFragments: 3 },
      issues: []
    });
    expect(report.surfaces).toContainEqual(expect.objectContaining({ path: 'docs/RELEASE_READINESS.md', status: 'current', role: 'source-readiness' }));
    expect(report.surfaces).toContainEqual(expect.objectContaining({ path: `tasks/${task.id}-release-publish/HANDOFF.md`, status: 'missing' }));
    expect(report.suggestedFragments.map((fragment) => fragment.path)).toEqual([
      'docs/RELEASE_READINESS.md',
      'docs/RELEASE_NOTES.md',
      `tasks/${task.id}/HANDOFF.md`
    ]);
    expect(validateSchema('hadara.releaseCloseout.v1', report).ok).toBe(true);
  });

  it('requires version and task inputs without throwing', () => {
    const root = tempProject();

    const report = createReleaseCloseoutReport(root, {});

    expect(report.ok).toBe(false);
    expect(report.issues).toEqual([
      expect.objectContaining({ code: 'RELEASE_CLOSEOUT_VERSION_REQUIRED' }),
      expect.objectContaining({ code: 'RELEASE_CLOSEOUT_TASK_REQUIRED' })
    ]);
    expect(validateSchema('hadara.releaseCloseout.v1', report).ok).toBe(true);
  });

  it('routes CLI JSON output without writing files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI release closeout');
    write(root, 'docs/RELEASE_READINESS.md', `0.3.4 ${task.id}`);
    const before = snapshotFiles(root);
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(handleReleaseCloseoutCommand({ args: ['release', 'closeout', '--version', '0.3.4', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    expect(report.schemaVersion).toBe('hadara.releaseCloseout.v1');
    expect(report.command).toBe('release.closeout');
    expect(report.taskId).toBe(task.id);
    expect(snapshotFiles(root)).toEqual(before);
  });
});

function write(root: string, relativePath: string, content: string): void {
  const absolutePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
}

function completeTask(taskDir: string, taskId: string, version: string): void {
  for (const fileName of ['TASK.md', 'EVIDENCE.md', 'HANDOFF.md']) {
    const filePath = path.join(taskDir, fileName);
    fs.writeFileSync(filePath, `${taskId} ${version} ${fileName} closeout complete.\n`, 'utf8');
  }
}

function snapshotFiles(root: string): Record<string, string> {
  const files: Record<string, string> = {};
  walk(root, (filePath) => {
    files[toPortablePath(path.relative(root, filePath))] = fs.readFileSync(filePath, 'utf8');
  });
  return files;
}

function walk(dir: string, visit: (filePath: string) => void): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, visit);
    if (entry.isFile()) visit(fullPath);
  }
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
