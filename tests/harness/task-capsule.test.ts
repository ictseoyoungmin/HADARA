import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appendEvidence, createSessionEvidenceDirs } from '../../src/evidence/evidence';
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
    const logPath = path.join(root, 'test-output.log');
    fs.writeFileSync(logPath, 'ok', 'utf8');

    appendEvidence(root, {
      taskId: task.id,
      kind: 'test-log',
      path: 'test-output.log',
      summary: 'Created evidence row',
      result: 'passed'
    });

    const evidence = fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8').trim().split('\n');
    expect(evidence[2]).toBe('| Time | Kind | Summary | Result |');
    expect(evidence[3]).toBe('|---|---|---|---|');
    expect(evidence[4].split('|')).toHaveLength(6);

    const index = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
    expect(index[0]).toMatchObject({
      schemaVersion: 'hadara.evidence.v1',
      kind: 'test-log',
      evidencePath: '../../test-output.log',
      visibility: 'public',
      result: 'passed'
    });
  });

  it('separates private evidence paths from public summaries', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Collect private evidence');

    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      path: '/tmp/private-command.log',
      summary: 'token=super-secret',
      result: 'unknown',
      visibility: 'private'
    });

    const evidence = fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8');
    expect(evidence).toContain('token=[REDACTED]');
    expect(evidence).not.toContain('/tmp/private-command.log');
    expect(evidence).not.toContain('super-secret');

    const index = JSON.parse(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8').trim());
    expect(index.visibility).toBe('private');
    expect(index.evidencePath).toBeUndefined();
  });

  it('creates session evidence directories by evidence kind', () => {
    const root = tempProject();
    const evidenceDir = createSessionEvidenceDirs(root, 'S-0001');

    expect(fs.existsSync(path.join(evidenceDir, 'command-logs'))).toBe(true);
    expect(fs.existsSync(path.join(evidenceDir, 'test-results'))).toBe(true);
    expect(fs.existsSync(path.join(evidenceDir, 'diff-summary'))).toBe(true);
    expect(fs.existsSync(path.join(evidenceDir, 'screenshots'))).toBe(true);
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
