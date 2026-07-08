import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { atomicWriteTextFile } from '../core/fs';
import {
  DOCS_REGISTER_ALLOWED_VALUES,
  DOCS_REGISTRY_PATH,
  DocumentRegistryEntry,
  DocumentRegistryFile,
  DocumentStatus,
  DocsIssue,
  registryJson
} from './docs-registry';

const VALID_STATUS_TOKENS = DOCS_REGISTER_ALLOWED_VALUES.status;

export interface DocsMarkReport {
  schemaVersion: 'hadara.docs.mark.v1';
  command: 'docs.mark';
  mode: 'dry-run' | 'execute';
  ok: boolean;
  path: string;
  correction: boolean;
  beforeStatus: DocumentStatus | null;
  afterStatus: DocumentStatus | null;
  fieldDiff: DocsMarkFieldDiff[];
  supersededBy?: string;
  reason: string | null;
  registryPath: typeof DOCS_REGISTRY_PATH;
  beforeHash: string;
  impact: {
    registryPatchPlanned: boolean;
    defaultRequiredReading: 'unchanged' | 'remove-after-execute' | 'excluded';
    managedRequiredReadingPatchAvailable: boolean;
    archiveCandidate: boolean;
  };
  issues: DocsIssue[];
}

export interface DocsMarkFieldDiff {
  field: 'status' | 'supersededBy';
  before: string | null;
  after: string | null;
}

export interface DocsRequiredReadingReport {
  schemaVersion: 'hadara.docs.requiredReading.v1';
  command: 'docs.required-reading';
  ok: boolean;
  documents: Array<{ path: string; status: DocumentStatus; readWhen: string[]; tier: RequiredReadingTier; reason: string }>;
  excluded: Array<{ path: string; status: DocumentStatus; tier: RequiredReadingTier; reason: string }>;
  issues: DocsIssue[];
}

export interface DocsCompleteSpecReport {
  schemaVersion: 'hadara.docs.completeSpec.v1';
  command: 'docs.complete-spec';
  mode: 'dry-run' | 'execute';
  ok: boolean;
  path: string;
  implementedBy: string;
  registryPath: typeof DOCS_REGISTRY_PATH;
  beforeHash: string;
  action: 'update' | 'already-complete' | 'blocked';
  before: {
    status: DocumentStatus;
    readWhen: string[];
    requiredReading: boolean;
    readTier?: string;
    activeForTasks?: string[];
  } | null;
  after: {
    status: DocumentStatus;
    readWhen: string[];
    requiredReading: boolean;
    readTier: string;
    activeForTasks: string[];
  } | null;
  writes: string[];
  issues: DocsIssue[];
}

export type RequiredReadingTier = 'current-state' | 'task-work' | 'conditional-reference' | 'historical' | 'excluded';

export interface DocsMarkOptions {
  documentPath: string;
  status: string;
  reason?: string;
  by?: string;
  mode: 'dry-run' | 'execute';
  beforeHash?: string;
  forceCanonical?: boolean;
  correction?: boolean;
}

export interface DocsCompleteSpecOptions {
  documentPath: string;
  implementedBy: string;
  reason?: string;
  mode: 'dry-run' | 'execute';
  beforeHash?: string;
}

