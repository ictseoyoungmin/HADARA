import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { appendEvidenceTextArtifact } from '../../src/evidence/evidence';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createReleaseCurrentStateReport } from '../../tools/dev-surface/release-current-state';
import { computeReleaseInputHash } from '../../tools/dev-surface/release-input';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('release current-state projection', () => {
  it('derives public facts from byte-bound typed evidence and ignores legacy lifecycle claims', () => {
    const root = fixtureProject();
    attachReleaseFacts(root);

    const report = createReleaseCurrentStateReport(root);

    expect(report.ok).toBe(true);
    expect(report.mode).toBe('dry-run');
    expect(report.readOnly).toBe(true);
    expect(report.writes).toEqual([]);
    expect(report.facts).toEqual({
      sourceVersion: '0.5.0-rc.6',
      publishedPrerelease: '0.5.0-rc.5',
      npmNext: '0.5.0-rc.5',
      npmLatest: '0.4.6',
      githubPrerelease: 'v0.5.0-rc.5',
      publicTerminalLifecycle: 'pending command-generated acceptance',
      stablePromotion: 'blocked pending public terminal lifecycle'
    });
    expect(report.sources.map((source) => source.schemaVersion)).toEqual([
      'hadara.releaseOperatorPublication.v1',
      'hadara.releasePublicVerification.v1'
    ]);
    expect(validateSchema('hadara.releaseCurrentStateProjection.v1', report).ok).toBe(true);
  });

  it('requires a fresh before hash and replaces exactly one managed block', () => {
    const root = fixtureProject();
    attachReleaseFacts(root);
    const readinessPath = path.join(root, 'docs', 'RELEASE_READINESS.md');
    const dryRun = createReleaseCurrentStateReport(root);
    fs.appendFileSync(readinessPath, '\nConcurrent human edit.\n', 'utf8');

    const refused = createReleaseCurrentStateReport(root, { execute: true, beforeHash: dryRun.beforeHash });

    expect(refused.ok).toBe(false);
    expect(refused.writes).toEqual([]);
    expect(refused.issues).toContainEqual(expect.objectContaining({ code: 'RELEASE_CURRENT_BEFORE_HASH_MISMATCH' }));
    expect(fs.readFileSync(readinessPath, 'utf8')).toContain('Concurrent human edit.');

    const reviewed = createReleaseCurrentStateReport(root);
    const applied = createReleaseCurrentStateReport(root, { execute: true, beforeHash: reviewed.beforeHash });
    const content = fs.readFileSync(readinessPath, 'utf8');
    expect(applied.ok).toBe(true);
    expect(applied.writes).toEqual(['docs/RELEASE_READINESS.md']);
    expect(content.match(/<!-- hadara:release-current:start -->/g)).toHaveLength(1);
    expect(content.match(/<!-- hadara:release-current:end -->/g)).toHaveLength(1);
    expect(content).toContain('| Published prerelease | 0.5.0-rc.5 |');
    expect(content).toContain('Historical stale row: next = 0.5.0-rc.2.');
    expect(createReleaseCurrentStateReport(root).changed).toBe(false);
  });
});

function fixtureProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-current-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({ name: 'hadara', version: '0.5.0-rc.6' }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'RELEASE_READINESS.md'), '# RELEASE_READINESS\n\nHistorical stale row: next = 0.5.0-rc.2.\n\n## Policy\n\nKeep history.\n', 'utf8');
  createTaskCapsule(root, 'Release evidence producer');
  return root;
}

function attachReleaseFacts(root: string): void {
  const task = createTaskCapsule(root, 'Typed release observations');
  appendReport(root, task.id, 'operator.json', {
    schemaVersion: 'hadara.releaseOperatorPublication.v1',
    generatedAt: '2026-08-12T00:00:00.000Z',
    package: {
      name: 'hadara', version: '0.5.0-rc.5', registry: 'https://registry.npmjs.org', distTag: 'next', npmMutationPerformed: true,
      observedVersion: '0.5.0-rc.5', distTagsBefore: { latest: '0.4.6', next: '0.5.0-rc.4' }, distTagsAfter: { latest: '0.4.6', next: '0.5.0-rc.5' }
    },
    github: {
      mutationPerformed: false, draftRequested: false, prerelease: true,
      assets: [
        { name: 'hadara.tgz', sha256: `sha256:${'a'.repeat(64)}`, uploaded: false },
        { name: 'hadara.tgz.sha256', sha256: `sha256:${'b'.repeat(64)}`, uploaded: false },
        { name: 'hadara.manifest.json', sha256: `sha256:${'c'.repeat(64)}`, uploaded: false }
      ]
    },
    lineage: {
      taskId: task.id,
      artifactSourceCommit: 'b'.repeat(40),
      releaseInputHash: computeReleaseInputHash(root),
      operatorCommit: 'c'.repeat(40),
      approvalActor: 'operator',
      approvalReason: 'fixture'
    },
    mutationBoundary: { dockerMutationPerformed: false, stableLatestMutationPerformed: false, substituteArtifactUsed: false },
    commands: { npmPublish: ['npm', 'publish'], githubRelease: null }
  });
  appendReport(root, task.id, 'github.json', {
    schemaVersion: 'hadara.releasePublicVerification.v1',
    verifiedAt: '2026-08-12T00:01:00.000Z',
    package: { name: 'hadara', version: '0.5.0-rc.5', distTags: { latest: '0.4.6', next: '0.5.0-rc.5' } },
    github: {
      repository: 'example/HADARA', tagName: 'v0.5.0-rc.5', isDraft: false, isPrerelease: true, assetCount: 3,
      assets: [
        { name: 'hadara.tgz', byteLength: 10, sha256: 'a'.repeat(64) },
        { name: 'hadara.tgz.sha256', byteLength: 20, sha256: 'b'.repeat(64) },
        { name: 'hadara.manifest.json', byteLength: 30, sha256: 'c'.repeat(64) }
      ]
    },
    mutationBoundary: { npmPublishPerformed: true, githubAssetsUploaded: true, dockerMutationPerformed: false, stableLatestMutationPerformed: false },
    publicLifecycleRecycle: 'pending'
  });
  appendReport(root, task.id, 'legacy-lifecycle.json', {
    schemaVersion: 'hadara.publicRcLifecycleAcceptance.v1', packageVersion: '0.5.0-rc.5', closeExecute: { ok: true }
  });
}

function appendReport(root: string, taskId: string, fileName: string, report: object): void {
  appendEvidenceTextArtifact(root, {
    taskId,
    kind: 'command-log',
    summary: `${fileName} typed release fixture passed.`,
    result: 'passed',
    visibility: 'public',
    category: 'release'
  }, { fileName, content: `${JSON.stringify(report, null, 2)}\n` });
}
