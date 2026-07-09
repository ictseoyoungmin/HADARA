import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { CODE_INDEX_EXTRACTOR_VERSION, CODE_INDEX_IGNORED_PATHS, classifyCodeFile } from './code-index';
import { hashContextGraphJson, normalizeContextGraphPath } from './extractor-contract';

export const CONTEXT_SOURCE_MANIFEST_SCHEMA_ID = 'hadara.context.sourceManifest.v1' as const;
export const CONTEXT_SOURCE_MANIFEST_CACHE_ROOT = '.hadara/local/cache/context' as const;
export const CONTEXT_SOURCE_MANIFEST_CACHE_PATH = `${CONTEXT_SOURCE_MANIFEST_CACHE_ROOT}/source-manifest.json` as const;
export const CONTEXT_SOURCE_MANIFEST_CACHE_VERSION = 'c6.1-source-manifest-v1' as const;

export const CONTEXT_SOURCE_MANIFEST_DEFAULT_BUDGETS: ContextSourceManifestBudget = {
  maxSourceFiles: 5000,
  maxSourceBytes: 40 * 1024 * 1024,
  maxSingleSourceBytes: 2 * 1024 * 1024
};

export const CONTEXT_SOURCE_MANIFEST_IGNORED_PATHS = Array.from(new Set([
  ...CODE_INDEX_IGNORED_PATHS,
  '.hadara/local',
  '.hadara/tmp',
  '.hadara/run',
  '.dashboard-visual'
])).sort();

export type ContextSourceManifestSchemaVersion = typeof CONTEXT_SOURCE_MANIFEST_SCHEMA_ID;
export type ContextSourceKind =
  | 'task-board'
  | 'task-capsule'
  | 'evidence'
  | 'docs-registry'
  | 'command-registry'
  | 'managed-section-source'
  | 'source-file'
  | 'test-file'
  | 'fixture-file'
  | 'config-file'
  | 'release-doc'
  | 'handoff-doc'
  | 'project-state-doc'
  | 'spec-doc'
  | 'other-doc';

export type ContextSourceManifestIssueCode =
  | 'SOURCE_MANIFEST_READ_FAILED'
  | 'SOURCE_MANIFEST_PARTIAL';

export interface ContextSourceManifestBudget {
  maxSourceFiles: number;
  maxSourceBytes: number;
  maxSingleSourceBytes: number;
}

export interface ContextSourceManifestBudgetUsage extends ContextSourceManifestBudget {
  discoveredSourceCount: number;
  discoveredBytes: number;
  skippedSourceCount: number;
}

export interface ContextSourceManifestIssue {
  severity: 'info' | 'warning' | 'error';
  code: ContextSourceManifestIssueCode;
  message: string;
  path?: string;
  fixHint?: string;
}

export interface ContextSourceEntry {
  path: string;
  kind: ContextSourceKind;
  sizeBytes: number;
  mtimeMs?: number;
  mtimeNs?: string;
  contentHash?: string;
  metadataHash: string;
  extractorKeys: string[];
  parseState?: 'ok' | 'skipped' | 'failed';
  issueCodes?: string[];
}

export interface ContextSourceManifestSummary {
  sourceCount: number;
  totalBytes: number;
  hashedSourceCount: number;
  skippedSourceCount: number;
  generatedByCommand?: string;
}

export interface ContextSourceManifestFingerprint {
  strategy: 'git-worktree-v1';
  projectFingerprint: string;
  cacheVersion: string;
  ignoreConfigHash: string;
  extractorVersionsHash: string;
  gitHead: string;
  gitStatusHash: string;
  dirtyContextSourceMetadataHash: string;
}

export interface ContextSourceManifest {
  schemaVersion: ContextSourceManifestSchemaVersion;
  generatedAt: string;
  projectFingerprint: string;
  cacheVersion: string;
  manifestHash: string;
  ignoreConfigHash: string;
  extractorVersions: Record<string, string>;
  fingerprint?: ContextSourceManifestFingerprint;
  sources: ContextSourceEntry[];
  summary: ContextSourceManifestSummary;
  budget: ContextSourceManifestBudgetUsage;
  issues: ContextSourceManifestIssue[];
}

