import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleHarnessCommand } from '../../src/cli/harness';
import { main } from '../../src/cli/main';
import { handlePackageCommand } from '../../src/cli/package-smoke';
import { handlePolicyCommand } from '../../src/cli/policy';
import { handleTaskCommand } from '../../src/cli/task';
import { resolveHadaraPaths } from '../../src/core/paths';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-legacy-command-routing-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

describe('legacy command routing', () => {
  it('does not handle retired task lifecycle subcommands', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Retired task routes');
    const subcommands = ['finish', 'ready', 'close', 'audit-close', 'complete', 'lifecycle'];

    for (const sub of subcommands) {
      expect(handleTaskCommand({ args: ['task', sub, '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(false);
    }
  });

  it('does not handle retired family subcommands', async () => {
    const root = tempProject();

    expect(handlePolicyCommand({ args: ['policy', 'check-shell', 'npm test', '--json'], jsonOutput: true })).toBe(false);
    expect(await handleHarnessCommand({ args: ['harness', 'replay', 'scenario.jsonl', '--json'], projectRoot: root, jsonOutput: true })).toBe(false);
    expect(handlePackageCommand({ args: ['package', 'smoke', '--dry-run', '--json'], paths: resolveHadaraPaths({ projectRoot: root }), jsonOutput: true })).toBe(false);
  });

  it('falls through to ordinary default help for retired top-level surfaces', async () => {
    const root = tempProject();
    const output: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((value?: unknown) => {
      output.push(String(value));
    });

    for (const args of [
      ['handoff', 'suggest', '--json'],
      ['write', 'preflight', 'task', 'create', 'Example', '--json'],
      ['run', '--json'],
      ['run', 'scaffold', '--json'],
      ['run-state', 'show', '--json'],
      ['run-state', 'resume', '--json']
    ]) {
      output.length = 0;
      process.exitCode = undefined;
      await main([...args, '--project', root]);
      expect(process.exitCode).toBe(1);
      expect(output.join('\n')).toContain('HADARA - project-local operating layer');
      expect(output.join('\n')).not.toContain('hadara.commandRemoved.v1');
    }
  });
});
