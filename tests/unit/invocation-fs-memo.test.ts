import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { withInvocationFsMemo } from '../../src/core/invocation-fs-memo';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-fs-memo-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('invocation fs memo', () => {
  it('reuses reads during one invocation and observes changes after the invocation ends', () => {
    const root = tempProject();
    const filePath = path.join(root, 'sample.txt');
    fs.writeFileSync(filePath, 'first', 'utf8');

    const values = withInvocationFsMemo(() => {
      const first = fs.readFileSync(filePath, 'utf8');
      fs.writeFileSync(filePath, 'second', 'utf8');
      const second = fs.readFileSync(filePath, 'utf8');
      return [first, second];
    });

    expect(values).toEqual(['first', 'first']);
    expect(fs.readFileSync(filePath, 'utf8')).toBe('second');
  });

  it('restores fs methods after callback errors', () => {
    const originalReadFileSync = fs.readFileSync;
    const root = tempProject();
    const filePath = path.join(root, 'sample.txt');
    fs.writeFileSync(filePath, 'content', 'utf8');

    expect(() => withInvocationFsMemo(() => {
      fs.readFileSync(filePath, 'utf8');
      throw new Error('expected');
    })).toThrow('expected');

    expect(fs.readFileSync).toBe(originalReadFileSync);
    expect(fs.readFileSync(filePath, 'utf8')).toBe('content');
  });
});