export interface BuildContextSourceManifestOptions {
  projectRoot: string;
  generatedAt?: string;
  generatedByCommand?: string;
  budgets?: Partial<ContextSourceManifestBudget>;
  extractorVersions?: Record<string, string>;
  previousManifest?: ContextSourceManifest;
}

export interface ContextSourceManifestComparison {
  addedPaths: string[];
  removedPaths: string[];
  changedPaths: string[];
  unchangedPaths: string[];
  staleExtractorKeys: string[];
}

export interface ContextSourceManifestFastFreshnessResult {
  ok: boolean;
  strategy?: ContextSourceManifestFingerprint['strategy'];
  reason:
    | 'fresh'
    | 'missing-fingerprint'
    | 'fingerprint-mismatch'
    | 'fingerprint-unavailable';
  currentFingerprint?: ContextSourceManifestFingerprint;
}

const DEFAULT_EXTRACTOR_VERSIONS: Record<string, string> = {
  codeIndex: CODE_INDEX_EXTRACTOR_VERSION,
  extractAgentHandoff: 'c1-agent-handoff-v1',
  extractCommandRegistry: 'c1-command-registry-v1',
  extractDecisions: 'c1-decisions-v1',
  extractDocsRegistry: 'c1-docs-registry-v1',
  extractEvidence: 'c1-evidence-v1',
  extractManagedSections: 'c1-managed-sections-v1',
  extractProjectState: 'c1-project-state-v1',
  extractReleaseReadiness: 'c1-release-readiness-v1',
  extractTaskBoard: 'c1-task-board-v1',
  extractTaskCapsules: 'c1-task-capsules-v1'
};

