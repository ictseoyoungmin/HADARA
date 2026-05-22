import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { resolveProjectFile, toProjectRelativePath, WorkspaceFileError } from '../../src/core/workspace';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-workspace-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('workspace file boundary', () => {
  it('resolves project-relative files to portable relative paths', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, 'fixtures'));
    fs.writeFileSync(path.join(root, 'fixtures', 'script.json'), '[]', 'utf8');

    const file = resolveProjectFile(root, 'fixtures/script.json');

    expect(file.absolutePath).toBe(path.join(root, 'fixtures', 'script.json'));
    expect(file.relativePath).toBe('fixtures/script.json');
    expect(toProjectRelativePath(root, file.absolutePath)).toBe('fixtures/script.json');
  });

  it('rejects parent traversal outside the project', () => {
    const parent = tempProject();
    const root = path.join(parent, 'repo');
    fs.mkdirSync(root);
    fs.writeFileSync(path.join(parent, 'outside.jsonl'), '{}', 'utf8');

    expect(() => resolveProjectFile(root, '../outside.jsonl')).toThrow(WorkspaceFileError);
    expect(() => resolveProjectFile(root, '../outside.jsonl')).toThrow(/inside the project root/);
  });

  it('rejects absolute paths outside the project', () => {
    const parent = tempProject();
    const root = path.join(parent, 'repo');
    fs.mkdirSync(root);
    const outside = path.join(parent, 'outside.json');
    fs.writeFileSync(outside, '{}', 'utf8');

    expect(() => resolveProjectFile(root, outside)).toThrow(WorkspaceFileError);
  });

  it('rejects symlink escape outside the project', () => {
    const parent = tempProject();
    const root = path.join(parent, 'repo');
    const outside = path.join(parent, 'outside');
    fs.mkdirSync(root);
    fs.mkdirSync(outside);
    fs.writeFileSync(path.join(outside, 'secret.json'), '{}', 'utf8');
    fs.symlinkSync(outside, path.join(root, 'linked-outside'), 'dir');

    expect(() => resolveProjectFile(root, 'linked-outside/secret.json')).toThrow(WorkspaceFileError);
  });
});
