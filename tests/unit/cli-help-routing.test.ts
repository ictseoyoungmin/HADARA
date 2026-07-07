import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleHarnessCommand } from '../../src/cli/harness';
import { handleSessionCommand } from '../../src/cli/session';
import { handleSliceCommand } from '../../src/cli/slice';
import { handleTaskCommand } from '../../src/cli/task';
import { handleValidationCommand } from '../../src/cli/validation';

const roots: string[] = [];
let logSpy: ReturnType<typeof vi.spyOn>;

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-help-routing-'));
  roots.push(root);
  return root;
}

function latestOutput(): string {
  return String(logSpy.mock.calls.at(-1)?.[0] ?? '');
}

beforeEach(() => {
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  process.exitCode = undefined;
});

afterEach(() => {
  logSpy.mockRestore();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('command-level help routing', () => {
  it('prints help before required-argument validation for representative commands', async () => {
    const root = tempProject();

    expect(handleValidationCommand({ args: ['validation', 'run', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('validation.run');

    expect(handleTaskCommand({ args: ['task', 'finalize', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('task.finalize');

    expect(handleSliceCommand({ args: ['slice', 'add', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('slice.add');

    expect(await handleHarnessCommand({ args: ['harness', 'validate', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('harness.validate');

    expect(handleSessionCommand({ args: ['session', 'start', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('session.start');
    expect(process.exitCode).toBeUndefined();
  });
});