export function buildContextSourceManifest(options: BuildContextSourceManifestOptions): ContextSourceManifest {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const budgets = normalizeContextSourceManifestBudgets(options.budgets);
  const extractorVersions = { ...DEFAULT_EXTRACTOR_VERSIONS, ...(options.extractorVersions ?? {}) };
  const ignoreConfigHash = hashContextGraphJson(CONTEXT_SOURCE_MANIFEST_IGNORED_PATHS);
  const previousByPath = new Map((options.previousManifest?.sources ?? []).map((entry) => [entry.path, entry]));
  const sources: ContextSourceEntry[] = [];
  const issues: ContextSourceManifestIssue[] = [];
  let discoveredBytes = 0;
  let skippedSourceCount = 0;
  let fileBudgetIssueRecorded = false;
  const root = path.resolve(options.projectRoot);

  function addSource(relativePath: string, input: { skipMissing?: boolean } = {}): void {
    if (shouldIgnoreContextSourcePath(relativePath)) return;
    const kind = classifyContextSourcePath(relativePath);
    if (!kind) return;
    if (sources.length >= budgets.maxSourceFiles) {
      skippedSourceCount += 1;
      if (!fileBudgetIssueRecorded) {
        fileBudgetIssueRecorded = true;
        issues.push(createPartialIssue({
          message: `Context source manifest exceeded max source file budget (${budgets.maxSourceFiles}); partial manifest returned.`,
          path: relativePath,
          fixHint: 'Reduce context source count or increase the future configurable source manifest budget.'
        }));
      }
      return;
    }

    const absolutePath = path.join(root, relativePath);
    let stats: fs.Stats;
    try {
      stats = fs.statSync(absolutePath);
    } catch (error) {
      if (input.skipMissing && isMissingFileError(error)) return;
      skippedSourceCount += 1;
      issues.push({
        severity: 'warning',
        code: 'SOURCE_MANIFEST_READ_FAILED',
        message: `Failed to stat context source ${relativePath}: ${error instanceof Error ? error.message : String(error)}.`,
        path: relativePath,
        fixHint: 'Check file permissions or remove the unreadable file from context source paths.'
      });
      return;
    }
    if (!stats.isFile()) return;

    if (stats.size > budgets.maxSingleSourceBytes) {
      skippedSourceCount += 1;
      issues.push(createPartialIssue({
        message: `Skipped ${relativePath} because it exceeds the single-source manifest budget (${stats.size} bytes > ${budgets.maxSingleSourceBytes} bytes).`,
        path: relativePath,
        fixHint: 'Reduce the file size or wait for a future configurable source manifest budget.'
      }));
      return;
    }
    if (discoveredBytes + stats.size > budgets.maxSourceBytes) {
      skippedSourceCount += 1;
      issues.push(createPartialIssue({
        message: `Skipped ${relativePath} because the source manifest byte budget would be exceeded (${discoveredBytes + stats.size} bytes > ${budgets.maxSourceBytes} bytes).`,
        path: relativePath,
        fixHint: 'Reduce context source size or wait for a future configurable source manifest budget.'
      }));
      return;
    }

    discoveredBytes += stats.size;
    const extractorKeys = extractorKeysForContextSource(relativePath, kind);
    const metadataHash = createContextSourceMetadataHash({
      path: relativePath,
      kind,
      sizeBytes: stats.size,
      mtimeMs: stats.mtimeMs,
      ignoreConfigHash,
      extractorKeys,
      extractorVersions
    });
    const previous = previousByPath.get(relativePath);
    const contentHash = previous && canCarryForwardContentHash(previous, {
      kind,
      sizeBytes: stats.size,
      mtimeMs: stats.mtimeMs
    }) ? previous.contentHash : undefined;
    sources.push({
      path: relativePath,
      kind,
      sizeBytes: stats.size,
      mtimeMs: stats.mtimeMs,
      metadataHash,
      extractorKeys,
      ...(contentHash ? { contentHash } : {}),
      parseState: 'ok'
    });
  }

  function visit(relativeDir: string): void {
    if (relativeDir && shouldIgnoreContextSourcePath(relativeDir)) return;
    const absoluteDir = path.join(root, relativeDir);
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
    } catch (error) {
      issues.push({
        severity: 'warning',
        code: 'SOURCE_MANIFEST_READ_FAILED',
        message: `Failed to read context source directory ${normalizeContextGraphPath(relativeDir || '.')}: ${error instanceof Error ? error.message : String(error)}.`,
        path: normalizeContextGraphPath(relativeDir || '.'),
        fixHint: 'Check directory permissions or exclude the unreadable directory from context source discovery.'
      });
      return;
    }

    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const relativePath = normalizeContextGraphPath(path.join(relativeDir, entry.name));
      if (shouldIgnoreContextSourcePath(relativePath)) continue;
      if (entry.isDirectory()) {
        visit(relativePath);
        continue;
      }
      if (!entry.isFile()) continue;
      addSource(relativePath);
    }
  }

  const gitCandidatePaths = listGitContextSourceCandidatePaths(root);
  if (gitCandidatePaths) {
    for (const relativePath of gitCandidatePaths) addSource(relativePath, { skipMissing: true });
  } else {
    visit('');
  }
  const sortedSources = sources.sort((a, b) => a.path.localeCompare(b.path));
  const projectFingerprint = hashContextGraphJson({ rootName: path.basename(root) });
  const fingerprint = createContextSourceManifestFingerprint({
    projectRoot: root,
    projectFingerprint,
    cacheVersion: CONTEXT_SOURCE_MANIFEST_CACHE_VERSION,
    ignoreConfigHash,
    extractorVersions
  });
  const manifestWithoutHash = {
    schemaVersion: CONTEXT_SOURCE_MANIFEST_SCHEMA_ID,
    generatedAt,
    projectFingerprint,
    cacheVersion: CONTEXT_SOURCE_MANIFEST_CACHE_VERSION,
    ignoreConfigHash,
    extractorVersions,
    ...(fingerprint ? { fingerprint } : {}),
    sources: sortedSources,
    summary: {
      sourceCount: sortedSources.length,
      totalBytes: discoveredBytes,
      hashedSourceCount: sortedSources.filter((source) => Boolean(source.contentHash)).length,
      skippedSourceCount,
      ...(options.generatedByCommand ? { generatedByCommand: options.generatedByCommand } : {})
    },
    budget: {
      ...budgets,
      discoveredSourceCount: sortedSources.length,
      discoveredBytes,
      skippedSourceCount
    },
    issues
  };

  return {
    ...manifestWithoutHash,
    manifestHash: createStableContextSourceManifestHash(manifestWithoutHash)
  };
}

