import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parseRunMaxSteps, readFakeShellFixtures, readScriptedProviderSteps } from '../../src/cli/main';
import { WorkspaceFileError } from '../../src/core/workspace';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-run-cli-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('run CLI input validation', () => {
  it('accepts maxSteps within the bounded deterministic harness range', () => {
    expect(parseRunMaxSteps('1')).toBe(1);
    expect(parseRunMaxSteps('32')).toBe(32);
  });

  it('rejects invalid maxSteps values', () => {
    for (const value of ['NaN', '-1', '0', '33', '999999', '1.5']) {
      expect(() => parseRunMaxSteps(value)).toThrow(/integer from 1 to 32/);
    }
  });

  it('rejects run --script paths outside the workspace', () => {
    const parent = tempProject();
    const root = path.join(parent, 'repo');
    fs.mkdirSync(root);
    fs.writeFileSync(path.join(parent, 'script.json'), '[]', 'utf8');

    expect(() => readScriptedProviderSteps(root, '../script.json')).toThrow(WorkspaceFileError);
  });

  it('rejects run --fake-shell-fixtures symlink escapes outside the workspace', () => {
    const parent = tempProject();
    const root = path.join(parent, 'repo');
    const outside = path.join(parent, 'outside');
    fs.mkdirSync(root);
    fs.mkdirSync(outside);
    fs.writeFileSync(path.join(outside, 'fixtures.json'), '{}', 'utf8');
    fs.symlinkSync(outside, path.join(root, 'linked-outside'), 'dir');

    expect(() => readFakeShellFixtures(root, 'linked-outside/fixtures.json')).toThrow(WorkspaceFileError);
  });
});
