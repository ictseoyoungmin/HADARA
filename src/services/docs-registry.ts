import fs from 'node:fs';
import path from 'node:path';
import type { InitProfile } from '../cli/init';
import { managedSectionBlock } from './managed-sections';
import { readMarkdownSection } from './markdown-table';

export type DocumentStatus = 'canonical' | 'active' | 'reference' | 'historical' | 'superseded' | 'archived';
export type DocumentKind =
  | 'project-context'
  | 'protocol'
  | 'project-state'
  | 'handoff'
  | 'task-board'
  | 'workflow-guide'
  | 'architecture'
  | 'decision-log'
  | 'test-strategy'
  | 'security-model'
  | 'roadmap'
  | 'release'
  | 'spec'
  | 'implementation-guide'
  | 'integration-guide'
  | 'task-capsule'
  | 'schema-reference'
  | 'historical-plan'
  | 'unknown';
export type ReadWhen = 'session-start' | 'task-start' | 'task-close' | 'release-work' | 'docs-work' | 'debugging' | 'integration-work' | 'only-when-linked' | 'never-default';

export interface ManagedSectionRef {
  id: string;
  owner: string;
  kind: string;
  required: boolean;
}

export interface DocumentRegistryEntry {
  path: string;
  title: string;
  owner: string;
  kind: DocumentKind;
  status: DocumentStatus;
  scope: 'project' | 'task' | 'release' | 'integration' | 'repo' | 'local';
  profiles: Array<InitProfile | 'hadara-dev'>;
  readWhen: ReadWhen[];
  requiredReading: boolean;
  updateOwner: 'human' | 'hadara-init' | 'hadara-task' | 'hadara-docs' | 'release-operator' | 'mixed';
  updatedByCommands: string[];
  managedSections: ManagedSectionRef[];
  closeSourceRole: 'included' | 'excluded' | 'task-dependent' | 'unknown';
  supersedes: string[];
  supersededBy?: string;
  generatedBy?: string;
  notes?: string;
}

export interface DocumentRegistryFile {
  schemaVersion: 'hadara.docs.registry.v1';
  registryVersion: number;
  projectProfile?: InitProfile | 'hadara-dev';
  generatedAt?: string;
  documents: DocumentRegistryEntry[];
}

export interface DocsIssue {
  severity: 'warning' | 'error';
  code: string;
  path?: string;
  message: string;
}

export interface DocsListReport {
  schemaVersion: 'hadara.docs.list.v1';
  command: 'docs.list';
  ok: boolean;
  source: { registryPath: '.hadara/docs-registry.json'; registryPresent: boolean; inferred: boolean };
  filters: { status: DocumentStatus | null; readWhen: ReadWhen | null };
  documents: DocumentRegistryEntry[];
  issues: DocsIssue[];
}

export interface DocsDoctorReport {
  schemaVersion: 'hadara.docs.doctor.v1';
  command: 'docs.doctor';
  ok: boolean;
  scope: 'registry' | 'profile' | 'required-reading' | 'links' | 'all';
  summary: {
    registryPresent: boolean;
    registeredDocuments: number;
    missingRegisteredDocuments: number;
    unregisteredActiveLookingDocuments: number;
    requiredReadingIssues: number;
    canonicalConflicts: number;
  };
  issues: DocsIssue[];
}

export interface DocsExplainReport {
  schemaVersion: 'hadara.docs.explain.v1';
  command: 'docs.explain';
  ok: boolean;
  path: string;
  document: DocumentRegistryEntry | null;
  guidance: {
    shouldReadNow: boolean;
    reason: string;
    safeToAutoUpdate: boolean;
    managedSections: ManagedSectionRef[];
  } | null;
  issues: DocsIssue[];
}

export interface DocsRegisterReport {
  schemaVersion: 'hadara.docs.register.v1';
  command: 'docs.register';
  ok: boolean;
  mode: 'dry-run' | 'execute';
  path: string;
  source: { registryPath: '.hadara/docs-registry.json'; registryPresent: boolean; inferred: boolean };
  action: 'create' | 'already-registered' | 'blocked';
  document: DocumentRegistryEntry | null;
  writes: string[];
  issues: DocsIssue[];
}