export function checkContextSourceManifestFastFreshness(
  projectRoot: string,
  manifest: ContextSourceManifest
): ContextSourceManifestFastFreshnessResult {
  if (!manifest.fingerprint) {
    return { ok: false, reason: 'missing-fingerprint' };
  }
  const currentFingerprint = createContextSourceManifestFingerprint({
    projectRoot,
    projectFingerprint: manifest.projectFingerprint,
    cacheVersion: manifest.cacheVersion,
    ignoreConfigHash: manifest.ignoreConfigHash,
    extractorVersions: manifest.extractorVersions
  });
  if (!currentFingerprint) {
    return { ok: false, reason: 'fingerprint-unavailable' };
  }
  if (sameContextSourceManifestFingerprint(manifest.fingerprint, currentFingerprint)) {
    return {
      ok: true,
      strategy: currentFingerprint.strategy,
      reason: 'fresh',
      currentFingerprint
    };
  }
  return {
    ok: false,
    strategy: currentFingerprint.strategy,
    reason: 'fingerprint-mismatch',
    currentFingerprint
  };
}

export function compareContextSourceManifests(
  previous: ContextSourceManifest | undefined,
  next: ContextSourceManifest
): ContextSourceManifestComparison {
  const previousByPath = new Map((previous?.sources ?? []).map((entry) => [entry.path, entry]));
  const nextByPath = new Map(next.sources.map((entry) => [entry.path, entry]));
  const addedPaths: string[] = [];
  const removedPaths: string[] = [];
  const changedPaths: string[] = [];
  const unchangedPaths: string[] = [];
  const staleExtractorKeys = new Set<string>();

  for (const nextEntry of next.sources) {
    const previousEntry = previousByPath.get(nextEntry.path);
    if (!previousEntry) {
      addedPaths.push(nextEntry.path);
      nextEntry.extractorKeys.forEach((key) => staleExtractorKeys.add(key));
      continue;
    }
    if (previousEntry.metadataHash === nextEntry.metadataHash && previousEntry.contentHash === nextEntry.contentHash) {
      unchangedPaths.push(nextEntry.path);
    } else {
      changedPaths.push(nextEntry.path);
      Array.from(new Set([...previousEntry.extractorKeys, ...nextEntry.extractorKeys])).forEach((key) => staleExtractorKeys.add(key));
    }
  }

  for (const previousEntry of previousByPath.values()) {
    if (nextByPath.has(previousEntry.path)) continue;
    removedPaths.push(previousEntry.path);
    previousEntry.extractorKeys.forEach((key) => staleExtractorKeys.add(key));
  }

  return {
    addedPaths: addedPaths.sort(),
    removedPaths: removedPaths.sort(),
    changedPaths: changedPaths.sort(),
    unchangedPaths: unchangedPaths.sort(),
    staleExtractorKeys: Array.from(staleExtractorKeys).sort()
  };
}

export function createContextSourceSubsetHash(
  manifest: ContextSourceManifest,
  input: { extractorKey?: string; kinds?: ContextSourceKind[] } = {}
): string {
  const kindSet = input.kinds ? new Set(input.kinds) : undefined;
  return hashContextGraphJson(manifest.sources
    .filter((source) => !input.extractorKey || source.extractorKeys.includes(input.extractorKey))
    .filter((source) => !kindSet || kindSet.has(source.kind))
    .map((source) => ({
      path: source.path,
      kind: source.kind,
      metadataHash: source.metadataHash,
      contentHash: source.contentHash ?? null
    }))
    .sort((a, b) => a.path.localeCompare(b.path)));
}

