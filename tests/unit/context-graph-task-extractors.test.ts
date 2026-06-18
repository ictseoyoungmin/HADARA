import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { extractTaskBoard, extractTaskCapsules } from '../../src/context/task-extractors';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-context-task-extractors-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('context graph task extractors', () => {
  it('extracts Task nodes and state from docs/TASK_BOARD.md', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), `# TASK_BOARD

| ID | Title | Status | Capsule | Notes |
|---|---|---|---|---|
| T-0344 | Context Graph Extractor Contract | Done | tasks/T-0344-context-graph-extractor-contract | |
| T-0345 | Context Graph Task Extractors | In Progress | tasks/T-0345-context-graph-task-extractors | |
`, 'utf8');

    const result = extractTaskBoard(root);

    expect(result.source).toMatchObject({
      extractor: 'extractTaskBoard',
      paths: ['docs/TASK_BOARD.md'],
      sourceHash: expect.stringMatching(/^sha256:[a-f0-9]{64}$/)
    });
    expect(result.nodes).toEqual([
      expect.objectContaining({
        id: 'task:T-0344',
        type: 'Task',
        label: 'T-0344 Context Graph Extractor Contract',
        path: 'tasks/T-0344-context-graph-extractor-contract/TASK.md',
        status: 'Done',
        kind: 'task-board-row',
        source: expect.objectContaining({ line: 5, extractor: 'extractTaskBoard' })
      }),
      expect.objectContaining({
        id: 'task:T-0345',
        status: 'In Progress',
        source: expect.objectContaining({ line: 6 })
      })
    ]);
    expect(result.stateSources).toEqual([expect.objectContaining({
      id: 'state-source:task-board',
      kind: 'task-board',
      extracted: {
        rows: 2,
        latestDoneTask: 'T-0344',
        activeTasks: ['T-0345']
      }
    })]);
    expect(result.issues).toEqual([]);
  });

  it('extracts Task nodes and state from task capsules', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Capsule extractor fixture');
    updateFile(path.join(task.dir, 'TASK.md'), (content) => content
      .replace('| Status | Draft |', '| Status | In Progress |')
      .replace('## Status\n\nDraft', '## Status\n\nIn Progress'));
    updateFile(path.join(task.dir, 'HANDOFF.md'), (content) => content
      .replace('| TaskStatus | Draft |', '| TaskStatus | In Progress |'));

    const result = extractTaskCapsules(root);

    expect(result.source.extractor).toBe('extractTaskCapsules');
    expect(result.source.paths).toEqual([
      `tasks/${task.id}-${task.slug}/HANDOFF.md`,
      `tasks/${task.id}-${task.slug}/TASK.md`
    ]);
    expect(result.nodes).toEqual([expect.objectContaining({
      id: `task:${task.id}`,
      type: 'Task',
      label: `${task.id} Capsule extractor fixture`,
      path: `tasks/${task.id}-${task.slug}/TASK.md`,
      status: 'In Progress',
      kind: 'task-capsule',
      metadata: expect.objectContaining({
        capsule: `tasks/${task.id}-${task.slug}`,
        handoffTaskStatus: 'In Progress',
        handoffPresent: true
      })
    })]);
    expect(result.stateSources).toEqual([expect.objectContaining({
      id: `state-source:task-capsule:${task.id}`,
      kind: 'task-capsule',
      extracted: expect.objectContaining({
        taskId: task.id,
        status: 'In Progress',
        handoffTaskStatus: 'In Progress'
      })
    })]);
    expect(result.issues).toEqual([]);
  });

  it('degrades missing Task Board to a source-missing issue', () => {
    const root = tempProject();

    const result = extractTaskBoard(root);

    expect(result.nodes).toEqual([]);
    expect(result.stateSources).toEqual([]);
    expect(result.issues).toEqual([expect.objectContaining({
      severity: 'warning',
      code: 'CONTEXT_GRAPH_SOURCE_MISSING',
      path: 'docs/TASK_BOARD.md'
    })]);
  });
});

function updateFile(filePath: string, update: (content: string) => string): void {
  fs.writeFileSync(filePath, update(fs.readFileSync(filePath, 'utf8')), 'utf8');
}