export const DOCS_REGISTRY_PATH = '.hadara/docs-registry.json';

const VALID_STATUSES: DocumentStatus[] = ['canonical', 'active', 'reference', 'historical', 'superseded', 'archived'];
const VALID_READ_WHEN: ReadWhen[] = ['session-start', 'task-start', 'task-close', 'release-work', 'docs-work', 'debugging', 'integration-work', 'only-when-linked', 'never-default'];

export function createSeedDocumentRegistry(profile: InitProfile | 'hadara-dev' = 'standard'): DocumentRegistryFile {
  return {
    schemaVersion: 'hadara.docs.registry.v1',
    registryVersion: 1,
    projectProfile: profile,
    documents: seedEntries(profile)
  };
}

export function createHadaraContextDoc(profile: InitProfile | 'hadara-dev', projectName = 'HADARA project', generatedBy = 'hadara init or protocol migrate'): string {
  return `# HADARA_CONTEXT

## Purpose

Compact project-local context anchor and read router.

This file is not the Required Reading authority, workflow manual, project history, task history, or evidence log. \`AGENTS.md\` owns Required Reading. \`docs/HADARA_WORKFLOW.md\` owns command and lifecycle guidance.

## Project

| Field | Value |
|---|---|
| Project | ${projectName.replace(/\|/g, '/')} |
| HADARA Protocol | 0.4 |
| Profile | ${profile} |
| Workflow Reference | \`docs/HADARA_WORKFLOW.md\` |
| Current State | \`docs/PROJECT_STATE.md\` |
| Task Board | \`docs/TASK_BOARD.md\` |
| Handoff | \`docs/AGENT_HANDOFF.md\` when present |
| Generated By | ${generatedBy.replace(/\|/g, '/')} |

## Read Routing

| Need | Read |
|---|---|
| Required reading and safety rules | \`AGENTS.md\` |
| Current project state | \`docs/PROJECT_STATE.md\` |
| Current or next task | \`docs/TASK_BOARD.md\` |
| HADARA command workflow | \`docs/HADARA_WORKFLOW.md\` |
| Task-specific scope and acceptance | Active \`tasks/T-*/TASK.md\` |
| Task continuation notes | Active \`tasks/T-*/HANDOFF.md\` |

## Rule

Prefer \`hadara session start --json\`, \`hadara task status --task T-XXXX --json\`, and \`hadara context pack --task T-XXXX --json\` before broad manual reading.

## Project-Specific Notes

Add short, non-secret notes only.

Do not store credentials, private logs, raw model transcripts, private user data, machine-local absolute paths, or large design documents here.
`;
}

export function renderDocRegistryMarkdown(registry: DocumentRegistryFile): string {
  const table = [
    '| Path | Kind | Status | Read When | Required | Owner |',
    '|---|---|---|---|---|---|',
    ...registry.documents.map((doc) => `| \`${doc.path}\` | ${doc.kind} | ${doc.status} | ${doc.readWhen.join(', ')} | ${doc.requiredReading ? 'yes' : 'no'} | ${doc.owner} |`)
  ].join('\n');
  return [
    '# DOC_REGISTRY',
    '',
    `Schema: \`${registry.schemaVersion}\``,
    '',
    managedSectionBlock('doc-registry-summary', {
      schema: 'hadara.managedSection.v1',
      owner: 'docs.registry',
      kind: 'markdown-table',
      mode: 'replace',
      version: 1,
      required: true,
      closeSourceRole: 'included'
    }, table),
    ''
  ].join('\n');
}

export function createDocsListReport(projectRoot: string, filters: { status?: string; readWhen?: string } = {}): DocsListReport {
  const state = loadRegistryOrInfer(projectRoot);
  const status = parseStatus(filters.status);
  const readWhen = parseReadWhen(filters.readWhen);
  const issues = [...state.issues];
  if (filters.status !== undefined && status === null) issues.push({ severity: 'error', code: 'DOC_UNKNOWN_STATUS', message: `Unknown document status: ${filters.status}` });
  if (filters.readWhen !== undefined && readWhen === null) issues.push({ severity: 'error', code: 'DOC_UNKNOWN_READ_WHEN', message: `Unknown read-when value: ${filters.readWhen}` });
  const documents = state.registry.documents.filter((doc) => {
    if (status && doc.status !== status) return false;
    if (readWhen && !doc.readWhen.includes(readWhen)) return false;
    return true;
  });
  return {
    schemaVersion: 'hadara.docs.list.v1',
    command: 'docs.list',
    ok: issues.every((issue) => issue.severity !== 'error'),
    source: state.source,
    filters: { status, readWhen },
    documents,
    issues
  };
}