export function classifyContextSourcePath(inputPath: string): ContextSourceKind | undefined {
  const filePath = normalizeContextGraphPath(inputPath);
  if (filePath === 'docs/TASK_BOARD.md') return 'task-board';
  if (filePath === '.hadara/docs-registry.json' || filePath === 'docs/DOC_REGISTRY.md') return 'docs-registry';
  if (filePath === 'src/services/capability-registry.ts') return 'command-registry';
  if (filePath === 'docs/PROJECT_STATE.md') return 'project-state-doc';
  if (filePath === 'docs/AGENT_HANDOFF.md') return 'handoff-doc';
  if (filePath === 'docs/RELEASE_READINESS.md') return 'release-doc';
  if (filePath.startsWith('docs/specs/') && filePath.endsWith('.md')) return 'spec-doc';
  if (filePath.startsWith('tasks/') && filePath.endsWith('/evidence.jsonl')) return 'evidence';
  if (filePath.startsWith('tasks/') && filePath.endsWith('.md')) return 'task-capsule';
  const codeKind = classifyCodeFile(filePath);
  if (codeKind === 'source' || codeKind === 'script') return 'source-file';
  if (codeKind === 'test') return 'test-file';
  if (codeKind === 'fixture') return 'fixture-file';
  if (codeKind === 'config') return 'config-file';
  if (filePath.startsWith('docs/') && filePath.endsWith('.md')) return 'managed-section-source';
  return undefined;
}

export function extractorKeysForContextSource(relativePath: string, kind: ContextSourceKind): string[] {
  switch (kind) {
    case 'task-board':
      return ['extractTaskBoard'];
    case 'task-capsule':
      return ['extractTaskCapsules'];
    case 'evidence':
      return ['extractEvidence'];
    case 'docs-registry':
      return ['extractDocsRegistry'];
    case 'command-registry':
      return ['extractCommandRegistry', 'codeIndex'];
    case 'managed-section-source':
      return ['extractManagedSections', 'extractDecisions'];
    case 'release-doc':
      return ['extractReleaseReadiness', 'extractManagedSections'];
    case 'handoff-doc':
      return ['extractAgentHandoff', 'extractManagedSections'];
    case 'project-state-doc':
      return ['extractProjectState', 'extractManagedSections'];
    case 'spec-doc':
      return ['extractDocsRegistry', 'extractManagedSections'];
    case 'source-file':
    case 'test-file':
    case 'fixture-file':
    case 'config-file':
      return ['codeIndex'];
    case 'other-doc':
      return ['extractManagedSections'];
    default:
      return relativePath.startsWith('docs/') ? ['extractManagedSections'] : [];
  }
}

export function shouldIgnoreContextSourcePath(inputPath: string): boolean {
  const normalizedPath = normalizeContextGraphPath(inputPath);
  if (!normalizedPath || normalizedPath === '.') return false;
  return CONTEXT_SOURCE_MANIFEST_IGNORED_PATHS.some((ignoredPath) =>
    normalizedPath === ignoredPath || normalizedPath.startsWith(`${ignoredPath}/`)
  );
}

function listGitContextSourceCandidatePaths(root: string): string[] | undefined {
  if (!fs.existsSync(path.join(root, '.git'))) return undefined;
  try {
    const output = execFileSync('git', ['-C', root, 'ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 5000
    });
    return contextSourceCandidatePathsFromGitOutput(output);
  } catch (error) {
    const output = recoverExecStdout(error);
    if (output !== undefined) return contextSourceCandidatePathsFromGitOutput(output);
    return undefined;
  }
}