const EXCLUDED_REQUIRED_READING_STATUSES = new Set<DocumentStatus>(['historical', 'superseded', 'archived']);
const ARCHIVE_STATUSES = new Set<DocumentStatus>(['historical', 'superseded']);
export function createDocsCompleteSpecReport(projectRoot: string, options: DocsCompleteSpecOptions): DocsCompleteSpecReport {
  const state = readRegistry(projectRoot);
  const normalizedPath = normalizePath(options.documentPath);
  const implementedBy = options.implementedBy.trim();
  const issues = [...state.issues];
  const entry = state.registry?.documents.find((doc) => doc.path === normalizedPath) ?? null;
  if (!entry) issues.push({ severity: 'error', code: 'DOC_NOT_REGISTERED', path: normalizedPath, message: `${normalizedPath} is not registered.` });
  if (entry && entry.kind !== 'spec') {
    issues.push({ severity: 'error', code: 'DOC_COMPLETE_SPEC_KIND_INVALID', path: normalizedPath, message: `docs.complete-spec requires kind spec, not ${entry.kind}.` });
  }
  if (!implementedBy) {
    issues.push({ severity: 'error', code: 'DOC_COMPLETE_SPEC_TASK_REQUIRED', path: normalizedPath, message: '--implemented-by is required.' });
  } else if (!taskExists(projectRoot, implementedBy)) {
    issues.push({ severity: 'error', code: 'DOC_COMPLETE_SPEC_TASK_NOT_FOUND', path: normalizedPath, message: `${implementedBy} task capsule was not found.` });
  }
  if (options.mode === 'execute' && !options.beforeHash) {
    issues.push({ severity: 'error', code: 'DOC_COMPLETE_SPEC_BEFORE_HASH_REQUIRED', path: DOCS_REGISTRY_PATH, message: 'Execute mode requires --before-hash from the reviewed dry-run.' });
  }
  if (options.mode === 'execute' && options.beforeHash && options.beforeHash !== state.beforeHash) {
    issues.push({ severity: 'error', code: 'DOC_COMPLETE_SPEC_BEFORE_HASH_MISMATCH', path: DOCS_REGISTRY_PATH, message: `Registry hash ${state.beforeHash} does not match reviewed hash ${options.beforeHash}.` });
  }

  const before = entry ? completionSnapshot(entry) : null;
  const after = entry && implementedBy ? completedSpecSnapshot(entry, implementedBy) : null;
  const alreadyComplete = Boolean(before && after && before.status === after.status && before.requiredReading === after.requiredReading && arrayEqual(before.readWhen, after.readWhen) && before.readTier === after.readTier && arrayEqual(before.activeForTasks ?? [], after.activeForTasks));
  let ok = issues.every((issue) => issue.severity !== 'error');

  if (options.mode === 'execute' && ok && state.registry && entry && after && !alreadyComplete) {
    entry.status = after.status;
    entry.readWhen = after.readWhen as DocumentRegistryEntry['readWhen'];
    entry.requiredReading = after.requiredReading;
    entry.readTier = 'implemented-reference';
    entry.authority = 'historical';
    entry.editPolicy = entry.editPolicy ?? 'agent-editable-with-review';
    entry.activeForTasks = after.activeForTasks;
    entry.notes = appendNote(entry.notes, options.reason ?? `Completed by ${implementedBy}.`);
    try {
      atomicWriteTextFile(projectRoot, DOCS_REGISTRY_PATH, registryJson(state.registry));
    } catch (error) {
      ok = false;
      issues.push({ severity: 'error', code: 'DOC_COMPLETE_SPEC_ATOMIC_WRITE_FAILED', path: DOCS_REGISTRY_PATH, message: `Could not write docs registry atomically: ${error instanceof Error ? error.message : String(error)}` });
    }
  }

  return {
    schemaVersion: 'hadara.docs.completeSpec.v1',
    command: 'docs.complete-spec',
    mode: options.mode,
    ok,
    path: normalizedPath,
    implementedBy,
    registryPath: DOCS_REGISTRY_PATH,
    beforeHash: state.beforeHash,
    action: ok ? alreadyComplete ? 'already-complete' : 'update' : 'blocked',
    before,
    after,
    writes: ok && options.mode === 'execute' && !alreadyComplete ? [DOCS_REGISTRY_PATH] : [],
    issues
  };
}