export function createDocsDoctorReport(projectRoot: string, scope: string = 'all'): DocsDoctorReport {
  const normalizedScope = parseScope(scope);
  const state = loadRegistryOrInfer(projectRoot);
  const issues = [...state.issues, ...validateRegistry(projectRoot, state.registry)];
  const invalidScopeIssue: DocsIssue = { severity: 'error', code: 'DOC_DOCTOR_SCOPE_INVALID', message: `Unsupported docs doctor scope: ${scope}` };
  const visibleIssues = normalizedScope === null ? [invalidScopeIssue, ...issues] : filterIssuesByScope(issues, normalizedScope);
  const summary = {
    registryPresent: state.source.registryPresent,
    registeredDocuments: state.registry.documents.length,
    missingRegisteredDocuments: issues.filter((issue) => issue.code === 'DOC_REGISTERED_FILE_MISSING').length,
    unregisteredActiveLookingDocuments: issues.filter((issue) => issue.code === 'DOC_UNREGISTERED_ACTIVE_LOOKING').length,
    requiredReadingIssues: issues.filter((issue) => issue.code === 'DOC_UNREGISTERED_REQUIRED_READING' || issue.code === 'DOC_SUPERSEDED_REQUIRED_READING' || issue.code === 'DOC_HISTORICAL_REQUIRED_READING').length,
    canonicalConflicts: issues.filter((issue) => issue.code === 'DOC_CANONICAL_CONFLICT').length
  };
  return {
    schemaVersion: 'hadara.docs.doctor.v1',
    command: 'docs.doctor',
    ok: normalizedScope !== null && visibleIssues.every((issue) => issue.severity !== 'error'),
    scope: normalizedScope ?? 'all',
    summary,
    issues: visibleIssues
  };
}

export function createDocsExplainReport(projectRoot: string, documentPath: string): DocsExplainReport {
  const normalized = normalizePath(documentPath);
  const state = loadRegistryOrInfer(projectRoot);
  const document = state.registry.documents.find((doc) => doc.path === normalized) ?? null;
  const issues = [...state.issues];
  if (!document) issues.push({ severity: 'warning', code: 'DOC_NOT_REGISTERED', path: normalized, message: `${normalized} is not registered.` });
  return {
    schemaVersion: 'hadara.docs.explain.v1',
    command: 'docs.explain',
    ok: issues.every((issue) => issue.severity !== 'error'),
    path: normalized,
    document,
    guidance: document ? {
      shouldReadNow: document.requiredReading || document.readWhen.includes('session-start') || document.readWhen.includes('task-start'),
      reason: guidanceReason(document),
      safeToAutoUpdate: document.updateOwner === 'hadara-init' || document.updateOwner === 'hadara-docs',
      managedSections: document.managedSections
    } : null,
    issues
  };
}

