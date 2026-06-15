import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-capsule-unit-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Task Capsule scaffold frames', () => {
  it('creates table-first v2 Task Capsule files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Scaffold smoke');

    expect(fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8')).toContain('| Field | Value |');
    expect(fs.readFileSync(path.join(task.dir, 'PLAN.md'), 'utf8')).toContain('| Step | Action | Status | Evidence |');
    expect(fs.readFileSync(path.join(task.dir, 'ACCEPTANCE.md'), 'utf8')).toContain('| ID | Criterion | Status | Evidence |');
    expect(fs.readFileSync(path.join(task.dir, 'TESTS.md'), 'utf8')).toContain('| Command | Purpose | Required For Done | Latest Result | Evidence |');
    const handoff = fs.readFileSync(path.join(task.dir, 'HANDOFF.md'), 'utf8');
    expect(handoff).toContain('## Current State');
    expect(handoff).toContain('| TaskStatus | Draft |');
    expect(handoff).not.toContain('| CloseState |');
    expect(handoff).not.toContain('| Status | Draft |');
    expect(handoff).toContain('## Next Recommended Step');
    expect(fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')).toContain('| Time | Kind | Summary | Result | Visibility | JSONL |');
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toBe('');
  });
});
