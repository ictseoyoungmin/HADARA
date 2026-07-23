import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleReleaseArtifactCommand } from '../../tools/dev-surface-handlers';
import { resolveHadaraPaths } from '../../src/core/paths';
import { validateSchema } from '../../src/core/schema';
import { attachReleaseArtifactEvidence, readReleaseArtifactJournal, writeReleaseArtifactJournal } from '../../src/services/release-artifact-evidence';
import { createReleaseArtifactReport, ReleaseArtifactCommandRunner } from '../../src/services/release-artifact';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-artifact-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'dist', 'cli'), { recursive: true });
  fs.writeFileSync(path.join(root, 'dist', 'cli', 'main.js'), '#!/usr/bin/env node\nconsole.log("hadara");\n', 'utf8');
  fs.writeFileSync(path.join(root, 'dist', 'index.js'), 'module.exports = {};\n', 'utf8');
  fs.writeFileSync(path.join(root, 'README.md'), '# HADARA\n', 'utf8');
  fs.writeFileSync(path.join(root, 'LICENSE'), 'MIT\n', 'utf8');
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(
      {
        name: 'hadara',
        version: '0.0.0-bootstrap',
        private: true,
        license: 'MIT',
        bin: { hadara: './dist/cli/main.js' }
      },
      null,
      2
    ),
    'utf8'
  );
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('release artifact builder', () => {
  it('requires explicit execution before running npm pack', () => {
    const root = tempProject();
    const runner = vi.fn<ReleaseArtifactCommandRunner>();

    const report = createReleaseArtifactReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      runner
    });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual({
      severity: 'error',
      code: 'RELEASE_ARTIFACT_EXECUTION_REQUIRED',
      message: 'Release artifact building requires explicit --execute because it runs npm pack and writes artifacts.'
    });
    expect(runner).not.toHaveBeenCalled();
    expect(validateSchema('hadara.releaseArtifact.v1', report).ok).toBe(true);
  });

  it('creates tarball checksum and manifest metadata in an explicit output directory', () => {
    const root = tempProject();
    const output = path.join(root, 'dist-release');
    const runner: ReleaseArtifactCommandRunner = (_command, args, options) => {
      const stagedPackage = JSON.parse(fs.readFileSync(path.join(options.cwd, 'package.json'), 'utf8')) as {
        description?: string;
        keywords?: string[];
        repository?: { type?: string; url?: string };
        homepage?: string;
        bugs?: { url?: string };
      };
      const outputDir = String(args[args.indexOf('--pack-destination') + 1]);
      expect(options.env?.NPM_CONFIG_CACHE).toContain('hadara-release-artifact-npm-cache-');
      expect(options.env?.npm_config_cache).toBe(options.env?.NPM_CONFIG_CACHE);
      fs.writeFileSync(path.join(outputDir, 'hadara-0.0.0-bootstrap.tgz'), 'package bytes', 'utf8');
      expect(stagedPackage.description).not.toContain('bootstrap skeleton');
      expect(stagedPackage.description).toBe('Local-first evidence control plane for trustworthy agentic development, resumable task capsules, and release gates.');
      expect(stagedPackage.keywords).toContain('ai');
      expect(stagedPackage.keywords).toContain('coding-agent');
      expect(stagedPackage.keywords).toContain('hadara');
      expect(stagedPackage.repository).toEqual({ type: 'git', url: 'git+https://github.com/ictseoyoungmin/HADARA.git' });
      expect(stagedPackage.homepage).toBe('https://github.com/ictseoyoungmin/HADARA#readme');
      expect(stagedPackage.bugs).toEqual({ url: 'https://github.com/ictseoyoungmin/HADARA/issues' });
      return {
        status: 0,
        stdout: JSON.stringify([
          {
            filename: 'hadara-0.0.0-bootstrap.tgz',
            files: [
              { path: 'package.json', size: 240 },
              { path: 'README.md', size: 9 },
              { path: 'LICENSE', size: 4 },
              { path: 'dist/cli/main.js', size: 42 },
              { path: 'dist/index.js', size: 21 }
            ]
          }
        ]),
        stderr: '/private/path/raw npm notice',
        elapsedMs: 15
      };
    };

    const report = createReleaseArtifactReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      execute: true,
      output: 'dist-release',
      runner
    });
    const encoded = JSON.stringify(report);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.releaseArtifact.v1',
      command: 'release.artifact',
      ok: true,
      mode: 'execute',
      execution: {
        stagingCreated: true,
        npmPackExecuted: true,
        checksumGenerated: true,
        manifestGenerated: true,
        packageContentsVerified: true,
        publishExecuted: false,
        githubReleaseCreated: false,
        dockerImageBuilt: false
      },
      output: {
        kind: 'explicit',
        displayPath: './dist-release',
        relativePath: 'dist-release',
        pathRedacted: true,
        retention: 'explicit-output'
      },
      packageContents: {
        verified: true,
        fileCount: 5,
        forbiddenMatches: []
      },
      privacy: {
        rawLogsIncluded: false,
        packageContentsIncluded: false,
        privatePathsIncluded: false,
        environmentSecretsIncluded: false,
        privateStorePathsIncluded: false
      },
      issues: []
    });
    expect(report.artifacts.map((artifact) => artifact.kind)).toEqual(['tarball', 'checksum', 'manifest']);
    expect(report.artifacts.every((artifact) => artifact.hash?.startsWith('sha256:'))).toBe(true);
    expect(fs.existsSync(path.join(output, 'hadara-0.0.0-bootstrap.tgz'))).toBe(true);
    expect(fs.existsSync(path.join(output, 'hadara-0.0.0-bootstrap.tgz.sha256'))).toBe(true);
    expect(fs.existsSync(path.join(output, 'hadara-0.0.0-bootstrap.tgz.manifest.json'))).toBe(true);
    expect(encoded).not.toContain(root);
    expect(encoded).not.toContain('/private/path');
    expect(validateSchema('hadara.releaseArtifact.v1', report).ok).toBe(true);
  });

  it('recovers release artifact metadata when npm pack succeeds with empty stdout', () => {
    const root = tempProject();
    const runner: ReleaseArtifactCommandRunner = (_command, args) => {
      const outputDir = String(args[args.indexOf('--pack-destination') + 1]);
      fs.writeFileSync(path.join(outputDir, 'hadara-0.0.0-bootstrap.tgz'), 'package bytes', 'utf8');
      return {
        status: 0,
        stdout: '',
        stderr: '',
        elapsedMs: 15
      };
    };

    const report = createReleaseArtifactReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      execute: true,
      output: 'dist-release',
      runner
    });

    expect(report.ok).toBe(true);
    expect(report.packageContents).toMatchObject({
      verified: true,
      fileCount: 5,
      forbiddenMatches: []
    });
    expect(report.artifacts.map((artifact) => artifact.kind)).toEqual(['tarball', 'checksum', 'manifest']);
    expect(validateSchema('hadara.releaseArtifact.v1', report).ok).toBe(true);
  });

  it('refuses to build release artifacts from a dirty git worktree', () => {
    const root = tempProject();
    spawnSync('git', ['init'], { cwd: root, encoding: 'utf8' });
    fs.writeFileSync(path.join(root, 'dirty.txt'), 'dirty\n', 'utf8');
    const runner = vi.fn<ReleaseArtifactCommandRunner>();

    const report = createReleaseArtifactReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      execute: true,
      output: 'dist-release',
      runner
    });

    expect(report.ok).toBe(false);
    expect(runner).not.toHaveBeenCalled();
    expect(report.issues).toContainEqual({
      severity: 'error',
      code: 'RELEASE_ARTIFACT_WORKTREE_DIRTY',
      message: 'Release artifact builder requires a clean git worktree so git commit metadata describes the artifact contents.'
    });
    expect(validateSchema('hadara.releaseArtifact.v1', report).ok).toBe(true);
  });

  it('fail-closes attach evidence when source and evidence roots share a clean git worktree', () => {
    const root = tempProject();
    initCleanGit(root);
    const runner = vi.fn<ReleaseArtifactCommandRunner>();

    const report = createReleaseArtifactReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      execute: true,
      output: 'dist-release',
      attachEvidence: true,
      runner
    });

    expect(report.ok).toBe(false);
    expect(runner).not.toHaveBeenCalled();
    expect(report.selfInvalidationRisk).toMatchObject({
      cleanRequired: true,
      attachEvidenceRequested: true,
      sourceEqualsEvidence: true,
      failClosed: true
    });
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'RELEASE_ARTIFACT_SELF_INVALIDATION_RISK' }));
    expect(validateSchema('hadara.releaseArtifact.v1', report).ok).toBe(true);
  });

  it('attaches release artifact evidence to a separate evidence root without dirtying the clean source root', () => {
    const sourceRoot = tempProject();
    const evidenceRoot = tempProject();
    initCleanGit(sourceRoot);
    const task = createTaskCapsule(evidenceRoot, 'Release artifact evidence');
    const outputRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-artifact-output-'));
    roots.push(outputRoot);
    const report = createReleaseArtifactReport({
      paths: resolveHadaraPaths({ projectRoot: sourceRoot }),
      execute: true,
      output: outputRoot,
      evidenceRoot,
      attachEvidence: true,
      runner: successfulPackRunner()
    });

    const journalPath = path.join(os.tmpdir(), `hadara-release-artifact-journal-${Date.now()}.json`);
    writeReleaseArtifactJournal({ journalPath, report });
    roots.push(journalPath);
    const fromJournal = readReleaseArtifactJournal(journalPath);
    const attached = attachReleaseArtifactEvidence({
      projectRoot: evidenceRoot,
      taskId: task.id,
      summary: 'release artifact journal attach',
      report: fromJournal
    });

    expect(report.ok).toBe(true);
    expect(fromJournal).toMatchObject({ schemaVersion: 'hadara.releaseArtifact.v1', ok: true });
    expect(attached.evidence.taskId).toBe(task.id);
    expect(spawnSync('git', ['status', '--porcelain=v1'], { cwd: sourceRoot, encoding: 'utf8' }).stdout.trim()).toBe('');
  });

  it('fails package content verification when npm pack reports a file outside the whitelist', () => {
    const root = tempProject();
    const runner: ReleaseArtifactCommandRunner = (_command, args) => {
      const outputDir = String(args[args.indexOf('--pack-destination') + 1]);
      fs.writeFileSync(path.join(outputDir, 'hadara-0.0.0-bootstrap.tgz'), 'package bytes', 'utf8');
      return {
        status: 0,
        stdout: JSON.stringify([
          {
            filename: 'hadara-0.0.0-bootstrap.tgz',
            files: [
              { path: 'package.json', size: 240 },
              { path: 'README.md', size: 9 },
              { path: 'LICENSE', size: 4 },
              { path: 'dist/cli/main.js', size: 42 },
              { path: 'tasks/T-0001/EVIDENCE.md', size: 99 }
            ]
          }
        ]),
        stderr: '',
        elapsedMs: 15
      };
    };

    const report = createReleaseArtifactReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      execute: true,
      runner
    });

    expect(report.ok).toBe(false);
    expect(report.packageContents).toMatchObject({
      verified: false,
      forbiddenMatches: ['tasks/T-0001/EVIDENCE.md']
    });
    expect(report.issues).toContainEqual({
      severity: 'error',
      code: 'RELEASE_ARTIFACT_FORBIDDEN_FILE_INCLUDED',
      message: 'Release artifact package includes file outside the whitelist: tasks/T-0001/EVIDENCE.md.',
      stepId: 'verify-contents'
    });
    expect(validateSchema('hadara.releaseArtifact.v1', report).ok).toBe(true);
  });

  it('prints JSON through the release artifact CLI handler', () => {
    const root = tempProject();
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handleReleaseArtifactCommand({
      args: ['release', 'artifact', '--json'],
      paths: resolveHadaraPaths({ projectRoot: root }),
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const report = JSON.parse(spy.mock.calls[0]?.[0] ?? '{}');
    expect(report).toMatchObject({
      schemaVersion: 'hadara.releaseArtifact.v1',
      command: 'release.artifact',
      ok: false
    });
    expect(validateSchema('hadara.releaseArtifact.v1', report).ok).toBe(true);
  });

  it('attaches reduced release artifact reports as public evidence artifacts', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Release artifact evidence');
    const report = createReleaseArtifactReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      execute: true,
      output: 'dist-release',
      runner: (_command, args) => {
        const outputDir = String(args[args.indexOf('--pack-destination') + 1]);
        fs.writeFileSync(path.join(outputDir, 'hadara-0.0.0-bootstrap.tgz'), 'package bytes', 'utf8');
        return {
          status: 0,
          stdout: JSON.stringify([
            {
              filename: 'hadara-0.0.0-bootstrap.tgz',
              files: [
                { path: 'package.json', size: 240 },
                { path: 'README.md', size: 9 },
                { path: 'LICENSE', size: 4 },
                { path: 'dist/cli/main.js', size: 42 }
              ]
            }
          ]),
          stderr: '',
          elapsedMs: 10
        };
      }
    });

    const attached = attachReleaseArtifactEvidence({
      projectRoot: root,
      taskId: task.id,
      summary: 'hadara release artifact --execute --attach-evidence artifacts/release-artifact hadara.releaseArtifact.v1',
      report
    });

    const evidencePath = attached.evidence.schemaVersion === 'hadara.evidence.v2' ? attached.evidence.legacy.evidencePath : attached.evidence.evidencePath;
    const artifactPath = path.join(task.dir, evidencePath ?? '');
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    expect(attached.evidence).toMatchObject({
      schemaVersion: 'hadara.evidence.v2',
      taskId: task.id,
      legacy: { result: 'passed' },
      visibility: 'public'
    });
    expect(evidencePath).toContain('artifacts/release-artifact/');
    expect(artifact).toMatchObject({
      schemaVersion: 'hadara.releaseArtifact.v1',
      ok: true,
      evidence: {
        taskId: task.id
      }
    });
    expect(validateSchema('hadara.releaseArtifact.v1', artifact).ok).toBe(true);
  });
});