export function createDocsRegisterReport(projectRoot: string, options: {
  documentPath: string;
  title?: string;
  kind?: string;
  status?: string;
  readWhen?: string;
  requiredReading?: boolean;
  requireExists?: boolean;
  mode?: 'dry-run' | 'execute';
}): DocsRegisterReport {
  const mode = options.mode ?? 'dry-run';
  const normalized = normalizePath(options.documentPath);
  const state = loadRegistryOrInfer(projectRoot);
  const issues = [...state.issues];
  const kind = parseKind(options.kind);
  const status = parseStatus(options.status ?? 'reference');
  const readWhen = parseReadWhen(options.readWhen ?? 'only-when-linked');
  if (!normalized) issues.push({ severity: 'error', code: 'DOC_REGISTER_PATH_REQUIRED', message: 'Document path is required.' });
  if (path.isAbsolute(options.documentPath) || normalized.startsWith('../') || normalized.includes('/../')) {
    issues.push({ severity: 'error', code: 'DOC_REGISTER_PATH_OUTSIDE_PROJECT', path: normalized, message: 'Document path must be project-relative.' });
  }
  if (options.kind !== undefined && kind === null) issues.push({ severity: 'error', code: 'DOC_UNKNOWN_KIND', path: normalized, message: `Unknown document kind: ${options.kind}` });
  if (status === null) issues.push({ severity: 'error', code: 'DOC_UNKNOWN_STATUS', path: normalized, message: `Unknown document status: ${options.status}` });
  if (readWhen === null) issues.push({ severity: 'error', code: 'DOC_UNKNOWN_READ_WHEN', path: normalized, message: `Unknown read-when value: ${options.readWhen}` });
  if (options.requireExists && normalized && !fs.existsSync(path.join(projectRoot, normalized))) {
    issues.push({ severity: 'error', code: 'DOC_REGISTER_FILE_MISSING', path: normalized, message: `${normalized} does not exist.` });
  }

  const existing = state.registry.documents.find((doc) => doc.path === normalized) ?? null;
  if (existing) {
    return {
      schemaVersion: 'hadara.docs.register.v1',
      command: 'docs.register',
      ok: issues.every((issue) => issue.severity !== 'error'),
      mode,
      path: normalized,
      source: state.source,
      action: issues.some((issue) => issue.severity === 'error') ? 'blocked' : 'already-registered',
      document: existing,
      writes: [],
      issues
    };
  }

  const document = issues.some((issue) => issue.severity === 'error') ? null : buildRegisteredDocument(state.registry, {
    path: normalized,
    title: options.title,
    kind: kind ?? inferKind(normalized),
    status: status ?? 'reference',
    readWhen: readWhen ?? 'only-when-linked',
    requiredReading: options.requiredReading ?? false
  });
  if (document && mode === 'execute') {
    const next: DocumentRegistryFile = {
      ...state.registry,
      generatedAt: new Date().toISOString(),
      documents: [...state.registry.documents, document].sort((a, b) => a.path.localeCompare(b.path))
    };
    writeRegistry(projectRoot, next);
  }

  return {
    schemaVersion: 'hadara.docs.register.v1',
    command: 'docs.register',
    ok: issues.every((issue) => issue.severity !== 'error'),
    mode,
    path: normalized,
    source: state.source,
    action: document ? 'create' : 'blocked',
    document,
    writes: document && mode === 'execute' ? [DOCS_REGISTRY_PATH] : [],
    issues
  };
}

export function registryJson(registry: DocumentRegistryFile): string {
  return `${JSON.stringify(registry, null, 2)}\n`;
}

function loadRegistryOrInfer(projectRoot: string): {
  registry: DocumentRegistryFile;
  issues: DocsIssue[];
  source: DocsListReport['source'];
} {
  const registryPath = path.join(projectRoot, DOCS_REGISTRY_PATH);
  if (!fs.existsSync(registryPath)) {
    return {
      registry: inferRegistry(projectRoot),
      issues: [{ severity: 'warning', code: 'DOC_REGISTRY_MISSING', path: DOCS_REGISTRY_PATH, message: 'Docs registry is missing; report was inferred from existing known files.' }],
      source: { registryPath: DOCS_REGISTRY_PATH, registryPresent: false, inferred: true }
    };
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as DocumentRegistryFile;
    return { registry: parsed, issues: [], source: { registryPath: DOCS_REGISTRY_PATH, registryPresent: true, inferred: false } };
  } catch (error) {
    return {
      registry: inferRegistry(projectRoot),
      issues: [{ severity: 'error', code: 'DOC_REGISTRY_INVALID_JSON', path: DOCS_REGISTRY_PATH, message: `Docs registry JSON could not be parsed: ${error instanceof Error ? error.message : String(error)}` }],
      source: { registryPath: DOCS_REGISTRY_PATH, registryPresent: true, inferred: true }
    };
  }
}

function inferRegistry(projectRoot: string): DocumentRegistryFile {
  const profile: InitProfile = fs.existsSync(path.join(projectRoot, 'docs/SECURITY_MODEL.md')) ? 'governed'
    : fs.existsSync(path.join(projectRoot, 'docs/ARCHITECTURE.md')) ? 'standard'
      : 'basic';
  const seed = createSeedDocumentRegistry(profile);
  return { ...seed, documents: seed.documents.filter((doc) => fs.existsSync(path.join(projectRoot, doc.path))) };
}

