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
  it('creates the 0.4 four-file Task Capsule scaffold', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Scaffold smoke');
    const files = fs.readdirSync(task.dir).sort();

    expect(files).toEqual(['EVIDENCE.md', 'HANDOFF.md', 'TASK.md', 'evidence.jsonl']);
    const taskMarkdown = fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8');
    expect(taskMarkdown).toContain('## Identity');
    expect(taskMarkdown).not.toContain('Lifecycle note:');
    expect(taskMarkdown.indexOf('## Goal')).toBeLessThan(taskMarkdown.indexOf('## Inputs / Constraints'));
    expect(taskMarkdown).toContain('## Scope');
    expect(taskMarkdown).toContain('## Inputs / Constraints');
    expect(taskMarkdown).toContain('| Source | Role | State | Notes |');
    expect(taskMarkdown).toContain('## Plan');
    expect(taskMarkdown).toContain('| Step | Action | Status |');
    expect(taskMarkdown).toContain('## Acceptance');
    expect(taskMarkdown).toContain('| ID | Criterion | State | Evidence | Reference |');
    expect(taskMarkdown).toContain('## Validation');
    expect(taskMarkdown).toContain('| Check | Gate | Status | Detail | Evidence |');
    expect(taskMarkdown).toContain('## Changes');
    expect(taskMarkdown).toContain('| Area | Summary |');
    expect(taskMarkdown).toContain('## Risks / Follow-ups');
    expect(taskMarkdown).toContain('| ID | Type | Summary | State | Link |');
    expect(taskMarkdown).toContain('## History');
    expect(taskMarkdown).toContain('| Date | State | Note |');
    expect(taskMarkdown).not.toContain('\n## Status\n');
    expect(taskMarkdown).not.toContain('## Close Proof');
    const handoff = fs.readFileSync(path.join(task.dir, 'HANDOFF.md'), 'utf8');
    expect(handoff).not.toContain('## Current State');
    expect(handoff).not.toContain('| CloseState |');
    expect(handoff).toContain('## Identity');
    expect(handoff).toContain('| Status | Draft |');
    expect(handoff).toContain('| Created |');
    expect(handoff).toContain('| Updated |');
    expect(handoff).toContain('## Pre-Close Operator Action');
    expect(handoff).toContain('## Post-Close Continuation');
    const evidence = fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8');
    expect(evidence).toContain('## Validation Evidence');
    expect(evidence).toContain('## Close Proof');
    expect(evidence).toContain('## Failed / Blocked / Residual Evidence');
    expect(evidence).toContain('<!-- hadara:slot evidence.validation-summary -->');
    expect(evidence).toContain('| Evidence ID | Outcome | Category | Summary |');
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toBe('');
  });
});