export function createDocsMarkReport(projectRoot: string, options: DocsMarkOptions): DocsMarkReport {
  const state = readRegistry(projectRoot);
  const normalizedPath = normalizePath(options.documentPath);
  const afterStatus = parseStatus(options.status);
  const issues = [...state.issues];
  const entry = state.registry?.documents.find((doc) => doc.path === normalizedPath) ?? null;
  const beforeStatus = entry?.status ?? null;
  if (!entry) issues.push({ severity: 'error', code: 'DOC_NOT_REGISTERED', path: normalizedPath, message: `${normalizedPath} is not registered.` });
  if (!afterStatus) {
    issues.push({
      severity: 'error',
      code: 'DOC_UNKNOWN_STATUS',
      path: normalizedPath,
      field: 'status',
      received: options.status,
      allowedValues: [...VALID_STATUS_TOKENS],
      message: `Unsupported target status: ${options.status}. Allowed values: ${VALID_STATUS_TOKENS.join(', ')}.`
    });
  }
  if (entry && afterStatus) issues.push(...validateTransition(entry, afterStatus, options));
  if (entry && afterStatus === 'canonical' && options.correction && state.registry) {
    const conflicts = state.registry.documents
      .filter((doc) => doc.path !== entry.path && doc.status === 'canonical' && doc.kind === entry.kind && doc.scope === entry.scope)
      .map((doc) => doc.path);
    if (conflicts.length > 0) {
      issues.push({
        severity: 'warning',
        code: 'DOC_CLEANUP_CANONICAL_CONFLICT_WARNING',
        path: normalizedPath,
        message: `Marking ${normalizedPath} canonical conflicts with existing canonical ${entry.kind}:${entry.scope} docs: ${conflicts.join(', ')}. Run \`hadara docs doctor --json\` after execute and resolve the duplicate canonical entries.`
      });
    }
  }
  if (afterStatus === 'superseded' && options.by && state.registry && !state.registry.documents.some((doc) => doc.path === normalizePath(options.by ?? ''))) {
    issues.push({ severity: 'error', code: 'DOC_SUPERSEDES_MISSING_TARGET', path: normalizedPath, message: `${normalizePath(options.by)} is not a registered replacement document.` });
  }
  if (options.mode === 'execute' && !options.beforeHash) {
    issues.push({ severity: 'error', code: 'DOC_CLEANUP_BEFORE_HASH_REQUIRED', path: DOCS_REGISTRY_PATH, message: 'Execute mode requires --before-hash from the reviewed dry-run.' });
  }
  if (options.mode === 'execute' && options.beforeHash && options.beforeHash !== state.beforeHash) {
    issues.push({ severity: 'error', code: 'DOC_CLEANUP_BEFORE_HASH_MISMATCH', path: DOCS_REGISTRY_PATH, message: `Registry hash ${state.beforeHash} does not match reviewed hash ${options.beforeHash}.` });
  }
  const fieldDiff = createDocsMarkFieldDiff(entry, afterStatus, options);
  let ok = issues.every((issue) => issue.severity !== 'error');
  if (options.mode === 'execute' && ok && state.registry && entry && afterStatus) {
    entry.status = afterStatus;
    entry.notes = options.reason ? `${entry.notes ? `${entry.notes} ` : ''}Cleanup reason: ${options.reason}` : entry.notes;
    if (afterStatus === 'superseded') entry.supersededBy = normalizePath(options.by ?? '');
    try {
      atomicWriteTextFile(projectRoot, DOCS_REGISTRY_PATH, registryJson(state.registry));
    } catch (error) {
      ok = false;
      issues.push({ severity: 'error', code: 'DOC_CLEANUP_ATOMIC_WRITE_FAILED', path: DOCS_REGISTRY_PATH, message: `Could not write docs registry atomically: ${error instanceof Error ? error.message : String(error)}` });
    }
  }
  return {
    schemaVersion: 'hadara.docs.mark.v1',
    command: 'docs.mark',
    mode: options.mode,
    ok,
    path: normalizedPath,
    correction: options.correction === true,
    beforeStatus,
    afterStatus,
    fieldDiff,
    ...(afterStatus === 'superseded' && options.by ? { supersededBy: normalizePath(options.by) } : {}),
    reason: options.reason ?? null,
    registryPath: DOCS_REGISTRY_PATH,
    beforeHash: state.beforeHash,
    impact: {
      registryPatchPlanned: Boolean(entry && afterStatus && beforeStatus !== afterStatus),
      defaultRequiredReading: entry?.requiredReading && afterStatus && EXCLUDED_REQUIRED_READING_STATUSES.has(afterStatus) ? 'remove-after-execute' : 'unchanged',
      managedRequiredReadingPatchAvailable: fs.existsSync(path.join(projectRoot, 'AGENTS.md')) && fs.readFileSync(path.join(projectRoot, 'AGENTS.md'), 'utf8').includes('hadara:managed:start required-reading'),
      archiveCandidate: afterStatus ? ARCHIVE_STATUSES.has(afterStatus) : false
    },
    issues
  };
}

