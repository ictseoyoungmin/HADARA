import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  DOCS_REGISTRY_PATH,
  DocumentRegistryEntry,
  DocumentRegistryFile,
  DocumentStatus,
  DocsIssue,
  registryJson
} from './docs-registry';

export interface DocsMarkReport {
  schemaVersion: 'hadara.docs.mark.v1';
  command: 'docs.mark';
  mode: 'dry-run' | 'execute';
  ok: boolean;
  path: string;
  beforeStatus: DocumentStatus | null;
  afterStatus: DocumentStatus | null;
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

export interface DocsArchivePlanReport {
  schemaVersion: 'hadara.docs.archivePlan.v1';
  command: 'docs.archive';
  mode: 'dry-run';
  ok: boolean;
  filters: { status: DocumentStatus | null };
  candidates: Array<{
    path: string;
    currentStatus: DocumentStatus;
    suggestedArchivePath: string;
    referencedByActiveDocs: string[];
    referencedByTaskEvidence: string[];
    risk: 'low' | 'active-doc-reference' | 'evidence-link-reference';
    executeSupported: false;
  }>;
  issues: DocsIssue[];
}

export interface DocsRequiredReadingReport {
  schemaVersion: 'hadara.docs.requiredReading.v1';
  command: 'docs.required-reading';
  ok: boolean;
  documents: Array<{ path: string; status: DocumentStatus; readWhen: string[]; reason: string }>;
  excluded: Array<{ path: string; status: DocumentStatus; reason: string }>;
  issues: DocsIssue[];
}

export interface DocsMarkOptions {
  documentPath: string;
  status: string;
  reason?: string;
  by?: string;
  mode: 'dry-run' | 'execute';
  beforeHash?: string;
  forceCanonical?: boolean;
}

const EXCLUDED_REQUIRED_READING_STATUSES = new Set<DocumentStatus>(['historical', 'superseded', 'archived']);
const ARCHIVE_STATUSES = new Set<DocumentStatus>(['historical', 'superseded']);

export function createDocsMarkReport(projectRoot: string, options: DocsMarkOptions): DocsMarkReport {
  const state = readRegistry(projectRoot);
  const normalizedPath = normalizePath(options.documentPath);
  const afterStatus = parseStatus(options.status);
  const issues = [...state.issues];
  const entry = state.registry?.documents.find((doc) => doc.path === normalizedPath) ?? null;
  const beforeStatus = entry?.status ?? null;
  if (!entry) issues.push({ severity: 'error', code: 'DOC_NOT_REGISTERED', path: normalizedPath, message: `${normalizedPath} is not registered.` });
  if (!afterStatus) issues.push({ severity: 'error', code: 'DOC_UNKNOWN_STATUS', path: normalizedPath, message: `Unsupported target status: ${options.status}` });
  if (entry && afterStatus) issues.push(...validateTransition(entry, afterStatus, options));
  if (afterStatus === 'superseded' && options.by && state.registry && !state.registry.documents.some((doc) => doc.path === normalizePath(options.by ?? ''))) {
    issues.push({ severity: 'error', code: 'DOC_SUPERSEDES_MISSING_TARGET', path: normalizedPath, message: `${normalizePath(options.by)} is not a registered replacement document.` });
  }
  if (options.mode === 'execute' && !options.beforeHash) {
    issues.push({ severity: 'error', code: 'DOC_CLEANUP_BEFORE_HASH_REQUIRED', path: DOCS_REGISTRY_PATH, message: 'Execute mode requires --before-hash from the reviewed dry-run.' });
  }
  if (options.mode === 'execute' && options.beforeHash && options.beforeHash !== state.beforeHash) {
    issues.push({ severity: 'error', code: 'DOC_CLEANUP_BEFORE_HASH_MISMATCH', path: DOCS_REGISTRY_PATH, message: `Registry hash ${state.beforeHash} does not match reviewed hash ${options.beforeHash}.` });
  }
  const ok = issues.every((issue) => issue.severity !== 'error');
  if (options.mode === 'execute' && ok && state.registry && entry && afterStatus) {
    entry.status = afterStatus;
    entry.notes = options.reason ? `${entry.notes ? `${entry.notes} ` : ''}Cleanup reason: ${options.reason}` : entry.notes;
    if (afterStatus === 'superseded') entry.supersededBy = normalizePath(options.by ?? '');
    fs.writeFileSync(path.join(projectRoot, DOCS_REGISTRY_PATH), registryJson(state.registry), 'utf8');
  }
  return {
    schemaVersion: 'hadara.docs.mark.v1',
    command: 'docs.mark',
    mode: options.mode,
    ok,
    path: normalizedPath,
    beforeStatus,
    afterStatus,
    ...(afterStatus === 'superseded' && options.by ? { supersededBy: normalizePath(options.by) } : {}),
    reason: options.reason ?? null,
    registryPath: DOCS_REGISTRY_PATH,
    beforeHash: state.beforeHash,
    impact: {
      registryPatchPlanned: Boolean(entry && afterStatus && beforeStatus !== afterStatus),
      defaultRequiredReading: entry?.requiredReading && afterStatus && EXCLUDED_REQUIRED_READING_STATUSES.has(afterStatus) ? 'remove-after-execute' : 'unchanged',
      managedRequiredReadingPatchAvailable: fs.existsSync(path.join(projectRoot, 'docs/IMPLEMENTATION_SOP.md')) && fs.readFileSync(path.join(projectRoot, 'docs/IMPLEMENTATION_SOP.md'), 'utf8').includes('hadara:managed:start required-reading'),
      archiveCandidate: afterStatus ? ARCHIVE_STATUSES.has(afterStatus) : false
    },
    issues
  };
}

export function createDocsArchivePlanReport(projectRoot: string, status: string | undefined): DocsArchivePlanReport {
  const state = readRegistry(projectRoot);
  const filterStatus = status ? parseStatus(status) : 'superseded';
  const issues = [...state.issues];
  if (!filterStatus || !ARCHIVE_STATUSES.has(filterStatus)) {
    issues.push({ severity: 'error', code: 'DOC_CLEANUP_INVALID_TRANSITION', message: `Archive planning supports historical or superseded status, not ${status ?? 'unknown'}.` });
  }
  const candidates = state.registry && filterStatus
    ? state.registry.documents.filter((doc) => doc.status === filterStatus).map((doc) => archiveCandidate(projectRoot, state.registry!, doc))
    : [];
  return {
    schemaVersion: 'hadara.docs.archivePlan.v1',
    command: 'docs.archive',
    mode: 'dry-run',
    ok: issues.every((issue) => issue.severity !== 'error'),
    filters: { status: filterStatus },
    candidates,
    issues
  };
}

export function createDocsRequiredReadingReport(projectRoot: string): DocsRequiredReadingReport {
  const state = readRegistry(projectRoot);
  const issues = [...state.issues];
  const documents: DocsRequiredReadingReport['documents'] = [];
  const excluded: DocsRequiredReadingReport['excluded'] = [];
  for (const doc of state.registry?.documents ?? []) {
    if (!doc.requiredReading) continue;
    if (EXCLUDED_REQUIRED_READING_STATUSES.has(doc.status)) {
      excluded.push({ path: doc.path, status: doc.status, reason: `${doc.status} docs are not default required reading` });
    } else {
      documents.push({ path: doc.path, status: doc.status, readWhen: doc.readWhen, reason: `${doc.status} ${doc.kind} doc` });
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

function validateTransition(entry: DocumentRegistryEntry, afterStatus: DocumentStatus, options: DocsMarkOptions): DocsIssue[] {
  const issues: DocsIssue[] = [];
  const reasonRequired = afterStatus === 'historical' || afterStatus === 'superseded';
  if (reasonRequired && !options.reason) {
    issues.push({ severity: 'error', code: 'DOC_CLEANUP_REASON_REQUIRED', path: entry.path, message: `${afterStatus} transition requires --reason.` });
  }
  if (afterStatus === 'superseded' && !options.by) {
    issues.push({ severity: 'error', code: 'DOC_SUPERSEDES_MISSING_TARGET', path: entry.path, message: 'Superseded transition requires --by <path>.' });
  }
  if (entry.status === 'canonical' && afterStatus === 'superseded' && !options.forceCanonical) {
    issues.push({ severity: 'error', code: 'DOC_CLEANUP_CANONICAL_REVIEW_REQUIRED', path: entry.path, message: 'Superseding canonical docs requires --force-canonical.' });
  }
  if (!isAllowedTransition(entry.status, afterStatus, options.forceCanonical === true)) {
    issues.push({ severity: 'error', code: 'DOC_CLEANUP_INVALID_TRANSITION', path: entry.path, message: `Transition ${entry.status} -> ${afterStatus} is not allowed.` });
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

function archiveCandidate(projectRoot: string, registry: DocumentRegistryFile, doc: DocumentRegistryEntry): DocsArchivePlanReport['candidates'][number] {
  const activeRefs = registry.documents
    .filter((candidate) => candidate.path !== doc.path && candidate.status !== 'historical' && candidate.status !== 'superseded' && candidate.status !== 'archived')
    .filter((candidate) => fileMentions(projectRoot, candidate.path, doc.path))
    .map((candidate) => candidate.path);
  const evidenceRefs = findTaskEvidenceReferences(projectRoot, doc.path);
  return {
    path: doc.path,
    currentStatus: doc.status,
    suggestedArchivePath: `docs/archive/${doc.path.replace(/^docs\//, '')}`,
    referencedByActiveDocs: activeRefs,
    referencedByTaskEvidence: evidenceRefs,
    risk: activeRefs.length > 0 ? 'active-doc-reference' : evidenceRefs.length > 0 ? 'evidence-link-reference' : 'low',
    executeSupported: false
  };
}

function fileMentions(projectRoot: string, documentPath: string, target: string): boolean {
  const absolutePath = path.join(projectRoot, documentPath);
  return fs.existsSync(absolutePath) && fs.readFileSync(absolutePath, 'utf8').includes(target);
}

function findTaskEvidenceReferences(projectRoot: string, target: string): string[] {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return [];
  const found: string[] = [];
  for (const dirName of fs.readdirSync(tasksDir)) {
    const dir = path.join(tasksDir, dirName);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const name of ['EVIDENCE.md', 'evidence.jsonl']) {
      const evidencePath = path.join(dir, name);
      if (fs.existsSync(evidencePath) && fs.readFileSync(evidencePath, 'utf8').includes(target)) {
        found.push(`tasks/${dirName}/${name}`);
      }
    }
  }
  return found;
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

function parseStatus(value: string): DocumentStatus | null {
  return value === 'canonical' || value === 'active' || value === 'reference' || value === 'historical' || value === 'superseded' || value === 'archived' ? value : null;
}

function normalizePath(value: string): string {
  return value.trim().replace(/\\/g, '/').replace(/^\.?\//, '');
}

function hashContent(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content, 'utf8').digest('hex')}`;
}
