import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { readJsonDocumentFact, resolveJsonPointer } from '../../src/status/adapters/json-document';
import { readMarkdownSectionFact } from '../../src/status/adapters/markdown-section';
import { readMarkdownTableFact } from '../../src/status/adapters/markdown-table';
import { readGitWorkspaceChangesFact } from '../../src/status/adapters/git-metadata';
import { readTaskCapsuleWorkUnitFact } from '../../src/status/adapters/task-capsule';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function tempRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  roots.push(root);
  return root;
}

describe('json-document adapter', () => {
  it('resolveJsonPointer walks nested tokens', () => {
    const doc = { activeTask: { id: 'T-0659' } };
    expect(resolveJsonPointer(doc, '/activeTask/id')).toEqual({ found: true, value: 'T-0659' });
    expect(resolveJsonPointer(doc, '/missing/id')).toEqual({ found: false, value: undefined });
    expect(resolveJsonPointer(doc, '')).toEqual({ found: true, value: doc });
  });

  it('reads a present value as a canonical fact', () => {
    const root = tempRoot('hadara-json-doc-');
    fs.mkdirSync(path.join(root, '.hadara', 'state'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'state', 'current.json'), JSON.stringify({ currentRelease: '0.5.0-rc.0' }), 'utf8');
    const fact = readJsonDocumentFact<string>(root, 'project.release', 'project-current-state', '.hadara/state/current.json', '/currentRelease');
    expect(fact).toMatchObject({ state: 'present', value: '0.5.0-rc.0', authority: 'canonical' });
  });

  it('returns missing (not invalid, not a healthy default) when the file does not exist', () => {
    const root = tempRoot('hadara-json-doc-missing-');
    const fact = readJsonDocumentFact(root, 'project.release', 'project-current-state', '.hadara/state/current.json', '/currentRelease');
    expect(fact.state).toBe('missing');
    expect(fact.value).toBeNull();
  });

  it('returns invalid for unparsable JSON instead of silently treating it as missing', () => {
    const root = tempRoot('hadara-json-doc-invalid-');
    fs.mkdirSync(path.join(root, '.hadara', 'state'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'state', 'current.json'), '{not valid json', 'utf8');
    const fact = readJsonDocumentFact(root, 'project.release', 'project-current-state', '.hadara/state/current.json', '/currentRelease');
    expect(fact.state).toBe('invalid');
  });
});

describe('markdown-section adapter', () => {
  it('reads a heading section as an observed fact', () => {
    const root = tempRoot('hadara-md-section-');
    fs.writeFileSync(root + '/DOC.md', '# DOC\n\n## Continuation\n\nReview combat prototype.\n', 'utf8');
    const fact = readMarkdownSectionFact(root, 'continuation.body', 'doc', 'DOC.md', '## Continuation');
    expect(fact.state).toBe('present');
    expect(fact.value).toContain('Review combat prototype.');
  });

  it('returns missing when the heading is absent', () => {
    const root = tempRoot('hadara-md-section-missing-');
    fs.writeFileSync(root + '/DOC.md', '# DOC\n\nNo sections here.\n', 'utf8');
    const fact = readMarkdownSectionFact(root, 'continuation.body', 'doc', 'DOC.md', '## Continuation');
    expect(fact.state).toBe('missing');
  });
});

describe('markdown-table adapter', () => {
  it('parses rows under a heading', () => {
    const root = tempRoot('hadara-md-table-');
    fs.writeFileSync(
      root + '/TASK_BOARD.md',
      ['# TASK_BOARD', '', '| ID | Title | Status |', '|---|---|---|', '| T-0006 | Hermes | Partial |', ''].join('\n'),
      'utf8'
    );
    const fact = readMarkdownTableFact(root, 'taskBoard.rows', 'task-board', 'TASK_BOARD.md');
    expect(fact.state).toBe('present');
    expect(fact.value).toEqual([
      ['ID', 'Title', 'Status'],
      ['T-0006', 'Hermes', 'Partial']
    ]);
  });

  it('returns missing when the table has no rows', () => {
    const root = tempRoot('hadara-md-table-empty-');
    fs.writeFileSync(root + '/TASK_BOARD.md', '# TASK_BOARD\n\nNo rows yet.\n', 'utf8');
    expect(readMarkdownTableFact(root, 'taskBoard.rows', 'task-board', 'TASK_BOARD.md').state).toBe('missing');
  });
});

describe('git-metadata adapter', () => {
  it('reports workspace changes from a real git repository, read-only', () => {
    const root = tempRoot('hadara-git-meta-');
    execFileSync('git', ['init', '--quiet'], { cwd: root });
    execFileSync('git', ['config', 'user.email', 'fixture@example.com'], { cwd: root });
    execFileSync('git', ['config', 'user.name', 'Fixture'], { cwd: root });
    fs.writeFileSync(path.join(root, 'tracked.txt'), 'one\n', 'utf8');
    execFileSync('git', ['add', 'tracked.txt'], { cwd: root });
    execFileSync('git', ['commit', '--quiet', '-m', 'init'], { cwd: root });
    fs.writeFileSync(path.join(root, 'new-file.txt'), 'two\n', 'utf8');

    const fact = readGitWorkspaceChangesFact(root);
    expect(fact.state).toBe('present');
    expect(fact.value).toEqual(expect.arrayContaining([expect.objectContaining({ status: 'untracked', path: 'new-file.txt' })]));

    const untracked = fs.readdirSync(root);
    expect(untracked).toContain('new-file.txt');
  });

  it('is unavailable (not invalid data) when the directory is not a git repository', () => {
    const root = tempRoot('hadara-git-meta-non-repo-');
    const fact = readGitWorkspaceChangesFact(root);
    expect(fact.state).toBe('invalid');
    expect(fact.value).toBeNull();
  });
});

describe('task-capsule adapter', () => {
  it('normalizes a Task Capsule into a generic workUnit fact', () => {
    const root = tempRoot('hadara-task-capsule-adapter-');
    fs.mkdirSync(path.join(root, 'tasks'), { recursive: true });
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n', 'utf8');
    const capsule = createTaskCapsule(root, 'Status fact model foundations');

    const fact = readTaskCapsuleWorkUnitFact(root, capsule.id);
    expect(fact.state).toBe('present');
    expect(fact.authority).toBe('declared');
    expect(fact.value).toEqual({ kind: 'task', id: capsule.id, title: 'Status fact model foundations' });
  });

  it('returns missing for an unknown task id', () => {
    const root = tempRoot('hadara-task-capsule-adapter-missing-');
    fs.mkdirSync(path.join(root, 'tasks'), { recursive: true });
    expect(readTaskCapsuleWorkUnitFact(root, 'T-9999').state).toBe('missing');
  });
});
