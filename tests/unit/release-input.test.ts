import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { computeReleaseInputHash, inspectReleaseInputInventory } from '../../tools/dev-surface/release-input';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('release input inventory', () => {
  it('includes distributed metadata and fails closed for relevant untracked or ignored inputs', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-input-'));
    roots.push(root);
    fs.mkdirSync(path.join(root, 'src'), { recursive: true });
    fs.mkdirSync(path.join(root, 'tools'), { recursive: true });
    fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
    for (const file of ['package.json', 'package-lock.json', 'tsconfig.json', 'tsconfig.tools.json', 'vitest.config.ts', 'vitest.dev.config.ts', 'README.md', 'LICENSE']) {
      fs.writeFileSync(path.join(root, file), file, 'utf8');
    }
    fs.writeFileSync(path.join(root, 'src', 'tracked.ts'), 'export {}\n', 'utf8');
    fs.writeFileSync(path.join(root, 'tools', 'tracked.ts'), 'export {}\n', 'utf8');
    fs.writeFileSync(path.join(root, 'scripts', 'tracked.sh'), '#!/usr/bin/env bash\n', 'utf8');
    execFileSync('git', ['init', '-q'], { cwd: root });
    execFileSync('git', ['config', 'user.email', 'fixture@example.test'], { cwd: root });
    execFileSync('git', ['config', 'user.name', 'fixture'], { cwd: root });
    execFileSync('git', ['add', '.'], { cwd: root });
    execFileSync('git', ['commit', '-qm', 'fixture'], { cwd: root });

    const inventory = inspectReleaseInputInventory(root);
    expect(inventory.files).toEqual(expect.arrayContaining(['package.json', 'README.md', 'LICENSE', 'src/tracked.ts']));
    expect(computeReleaseInputHash(root)).toMatch(/^sha256:[a-f0-9]{64}$/);

    fs.writeFileSync(path.join(root, 'src', 'untracked.ts'), 'export {}\n', 'utf8');
    expect(inspectReleaseInputInventory(root).relevantUntrackedFiles).toContain('src/untracked.ts');
    expect(computeReleaseInputHash(root)).toBeUndefined();

    fs.rmSync(path.join(root, 'src', 'untracked.ts'));
    fs.writeFileSync(path.join(root, '.gitignore'), 'tools/generated.ts\n', 'utf8');
    fs.writeFileSync(path.join(root, 'tools', 'generated.ts'), 'export {}\n', 'utf8');
    expect(inspectReleaseInputInventory(root).relevantUntrackedFiles).toContain('tools/generated.ts');
    expect(computeReleaseInputHash(root)).toBeUndefined();
  });
});
