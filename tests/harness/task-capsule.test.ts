import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appendEvidence } from '../../src/evidence/evidence';
import { createTaskCapsule, listTaskCapsules } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-test-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Task Capsule harness', () => {
  it('creates a complete task capsule', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Implement provider contract');

    expect(task.id).toBe('T-0001');
    expect(fs.existsSync(path.join(task.dir, 'TASK.md'))).toBe(true);
    expect(fs.existsSync(path.join(task.dir, 'ACCEPTANCE.md'))).toBe(true);
    expect(fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')).toContain(
      '| Time | Kind | Summary | Result |\n|---|---|---|---|'
    );
    expect(fs.readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8')).toContain(task.id);
  });

  it('keeps evidence table schema valid after appending evidence', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Collect evidence');

    appendEvidence(root, {
      taskId: task.id,
      kind: 'note',
      summary: 'Created evidence row',
      result: 'passed'
    });

    const evidence = fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8').trim().split('\n');
    expect(evidence[2]).toBe('| Time | Kind | Summary | Result |');
    expect(evidence[3]).toBe('|---|---|---|---|');
    expect(evidence[4].split('|')).toHaveLength(6);
  });

  it('lists task capsules', () => {
    const root = tempProject();
    createTaskCapsule(root, 'First task');
    createTaskCapsule(root, 'Second task');

    const tasks = listTaskCapsules(root);
    expect(tasks).toHaveLength(2);
    expect(tasks[1].id).toBe('T-0002');
  });
});
