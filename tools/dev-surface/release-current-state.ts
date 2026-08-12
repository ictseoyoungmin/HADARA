import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { validateSchema } from '../../src/core/schema';
import { listTaskCapsules } from '../../src/task/task-capsule';

export interface ReleaseCurrentStateFacts {
  sourceVersion: string;
  publishedPrerelease: string;
  npmNext: string;
  npmLatest: string;
  githubPrerelease: string;
  publicTerminalLifecycle: string;
  stablePromotion: string;
}

export interface ReleaseCurrentStateReport {
  schemaVersion: 'hadara.releaseCurrentStateProjection.v1';
  command: 'release.current-state';
  ok: boolean;
  mode: 'dry-run' | 'execute';
  readOnly: boolean;
  path: 'docs/RELEASE_READINESS.md';
  beforeHash: string;
  changed: boolean;
  facts: ReleaseCurrentStateFacts;
  sources: Array<{ schemaVersion: string; evidenceId: string; taskId: string; artifactPath: string }>;
  writes: string[];
  executeCommand?: string;
  issues: Array<{ severity: 'error' | 'warning'; code: string; message: string }>;
}

interface BoundTypedArtifact {
  schemaVersion: string;
  evidenceId: string;
  taskId: string;
  artifactPath: string;
  evidenceTime: string;
  report: Record<string, any>;
}

const READINESS_PATH = 'docs/RELEASE_READINESS.md' as const;
const START = '<!-- hadara:release-current:start -->';
const END = '<!-- hadara:release-current:end -->';

export function createReleaseCurrentStateReport(
  projectRoot: string,
  options: { execute?: boolean; beforeHash?: string } = {}
): ReleaseCurrentStateReport {
  const mode = options.execute ? 'execute' : 'dry-run';
  const issues: ReleaseCurrentStateReport['issues'] = [];
  const releasePath = path.join(projectRoot, READINESS_PATH);
  const packagePath = path.join(projectRoot, 'package.json');
  const before = fs.existsSync(releasePath) ? fs.readFileSync(releasePath, 'utf8') : '';
  const beforeHash = hash(before);
  const sourceVersion = readPackageVersion(packagePath);
  if (!sourceVersion) issues.push({ severity: 'error', code: 'RELEASE_CURRENT_PACKAGE_VERSION_MISSING', message: 'package.json does not expose a package version.' });
  if (!before) issues.push({ severity: 'error', code: 'RELEASE_CURRENT_READINESS_MISSING', message: `${READINESS_PATH} is missing or empty.` });
  const artifacts = readBoundTypedArtifacts(projectRoot, issues);
  const publication = latest(artifacts, 'hadara.releaseOperatorPublication.v1');
  const publicationVersion = stringValue(publication?.report?.package?.version);
  const verification = latestForVersion(artifacts, 'hadara.releasePublicVerification.v1', publicationVersion);
  const lifecycle = latestLifecycle(artifacts, publicationVersion);
  const currentCommit = readGitHead(projectRoot);
  const publicationCommit = stringValue(publication?.report?.lineage?.sourceCommit);
  const sourceMatchesPublication = Boolean(currentCommit && publicationCommit && currentCommit === publicationCommit);
  const facts: ReleaseCurrentStateFacts = {
    sourceVersion: sourceVersion ?? 'unknown',
    publishedPrerelease: stringValue(publication?.report?.package?.version) ?? 'unknown',
    npmNext: stringValue(verification?.report?.package?.distTags?.next) ?? stringValue(publication?.report?.package?.distTagsAfter?.next) ?? 'unknown',
    npmLatest: stringValue(verification?.report?.package?.distTags?.latest) ?? stringValue(publication?.report?.package?.distTagsAfter?.latest) ?? 'unknown',
    githubPrerelease: publicPrereleaseTag(verification),
    publicTerminalLifecycle: lifecycle ? 'passed' : 'pending command-generated acceptance',
    stablePromotion: sourceMatchesPublication && lifecycle ? 'pending decision' : 'blocked pending current-source RC regeneration'
  };
  if (!publication) issues.push({ severity: 'warning', code: 'RELEASE_CURRENT_PUBLICATION_OBSERVATION_MISSING', message: 'No byte-bound operator publication report was found.' });
  if (!verification) issues.push({ severity: 'warning', code: 'RELEASE_CURRENT_GITHUB_OBSERVATION_MISSING', message: 'No byte-bound public GitHub verification report was found.' });
  if (!lifecycle) issues.push({ severity: 'warning', code: 'RELEASE_CURRENT_TERMINAL_LIFECYCLE_PENDING', message: 'No byte-bound command-generated public terminal lifecycle acceptance matches the published version.' });
  const rendered = before ? renderReleaseCurrentState(before, facts, issues) : before;
  const changed = rendered !== before;
  const writes: string[] = [];

  if (options.execute && !issues.some((issue) => issue.severity === 'error')) {
    if (!options.beforeHash || options.beforeHash !== beforeHash) {
      issues.push({ severity: 'error', code: 'RELEASE_CURRENT_BEFORE_HASH_MISMATCH', message: 'Execute requires the exact beforeHash from the latest dry-run; no file was written.' });
    } else if (changed) {
      fs.writeFileSync(releasePath, rendered, 'utf8');
      writes.push(READINESS_PATH);
    }
  }

  const ok = !issues.some((issue) => issue.severity === 'error');
  const used = [publication, verification, lifecycle].filter((item): item is BoundTypedArtifact => Boolean(item));
  return {
    schemaVersion: 'hadara.releaseCurrentStateProjection.v1',
    command: 'release.current-state',
    ok,
    mode,
    readOnly: !options.execute,
    path: READINESS_PATH,
    beforeHash,
    changed,
    facts,
    sources: used.map(({ schemaVersion, evidenceId, taskId, artifactPath }) => ({ schemaVersion, evidenceId, taskId, artifactPath })),
    writes,
    ...(!options.execute && ok ? { executeCommand: `hadara release current-state --execute --before-hash ${beforeHash} --json` } : {}),
    issues
  };
}