function createContextSourceManifestFingerprint(input: {
  projectRoot: string;
  projectFingerprint: string;
  cacheVersion: string;
  ignoreConfigHash: string;
  extractorVersions: Record<string, string>;
}): ContextSourceManifestFingerprint | undefined {
  if (!fs.existsSync(path.join(input.projectRoot, '.git'))) return undefined;
  const gitHead = readGitOutput(input.projectRoot, ['rev-parse', 'HEAD']) ?? 'UNBORN';
  const gitStatus = readGitOutput(input.projectRoot, ['status', '--porcelain=v1', '-z', '--untracked-files=all']);
  if (gitStatus === undefined) return undefined;
  const relevantStatusEntries = contextRelevantGitStatusEntriesFromGitStatus(gitStatus);
  if (!relevantStatusEntries) return undefined;
  const dirtyMetadataHash = createDirtyContextSourceMetadataHash(input.projectRoot, gitStatus);
  if (!dirtyMetadataHash) return undefined;
  return {
    strategy: 'git-worktree-v1',
    projectFingerprint: input.projectFingerprint,
    cacheVersion: input.cacheVersion,
    ignoreConfigHash: input.ignoreConfigHash,
    extractorVersionsHash: hashContextGraphJson(input.extractorVersions),
    gitHead,
    gitStatusHash: hashContextGraphJson(relevantStatusEntries),
    dirtyContextSourceMetadataHash: dirtyMetadataHash
  };
}

function readGitOutput(root: string, args: string[]): string | undefined {
  try {
    return execFileSync('git', ['-C', root, ...args], {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 5000
    });
  } catch (error) {
    const output = recoverExecStdout(error);
    if (output !== undefined) return output;
    return undefined;
  }
}

function contextSourceCandidatePathsFromGitOutput(output: string): string[] {
  return Array.from(new Set(output
    .split('\0')
    .map((entry) => normalizeContextGraphPath(entry))
    .filter((entry) => entry && !shouldIgnoreContextSourcePath(entry))))
    .sort((a, b) => a.localeCompare(b));
}

function recoverExecStdout(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const output = 'stdout' in error ? (error as { stdout?: unknown }).stdout : undefined;
  if (typeof output === 'string' && output.length > 0) return output;
  if (Buffer.isBuffer(output) && output.length > 0) return output.toString('utf8');
  return undefined;
}

function createDirtyContextSourceMetadataHash(root: string, gitStatus: string): string | undefined {
  const dirtyPaths = dirtyContextSourcePathsFromGitStatus(gitStatus);
  if (!dirtyPaths) return undefined;
  const metadata: Array<{ path: string; sizeBytes: number; mtimeMs: number }> = [];
  for (const relativePath of dirtyPaths) {
    try {
      const stats = fs.statSync(path.join(root, relativePath));
      if (stats.isFile()) {
        metadata.push({
          path: relativePath,
          sizeBytes: stats.size,
          mtimeMs: stats.mtimeMs
        });
      }
    } catch (error) {
      if (!isMissingFileError(error)) return undefined;
    }
  }
  return hashContextGraphJson(metadata.sort((a, b) => a.path.localeCompare(b.path)));
}

function dirtyContextSourcePathsFromGitStatus(gitStatus: string): string[] | undefined {
  const entries = contextRelevantGitStatusEntriesFromGitStatus(gitStatus);
  if (!entries) return undefined;
  return entries.map((entry) => entry.path).sort((a, b) => a.localeCompare(b));
}

function contextRelevantGitStatusEntriesFromGitStatus(gitStatus: string): Array<{ status: string; path: string }> | undefined {
  const paths = new Set<string>();
  const entriesByPath = new Map<string, { status: string; path: string }>();
  const entries = gitStatus.split('\0').filter(Boolean);
  for (const entry of entries) {
    if (entry.length < 4) continue;
    const indexStatus = entry[0];
    const worktreeStatus = entry[1];
    if (indexStatus === 'R' || worktreeStatus === 'R' || indexStatus === 'C' || worktreeStatus === 'C') {
      return undefined;
    }
    const relativePath = normalizeContextGraphPath(entry.slice(3));
    if (!relativePath || shouldIgnoreContextSourcePath(relativePath)) continue;
    const kind = classifyContextSourcePath(relativePath);
    if (!kind) continue;
    paths.add(relativePath);
    entriesByPath.set(relativePath, {
      status: `${indexStatus}${worktreeStatus}`,
      path: relativePath
    });
  }
  return Array.from(paths)
    .sort((a, b) => a.localeCompare(b))
    .map((relativePath) => entriesByPath.get(relativePath))
    .filter((entry): entry is { status: string; path: string } => Boolean(entry));
}