function successfulPackRunner(): ReleaseArtifactCommandRunner {
  return (_command, args) => {
    const outputDir = String(args[args.indexOf('--pack-destination') + 1]);
    fs.writeFileSync(path.join(outputDir, 'hadara-0.0.0-bootstrap.tgz'), 'package bytes', 'utf8');
    return {
      status: 0,
      stdout: JSON.stringify([
        {
          filename: 'hadara-0.0.0-bootstrap.tgz',
          files: [
            { path: 'package.json', size: 240 },
            { path: 'README.md', size: 9 },
            { path: 'LICENSE', size: 4 },
            { path: 'dist/cli/main.js', size: 42 }
          ]
        }
      ]),
      stderr: '',
      elapsedMs: 10
    };
  };
}

function initCleanGit(root: string): void {
  spawnSync('git', ['init', '--quiet'], { cwd: root, encoding: 'utf8' });
  spawnSync('git', ['config', 'user.email', 'fixture@example.com'], { cwd: root, encoding: 'utf8' });
  spawnSync('git', ['config', 'user.name', 'Fixture'], { cwd: root, encoding: 'utf8' });
  spawnSync('git', ['add', '.'], { cwd: root, encoding: 'utf8' });
  spawnSync('git', ['commit', '--quiet', '-m', 'fixture'], { cwd: root, encoding: 'utf8' });
}