export function renderReleaseCurrentState(content: string, facts: ReleaseCurrentStateFacts, issues: ReleaseCurrentStateReport['issues'] = []): string {
  const block = [
    START,
    '| Field | Value |',
    '|---|---|',
    `| Source version | ${facts.sourceVersion} |`,
    `| Published prerelease | ${facts.publishedPrerelease} |`,
    `| npm next | ${facts.npmNext} |`,
    `| npm latest | ${facts.npmLatest} |`,
    `| GitHub prerelease | ${facts.githubPrerelease} |`,
    `| Public terminal lifecycle | ${facts.publicTerminalLifecycle} |`,
    `| Stable promotion | ${facts.stablePromotion} |`,
    END
  ].join('\n');
  const starts = content.split(START).length - 1;
  const ends = content.split(END).length - 1;
  if (starts > 1 || ends > 1 || starts !== ends) {
    issues.push({ severity: 'error', code: 'RELEASE_CURRENT_MANAGED_BLOCK_INVALID', message: 'Release readiness must contain zero or one balanced managed current-state block.' });
    return content;
  }
  if (starts === 1) return content.replace(new RegExp(`${escape(START)}[\\s\\S]*?${escape(END)}`), block);
  const section = [
    '## Current Release State (Managed)',
    '',
    'This block is the sole current release-state authority. Version-specific narrative below is historical context or policy unless this block links it as current.',
    '',
    block
  ].join('\n');
  const firstSection = content.search(/\n##\s+/);
  if (firstSection < 0) return `${content.trimEnd()}\n\n${section}\n`;
  return `${content.slice(0, firstSection).trimEnd()}\n\n${section}\n${content.slice(firstSection)}`;
}

function readBoundTypedArtifacts(projectRoot: string, issues: ReleaseCurrentStateReport['issues']): BoundTypedArtifact[] {
  const result: BoundTypedArtifact[] = [];
  for (const task of listTaskCapsules(projectRoot)) {
    const indexPath = path.join(task.dir, 'evidence.jsonl');
    if (!fs.existsSync(indexPath)) continue;
    for (const line of fs.readFileSync(indexPath, 'utf8').split(/\r?\n/).filter(Boolean)) {
      let record: Record<string, any>;
      try { record = JSON.parse(line) as Record<string, any>; } catch { continue; }
      if (record.schemaVersion !== 'hadara.evidence.v2' || record.visibility !== 'public' || record.outcome !== 'passed' || !Array.isArray(record.artifacts)) continue;
      for (const artifact of record.artifacts) {
        if (!artifact || typeof artifact.path !== 'string' || typeof artifact.sha256 !== 'string' || typeof artifact.byteLength !== 'number') continue;
        const artifactPath = path.resolve(task.dir, artifact.path);
        if (!inside(task.dir, artifactPath) || !fs.existsSync(artifactPath)) continue;
        const bytes = fs.readFileSync(artifactPath);
        if (`sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}` !== artifact.sha256 || bytes.byteLength !== artifact.byteLength) continue;
        let report: Record<string, any>;
        try { report = JSON.parse(bytes.toString('utf8')) as Record<string, any>; } catch { continue; }
        const schemaVersion = stringValue(report.schemaVersion);
        if (!schemaVersion || !isSupportedTypedReport(schemaVersion, report)) continue;
        result.push({ schemaVersion, evidenceId: String(record.id), taskId: task.id, artifactPath: `${path.relative(projectRoot, artifactPath).split(path.sep).join('/')}`, evidenceTime: String(record.time), report });
      }
    }
  }
  if (result.length === 0) issues.push({ severity: 'warning', code: 'RELEASE_CURRENT_TYPED_EVIDENCE_EMPTY', message: 'No supported byte-bound typed release observations were found.' });
  return result;
}

function isSupportedTypedReport(schemaVersion: string, report: Record<string, any>): boolean {
  if (schemaVersion === 'hadara.releaseOperatorPublication.v1') return validateSchema(schemaVersion, report).ok;
  if (schemaVersion === 'hadara.publicLifecycleAcceptance.v1') return validateSchema(schemaVersion, report).ok && report.ok === true;
  if (schemaVersion === 'hadara.packageRecycle.v1') return validateSchema(schemaVersion, report).ok && report.ok === true && report.terminalLifecycle?.schemaVersion === 'hadara.publicLifecycleAcceptance.v1' && report.terminalLifecycle?.ok === true;
  if (schemaVersion === 'hadara.releasePublicVerification.v1') return validateSchema(schemaVersion, report).ok;
  return false;
}

function latest(items: BoundTypedArtifact[], schemaVersion: string): BoundTypedArtifact | undefined {
  return items.filter((item) => item.schemaVersion === schemaVersion).sort((a, b) => a.evidenceTime.localeCompare(b.evidenceTime)).at(-1);
}

function latestForVersion(items: BoundTypedArtifact[], schemaVersion: string, version: string | null): BoundTypedArtifact | undefined {
  return items
    .filter((item) => item.schemaVersion === schemaVersion && stringValue(item.report.package?.version) === version)
    .sort((a, b) => a.evidenceTime.localeCompare(b.evidenceTime))
    .at(-1);
}

function latestLifecycle(items: BoundTypedArtifact[], publishedVersion: unknown): BoundTypedArtifact | undefined {
  const version = stringValue(publishedVersion);
  return items.filter((item) => {
    if (item.schemaVersion === 'hadara.publicLifecycleAcceptance.v1') return item.report.packageVersion === version && item.report.ok === true;
    if (item.schemaVersion === 'hadara.packageRecycle.v1') return item.report.package?.observedVersion === version && item.report.terminalLifecycle?.ok === true;
    return false;
  }).sort((a, b) => a.evidenceTime.localeCompare(b.evidenceTime)).at(-1);
}

function publicPrereleaseTag(verification: BoundTypedArtifact | undefined): string {
  return verification?.report?.github?.isDraft === false && verification?.report?.github?.isPrerelease === true
    ? stringValue(verification.report.github.tagName) ?? 'unknown'
    : 'unknown';
}

function readPackageVersion(packagePath: string): string | null {
  try { return stringValue(JSON.parse(fs.readFileSync(packagePath, 'utf8')).version); } catch { return null; }
}

function readGitHead(projectRoot: string): string | null {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: projectRoot, encoding: 'utf8' });
  return result.status === 0 && /^[a-f0-9]{40,64}$/.test(result.stdout.trim()) ? result.stdout.trim() : null;
}

function stringValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function inside(root: string, candidate: string): boolean {
  const relative = path.relative(path.resolve(root), path.resolve(candidate));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function hash(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content, 'utf8').digest('hex')}`;
}

function escape(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