function sameContextSourceManifestFingerprint(
  left: ContextSourceManifestFingerprint,
  right: ContextSourceManifestFingerprint
): boolean {
  return left.strategy === right.strategy
    && left.projectFingerprint === right.projectFingerprint
    && left.cacheVersion === right.cacheVersion
    && left.ignoreConfigHash === right.ignoreConfigHash
    && left.extractorVersionsHash === right.extractorVersionsHash
    && left.gitHead === right.gitHead
    && left.gitStatusHash === right.gitStatusHash
    && left.dirtyContextSourceMetadataHash === right.dirtyContextSourceMetadataHash;
}

function isMissingFileError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: unknown }).code === 'ENOENT';
}

function normalizeContextSourceManifestBudgets(input: Partial<ContextSourceManifestBudget> = {}): ContextSourceManifestBudget {
  return {
    maxSourceFiles: normalizeBudgetValue(input.maxSourceFiles, CONTEXT_SOURCE_MANIFEST_DEFAULT_BUDGETS.maxSourceFiles),
    maxSourceBytes: normalizeBudgetValue(input.maxSourceBytes, CONTEXT_SOURCE_MANIFEST_DEFAULT_BUDGETS.maxSourceBytes),
    maxSingleSourceBytes: normalizeBudgetValue(input.maxSingleSourceBytes, CONTEXT_SOURCE_MANIFEST_DEFAULT_BUDGETS.maxSingleSourceBytes)
  };
}

function normalizeBudgetValue(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.floor(value));
}

function createPartialIssue(input: { message: string; path?: string; fixHint: string }): ContextSourceManifestIssue {
  return {
    severity: 'warning',
    code: 'SOURCE_MANIFEST_PARTIAL',
    message: input.message,
    ...(input.path ? { path: input.path } : {}),
    fixHint: input.fixHint
  };
}

function createContextSourceMetadataHash(input: {
  path: string;
  kind: ContextSourceKind;
  sizeBytes: number;
  mtimeMs?: number;
  ignoreConfigHash: string;
  extractorKeys: string[];
  extractorVersions: Record<string, string>;
}): string {
  return hashContextGraphJson({
    path: input.path,
    kind: input.kind,
    sizeBytes: input.sizeBytes,
    mtimeMs: input.mtimeMs ?? null,
    ignoreConfigHash: input.ignoreConfigHash,
    extractorKeys: input.extractorKeys,
    extractorVersions: Object.fromEntries(input.extractorKeys.map((key) => [key, input.extractorVersions[key] ?? 'unknown']).sort())
  });
}

function createStableContextSourceManifestHash(input: Omit<ContextSourceManifest, 'manifestHash'>): string {
  return hashContextGraphJson({
    schemaVersion: input.schemaVersion,
    projectFingerprint: input.projectFingerprint,
    cacheVersion: input.cacheVersion,
    ignoreConfigHash: input.ignoreConfigHash,
    extractorVersions: input.extractorVersions,
    sources: input.sources.map((source) => ({
      path: source.path,
      kind: source.kind,
      sizeBytes: source.sizeBytes,
      mtimeMs: source.mtimeMs ?? null,
      mtimeNs: source.mtimeNs ?? null,
      contentHash: source.contentHash ?? null,
      metadataHash: source.metadataHash,
      extractorKeys: source.extractorKeys,
      parseState: source.parseState ?? null,
      issueCodes: source.issueCodes ?? []
    })),
    summary: {
      sourceCount: input.summary.sourceCount,
      totalBytes: input.summary.totalBytes,
      hashedSourceCount: input.summary.hashedSourceCount,
      skippedSourceCount: input.summary.skippedSourceCount
    },
    budget: input.budget,
    issues: input.issues
  });
}

function canCarryForwardContentHash(
  previous: ContextSourceEntry,
  next: { kind: ContextSourceKind; sizeBytes: number; mtimeMs?: number }
): boolean {
  return Boolean(previous.contentHash)
    && previous.kind === next.kind
    && previous.sizeBytes === next.sizeBytes
    && previous.mtimeMs === next.mtimeMs;
}