function createDocsMarkFieldDiff(entry: DocumentRegistryEntry | null, afterStatus: DocumentStatus | null, options: DocsMarkOptions): DocsMarkFieldDiff[] {
  if (!entry || !afterStatus) return [];
  const diff: DocsMarkFieldDiff[] = [];
  if (entry.status !== afterStatus) diff.push({ field: 'status', before: entry.status, after: afterStatus });
  const afterSupersededBy = afterStatus === 'superseded' && options.by ? normalizePath(options.by) : null;
  const beforeSupersededBy = entry.supersededBy ?? null;
  if (beforeSupersededBy !== afterSupersededBy && (beforeSupersededBy !== null || afterSupersededBy !== null)) {
    diff.push({ field: 'supersededBy', before: beforeSupersededBy, after: afterSupersededBy });
  }
  return diff;
}

export function createDocsRequiredReadingReport(projectRoot: string): DocsRequiredReadingReport {
  const state = readRegistry(projectRoot);
  const issues = [...state.issues];
  const documents: DocsRequiredReadingReport['documents'] = [];
  const excluded: DocsRequiredReadingReport['excluded'] = [];
  for (const doc of state.registry?.documents ?? []) {
    if (!doc.requiredReading) continue;
    const tier = requiredReadingTier(doc);
    if (EXCLUDED_REQUIRED_READING_STATUSES.has(doc.status)) {
      excluded.push({ path: doc.path, status: doc.status, tier, reason: `${doc.status} docs are not default required reading` });
    } else {
      documents.push({ path: doc.path, status: doc.status, readWhen: doc.readWhen, tier, reason: `${doc.status} ${doc.kind} doc` });
    }
  }
  return {
    schemaVersion: 'hadara.docs.requiredReading.v1',
    command: 'docs.required-reading',
    ok: issues.every((issue) => issue.severity !== 'error'),
    documents,
    excluded,
    issues
  };
}

function requiredReadingTier(doc: DocumentRegistryEntry): RequiredReadingTier {
  if (doc.status === 'superseded' || doc.status === 'archived') return 'excluded';
  if (doc.status === 'historical') return 'historical';
  if (doc.kind === 'workflow-guide' || doc.kind === 'task-board' || doc.kind === 'task-capsule' || doc.readWhen.some((readWhen) => readWhen === 'task-start' || readWhen === 'task-close')) {
    return 'task-work';
  }
  if (doc.kind === 'project-context' || doc.kind === 'project-state' || doc.kind === 'handoff' || doc.kind === 'protocol' || doc.readWhen.includes('session-start')) {
    return 'current-state';
  }
  return 'conditional-reference';
}

function validateTransition(entry: DocumentRegistryEntry, afterStatus: DocumentStatus, options: DocsMarkOptions): DocsIssue[] {
  const issues: DocsIssue[] = [];
  // FD-008: `--correction` opens ordinary metadata corrections (for example
  // canonical -> reference after an over-broad registration) without forcing
  // registry hand-edits. Guards stay: a reason is always required, superseded
  // still needs a replacement target, and correction-to-canonical emits a
  // conflict warning in createDocsMarkReport instead of silently stacking
  // canonical duplicates.
  const reasonRequired = options.correction === true || afterStatus === 'historical' || afterStatus === 'superseded';
  if (reasonRequired && !options.reason) {
    issues.push({ severity: 'error', code: 'DOC_CLEANUP_REASON_REQUIRED', path: entry.path, message: `${options.correction ? 'Correction' : afterStatus} transition requires --reason.` });
  }
  if (afterStatus === 'superseded' && !options.by) {
    issues.push({ severity: 'error', code: 'DOC_SUPERSEDES_MISSING_TARGET', path: entry.path, message: 'Superseded transition requires --by <path>.' });
  }
  if (!options.correction && entry.status === 'canonical' && afterStatus === 'superseded' && !options.forceCanonical) {
    issues.push({ severity: 'error', code: 'DOC_CLEANUP_CANONICAL_REVIEW_REQUIRED', path: entry.path, message: 'Superseding canonical docs requires --force-canonical.' });
  }
  if (!options.correction && !isAllowedTransition(entry.status, afterStatus, options.forceCanonical === true)) {
    issues.push({ severity: 'error', code: 'DOC_CLEANUP_INVALID_TRANSITION', path: entry.path, message: `Transition ${entry.status} -> ${afterStatus} is not allowed. Use --correction --reason <text> for ordinary registry metadata corrections.` });
  }
  return issues;
}

