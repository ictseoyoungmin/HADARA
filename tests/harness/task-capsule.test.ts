import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appendEvidence, createSessionEvidenceDirs } from '../../src/evidence/evidence';
import { createTaskCapsule, findTaskCapsule, listTaskCapsules } from '../../src/task/task-capsule';

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
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toBe('');
    expect(fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')).toContain(
      '| Time | Kind | Summary | Result | Visibility | JSONL |\n|---|---|---|---|---|---|'
    );
    expect(fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8')).toContain('| Field | Value |');
    expect(fs.readFileSync(path.join(task.dir, 'PLAN.md'), 'utf8')).toContain('| Step | Action | Status | Evidence |');
    expect(fs.readFileSync(path.join(task.dir, 'ACCEPTANCE.md'), 'utf8')).toContain('| ID | Criterion | Status | Evidence |');
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
    expect(evidence[2]).toBe('| Time | Kind | Summary | Result | Visibility | JSONL |');
    expect(evidence[3]).toBe('|---|---|---|---|---|---|');
    expect(evidence[4].split('|')).toHaveLength(8);

    const index = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
    expect(index[0]).toMatchObject({
      schemaVersion: 'hadara.evidence.v2',
      id: expect.stringMatching(new RegExp(`^ev:${task.id}:[a-f0-9]{24}$`)),
      artifacts: [{ path: expect.stringMatching(/^artifacts\/test-log\/.+-test-output\.log$/), visibility: 'public', artifactType: 'test-log' }],
      legacy: { kind: 'test-log', result: 'passed', evidencePath: expect.stringMatching(/^artifacts\/test-log\/.+-test-output\.log$/) },
      visibility: 'public',
      outcome: 'passed'
    });
    expect(fs.existsSync(path.join(task.dir, index[0].artifacts[0].path))).toBe(true);
  });

  it('rejects public artifact copies when text contains secret-like values', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Reject secret artifact');
    fs.writeFileSync(path.join(root, 'secret.log'), 'token=super-secret', 'utf8');

    expect(() =>
      appendEvidence(root, {
        taskId: task.id,
        kind: 'test-log',
        path: 'secret.log',
        summary: 'Should reject',
        result: 'blocked'
      })
    ).toThrow(/secret-like content/);
    expect(fs.existsSync(path.join(task.dir, 'artifacts'))).toBe(false);
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toBe('');
  });

  it('rejects public binary artifact copies', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Reject binary artifact');
    fs.writeFileSync(path.join(root, 'binary.bin'), Buffer.from([0x48, 0x00, 0x49]));

    expect(() =>
      appendEvidence(root, {
        taskId: task.id,
        kind: 'screenshot',
        path: 'binary.bin',
        summary: 'Binary artifact',
        result: 'blocked'
      })
    ).toThrow(/UTF-8 text/);
    expect(fs.existsSync(path.join(task.dir, 'artifacts'))).toBe(false);
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

  it('ignores task-like directories without a TASK.md source document', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Tracked task');
    fs.mkdirSync(path.join(root, 'tasks', 'T-0002-empty-local-leftover'));

    expect(listTaskCapsules(root).map((capsule) => capsule.id)).toEqual([task.id]);
    expect(findTaskCapsule(root, 'T-0002')).toBeUndefined();
  });

  it('finds a later real task capsule when an earlier same-id leftover lacks TASK.md', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Tracked task');
    fs.mkdirSync(path.join(root, 'tasks', 'T-0002-empty-local-leftover'));
    const realDir = path.join(root, 'tasks', 'T-0002-real-task');
    fs.mkdirSync(realDir);
    fs.writeFileSync(path.join(realDir, 'TASK.md'), '# T-0002 Real task\n', 'utf8');

    expect(findTaskCapsule(root, 'T-0002')).toMatchObject({
      id: 'T-0002',
      title: 'Real task',
      slug: 'real-task',
      dir: realDir
    });
  });

  it('writes evidence to the TASK.md-bearing capsule when same-id leftovers exist', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Tracked task');
    fs.mkdirSync(path.join(root, 'tasks', 'T-0002-empty-local-leftover'));
    const realDir = path.join(root, 'tasks', 'T-0002-real-task');
    fs.mkdirSync(realDir);
    fs.writeFileSync(path.join(realDir, 'TASK.md'), '# T-0002 Real task\n', 'utf8');
    fs.writeFileSync(path.join(realDir, 'EVIDENCE.md'), '# Evidence\n\n| Time | Kind | Summary | Result | Visibility | JSONL |\n|---|---|---|---|---|---|\n', 'utf8');
    fs.writeFileSync(path.join(realDir, 'evidence.jsonl'), '', 'utf8');

    appendEvidence(root, {
      taskId: 'T-0002',
      kind: 'command-log',
      summary: 'Evidence lands in real capsule',
      result: 'passed',
      visibility: 'public'
    });

    expect(fs.existsSync(path.join(root, 'tasks', 'T-0002-empty-local-leftover', 'evidence.jsonl'))).toBe(false);
    expect(fs.readFileSync(path.join(realDir, 'evidence.jsonl'), 'utf8')).toContain('Evidence lands in real capsule');
  });

  it('rejects evidence writes when same-id TASK.md-bearing capsules are ambiguous', () => {
    const root = tempProject();
    const firstDir = path.join(root, 'tasks', 'T-0002-first-task');
    const secondDir = path.join(root, 'tasks', 'T-0002-second-task');
    fs.mkdirSync(path.join(root, 'tasks'), { recursive: true });
    fs.mkdirSync(firstDir);
    fs.mkdirSync(secondDir);
    fs.writeFileSync(path.join(firstDir, 'TASK.md'), '# T-0002 First task\n', 'utf8');
    fs.writeFileSync(path.join(secondDir, 'TASK.md'), '# T-0002 Second task\n', 'utf8');

    expect(() =>
      appendEvidence(root, {
        taskId: 'T-0002',
        kind: 'command-log',
        summary: 'Ambiguous evidence',
        result: 'passed',
        visibility: 'public'
      })
    ).toThrow(/Multiple Task Capsules found for T-0002/);
  });
});
