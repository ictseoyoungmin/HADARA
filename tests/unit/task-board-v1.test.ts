import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTaskFinishReport } from '../../src/task/task-finish';
import { normalizeCloseSummary, parseTaskBoard, renderTaskTargets } from '../../src/task/task-board';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Init v1 Task Board', () => {
  it('creates the six-column Board and renders explicit targets in caller order', () => {
    const root = tempProject();
    writeV1Board(root);
    const task = createTaskCapsule(root, 'Targeted task', {
      targets: [
        { namespace: 'release', id: 'v0.1.0' },
        { namespace: 'component', id: 'authentication' }
      ]
    });

    const parsed = parseTaskBoard(fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8'));

    expect(parsed.schema).toBe('v1');
    expect(parsed.rows[0]).toMatchObject({
      id: task.id,
      status: 'Draft',
      targets: 'release:v0.1.0; component:authentication',
      capsule: `tasks/${path.basename(task.dir)}`,
      result: '-'
    });
    expect(fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8'))
      .toContain('| Targets | release:v0.1.0; component:authentication |');
  });

  it('projects only the exact optional Close Summary and preserves targets', () => {
    const root = tempProject();
    writeV1Board(root);
    const task = createTaskCapsule(root, 'Close projection');
    const taskPath = path.join(task.dir, 'TASK.md');
    const taskContent = fs.readFileSync(taskPath, 'utf8')
      .replace('## Close Summary\n\n', '## Close Summary\n\n**Added** the [small path](https://example.test).\nSecond line.\n\n')
      .concat('\n## Notes\n\nNever copy this.\n');
    fs.writeFileSync(taskPath, taskContent, 'utf8');
    expect(taskContent).not.toContain('| Targets | project |');

    const report = createTaskFinishReport(root, task.id, 'execute');
    const row = parseTaskBoard(fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8')).rows[0];

    expect(report.ok).toBe(true);
    expect(row).toMatchObject({
      status: 'Done',
      targets: 'project',
      result: 'Added the small path. Second line.'
    });
    expect(row.result).not.toContain('Never copy');
  });

  it('keeps Result as a dash when Close Summary is absent and caps Unicode code points', () => {
    expect(normalizeCloseSummary(`**${'가'.repeat(170)}**`)).toHaveLength(160);
    expect(normalizeCloseSummary('')).toBe('');
    expect(renderTaskTargets([])).toBe('project');
  });

  it('preserves legacy Notes and extra cells during finish', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(
      path.join(root, 'docs', 'TASK_BOARD.md'),
      '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes | Owner |\n|---|---|---|---|---|---|\n',
      'utf8'
    );
    const task = createTaskCapsule(root, 'Legacy preservation');
    const boardPath = path.join(root, 'docs', 'TASK_BOARD.md');
    fs.writeFileSync(
      boardPath,
      fs.readFileSync(boardPath, 'utf8').replace(
        /^\| T-0001 .+$/m,
        `| ${task.id} | Legacy preservation | Draft | tasks/${path.basename(task.dir)} | Keep this | reviewer |`
      ),
      'utf8'
    );

    const report = createTaskFinishReport(root, task.id, 'execute');

    expect(report.ok).toBe(true);
    expect(fs.readFileSync(boardPath, 'utf8')).toContain('| Keep this | reviewer |');
  });
});

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-board-v1-'));
  roots.push(root);
  return root;
}

function writeV1Board(root: string): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'docs', 'TASK_BOARD.md'),
    '# Task Board\n\n| ID | Title | Status | Targets | Capsule | Result |\n|---|---|---|---|---|---|\n',
    'utf8'
  );
}