function validateRegistry(projectRoot: string, registry: DocumentRegistryFile): DocsIssue[] {
  const issues: DocsIssue[] = [];
  const expectedSeed = registry.projectProfile ? createSeedDocumentRegistry(registry.projectProfile).documents : [];
  const registeredPaths = new Set(registry.documents.map((doc) => doc.path));
  const seenCanonical = new Map<string, string>();
  for (const expected of expectedSeed) {
    if (!registeredPaths.has(expected.path) && fs.existsSync(path.join(projectRoot, expected.path))) {
      issues.push({
        severity: 'warning',
        code: 'DOC_INIT_PROFILE_DRIFT',
        path: expected.path,
        message: `${expected.path} exists for profile ${registry.projectProfile} but is missing from the docs registry.`
      });
    }
  }
  for (const doc of registry.documents) {
    if (!fs.existsSync(path.join(projectRoot, doc.path))) {
      issues.push({ severity: 'error', code: 'DOC_REGISTERED_FILE_MISSING', path: doc.path, message: `${doc.path} is registered but missing.` });
    }
    if (!VALID_STATUSES.includes(doc.status as DocumentStatus)) {
      issues.push({ severity: 'error', code: 'DOC_UNKNOWN_STATUS', path: doc.path, message: `${doc.path} has invalid status: ${doc.status}` });
    }
    if (doc.status === 'canonical') {
      const key = `${doc.kind}:${doc.scope}`;
      const existing = seenCanonical.get(key);
      if (existing) issues.push({ severity: 'error', code: 'DOC_CANONICAL_CONFLICT', path: doc.path, message: `${doc.path} conflicts with canonical ${existing} for ${key}.` });
      seenCanonical.set(key, doc.path);
    }
    if (doc.status === 'superseded' && (!doc.supersededBy || !registry.documents.some((candidate) => candidate.path === doc.supersededBy))) {
      issues.push({ severity: 'error', code: 'DOC_SUPERSEDES_MISSING_TARGET', path: doc.path, message: `${doc.path} is superseded but does not point to a registered replacement.` });
    }
    if (doc.status === 'superseded' || doc.status === 'historical') {
      issues.push({ severity: 'warning', code: 'DOC_ARCHIVE_CANDIDATE', path: doc.path, message: `${doc.path} can be considered for dry-run archive planning.` });
    }
  }
  for (const requiredPath of parseRequiredReading(projectRoot)) {
    const registered = registry.documents.find((doc) => doc.path === requiredPath);
    if (!registered) {
      issues.push({ severity: 'warning', code: 'DOC_UNREGISTERED_REQUIRED_READING', path: requiredPath, message: `${requiredPath} appears in Required Reading but is not registered.` });
    } else if (registered.status === 'superseded') {
      issues.push({ severity: 'warning', code: 'DOC_SUPERSEDED_REQUIRED_READING', path: requiredPath, message: `${requiredPath} is superseded but appears in Required Reading.` });
    } else if (registered.status === 'historical') {
      issues.push({ severity: 'warning', code: 'DOC_HISTORICAL_REQUIRED_READING', path: requiredPath, message: `${requiredPath} is historical but appears in Required Reading.` });
    }
  }
  for (const activePath of findActiveLookingDocs(projectRoot)) {
    if (!registry.documents.some((doc) => doc.path === activePath)) {
      issues.push({ severity: 'warning', code: 'DOC_UNREGISTERED_ACTIVE_LOOKING', path: activePath, message: `${activePath} looks active but is not registered.` });
    }
  }
  return issues;
}

