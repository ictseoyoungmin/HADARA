import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { createDevDockerCheckReport, type DevDockerCommandRunner } from '../../src/dev/docker-check';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-dev-docker-check-'));
  roots.push(root);
  fs.writeFileSync(path.join(root, 'package.json'), '{"name":"fixture"}\n', 'utf8');
  fs.writeFileSync(path.join(root, 'package-lock.json'), '{"lockfileVersion":3}\n', 'utf8');
  fs.mkdirSync(path.join(root, 'dist', 'cli'), { recursive: true });
  fs.writeFileSync(path.join(root, 'dist', 'cli', 'main.js'), 'old\n', 'utf8');
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('dev docker-check report', () => {
  it('runs focused Docker validation with explicit dist sync and redacted output', () => {
    const root = tempProject();
    const runner = fakeRunner(root);
    const beforeHash = hashDist(root);

    const report = createDevDockerCheckReport(root, {
      focusedTests: ['tests/unit/schema-runtime.test.ts', 'tests/unit/dev-docker-check.test.ts'],
      syncDist: true,
      distBeforeHash: beforeHash,
      workspace: '/workspace',
      tmpWorkdir: '/tmp/hadara-dev-check-test'
    }, runner);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.dev.docker_check.v1',
      command: 'dev.dockerCheck',
      ok: true,
      mode: 'focused',
      execution: {
        subprocessExecuted: true,
        dockerUsed: true,
        projectMutation: false,
        projectSourceMutation: false,
        outputMutation: true,
        tempWorkspaceCreated: true,
        npmCiExecuted: true,
        focusedTestsExecuted: true,
        fullCheckExecuted: false,
        distSyncExecuted: true
      },
      source: { projectRootRedacted: true },
      workspace: { kind: 'temp-copy', pathRedacted: true, retention: 'kept-temporary', runScoped: true },
      privacy: { rawLogsIncluded: false, privatePathsIncluded: false, environmentSecretsIncluded: false },
      issues: []
    });
    expect(report.focusedTests).toEqual(['tests/unit/schema-runtime.test.ts', 'tests/unit/dev-docker-check.test.ts']);
    expect(report.distSync?.requested).toBe(true);
    expect(report.distSync?.executed).toBe(true);
    expect(report.distSync?.conflictDetected).toBe(false);
    expect(report.distSync?.beforeHashAvailable).toBe(true);
    expect(report.distSync?.outputChanged).toBe(true);
    expect(report.distSync?.requiresBeforeHash).toBe(true);
    expect(report.distSync?.reviewedBeforeHash).toBe(beforeHash);
    expect(report.distSync?.beforeHashMatched).toBe(true);
    expect(report.distSync?.allowMissingBeforeHash).toBe(false);
    expect(report.distSync?.beforeHash).not.toBe(report.distSync?.afterHash);
    expect(report.evidenceSummary.suggestedEvidenceCommand).toContain('hadara evidence add-command');
    expect(JSON.stringify(report)).not.toContain(root);
    expect(validateSchema('hadara.dev.docker_check.v1', report).ok).toBe(true);
  });

  it('accepts explicit actor context for dev docker-check reports', () => {
    const root = tempProject();

    const report = createDevDockerCheckReport(root, {
      focusedTests: ['tests/unit/dev-docker-check.test.ts'],
      workspace: '/workspace',
      tmpWorkdir: '/tmp/hadara-dev-check-test',
      actor: { agentId: 'worker-docker', runId: 'run-docker', role: 'worker', parentRunId: 'coord-docker' }
    }, fakeRunner(root));

    expect(report.actor).toEqual({ agentId: 'worker-docker', runId: 'run-docker', role: 'worker', parentRunId: 'coord-docker' });
    expect(validateSchema('hadara.dev.docker_check.v1', report).ok).toBe(true);
  });

  it('runs full check without dist sync by default', () => {
    const root = tempProject();
    const report = createDevDockerCheckReport(root, { workspace: '/workspace', tmpWorkdir: '/tmp/hadara-dev-check-test' }, fakeRunner(root));

    expect(report.ok).toBe(true);
    expect(report.mode).toBe('full');
    expect(report.execution.fullCheckExecuted).toBe(true);
    expect(report.execution.focusedTestsExecuted).toBe(false);
    expect(report.execution.distSyncExecuted).toBe(false);
    expect(report.execution.outputMutation).toBe(false);
    expect(report.distSync).toMatchObject({ requested: false, executed: false, conflictDetected: false, beforeHashAvailable: false, outputChanged: false, requiresBeforeHash: false, allowMissingBeforeHash: false });
    expect(validateSchema('hadara.dev.docker_check.v1', report).ok).toBe(true);
  });

  it('blocks dist sync when no reviewed before-hash is supplied', () => {
    const root = tempProject();

    const report = createDevDockerCheckReport(root, {
      focusedTests: ['tests/unit/dev-docker-check.test.ts'],
      syncDist: true,
      workspace: '/workspace',
      tmpWorkdir: '/tmp/hadara-dev-check-test'
    }, fakeRunner(root));

    expect(report.ok).toBe(false);
    expect(report.execution.outputMutation).toBe(false);
    expect(report.execution.distSyncExecuted).toBe(false);
    expect(report.distSync).toMatchObject({
      requested: true,
      executed: false,
      conflictDetected: true,
      beforeHashAvailable: true,
      outputChanged: false,
      requiresBeforeHash: true,
      allowMissingBeforeHash: false
    });
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'HADARA_DIST_SYNC_BEFORE_HASH_REQUIRED' }));
    expect(validateSchema('hadara.dev.docker_check.v1', report).ok).toBe(true);
  });

  it('blocks dist sync when the reviewed before-hash is stale', () => {
    const root = tempProject();

    const report = createDevDockerCheckReport(root, {
      focusedTests: ['tests/unit/dev-docker-check.test.ts'],
      syncDist: true,
      distBeforeHash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000',
      workspace: '/workspace',
      tmpWorkdir: '/tmp/hadara-dev-check-test'
    }, fakeRunner(root));

    expect(report.ok).toBe(false);
    expect(report.execution.outputMutation).toBe(false);
    expect(report.distSync).toMatchObject({
      requested: true,
      executed: false,
      conflictDetected: true,
      beforeHashAvailable: true,
      outputChanged: false,
      requiresBeforeHash: true,
      beforeHashMatched: false,
      allowMissingBeforeHash: false
    });
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'HADARA_DIST_SYNC_BEFORE_HASH_MISMATCH' }));
    expect(validateSchema('hadara.dev.docker_check.v1', report).ok).toBe(true);
  });

  it('allows first-time dist sync only with an explicit missing-before-hash escape hatch', () => {
    const root = tempProject();
    fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });

    const report = createDevDockerCheckReport(root, {
      focusedTests: ['tests/unit/dev-docker-check.test.ts'],
      syncDist: true,
      allowMissingBeforeHash: true,
      workspace: '/workspace',
      tmpWorkdir: '/tmp/hadara-dev-check-test'
    }, fakeRunner(root));

    expect(report.ok).toBe(true);
    expect(report.execution.outputMutation).toBe(true);
    expect(report.distSync).toMatchObject({
      requested: true,
      executed: true,
      conflictDetected: false,
      beforeHashAvailable: false,
      outputChanged: true,
      requiresBeforeHash: true,
      allowMissingBeforeHash: true
    });
    expect(validateSchema('hadara.dev.docker_check.v1', report).ok).toBe(true);
  });

  it('omits raw subprocess logs when a Docker step fails', () => {
    const root = tempProject();
    const runner = fakeRunner(root, 'focused-tests');

    const report = createDevDockerCheckReport(root, { focusedTests: ['tests/unit/schema-runtime.test.ts'], workspace: '/workspace', tmpWorkdir: '/tmp/hadara-dev-check-test' }, runner);

    expect(report.ok).toBe(false);
    expect(report.steps.find((step) => step.id === 'focused-tests')?.status).toBe('failed');
    expect(report.steps.find((step) => step.id === 'dist-sync')?.status).toBe('skipped');
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'DEV_DOCKER_CHECK_STEP_FAILED', stepId: 'focused-tests' }));
    expect(JSON.stringify(report)).not.toContain('npm error');
    expect(validateSchema('hadara.dev.docker_check.v1', report).ok).toBe(true);
  });
});

function fakeRunner(root: string, failStep?: string): DevDockerCommandRunner {
  return {
    run(_command, args) {
      const script = args.at(-1) ?? '';
      const stepId = classifyScript(script);
      if (stepId === failStep) return { ok: false, exitCode: 1 };
      if (stepId === 'dist-sync') {
        fs.mkdirSync(path.join(root, 'dist', 'cli'), { recursive: true });
        fs.writeFileSync(path.join(root, 'dist', 'cli', 'main.js'), 'new\n', 'utf8');
      }
      return { ok: true, exitCode: 0 };
    }
  };
}

function classifyScript(script: string): string {
  if (script.includes('tar --exclude=.git')) return 'temp-workspace';
  if (script.includes('npm ci')) return 'npm-ci';
  if (script.includes('npm run test:focused')) return 'focused-tests';
  if (script.includes('npm run check')) return 'full-check';
  if (script.includes('npm run build')) return 'dist-build';
  if (script.includes('cp -R')) return 'dist-sync';
  return 'unknown';
}

function hashDist(root: string): string {
  const content = fs.readFileSync(path.join(root, 'dist', 'cli', 'main.js'), 'utf8');
  return `sha256:${crypto.createHash('sha256').update(content, 'utf8').digest('hex')}`;
}
