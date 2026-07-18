import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { buildSessionStartReport } from '../../src/context/session-start';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createContextCacheWarmReport } from '../../src/context/context-cache-store';
import { initProject } from '../../src/cli/init';
import { createTaskCreateReport } from '../../src/task/task-create';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-session-start-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('session start', () => {
  it('prefers the structured current-state canon for fast session resume', () => {
    const root = tempProject();
    initProject(root, 'governed', { silent: true });
    const created = createTaskCreateReport(root, 'Structured resume task');

    const report = buildSessionStartReport({
      projectRoot: root,
      generatedAt: '2026-07-10T00:00:00.000Z'
    });

    expect(report.currentState).toMatchObject({
      activeTask: created.taskId,
      recommendedNextTask: created.taskId,
      currentRelease: expect.any(String),
      nextWork: null,
      nextOperatorIntent: 'No next work selected. Run `hadara task status --json` for current task-selection guidance.',
      source: '.hadara/state/current.json'
    });
    expect(report.currentState.releaseState).not.toBe(report.currentState.currentRelease);
    expect(report.guidance.primaryAction.args).toEqual(['task', 'status', '--task', created.taskId, '--json']);
    expect(validateSchema('hadara.sessionStart.v1', report).ok).toBe(true);
  });

  it('hides stale bootstrap next-work from session start once task history exists', () => {
    const root = tempProject();
    initProject(root, 'basic', { silent: true });
    const created = createTaskCreateReport(root, 'Historical task');
    fs.writeFileSync(
      path.join(root, '.hadara', 'state', 'current.json'),
      `${JSON.stringify({
        schemaVersion: 'hadara.projectCurrentState.v1',
        rev: 2,
        profile: 'basic',
        currentRelease: '0.0.0',
        latestCompletedTask: { id: created.taskId, title: 'Historical task' },
        activeTask: null,
        nextWork: {
          title: 'Create first Task Capsule',
          state: 'candidate',
          operatorGuidance: 'Create or select the first bounded Task Capsule.',
          createCommandAllowed: true
        },
        nextOperatorIntent: 'Create first Task Capsule',
        currentKnownProblems: [],
        validationBaseline: { summary: 'No validation baseline has been recorded yet.', evidence: [] }
      }, null, 2)}\n`,
      'utf8'
    );

    const report = buildSessionStartReport({
      projectRoot: root,
      generatedAt: '2026-07-10T00:00:00.000Z'
    });

    expect(report.currentState.nextWork).toBe(null);
    expect(report.currentState.nextOperatorIntent).toBe('No next work selected. Run `hadara task status --json` for current task-selection guidance.');
    expect(validateSchema('hadara.sessionStart.v1', report).ok).toBe(true);
  });

  it('builds a schema-valid bounded packet from context pack without writing files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Session start task');
    const before = snapshotProject(root);

    const report = buildSessionStartReport({
      projectRoot: root,
      taskId: task.id,
      generatedAt: '2026-06-19T12:00:00.000Z',
      budget: { maxReadFirstItems: 3, maxItems: 8 }
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.sessionStart.v1',
      command: 'session.start',
      ok: true,
      projectRoot: root,
      currentState: {
        recommendedNextTask: task.id
      },
      contextPack: {
        schemaVersion: 'hadara.contextPack.v1',
        taskId: task.id
      },
      guidance: {
        mode: 'bounded-no-live',
        primaryNextAction: 'inspect-task',
        taskRequired: false
      },
      cache: { used: false, hit: false }
    });
    expect(report.contextPack.readFirst.length).toBeLessThanOrEqual(3);
    expect(report.lifecycle.primaryNextCommands).toEqual(expect.arrayContaining([
      `hadara task status --task ${task.id} --json`,
      `hadara context pack --task ${task.id} --json`,
      `hadara task status --task ${task.id} --detail full --json`
    ]));
    expect(report.lifecycle.primaryNextCommands[0]).toBe(`hadara task status --task ${task.id} --json`);
    expect(report.lifecycle.diagnosticCommands).toEqual(expect.arrayContaining([
      'hadara context cache status --json',
      `hadara context graph --task ${task.id} --json`,
      `hadara context pack --task ${task.id} --json`,
      'hadara status --json'
    ]));
    expect(report.guidance.commands).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'task-status',
        args: ['task', 'status', '--task', task.id, '--json']
      }),
      expect.objectContaining({
        id: 'cache-warm',
        args: ['context', 'cache', 'warm', '--json']
      }),
      expect.objectContaining({
        id: 'docs-read-map',
        args: ['docs', 'read-map', '--task', task.id, '--json']
      }),
      expect.objectContaining({
        id: 'context-pack',
        args: ['context', 'pack', '--task', task.id, '--json']
      })
    ]));
    expect(report.guidance.commands.some((command) => command.command.includes('session start'))).toBe(false);
    expect(report.docsReadMap).toMatchObject({
      taskId: task.id,
      command: `hadara docs read-map --task ${task.id} --json`,
      task: {
        capsulePresent: true,
        title: 'Session start task'
      }
    });
    expect(report.docsReadMap?.readFirstCount).toBe(report.docsReadMap?.readFirst.length ?? 0);
    expect(report.docsReadMap?.readFirstTotalCount).toBeGreaterThanOrEqual(report.docsReadMap?.readFirstCount ?? 0);
    expect(report.docsReadMap?.driftWarningCount).toBe(report.docsReadMap?.driftWarnings.length ?? 0);
    expect(report.docsReadMap?.driftWarningTotalCount).toBeGreaterThanOrEqual(report.docsReadMap?.driftWarningCount ?? 0);
    expect(report.guidance.primaryAction).toMatchObject({
      id: 'task-status',
      command: `hadara task status --task ${task.id} --json`,
      args: ['task', 'status', '--task', task.id, '--json'],
      writeBoundary: 'read-only',
      recommendedActorRole: 'agent-worker'
    });
    expect(report.guidance.nextCommandArgs).toEqual(['task', 'status', '--task', task.id, '--json']);
    expect(report.guidance.whyThisNow).toContain('task id is available');
    expect(report.guidance.avoidForNow).toEqual(expect.arrayContaining([
      expect.stringContaining('Do not run task finalize')
    ]));
    expect(validateSchema('hadara.sessionStart.v1', report).ok).toBe(true);
    expect(validateSchema('hadara.contextPack.v1', report.contextPack).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('uses fresh warm graph-core cache by default without live writes', () => {
    const root = tempProject();
    initGit(root);
    const task = createTaskCapsule(root, 'Warm session start task');
    const warm = createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-19T12:05:00.000Z'
    });
    expect(warm.shards.items).toContainEqual(expect.objectContaining({
      extractorKey: 'graphCore',
      executed: true
    }));
    const before = snapshotProject(root);

    const report = buildSessionStartReport({
      projectRoot: root,
      taskId: task.id,
      generatedAt: '2026-06-19T12:06:00.000Z',
      budget: { maxReadFirstItems: 5, maxItems: 12 }
    });

    expect(report.ok).toBe(true);
    expect(report.cache).toMatchObject({
      used: true,
      hit: true,
      mode: 'graph-core',
      sourceManifestCacheFresh: true,
      sourceManifestFastPath: 'hit'
    });
    expect(report.guidance).toMatchObject({
      mode: 'warm-cache',
      primaryNextAction: 'inspect-task',
      taskRequired: false
    });
    expect(report.contextPack.sourceSummary.graphAvailable).toBe(true);
    expect(report.contextPack.readFirst[0]).toEqual(expect.objectContaining({
      id: `task:${task.id}`,
      type: 'Task'
    }));
    expect(report.issues).not.toContainEqual(expect.objectContaining({
      code: 'CONTEXT_PACK_DEGRADED',
      message: expect.stringContaining('bounded no-live')
    }));
    expect(validateSchema('hadara.sessionStart.v1', report).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('uses fresh warm code-index cache for include-code session start', () => {
    const root = tempProject();
    initGit(root);
    fs.mkdirSync(path.join(root, 'src'), { recursive: true });
    fs.writeFileSync(path.join(root, 'src', 'feature.ts'), 'export function feature() { return 1; }\n');
    const task = createTaskCapsule(root, 'Warm code session start task');
    const warm = createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-19T12:07:00.000Z',
      includeCode: true
    });
    expect(warm.shards.items).toContainEqual(expect.objectContaining({
      extractorKey: 'codeIndex',
      executed: true
    }));
    const before = snapshotProject(root);

    const report = buildSessionStartReport({
      projectRoot: root,
      taskId: task.id,
      includeCode: true,
      generatedAt: '2026-06-19T12:08:00.000Z'
    });

    expect(report.ok).toBe(true);
    expect(report.cache).toMatchObject({
      used: true,
      hit: true,
      mode: 'graph-core+code-index',
      readShardCount: 2,
      hitShardCount: 2
    });
    expect(report.guidance.mode).toBe('warm-cache');
    expect(report.contextPack.sourceSummary.codeIndexAvailable).toBe(true);
    expect(report.issues).not.toContainEqual(expect.objectContaining({
      code: 'CONTEXT_PACK_CODE_INDEX_UNAVAILABLE'
    }));
    expect(validateSchema('hadara.sessionStart.v1', report).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('keeps bounded no-live fallback when warm freshness cannot be proven', () => {
    const root = tempProject();
    initGit(root);
    const task = createTaskCapsule(root, 'Stale warm session start task');
    createContextCacheWarmReport({
      projectRoot: root,
      execute: true,
      generatedAt: '2026-06-19T12:09:00.000Z'
    });
    fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# changed after warm\n');
    const before = snapshotProject(root);

    const report = buildSessionStartReport({
      projectRoot: root,
      taskId: task.id,
      generatedAt: '2026-06-19T12:10:00.000Z'
    });

    expect(report.ok).toBe(true);
    expect(report.cache).toMatchObject({
      used: false,
      hit: false,
      mode: 'session-start-bounded-no-live'
    });
    expect(report.contextPack.sourceSummary.graphAvailable).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'CONTEXT_PACK_DEGRADED',
      message: expect.stringContaining('bounded no-live')
    }));
    expect(validateSchema('hadara.sessionStart.v1', report).ok).toBe(true);
    expect(snapshotProject(root)).toEqual(before);
  });

  it('returns degraded task-selection guidance when no task is available', () => {
    const root = tempProject();

    const report = buildSessionStartReport({
      projectRoot: root,
      generatedAt: '2026-06-19T12:00:00.000Z'
    });

    expect(report.ok).toBe(true);
    expect(report.summary.degraded).toBe(true);
    expect(report.lifecycle.primaryNextCommands).toEqual(['hadara task status --json']);
    expect(report.guidance).toMatchObject({
      mode: 'bounded-no-live',
      primaryNextAction: 'select-task',
      taskRequired: true,
      primaryAction: {
        id: 'task-status',
        args: ['task', 'status', '--json'],
        writeBoundary: 'read-only',
        recommendedActorRole: 'agent-worker'
      },
      nextCommandArgs: ['task', 'status', '--json']
    });
    expect(report.guidance.commands).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'task-status',
        args: ['task', 'status', '--json']
      })
    ]));
    expect(report.docsReadMap).toBeUndefined();
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'CONTEXT_PACK_TASK_NOT_FOUND', severity: 'warning' })
    ]));
    expect(validateSchema('hadara.sessionStart.v1', report).ok).toBe(true);
  });

  it('surfaces source document drift through task-scoped session start', () => {
    const root = tempProject();
    initProject(root, 'basic', { silent: true });
    fs.mkdirSync(path.join(root, 'docs', 'specs'), { recursive: true });
    const sourcePath = path.join(root, 'docs', 'specs', 'source.md');
    fs.writeFileSync(sourcePath, '# Source\n\nBefore\n', 'utf8');
    const hash = sha256(sourcePath);
    const task = createTaskCapsule(root, 'Drift session start task');
    const taskPath = path.join(task.dir, 'TASK.md');
    const taskMarkdown = fs.readFileSync(taskPath, 'utf8').replace(
      '## Inputs / Constraints\n\n| Source | Role | State | Notes |\n|---|---|---|---|\n| TBD | reference | active | TBD |',
      `## Inputs / Constraints\n\n| Path / Source | Type | Authority | State | Notes | Hash |\n|---|---|---|---|---|---|\n| docs/specs/source.md | implementation-source | implementation-source | approved | Source for drift check. | ${hash} |`
    );
    fs.writeFileSync(taskPath, taskMarkdown, 'utf8');
    fs.writeFileSync(sourcePath, '# Source\n\nAfter\n', 'utf8');

    const report = buildSessionStartReport({
      projectRoot: root,
      taskId: task.id,
      generatedAt: '2026-06-30T12:00:00.000Z'
    });

    expect(report.docsReadMap?.sourceDocumentDriftCount).toBe(1);
    expect(report.docsReadMap?.sourceDocumentDrift).toContainEqual(expect.objectContaining({
      code: 'TASK_SOURCE_DOCUMENT_CHANGED',
      message: expect.stringContaining('docs/specs/source.md')
    }));
    expect(validateSchema('hadara.sessionStart.v1', report).ok).toBe(true);
  });
});

function initGit(root: string): void {
  const result = spawnSync('git', ['init'], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git init failed: ${result.stderr || result.stdout}`);
  }
}

function sha256(filePath: string): string {
  const result = spawnSync('sha256sum', [filePath], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  return `sha256:${result.stdout.trim().split(/\s+/)[0]}`;
}

function snapshotProject(root: string): string[] {
  const entries: string[] = [];
  walk(root, root, entries);
  return entries.sort();
}

function walk(root: string, dir: string, entries: string[]): void {
  for (const name of fs.readdirSync(dir).sort()) {
    const fullPath = path.join(dir, name);
    const relative = path.relative(root, fullPath).split(path.sep).join('/');
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      entries.push(`${relative}/`);
      walk(root, fullPath, entries);
    } else {
      entries.push(`${relative}:${stat.size}`);
    }
  }
}