function seedEntries(profile: InitProfile | 'hadara-dev'): DocumentRegistryEntry[] {
  const coreProfiles: DocumentRegistryEntry['profiles'] = ['basic', 'standard', 'governed', 'hadara-dev'];
  const standardProfiles: DocumentRegistryEntry['profiles'] = ['standard', 'governed', 'hadara-dev'];
  const governedProfiles: DocumentRegistryEntry['profiles'] = ['governed', 'hadara-dev'];
  const entries: DocumentRegistryEntry[] = [
    entry('.hadara/context/HADARA_CONTEXT.md', 'HADARA_CONTEXT', 'project-context', 'canonical', ['session-start'], true, 'mixed', coreProfiles),
    entry('AGENTS.md', 'AGENTS', 'protocol', 'canonical', ['session-start'], true, 'mixed', coreProfiles, 'repo'),
    entry('docs/HADARA_WORKFLOW.md', 'HADARA_WORKFLOW', 'workflow-guide', 'canonical', ['session-start', 'task-start'], true, 'mixed', coreProfiles),
    entry('docs/PROJECT_STATE.md', 'PROJECT_STATE', 'project-state', 'canonical', ['session-start'], true, 'mixed', coreProfiles),
    entry('docs/TASK_BOARD.md', 'TASK_BOARD', 'task-board', 'active', ['task-start'], true, 'hadara-task', coreProfiles)
  ];
  if (profile !== 'basic') {
    entries.push(
      entry('docs/ARCHITECTURE.md', 'ARCHITECTURE', 'architecture', 'reference', ['only-when-linked'], false, 'human', standardProfiles),
      entry('docs/DECISIONS.md', 'DECISIONS', 'decision-log', 'reference', ['only-when-linked'], false, 'human', standardProfiles),
      entry('docs/ROADMAP.md', 'ROADMAP', 'roadmap', 'reference', ['only-when-linked'], false, 'human', standardProfiles)
    );
  }
  if (profile === 'governed' || profile === 'hadara-dev') {
    entries.push(
      entry('docs/AGENT_HANDOFF.md', 'AGENT_HANDOFF', 'handoff', 'canonical', ['session-start'], true, 'mixed', governedProfiles),
      entry('docs/SECURITY_MODEL.md', 'SECURITY_MODEL', 'security-model', 'reference', ['only-when-linked'], false, 'human', governedProfiles)
    );
  }
  return entries;
}

function entry(
  pathValue: string,
  title: string,
  kind: DocumentKind,
  status: DocumentStatus,
  readWhen: ReadWhen[],
  requiredReading: boolean,
  updateOwner: DocumentRegistryEntry['updateOwner'],
  profiles: DocumentRegistryEntry['profiles'],
  scope: DocumentRegistryEntry['scope'] = 'project'
): DocumentRegistryEntry {
  return {
    path: pathValue,
    title,
    owner: 'hadara-docs',
    kind,
    status,
    scope,
    profiles,
    readWhen,
    requiredReading,
    updateOwner,
    updatedByCommands: [],
    managedSections: [],
    closeSourceRole: requiredReading || status === 'active' ? 'included' : 'task-dependent',
    supersedes: [],
    generatedBy: 'hadara init'
  };
}

