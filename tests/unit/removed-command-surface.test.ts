import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleEvidenceCommand } from '../../src/cli/evidence';
import { handleHandoffCommand } from '../../src/cli/handoff';
import { handleHarnessCommand } from '../../src/cli/harness';
import { handleInitCommand } from '../../src/cli/init';
import { handlePackageCommand } from '../../src/cli/package-smoke';
import { handlePolicyCommand } from '../../src/cli/policy';
import { handleRunCommand } from '../../src/cli/run';
import { handleRunStateCommand } from '../../src/cli/run-state';
import { handleDocsCommand } from '../../src/cli/docs';
import { handleStatusCommand, handleOpsCommand } from '../../src/cli/status';
import { handleTaskCommand } from '../../src/cli/task';
import { handleWriteCommand } from '../../src/cli/write-preflight';
import { resolveHadaraPaths } from '../../src/core/paths';
import { validateSchema } from '../../src/core/schema';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-removed-command-surface-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

async function captureJson(run: () => boolean | Promise<boolean>): Promise<Record<string, unknown>> {
  const output: string[] = [];
  const spy = vi.spyOn(console, 'log').mockImplementation((value?: unknown) => {
    output.push(String(value));
  });
  try {
    expect(await run()).toBe(true);
  } finally {
    spy.mockRestore();
  }
  const payload = JSON.parse(output.join('\n')) as Record<string, unknown>;
  expect(validateSchema('hadara.commandRemoved.v1', payload).ok).toBe(true);
  expect(payload).toMatchObject({
    schemaVersion: 'hadara.commandRemoved.v1',
    ok: false,
    code: 'COMMAND_SURFACE_REMOVED'
  });
  expect(process.exitCode).toBe(6);
  process.exitCode = undefined;
  return payload;
}

describe('removed compatibility command surfaces', () => {
  it('redirects obsolete task/evidence/handoff/policy/write/status commands with replacementCommand', async () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Removed command route');
    const cases: Array<{ command: string; replacement: string; run: () => boolean | Promise<boolean> }> = [
      {
        command: 'task.show',
        replacement: 'hadara task status --task <task-id> --json',
        run: () => handleTaskCommand({ args: ['task', 'show', task.id, '--json'], projectRoot: root, jsonOutput: true })
      },
      {
        command: 'task.next',
        replacement: 'hadara task status --json',
        run: () => handleTaskCommand({ args: ['task', 'next', '--json'], projectRoot: root, jsonOutput: true })
      },
      {
        command: 'task.upgrade-scaffold',
        replacement: 'hadara protocol remediate --fix <fix-id> --task <task-id> --json',
        run: () => handleTaskCommand({ args: ['task', 'upgrade-scaffold', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })
      },
      {
        command: 'init.register-doc',
        replacement: 'hadara docs register --path <path> --json',
        run: () => handleInitCommand({ args: ['init', 'register-doc', '--path', 'docs/EXAMPLE.md', '--json'], projectRoot: root, jsonOutput: true })
      },
      {
        command: 'docs.archive',
        replacement: 'hadara docs list --status <status> --json',
        run: () => handleDocsCommand({ args: ['docs', 'archive', '--status', 'historical', '--json'], projectRoot: root, jsonOutput: true })
      },
      {
        command: 'evidence.collect',
        replacement: 'hadara evidence add-command --task <task-id> --summary "..." --result passed --json',
        run: () => handleEvidenceCommand({ args: ['evidence', 'collect', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })
      },
      {
        command: 'handoff.suggest',
        replacement: 'hadara task status --task <task-id> --json',
        run: () => handleHandoffCommand({ args: ['handoff', 'suggest', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })
      },
      {
        command: 'handoff.stale-problems',
        replacement: 'hadara state verify --json',
        run: () => handleHandoffCommand({ args: ['handoff', 'stale-problems', '--json'], projectRoot: root, jsonOutput: true })
      },
      {
        command: 'write.preflight',
        replacement: 'hadara policy preflight-shell <command> --json',
        run: () => handleWriteCommand({ args: ['write', 'preflight', 'task', 'create', 'Example', '--json'], projectRoot: root, jsonOutput: true })
      },
      {
        command: 'policy.check-shell',
        replacement: 'hadara policy preflight-shell <command> --json',
        run: () => handlePolicyCommand({ args: ['policy', 'check-shell', 'npm test', '--json'], jsonOutput: true })
      },
      {
        command: 'ops.status',
        replacement: 'hadara status --json',
        run: () => handleOpsCommand({ args: ['ops', 'status', '--json'], projectRoot: root, jsonOutput: true })
      },
      {
        command: 'harness.replay',
        replacement: 'hadara validation run --task <task-id> --check <name> -- <command>',
        run: () => handleHarnessCommand({ args: ['harness', 'replay', 'scenario.jsonl', '--json'], projectRoot: root, jsonOutput: true })
      },
      {
        command: 'run-state.show',
        replacement: 'hadara status --json',
        run: () => handleRunStateCommand({ args: ['run-state', 'show', '--json'], projectRoot: root, jsonOutput: true })
      },
      {
        command: 'run.scaffold',
        replacement: 'hadara validation run --task <task-id> --check <name> -- <command>',
        run: () => handleRunCommand({ args: ['run', 'scaffold', '--task', task.id, '--command', 'npm test', '--json'], projectRoot: root, jsonOutput: true })
      },
      {
        command: 'package.smoke',
        replacement: 'hadara smoke package [--dry-run|--execute] [--from <tarball|dir>] --json',
        run: () => handlePackageCommand({ args: ['package', 'smoke', '--dry-run', '--json'], paths: resolveHadaraPaths({ projectRoot: root }), jsonOutput: true })
      }
    ];

    for (const item of cases) {
      const payload = await captureJson(item.run);
      expect(payload).toMatchObject({ command: item.command, replacementCommand: item.replacement });
    }

    const statusOutput: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((value?: unknown) => {
      statusOutput.push(String(value));
    });
    expect(handleStatusCommand({ args: ['status', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    expect(JSON.parse(statusOutput.join('\n'))).toMatchObject({ schemaVersion: 'hadara.ops.status.v1', command: 'ops.status' });
  });
});
