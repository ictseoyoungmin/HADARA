import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleDevCommand } from '../../src/cli/dev';
import { handleDocsCommand } from '../../src/cli/docs';
import { handleHarnessCommand } from '../../src/cli/harness';
import { handlePackageCommand } from '../../src/cli/package-smoke';
import { handleSmokeCommand } from '../../src/cli/smoke';
import { handleReleaseArtifactCommand } from '../../src/cli/release-artifact';
import { handleReleaseCloseoutCommand } from '../../src/cli/release-closeout';
import { handleReleaseDryRunCommand } from '../../src/cli/release-dry-run';
import { handleReleaseGateCommand } from '../../src/cli/release-gate';
import { handleReleasePublishCommand } from '../../src/cli/release-publish';
import { handleSessionCommand } from '../../src/cli/session';
import { handleSliceCommand } from '../../src/cli/slice';
import { handleTaskCommand } from '../../src/cli/task';
import { handleValidationCommand } from '../../src/cli/validation';
import { resolveHadaraPaths } from '../../src/core/paths';

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

    expect(handleTaskCommand({ args: ['task', 'create', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('task.create');
    expect(latestOutput()).not.toContain('task create requires a title');

    expect(handleSliceCommand({ args: ['slice', 'add', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('slice.add');

    expect(await handleHarnessCommand({ args: ['harness', 'validate', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('harness.validate');

    expect(handleSessionCommand({ args: ['session', 'start', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('session.start');
    expect(process.exitCode).toBeUndefined();
  });

  it('prints docs mutation help before required-argument validation', () => {
    const root = tempProject();

    for (const subcommand of ['add', 'update', 'archive', 'supersede', 'unregister', 'render']) {
      expect(handleDocsCommand({ args: ['docs', subcommand, '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
      expect(latestOutput()).toContain(`docs.${subcommand}`);
    }
    expect(process.exitCode).toBeUndefined();
  });

  it('prints help before package, release, and dev command reports execute or validate arguments', () => {
    const root = tempProject();
    const paths = resolveHadaraPaths({ projectRoot: root });

    expect(handleSmokeCommand({ args: ['smoke', 'package', '--help'], paths, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('smoke.package');

    expect(handlePackageCommand({ args: ['package', 'recycle', '--help'], paths, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('package.recycle');

    expect(handleDevCommand({ args: ['dev', 'docker-check', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('dev.docker-check');

    expect(handleReleaseDryRunCommand({ args: ['release', 'dry-run', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('release.dry-run');

    expect(handleReleaseCloseoutCommand({ args: ['release', 'closeout', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('release.closeout');

    expect(handleReleasePublishCommand({ args: ['release', 'publish', '--execute', '--help'], paths, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('release.publish');

    expect(handleReleaseArtifactCommand({ args: ['release', 'artifact', '--execute', '--attach-evidence', '--help'], paths, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('release.artifact');

    expect(handleReleaseGateCommand({ args: ['release', 'gate', '--mode', 'definitely-invalid', '--help'], projectRoot: root, jsonOutput: false })).toBe(true);
    expect(latestOutput()).toContain('release.gate');
    expect(process.exitCode).toBeUndefined();
  });
});