function parseRequiredReading(projectRoot: string): string[] {
  const files = ['AGENTS.md', 'docs/IMPLEMENTATION_SOP.md'];
  const found = new Set<string>();
  for (const file of files) {
    const text = fs.existsSync(path.join(projectRoot, file)) ? fs.readFileSync(path.join(projectRoot, file), 'utf8') : '';
    const requiredReading = readMarkdownSection(text, '## Required Reading');
    for (const match of requiredReading.matchAll(/`([^`]+\.(?:md|MD))`/g)) {
      const value = normalizePath(match[1]);
      if (value !== 'AGENTS.md' && !value.startsWith('docs/') && value !== '.hadara/context/HADARA_CONTEXT.md') continue;
      if (!value.startsWith('tasks/')) found.add(value);
    }
  }
  return [...found];
}

function findActiveLookingDocs(projectRoot: string): string[] {
  const dirs = ['docs/specs', 'docs/specs/0.3.0'];
  const found: string[] = [];
  for (const dir of dirs) {
    const full = path.join(projectRoot, dir);
    if (!fs.existsSync(full)) continue;
    for (const name of fs.readdirSync(full)) {
      if (name.endsWith('.md')) found.push(`${dir}/${name}`);
    }
  }
  return found;
}

function parseStatus(value?: string): DocumentStatus | null {
  if (value === undefined) return null;
  return VALID_STATUSES.includes(value as DocumentStatus) ? value as DocumentStatus : null;
}

function parseKind(value?: string): DocumentKind | null {
  if (value === undefined) return null;
  const kinds: DocumentKind[] = [
    'project-context', 'protocol', 'project-state', 'handoff', 'task-board', 'workflow-guide', 'architecture', 'decision-log',
    'test-strategy', 'security-model', 'roadmap', 'release', 'spec', 'implementation-guide', 'integration-guide', 'task-capsule',
    'schema-reference', 'historical-plan', 'unknown'
  ];
  return kinds.includes(value as DocumentKind) ? value as DocumentKind : null;
}

function parseReadWhen(value?: string): ReadWhen | null {
  if (value === undefined) return null;
  return VALID_READ_WHEN.includes(value as ReadWhen) ? value as ReadWhen : null;
}

function parseScope(value: string): DocsDoctorReport['scope'] | null {
  return value === 'registry' || value === 'profile' || value === 'required-reading' || value === 'links' || value === 'all' ? value : null;
}

function filterIssuesByScope(issues: DocsIssue[], scope: DocsDoctorReport['scope']): DocsIssue[] {
  if (scope === 'all') return issues;
  if (scope === 'registry') return issues.filter((issue) => issue.code.startsWith('DOC_REGISTRY') || issue.code === 'DOC_REGISTERED_FILE_MISSING' || issue.code === 'DOC_CANONICAL_CONFLICT' || issue.code === 'DOC_UNKNOWN_STATUS' || issue.code === 'DOC_SUPERSEDES_MISSING_TARGET' || issue.code === 'DOC_ARCHIVE_CANDIDATE');
  if (scope === 'required-reading') return issues.filter((issue) => issue.code.includes('REQUIRED_READING'));
  if (scope === 'links') return issues.filter((issue) => issue.code === 'DOC_UNREGISTERED_ACTIVE_LOOKING');
  if (scope === 'profile') return issues.filter((issue) => issue.code === 'DOC_INIT_PROFILE_DRIFT');
  return [];
}

function guidanceReason(doc: DocumentRegistryEntry): string {
  if (doc.readWhen.includes('session-start')) return `Canonical ${doc.kind} document used at session start.`;
  if (doc.readWhen.includes('task-start')) return `${doc.kind} document used when starting or closing task work.`;
  if (doc.readWhen.includes('never-default')) return `${doc.kind} document is historical and should not be default required reading.`;
  return `${doc.kind} document should be read ${doc.readWhen.join(', ')}.`;
}

function normalizePath(value: string): string {
  return value.trim().replace(/\\/g, '/').replace(/^\.?\//, '');
}

function inferKind(documentPath: string): DocumentKind {
  if (documentPath.startsWith('docs/specs/')) return 'spec';
  if (documentPath === 'docs/ARCHITECTURE.md') return 'architecture';
  if (documentPath === 'docs/DECISIONS.md') return 'decision-log';
  if (documentPath === 'docs/ROADMAP.md') return 'roadmap';
  if (documentPath.endsWith('SCHEMAS.md')) return 'schema-reference';
  return 'unknown';
}

function buildRegisteredDocument(registry: DocumentRegistryFile, input: {
  path: string;
  title?: string;
  kind: DocumentKind;
  status: DocumentStatus;
  readWhen: ReadWhen;
  requiredReading: boolean;
}): DocumentRegistryEntry {
  return {
    path: input.path,
    title: input.title ?? titleFromPath(input.path),
    owner: 'hadara-docs',
    kind: input.kind,
    status: input.status,
    scope: 'project',
    profiles: registry.projectProfile ? [registry.projectProfile] : ['basic', 'standard', 'governed', 'hadara-dev'],
    readWhen: [input.readWhen],
    requiredReading: input.requiredReading,
    updateOwner: 'human',
    updatedByCommands: ['docs.register'],
    managedSections: [],
    closeSourceRole: input.requiredReading ? 'included' : 'task-dependent',
    supersedes: []
  };
}

function titleFromPath(documentPath: string): string {
  return path.basename(documentPath).replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
}

function writeRegistry(projectRoot: string, registry: DocumentRegistryFile): void {
  const target = path.join(projectRoot, DOCS_REGISTRY_PATH);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const temp = `${target}.${process.pid}.tmp`;
  fs.writeFileSync(temp, registryJson(registry));
  fs.renameSync(temp, target);
}
