import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleTaskCommand } from '../../src/cli/task';
import { validateSchema } from '../../src/core/schema';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTaskNextReport, formatTaskNextReport } from '../../src/task/task-next';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

describe('task next recommendation', () => {
  it('prefers actionable handoff next step and keeps legacy Task Board rows as backlog', () => {
    const root = tempProject({
      handoffNextStep: 'Continue with task capsule upgrade/remediation dry-run hardening.',
      developmentRows: ['| 1 | Completed | T-0001 | Done. | Done: complete. |']
    });
    const legacy = createTaskCapsule(root, 'Legacy Partial Work');
    updateTaskBoardStatus(root, legacy.id, 'Partial');

    const report = createTaskNextReport(root);

    expect(report).toMatchObject({
      summary: { recommendations: 1, source: 'docs/AGENT_HANDOFF.md', policy: 'handoff-first' },
      recommendations: [
        expect.objectContaining({
          taskId: 'TBD',
          title: 'Task capsule upgrade/remediation dry-run hardening',
          source: 'docs/AGENT_HANDOFF.md',
          sourceKind: 'handoff',
          taskCapsulePresent: false,
          createCommand: "hadara task create 'Task capsule upgrade/remediation dry-run hardening'"
        })
      ],
      sources: {
        agentHandoff: expect.objectContaining({
          activeNext: 'T-0181 Task Next Recommendation',
          nextRecommendedStep: 'Continue with task capsule upgrade/remediation dry-run hardening.'
        })
      },
      backlog: [
        expect.objectContaining({
          taskId: legacy.id,
          title: 'Legacy Partial Work',
          status: 'Partial',
          source: 'docs/TASK_BOARD.md',
          taskCapsulePresent: true
        })
      ]
    });
    expect(report.recommendations[0].taskId).not.toBe(legacy.id);
    expect(validateSchema('hadara.task.next.v1', report).ok).toBe(true);
  });

  it('recommends the first incomplete Development Slices row with existing capsule metadata', () => {
    const root = tempProject();
    const done = createTaskCapsule(root, 'Already Done');
    const next = createTaskCapsule(root, 'Next Slice');
    writeDevelopmentSlices(root, [
      `| 1 | Already Done | ${done.id} | Done objective. | Done: complete. |`,
      '| 2 | Legacy Done Evidence | T-0009 | Old style. | Build/tests pass, CLI JSON sample recorded. |',
      `| 3 | Next Slice | ${next.id} | Continue. | Planned after previous. |`,
      '| 4 | Later Slice | T-9999 | Later. | Planned later. |'
    ]);

    const report = createTaskNextReport(root);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.next.v1',
      command: 'task.next',
      ok: true,
      summary: { recommendations: 1, source: 'docs/DEVELOPMENT_SLICES.md' },
      recommendations: [
        expect.objectContaining({
          taskId: next.id,
          title: 'Next Slice',
          taskBoardStatus: 'Draft',
          taskBoardPath: 'docs/TASK_BOARD.md',
          taskCapsulePresent: true,
          capsule: `tasks/${next.id}-next-slice`,
          createCommand: null
        })
      ]
    });
    expect(report.recommendations[0].requiredReading).toEqual([
      'docs/PROJECT_STATE.md',
      'docs/AGENT_HANDOFF.md',
      'docs/DEVELOPMENT_SLICES.md',
      'docs/TASK_BOARD.md'
    ]);
    expect(validateSchema('hadara.task.next.v1', report).ok).toBe(true);
    expect(formatTaskNextReport(report)).toContain(`${next.id}\tNext Slice`);
  });

  it('returns a shell-quoted create command when the planned slice has no capsule yet', () => {
    const root = tempProject();
    writeDevelopmentSlices(root, [`| 1 | Missing "Quoted" Capsule | T-0188 | Create me. | Planned after current. |`]);

    const report = createTaskNextReport(root);

    expect(report.recommendations[0]).toMatchObject({
      taskId: 'T-0188',
      title: 'Missing "Quoted" Capsule',
      taskCapsulePresent: false,
      capsule: null,
      createCommand: `hadara task create 'Missing "Quoted" Capsule'`
    });
    expect(validateSchema('hadara.task.next.v1', report).ok).toBe(true);
  });

  it('falls back to the first incomplete Task Board row when slices are complete', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Board Fallback');
    writeDevelopmentSlices(root, [`| 1 | Completed | T-0001 | Done. | Done: complete. |`]);

    const report = createTaskNextReport(root);

    expect(report.recommendations[0]).toMatchObject({
      taskId: task.id,
      title: 'Board Fallback',
      reason: 'First incomplete Task Board row with status Draft.',
      source: 'docs/TASK_BOARD.md',
      sourceKind: 'task-board-fallback'
    });
    expect(validateSchema('hadara.task.next.v1', report).ok).toBe(true);
  });

  it('prints JSON through the task next CLI route', () => {
    const root = tempProject();
    writeDevelopmentSlices(root, ['| 1 | CLI Next | T-0199 | Continue. | Planned. |']);
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleTaskCommand({ args: ['task', 'next', '--json'], projectRoot: root, jsonOutput: true });

    expect(handled).toBe(true);
    const payload = JSON.parse(String(log.mock.calls[0][0]));
    expect(payload).toMatchObject({ schemaVersion: 'hadara.task.next.v1', command: 'task.next', ok: true });
    expect(validateSchema('hadara.task.next.v1', payload).ok).toBe(true);
  });
});

function tempProject(options: { handoffNextStep?: string; developmentRows?: string[] } = {}): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-next-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'docs', 'AGENT_HANDOFF.md'),
    [
      '# AGENT_HANDOFF',
      '',
      '## Current State',
      '',
      '| Area | State | Notes |',
      '|---|---|---|',
      '| Active / Next Task | T-0181 Task Next Recommendation | Fixture. |',
      '',
      ...(options.handoffNextStep
        ? [
            '## Next Recommended Step',
            '',
            '| Step | Reason | Done Evidence |',
            '|---|---|---|',
            `| ${options.handoffNextStep} | Fixture handoff priority. | TBD |`,
            ''
          ]
        : [])
    ].join('\n'),
    'utf8'
  );
  if (options.developmentRows) writeDevelopmentSlices(root, options.developmentRows);
  return root;
}

function writeDevelopmentSlices(root: string, rows: string[]): void {
  fs.writeFileSync(
    path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'),
    ['# DEVELOPMENT_SLICES', '', '| # | Name | Task | Objective | Status / Evidence |', '|---|---|---|---|---|', ...rows, ''].join('\n'),
    'utf8'
  );
}

function updateTaskBoardStatus(root: string, taskId: string, status: string): void {
  const taskBoard = path.join(root, 'docs', 'TASK_BOARD.md');
  fs.writeFileSync(
    taskBoard,
    fs
      .readFileSync(taskBoard, 'utf8')
      .split(/\r?\n/)
      .map((line) => (line.startsWith(`| ${taskId} |`) ? line.replace('| Draft |', `| ${status} |`) : line))
      .join('\n'),
    'utf8'
  );
}
