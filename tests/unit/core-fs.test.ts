import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  atomicWriteTextFile,
  cleanupPreparedAtomicTextFileWrite,
  prepareAtomicTextFileWrite
} from '../../src/core/fs';

const roots: string[] = [];

function tempRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-core-fs-'));
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('core fs atomic text writes', () => {
  it('writes project-relative paths atomically', () => {
    const root = tempRoot();

    atomicWriteTextFile(root, 'docs/example.md', '# Example\n');

    expect(fs.readFileSync(path.join(root, 'docs', 'example.md'), 'utf8')).toBe('# Example\n');
  });

  it('rejects parent-directory traversal before preparing a temp file', () => {
    const root = tempRoot();
    const outsidePath = path.join(path.dirname(root), 'outside.txt');

    expect(() => prepareAtomicTextFileWrite(root, '../outside.txt', 'outside\n')).toThrow(
      'Refusing to write outside project: ../outside.txt'
    );

    expect(fs.existsSync(outsidePath)).toBe(false);
    expect(fs.readdirSync(root)).toEqual([]);
  });

  it('rejects absolute paths before preparing a temp file', () => {
    const root = tempRoot();
    const absoluteTarget = path.join(os.tmpdir(), `hadara-core-fs-outside-${process.pid}.txt`);
    fs.rmSync(absoluteTarget, { force: true });

    expect(() => prepareAtomicTextFileWrite(root, absoluteTarget, 'outside\n')).toThrow(
      `Refusing to write outside project: ${absoluteTarget}`
    );

    expect(fs.existsSync(absoluteTarget)).toBe(false);
    expect(fs.readdirSync(root)).toEqual([]);
  });

  it('allows prepared writes to be cleaned up without committing', () => {
    const root = tempRoot();
    const prepared = prepareAtomicTextFileWrite(root, 'docs/prepared.md', '# Prepared\n');

    expect(fs.existsSync(prepared.tempPath)).toBe(true);
    expect(fs.existsSync(prepared.targetPath)).toBe(false);

    cleanupPreparedAtomicTextFileWrite(prepared);

    expect(fs.existsSync(prepared.tempPath)).toBe(false);
    expect(fs.existsSync(prepared.targetPath)).toBe(false);
  });
});