function isAllowedTransition(before: DocumentStatus, after: DocumentStatus, forceCanonical: boolean): boolean {
  if (before === after) return true;
  if (before === 'active') return after === 'reference' || after === 'historical' || after === 'superseded';
  if (before === 'reference') return after === 'historical' || after === 'superseded';
  if (before === 'historical' || before === 'superseded') return after === 'archived';
  if (before === 'canonical' && forceCanonical) return after === 'superseded';
  return false;
}

function readRegistry(projectRoot: string): { registry: DocumentRegistryFile | null; beforeHash: string; issues: DocsIssue[] } {
  const registryPath = path.join(projectRoot, DOCS_REGISTRY_PATH);
  if (!fs.existsSync(registryPath)) {
    return {
      registry: null,
      beforeHash: hashContent(''),
      issues: [{ severity: 'error', code: 'DOC_REGISTRY_MISSING', path: DOCS_REGISTRY_PATH, message: 'Docs registry is required for cleanup operations.' }]
    };
  }
  const content = fs.readFileSync(registryPath, 'utf8');
  try {
    return { registry: JSON.parse(content) as DocumentRegistryFile, beforeHash: hashContent(content), issues: [] };
  } catch (error) {
    return {
      registry: null,
      beforeHash: hashContent(content),
      issues: [{ severity: 'error', code: 'DOC_REGISTRY_INVALID_JSON', path: DOCS_REGISTRY_PATH, message: `Docs registry JSON could not be parsed: ${error instanceof Error ? error.message : String(error)}` }]
    };
  }
}

function completionSnapshot(entry: DocumentRegistryEntry): DocsCompleteSpecReport['before'] {
  return {
    status: entry.status,
    readWhen: [...entry.readWhen],
    requiredReading: entry.requiredReading,
    ...(entry.readTier ? { readTier: entry.readTier } : {}),
    ...(entry.activeForTasks ? { activeForTasks: [...entry.activeForTasks] } : {})
  };
}

function completedSpecSnapshot(entry: DocumentRegistryEntry, implementedBy: string): DocsCompleteSpecReport['after'] {
  return {
    status: 'historical',
    readWhen: ['only-when-linked'],
    requiredReading: false,
    readTier: 'implemented-reference',
    activeForTasks: unique([...(entry.activeForTasks ?? []), implementedBy])
  };
}

function taskExists(projectRoot: string, taskId: string): boolean {
  if (!/^T-\d{4,}$/.test(taskId)) return false;
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return false;
  return fs.readdirSync(tasksDir).some((entryName) => entryName.startsWith(`${taskId}-`) && fs.statSync(path.join(tasksDir, entryName)).isDirectory());
}

function appendNote(current: string | undefined, note: string): string {
  return current ? `${current} ${note}` : note;
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function arrayEqual(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function parseStatus(value: string): DocumentStatus | null {
  return value === 'canonical' || value === 'active' || value === 'reference' || value === 'historical' || value === 'superseded' || value === 'archived' ? value : null;
}

function normalizePath(value: string): string {
  return value.trim().replace(/\\/g, '/').replace(/^\.?\//, '');
}

function hashContent(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content, 'utf8').digest('hex')}`;
}
