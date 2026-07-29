import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { InitProfile } from '../cli/init';
import { managedSectionBlock } from './managed-sections';
import { readMarkdownSection } from './markdown-table';

export type DocumentStatus = 'canonical' | 'active' | 'reference' | 'historical' | 'superseded' | 'archived';
export type DocumentKind =
  | 'project-context'
  | 'protocol'
  | 'task-board'
  | 'workflow-guide'
  | 'architecture'
  | 'decision-log'
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
export type DocsReadTier = 'bootstrap' | 'current-state' | 'workflow-reference' | 'active-task' | 'active-spec' | 'conditional-reference' | 'implemented-reference' | 'drift-review' | 'historical' | 'excluded';
export type DocsAuthority = 'exploratory' | 'proposed' | 'approved' | 'normative' | 'implementation-source' | 'reference-only' | 'historical';
export type DocsEditPolicy = 'human-only' | 'agent-assisted' | 'agent-editable-with-request' | 'agent-editable-with-review' | 'cli-owned' | 'generated-projection';
export type DocsOriginType = 'hadara-scaffold' | 'hadara-projection' | 'task-generated' | 'project-authored' | 'imported';

export interface DocumentRegistryProject {
  id: string;
  name?: string;
  hadaraProfile: InitProfile;
}

export interface DocumentOrigin {
  type: DocsOriginType;
  generator?: string;
  template?: string;
  taskId?: string;
}

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
  profiles: InitProfile[];
  applicableProfiles?: InitProfile[];
  origin?: DocumentOrigin;
  readWhen: ReadWhen[];
  requiredReading: boolean;
  updateOwner: 'human' | 'hadara-init' | 'hadara-task' | 'hadara-docs' | 'release-operator' | 'mixed';
  updatedByCommands: string[];
  managedSections: ManagedSectionRef[];
  closeSourceRole: 'included' | 'excluded' | 'task-dependent' | 'unknown';
  readTier?: DocsReadTier;
  authority?: DocsAuthority;
  editPolicy?: DocsEditPolicy;
  activeForTasks?: string[];
  drift?: {
    risk: 'low' | 'medium' | 'high';
    reviewRequiredBeforeUse: boolean;
    reason: string;
  };
  supersedes: string[];
  supersededBy?: string;
  generatedBy?: string;
  notes?: string;
}

export interface DocumentRegistryFile {
  schemaVersion: 'hadara.docs.registry.v1' | 'hadara.docsRegistry.v2' | 'hadara.docsRegistry.v3';
  registryVersion: number;
  project?: DocumentRegistryProject;
  projectProfile?: InitProfile | 'hadara-dev';
  generatedAt?: string;
  documents: DocumentRegistryEntry[];
}

export interface DocsIssue {
  severity: 'warning' | 'error';
  code: string;
  path?: string;
  message: string;
  field?: string;
  received?: string;
  allowedValues?: string[];
  suggestion?: string;
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
  semantics: {
    ok: 'command-completed-without-error-issues';
    health: 'compatibility-document-health';
    currentnessVerdict: 'clean-warning-or-semantic-drift';
  };
  summary: {
    health: 'healthy' | 'warning' | 'drifted';
    currentnessVerdict: 'clean' | 'warning' | 'drifted';
    registryPresent: boolean;
    registeredDocuments: number;
    missingRegisteredDocuments: number;
    unregisteredActiveLookingDocuments: number;
    requiredReadingIssues: number;
    canonicalConflicts: number;
    currentnessIssues: number;
    semanticDriftIssues: number;
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
  beforeHash: string;
  action: 'create' | 'already-registered' | 'blocked';
  document: DocumentRegistryEntry | null;
  writes: string[];
  issues: DocsIssue[];
  executeCommand?: string;
}

export interface DocsRegistryMutationReport {
  schemaVersion: 'hadara.docs.registryMutation.v1';
  command: 'docs.update' | 'docs.archive' | 'docs.supersede' | 'docs.unregister' | 'docs.render';
  ok: boolean;
  mode: 'dry-run' | 'execute';
  action: 'update' | 'archive' | 'supersede' | 'unregister' | 'render' | 'already-current' | 'already-unregistered' | 'blocked';
  path: string;
  registryPath: typeof DOCS_REGISTRY_PATH;
  beforeHash: string;
  before: unknown;
  after: unknown;
  changedFields: Array<{ field: string; before: unknown; after: unknown }>;
  writes: string[];
  issues: DocsIssue[];
  executeCommand?: string;
}

export interface DocsReadMapEntry {
  path: string;
  title: string;
  kind: string;
  status: string;
  readWhen: string[];
  readTier: DocsReadTier;
  authority: DocsAuthority;
  editPolicy: DocsEditPolicy;
  source: 'registry' | 'task-capsule' | 'discovery';
  reason: string;
}

export interface DocsDriftWarning {
  code: string;
  path: string;
  risk: 'low' | 'medium' | 'high';
  reviewRequiredBeforeUse: boolean;
  reason: string;
}

export interface DocsReadMapReport {
  schemaVersion: 'hadara.docs.readMap.v1';
  command: 'docs.read-map';
  ok: boolean;
  taskId: string;
  source: { registryPath: '.hadara/docs-registry.json'; registryPresent: boolean; inferred: boolean };
  task: { capsulePath: string | null; capsulePresent: boolean; title: string | null };
  readFirst: DocsReadMapEntry[];
  readIfNeeded: DocsReadMapEntry[];
  doNotReadByDefault: DocsReadMapEntry[];
  driftWarnings: DocsDriftWarning[];
  issues: DocsIssue[];
}

export interface DocsInboxReport {
  schemaVersion: 'hadara.docs.inbox.v1';
  command: 'docs.inbox';
  ok: boolean;
  source: { registryPath: '.hadara/docs-registry.json'; registryPresent: boolean; inferred: boolean };
  summary: { items: number; errors: number; warnings: number };
  items: DocsIssue[];
  issues: DocsIssue[];
}

export const DOCS_REGISTRY_PATH = '.hadara/docs-registry.json';

const VALID_STATUSES: DocumentStatus[] = ['canonical', 'active', 'reference', 'historical', 'superseded', 'archived'];
const VALID_KINDS: DocumentKind[] = [
  'project-context',
  'protocol',
  'task-board',
  'workflow-guide',
  'architecture',
  'decision-log',
  'security-model',
  'roadmap',
  'release',
  'spec',
  'implementation-guide',
  'integration-guide',
  'task-capsule',
  'schema-reference',
  'historical-plan',
  'unknown'
];
const VALID_READ_WHEN: ReadWhen[] = ['session-start', 'task-start', 'task-close', 'release-work', 'docs-work', 'debugging', 'integration-work', 'only-when-linked', 'never-default'];
const VALID_READ_TIERS: DocsReadTier[] = ['bootstrap', 'current-state', 'workflow-reference', 'active-task', 'active-spec', 'conditional-reference', 'implemented-reference', 'drift-review', 'historical', 'excluded'];
const VALID_AUTHORITIES: DocsAuthority[] = ['exploratory', 'proposed', 'approved', 'normative', 'implementation-source', 'reference-only', 'historical'];
const VALID_EDIT_POLICIES: DocsEditPolicy[] = ['human-only', 'agent-assisted', 'agent-editable-with-request', 'agent-editable-with-review', 'cli-owned', 'generated-projection'];
const VALID_DRIFT_RISKS = ['low', 'medium', 'high'] as const;
export const DOCS_REGISTER_ALLOWED_VALUES = {
  kind: VALID_KINDS,
  status: VALID_STATUSES,
  readWhen: VALID_READ_WHEN,
  readTier: VALID_READ_TIERS,
  authority: VALID_AUTHORITIES,
  editPolicy: VALID_EDIT_POLICIES,
  driftRisk: VALID_DRIFT_RISKS
} as const;

const DOC_REGISTER_TOKEN_ALIASES: Record<string, Record<string, string>> = {
  kind: {
    guide: 'workflow-guide',
    doc: 'workflow-guide',
    documentation: 'workflow-guide'
  },
  authority: {
    project: 'normative',
    approved: 'approved',
    reference: 'reference-only'
  },
  editPolicy: {
    'human-reviewed': 'agent-editable-with-review',
    'human-review': 'agent-editable-with-review',
    readonly: 'human-only'
  },
  readWhen: {
    linked: 'only-when-linked',
    task: 'task-start',
    session: 'session-start',
    release: 'release-work'
  }
};
const ACTIVE_DOC_DISCOVERY_LIMIT = 200;

export function createSeedDocumentRegistry(
  profile: InitProfile | 'hadara-dev' = 'standard',
  schemaVersion: DocumentRegistryFile['schemaVersion'] = 'hadara.docsRegistry.v2'
): DocumentRegistryFile {
  return {
    schemaVersion,
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
| Task Board | \`docs/TASK_BOARD.md\` |
| Task Capsules | \`tasks/T-*/\` |
| Generated By | ${generatedBy.replace(/\|/g, '/')} |

## Read Routing

| Need | Read |
|---|---|
| Required reading and safety rules | \`AGENTS.md\` |
| Current or next task | \`hadara task status --json\`, then \`docs/TASK_BOARD.md\` and the selected Task Capsule |
| Task queue and completed-task index | \`docs/TASK_BOARD.md\` |
| HADARA command workflow | \`docs/HADARA_WORKFLOW.md\` |
| Task-specific scope and acceptance | Active \`tasks/T-*/TASK.md\` |
| Task continuation notes | Active \`tasks/T-*/HANDOFF.md\` |

## Rule

Prefer \`hadara task status --json\`, \`hadara task status --task T-XXXX --json\`, and \`hadara context pack --task T-XXXX --json\` before broad manual reading.

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
  const issues = [...state.issues, ...validateRegistryMetadata(state.registry)];
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
  const issues = [
    ...state.issues,
    ...validateRegistry(projectRoot, state.registry),
    ...validateActiveDocumentCurrentness(projectRoot, state.registry)
  ];
  const invalidScopeIssue: DocsIssue = { severity: 'error', code: 'DOC_DOCTOR_SCOPE_INVALID', message: `Unsupported docs doctor scope: ${scope}` };
  const visibleIssues = normalizedScope === null ? [invalidScopeIssue, ...issues] : filterIssuesByScope(issues, normalizedScope);
  const semanticDriftIssues = visibleIssues.filter(isSemanticCurrentnessIssue).length;
  const hasErrors = visibleIssues.some((issue) => issue.severity === 'error');
  const summary = {
    health: visibleIssues.some((issue) => issue.severity === 'error')
      ? 'drifted' as const
      : visibleIssues.length > 0 ? 'warning' as const : 'healthy' as const,
    currentnessVerdict: hasErrors || semanticDriftIssues > 0
      ? 'drifted' as const
      : visibleIssues.length > 0 ? 'warning' as const : 'clean' as const,
    registryPresent: state.source.registryPresent,
    registeredDocuments: state.registry.documents.length,
    missingRegisteredDocuments: issues.filter((issue) => issue.code === 'DOC_REGISTERED_FILE_MISSING').length,
    unregisteredActiveLookingDocuments: issues.filter((issue) => issue.code === 'DOC_UNREGISTERED_ACTIVE_LOOKING').length,
    requiredReadingIssues: issues.filter((issue) => issue.code === 'DOC_UNREGISTERED_REQUIRED_READING' || issue.code === 'DOC_SUPERSEDED_REQUIRED_READING' || issue.code === 'DOC_HISTORICAL_REQUIRED_READING').length,
    canonicalConflicts: issues.filter((issue) => issue.code === 'DOC_CANONICAL_CONFLICT').length,
    currentnessIssues: visibleIssues.filter(isSemanticCurrentnessIssue).length,
    semanticDriftIssues
  };
  return {
    schemaVersion: 'hadara.docs.doctor.v1',
    command: 'docs.doctor',
    ok: normalizedScope !== null && visibleIssues.every((issue) => issue.severity !== 'error'),
    scope: normalizedScope ?? 'all',
    semantics: {
      ok: 'command-completed-without-error-issues',
      health: 'compatibility-document-health',
      currentnessVerdict: 'clean-warning-or-semantic-drift'
    },
    summary,
    issues: visibleIssues
  };
}

function isSemanticCurrentnessIssue(issue: DocsIssue): boolean {
  return issue.code === 'DOC_STALE_INSTALL_VERSION' ||
    issue.code === 'DOC_REMOVED_COMMAND_EXAMPLE';
}

const REMOVED_COMMAND_EXAMPLE_PATTERNS = [
  /^hadara task (?:next|show|lifecycle|finish|ready|audit-close|complete)\b/,
  /^hadara (?:proof (?:status|explain)|evidence summary|ci gate|state verify|package smoke)\b/,
  /^hadara help command (?:task\.(?:next|show|lifecycle|finish|ready|audit-close|complete)|proof\.(?:status|explain)|evidence\.summary|ci\.gate|state\.verify|package\.smoke)\b/
];

function validateActiveDocumentCurrentness(projectRoot: string, registry: DocumentRegistryFile): DocsIssue[] {
  const issues: DocsIssue[] = [];
  const activePaths = new Set(
    registry.documents
      .filter((doc) => doc.status === 'canonical' || doc.status === 'active')
      .map((doc) => doc.path)
  );
  if (fs.existsSync(path.join(projectRoot, 'README.md'))) activePaths.add('README.md');

  const packageVersion = readHadaraPackageVersion(projectRoot);
  for (const documentPath of activePaths) {
    const absolutePath = path.join(projectRoot, documentPath);
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) continue;
    const lines = fs.readFileSync(absolutePath, 'utf8').split(/\r?\n/);
    for (const [index, line] of lines.entries()) {
      const command = normalizeCurrentnessExampleLine(line);
      if (REMOVED_COMMAND_EXAMPLE_PATTERNS.some((pattern) => pattern.test(command))) {
        issues.push({
          severity: 'warning',
          code: 'DOC_REMOVED_COMMAND_EXAMPLE',
          path: documentPath,
          message: `${documentPath}:${index + 1} presents a removed public command as an executable example.`
        });
      }

      if (!packageVersion || (documentPath !== 'README.md' && documentPath !== 'docs/GETTING_STARTED.md')) continue;
      const installMatch = command.match(/^(?:npm install -g|npx)\s+hadara@(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)(?:\s|$)/);
      if (installMatch && installMatch[1] !== packageVersion && !isAllowedStableInstallExample(packageVersion, installMatch[1], lines, index)) {
        issues.push({
          severity: 'warning',
          code: 'DOC_STALE_INSTALL_VERSION',
          path: documentPath,
          message: `${documentPath}:${index + 1} installs hadara@${installMatch[1]}, but package.json declares ${packageVersion}.`
        });
      }
    }
  }
  return issues;
}

function isAllowedStableInstallExample(sourceVersion: string, installVersion: string, lines: string[], lineIndex: number): boolean {
  if (!/^\d+\.\d+\.\d+-/.test(sourceVersion)) return false;
  if (!/^\d+\.\d+\.\d+$/.test(installVersion)) return false;
  const nearbyText = lines.slice(Math.max(0, lineIndex - 5), lineIndex + 1).join(' ').toLowerCase();
  return /\bstable\b/.test(nearbyText);
}

function normalizeCurrentnessExampleLine(line: string): string {
  let command = line.trim();
  command = command.replace(/^(?:[-*+]\s+|\d+[.)]\s+)/, '');
  command = command.replace(/^(?:[$#>]\s*)+/, '');
  command = command.replace(/^[^\s]+@[^$#>]+[$#>]\s*/, '');
  command = command.replace(/^>\s*/, '');
  return command.trim();
}

function readHadaraPackageVersion(projectRoot: string): string | null {
  const packagePath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(packagePath)) return null;
  try {
    const manifest = JSON.parse(fs.readFileSync(packagePath, 'utf8')) as { name?: unknown; version?: unknown };
    return manifest.name === 'hadara' && typeof manifest.version === 'string' ? manifest.version : null;
  } catch {
    return null;
  }
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
  readTier?: string;
  authority?: string;
  editPolicy?: string;
  activeForTasks?: string[];
  driftRisk?: string;
  driftReviewRequired?: boolean;
  driftReason?: string;
  requiredReading?: boolean;
  requireExists?: boolean;
  mode?: 'dry-run' | 'execute';
  beforeHash?: string;
}): DocsRegisterReport {
  const mode = options.mode ?? 'dry-run';
  const normalized = normalizePath(options.documentPath);
  const state = loadRegistryOrInfer(projectRoot);
  const mutationState = readRegistryForMutation(projectRoot);
  const issues = [...state.issues];
  const kind = parseKind(options.kind);
  const status = parseStatus(options.status ?? 'reference');
  const readWhen = parseReadWhen(options.readWhen ?? 'only-when-linked');
  const readTier = parseReadTier(options.readTier);
  const authority = parseAuthority(options.authority);
  const editPolicy = parseEditPolicy(options.editPolicy);
  const driftRisk = parseDriftRisk(options.driftRisk);
  if (!normalized) issues.push({ severity: 'error', code: 'DOC_REGISTER_PATH_REQUIRED', message: 'Document path is required.' });
  if (path.isAbsolute(options.documentPath) || normalized.startsWith('../') || normalized.includes('/../')) {
    issues.push({ severity: 'error', code: 'DOC_REGISTER_PATH_OUTSIDE_PROJECT', path: normalized, message: 'Document path must be project-relative.' });
  }
  if (options.kind !== undefined && kind === null) issues.push(invalidControlledValueIssue({ code: 'DOC_UNKNOWN_KIND', path: normalized, field: 'kind', received: options.kind, allowedValues: DOCS_REGISTER_ALLOWED_VALUES.kind }));
  if (status === null) issues.push(invalidControlledValueIssue({ code: 'DOC_UNKNOWN_STATUS', path: normalized, field: 'status', received: options.status, allowedValues: DOCS_REGISTER_ALLOWED_VALUES.status }));
  if (readWhen === null) issues.push(invalidControlledValueIssue({ code: 'DOC_UNKNOWN_READ_WHEN', path: normalized, field: 'readWhen', received: options.readWhen, allowedValues: DOCS_REGISTER_ALLOWED_VALUES.readWhen }));
  if (options.readTier !== undefined && readTier === null) issues.push(invalidControlledValueIssue({ code: 'DOC_READ_TIER_INVALID_TOKEN', path: normalized, field: 'readTier', received: options.readTier, allowedValues: DOCS_REGISTER_ALLOWED_VALUES.readTier }));
  if (options.authority !== undefined && authority === null) issues.push(invalidControlledValueIssue({ code: 'DOC_AUTHORITY_INVALID_TOKEN', path: normalized, field: 'authority', received: options.authority, allowedValues: DOCS_REGISTER_ALLOWED_VALUES.authority }));
  if (options.editPolicy !== undefined && editPolicy === null) issues.push(invalidControlledValueIssue({ code: 'DOC_EDIT_POLICY_INVALID_TOKEN', path: normalized, field: 'editPolicy', received: options.editPolicy, allowedValues: DOCS_REGISTER_ALLOWED_VALUES.editPolicy }));
  if (options.driftRisk !== undefined && driftRisk === null) issues.push(invalidControlledValueIssue({ code: 'DOC_DRIFT_RISK_INVALID_TOKEN', path: normalized, field: 'driftRisk', received: options.driftRisk, allowedValues: DOCS_REGISTER_ALLOWED_VALUES.driftRisk }));
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
      beforeHash: mutationState.beforeHash,
      action: issues.some((issue) => issue.severity === 'error') ? 'blocked' : 'already-registered',
      document: existing,
      writes: [],
      issues
    };
  }

  validateMutationExecuteGuard(mode, options.beforeHash, mutationState.beforeHash, issues);
  const document = issues.some((issue) => issue.severity === 'error') ? null : buildRegisteredDocument(state.registry, {
    path: normalized,
    title: options.title,
    kind: kind ?? inferKind(normalized),
    status: status ?? 'reference',
    readWhen: readWhen ?? 'only-when-linked',
    readTier: readTier ?? undefined,
    authority: authority ?? undefined,
    editPolicy: editPolicy ?? undefined,
    activeForTasks: options.activeForTasks,
    drift: driftRisk ? {
      risk: driftRisk,
      reviewRequiredBeforeUse: options.driftReviewRequired ?? false,
      reason: options.driftReason ?? `${normalized} is marked as ${driftRisk} drift risk.`
    } : undefined,
    requiredReading: options.requiredReading ?? false
  });
  if (document && mode === 'execute' && issues.every((issue) => issue.severity !== 'error')) {
    const next: DocumentRegistryFile = {
      ...state.registry,
      generatedAt: new Date().toISOString(),
      documents: [...state.registry.documents, document].sort((a, b) => a.path.localeCompare(b.path))
    };
    writeRegistry(projectRoot, next);
  }

  const report: DocsRegisterReport = {
    schemaVersion: 'hadara.docs.register.v1',
    command: 'docs.register',
    ok: issues.every((issue) => issue.severity !== 'error'),
    mode,
    path: normalized,
    source: state.source,
    beforeHash: mutationState.beforeHash,
    action: document ? 'create' : 'blocked',
    document,
    writes: document && mode === 'execute' && issues.every((issue) => issue.severity !== 'error') ? [DOCS_REGISTRY_PATH] : [],
    issues
  };
  if (report.mode === 'dry-run' && report.ok && report.action === 'create') {
    const metadataArgs = [
      options.title ? `--title ${shellQuote(options.title)}` : '',
      options.kind ? `--kind ${shellQuote(options.kind)}` : '',
      options.status ? `--status ${shellQuote(options.status)}` : '',
      options.readWhen ? `--read-when ${shellQuote(options.readWhen)}` : '',
      options.readTier ? `--read-tier ${shellQuote(options.readTier)}` : '',
      options.authority ? `--authority ${shellQuote(options.authority)}` : '',
      options.editPolicy ? `--edit-policy ${shellQuote(options.editPolicy)}` : '',
      options.activeForTasks?.length ? `--active-for-task ${shellQuote(options.activeForTasks.join(','))}` : '',
      options.driftRisk ? `--drift ${shellQuote(options.driftRisk)}` : '',
      options.driftReviewRequired ? '--drift-review-required' : '',
      options.driftReason ? `--drift-reason ${shellQuote(options.driftReason)}` : '',
      options.requiredReading ? '--required-reading' : '',
      options.requireExists ? '--require-exists' : ''
    ].filter(Boolean).join(' ');
    report.executeCommand = `hadara docs register --path ${shellQuote(normalized)}${metadataArgs ? ` ${metadataArgs}` : ''} --execute --before-hash ${mutationState.beforeHash} --json`;
  }
  return report;
}

export function createDocsUpdateReport(projectRoot: string, options: {
  documentPath: string;
  set: string[];
  mode?: 'dry-run' | 'execute';
  beforeHash?: string;
}): DocsRegistryMutationReport {
  const state = readRegistryForMutation(projectRoot);
  const mode = options.mode ?? 'dry-run';
  const normalized = normalizePath(options.documentPath);
  const issues = [...state.issues];
  const entry = state.registry?.documents.find((doc) => doc.path === normalized) ?? null;
  if (!entry) issues.push({ severity: 'error', code: 'DOC_NOT_REGISTERED', path: normalized, message: `${normalized} is not registered.` });
  if (entry) validateProtectedRegistryEntry(state.registry, entry, 'docs.update', issues);
  const updates = parseDocumentFieldUpdates(normalized, options.set, issues);
  if (options.set.length === 0) issues.push({ severity: 'error', code: 'DOC_UPDATE_SET_REQUIRED', path: normalized, message: 'docs update requires at least one --set field=value.' });
  validateMutationExecuteGuard(mode, options.beforeHash, state.beforeHash, issues);
  const before = entry ? cloneJson(entry) : null;
  const after = entry ? applyDocumentFieldUpdates(cloneJson(entry) as unknown as Record<string, unknown>, updates) : null;
  const changedFields = before && after ? diffObjects(before, after) : [];
  const action = issues.some((issue) => issue.severity === 'error') ? 'blocked' : changedFields.length === 0 ? 'already-current' : 'update';
  if (mode === 'execute' && action === 'update' && state.registry && entry && after) {
    Object.assign(entry, after);
    writeRegistry(projectRoot, state.registry);
  }
  return mutationReport({
    command: 'docs.update',
    mode,
    action,
    path: normalized,
    beforeHash: state.beforeHash,
    before,
    after,
    changedFields,
    writes: mode === 'execute' && action === 'update' ? [DOCS_REGISTRY_PATH] : [],
    issues,
    executeArgs: `docs update --path ${shellQuote(normalized)} ${options.set.map((value) => `--set ${shellQuote(value)}`).join(' ')}`
  });
}

export function createDocsArchiveReport(projectRoot: string, options: {
  documentPath: string;
  reason?: string;
  mode?: 'dry-run' | 'execute';
  beforeHash?: string;
}): DocsRegistryMutationReport {
  const reason = options.reason?.trim() ?? '';
  const updates = [
    ['status', 'archived'],
    ['readWhen', ['never-default']],
    ['requiredReading', false],
    ['closeSourceRole', 'excluded'],
    ['readTier', 'excluded'],
    ['authority', 'historical'],
    ['editPolicy', 'human-only']
  ] as Array<[string, unknown]>;
  return mutateDocument(projectRoot, {
    command: 'docs.archive',
    action: 'archive',
    documentPath: options.documentPath,
    reason,
    reasonRequiredCode: 'DOC_ARCHIVE_REASON_REQUIRED',
    mode: options.mode ?? 'dry-run',
    beforeHash: options.beforeHash,
    updates,
    notePrefix: 'Archive reason',
    executeArgs: `docs archive --path ${shellQuote(normalizePath(options.documentPath))} --reason ${shellQuote(reason)}`
  });
}

export function createDocsSupersedeReport(projectRoot: string, options: {
  documentPath: string;
  by: string;
  reason?: string;
  mode?: 'dry-run' | 'execute';
  beforeHash?: string;
}): DocsRegistryMutationReport {
  const replacement = normalizePath(options.by);
  const reason = options.reason?.trim() ?? '';
  const updates = [
    ['status', 'superseded'],
    ['supersededBy', replacement],
    ['readWhen', ['never-default']],
    ['requiredReading', false],
    ['closeSourceRole', 'excluded'],
    ['readTier', 'historical'],
    ['authority', 'historical'],
    ['editPolicy', 'human-only']
  ] as Array<[string, unknown]>;
  const report = mutateDocument(projectRoot, {
    command: 'docs.supersede',
    action: 'supersede',
    documentPath: options.documentPath,
    reason,
    reasonRequiredCode: 'DOC_SUPERSEDE_REASON_REQUIRED',
    mode: options.mode ?? 'dry-run',
    beforeHash: options.beforeHash,
    updates,
    notePrefix: 'Supersede reason',
    executeArgs: `docs supersede --path ${shellQuote(normalizePath(options.documentPath))} --by ${shellQuote(replacement)} --reason ${shellQuote(reason)}`,
    extraValidate: (registry, issues) => {
      if (!replacement) issues.push({ severity: 'error', code: 'DOC_SUPERSEDES_MISSING_TARGET', path: normalizePath(options.documentPath), message: 'docs supersede requires --by <path>.' });
      if (replacement && replacement === normalizePath(options.documentPath)) {
        issues.push({ severity: 'error', code: 'DOC_SUPERSEDE_SELF_REFERENCE', path: normalizePath(options.documentPath), message: 'docs supersede cannot point a document at itself.' });
      }
      if (replacement && !registry.documents.some((doc) => doc.path === replacement)) {
        issues.push({ severity: 'error', code: 'DOC_SUPERSEDES_MISSING_TARGET', path: normalizePath(options.documentPath), message: `${replacement} is not a registered replacement document.` });
      }
    }
  });
  return report;
}

export function createDocsUnregisterReport(projectRoot: string, options: {
  documentPath: string;
  reason?: string;
  mode?: 'dry-run' | 'execute';
  beforeHash?: string;
}): DocsRegistryMutationReport {
  const state = readRegistryForMutation(projectRoot);
  const mode = options.mode ?? 'dry-run';
  const normalized = normalizePath(options.documentPath);
  const reason = options.reason?.trim() ?? '';
  const issues = [...state.issues];
  if (!reason) issues.push({ severity: 'error', code: 'DOC_UNREGISTER_REASON_REQUIRED', path: normalized, message: 'docs unregister requires --reason.' });
  validateMutationExecuteGuard(mode, options.beforeHash, state.beforeHash, issues);
  const index = state.registry?.documents.findIndex((doc) => doc.path === normalized) ?? -1;
  const before = index >= 0 && state.registry ? cloneJson(state.registry.documents[index]) : null;
  if (index >= 0 && state.registry) validateProtectedRegistryEntry(state.registry, state.registry.documents[index], 'docs.unregister', issues);
  const after = null;
  const action = issues.some((issue) => issue.severity === 'error') ? 'blocked' : index < 0 ? 'already-unregistered' : 'unregister';
  if (mode === 'execute' && action === 'unregister' && state.registry) {
    state.registry.documents.splice(index, 1);
    state.registry.generatedAt = new Date().toISOString();
    writeRegistry(projectRoot, state.registry);
  }
  return mutationReport({
    command: 'docs.unregister',
    mode,
    action,
    path: normalized,
    beforeHash: state.beforeHash,
    before,
    after,
    changedFields: before ? [{ field: 'documents', before: normalized, after: null }] : [],
    writes: mode === 'execute' && action === 'unregister' ? [DOCS_REGISTRY_PATH] : [],
    issues,
    executeArgs: `docs unregister --path ${shellQuote(normalized)} --reason ${shellQuote(reason)}`
  });
}

export function createDocsRenderReport(projectRoot: string, options: {
  mode?: 'dry-run' | 'execute';
  beforeHash?: string;
} = {}): DocsRegistryMutationReport {
  const state = readRegistryForMutation(projectRoot);
  const mode = options.mode ?? 'dry-run';
  const issues = [...state.issues];
  validateMutationExecuteGuard(mode, options.beforeHash, state.beforeHash, issues);
  const beforePath = path.join(projectRoot, 'docs/DOC_REGISTRY.md');
  const before = fs.existsSync(beforePath) ? fs.readFileSync(beforePath, 'utf8') : null;
  const after = state.registry ? renderDocRegistryMarkdown(normalizeDocumentRegistryFile(state.registry)) : null;
  const changedFields = before !== after ? [{ field: 'docs/DOC_REGISTRY.md', before: before === null ? null : 'present', after: after === null ? null : 'rendered' }] : [];
  const action = issues.some((issue) => issue.severity === 'error') ? 'blocked' : changedFields.length === 0 ? 'already-current' : 'render';
  if (mode === 'execute' && action === 'render' && after !== null) {
    fs.mkdirSync(path.dirname(beforePath), { recursive: true });
    const temp = `${beforePath}.${process.pid}.tmp`;
    fs.writeFileSync(temp, after, 'utf8');
    fs.renameSync(temp, beforePath);
  }
  return mutationReport({
    command: 'docs.render',
    mode,
    action,
    path: 'docs/DOC_REGISTRY.md',
    beforeHash: state.beforeHash,
    before: before === null ? null : { path: 'docs/DOC_REGISTRY.md', present: true },
    after: after === null ? null : { path: 'docs/DOC_REGISTRY.md', bytes: after.length },
    changedFields,
    writes: mode === 'execute' && action === 'render' ? ['docs/DOC_REGISTRY.md'] : [],
    issues,
    executeArgs: 'docs render'
  });
}

function mutateDocument(projectRoot: string, input: {
  command: DocsRegistryMutationReport['command'];
  action: DocsRegistryMutationReport['action'];
  documentPath: string;
  reason: string;
  reasonRequiredCode: string;
  mode: 'dry-run' | 'execute';
  beforeHash?: string;
  updates: Array<[string, unknown]>;
  notePrefix: string;
  executeArgs: string;
  extraValidate?: (registry: DocumentRegistryFile, issues: DocsIssue[]) => void;
}): DocsRegistryMutationReport {
  const state = readRegistryForMutation(projectRoot);
  const normalized = normalizePath(input.documentPath);
  const issues = [...state.issues];
  const entry = state.registry?.documents.find((doc) => doc.path === normalized) ?? null;
  if (!entry) issues.push({ severity: 'error', code: 'DOC_NOT_REGISTERED', path: normalized, message: `${normalized} is not registered.` });
  if (entry) validateProtectedRegistryEntry(state.registry, entry, input.command, issues);
  if (!input.reason) issues.push({ severity: 'error', code: input.reasonRequiredCode, path: normalized, message: `${input.command} requires --reason.` });
  if (state.registry && input.extraValidate) input.extraValidate(state.registry, issues);
  validateMutationExecuteGuard(input.mode, input.beforeHash, state.beforeHash, issues);
  const before = entry ? cloneJson(entry) : null;
  const after = entry ? applyDocumentFieldUpdates(cloneJson(entry) as unknown as Record<string, unknown>, [
    ...input.updates,
    ['notes', appendRegistryNote(entry.notes, `${input.notePrefix}: ${input.reason}`)]
  ]) : null;
  const changedFields = before && after ? diffObjects(before, after) : [];
  const action = issues.some((issue) => issue.severity === 'error') ? 'blocked' : changedFields.length === 0 ? 'already-current' : input.action;
  if (input.mode === 'execute' && action === input.action && state.registry && entry && after) {
    Object.assign(entry, after);
    state.registry.generatedAt = new Date().toISOString();
    writeRegistry(projectRoot, state.registry);
  }
  return mutationReport({
    command: input.command,
    mode: input.mode,
    action,
    path: normalized,
    beforeHash: state.beforeHash,
    before,
    after,
    changedFields,
    writes: input.mode === 'execute' && action === input.action ? [DOCS_REGISTRY_PATH] : [],
    issues,
    executeArgs: input.executeArgs
  });
}

function readRegistryForMutation(projectRoot: string): { registry: DocumentRegistryFile | null; beforeHash: string; issues: DocsIssue[] } {
  const target = path.join(projectRoot, DOCS_REGISTRY_PATH);
  if (!fs.existsSync(target)) {
    return {
      registry: null,
      beforeHash: hashText(''),
      issues: [{ severity: 'error', code: 'DOC_REGISTRY_MISSING', path: DOCS_REGISTRY_PATH, message: 'Docs registry is required for mutation commands.' }]
    };
  }
  const content = fs.readFileSync(target, 'utf8');
  try {
    return { registry: JSON.parse(content) as DocumentRegistryFile, beforeHash: hashText(content), issues: [] };
  } catch (error) {
    return {
      registry: null,
      beforeHash: hashText(content),
      issues: [{ severity: 'error', code: 'DOC_REGISTRY_INVALID_JSON', path: DOCS_REGISTRY_PATH, message: `Docs registry JSON could not be parsed: ${error instanceof Error ? error.message : String(error)}` }]
    };
  }
}

function validateMutationExecuteGuard(mode: 'dry-run' | 'execute', requestedHash: string | undefined, beforeHash: string, issues: DocsIssue[]): void {
  if (mode !== 'execute') return;
  if (!requestedHash) {
    issues.push({ severity: 'error', code: 'DOC_MUTATION_BEFORE_HASH_REQUIRED', path: DOCS_REGISTRY_PATH, message: 'Execute mode requires --before-hash from the reviewed dry-run.' });
  } else if (requestedHash !== beforeHash) {
    issues.push({ severity: 'error', code: 'DOC_MUTATION_BEFORE_HASH_MISMATCH', path: DOCS_REGISTRY_PATH, message: `Registry hash ${beforeHash} does not match reviewed hash ${requestedHash}.` });
  }
}

function validateProtectedRegistryEntry(registry: DocumentRegistryFile | null, entry: DocumentRegistryEntry, command: DocsRegistryMutationReport['command'], issues: DocsIssue[]): void {
  const protectedReasons: string[] = [];
  if (entry.status === 'canonical') protectedReasons.push('canonical');
  if (entry.requiredReading) protectedReasons.push('requiredReading');
  if (entry.origin?.type === 'hadara-scaffold' || entry.origin?.type === 'hadara-projection') protectedReasons.push(`origin:${entry.origin.type}`);
  if (entry.generatedBy === 'hadara init') protectedReasons.push('generatedBy:hadara init');
  if (registry && seedEntries(registryHadaraProfile(registry)).some((seed) => seed.path === entry.path)) protectedReasons.push('profile-seed');
  if (protectedReasons.length === 0) return;
  issues.push({
    severity: 'error',
    code: 'DOC_PROTECTED_ENTRY_MUTATION_BLOCKED',
    path: entry.path,
    message: `${command} cannot mutate protected registry entry ${entry.path} (${[...new Set(protectedReasons)].join(', ')}). Change the scaffold/profile contract or use a dedicated correction path.`
  });
}

function parseDocumentFieldUpdates(documentPath: string, sets: string[], issues: DocsIssue[]): Array<[string, unknown]> {
  const updates: Array<[string, unknown]> = [];
  for (const item of sets) {
    const index = item.indexOf('=');
    if (index <= 0) {
      issues.push({ severity: 'error', code: 'DOC_UPDATE_SET_INVALID', path: documentPath, message: `Invalid --set value: ${item}. Expected field=value.` });
      continue;
    }
    const field = item.slice(0, index).trim();
    const rawValue = item.slice(index + 1).trim();
    const parsed = parseDocumentFieldValue(documentPath, field, rawValue, issues);
    if (parsed.ok) updates.push([field, parsed.value]);
  }
  return updates;
}

function parseDocumentFieldValue(documentPath: string, field: string, rawValue: string, issues: DocsIssue[]): { ok: true; value: unknown } | { ok: false } {
  if (field === 'title' || field === 'owner' || field === 'notes' || field === 'supersededBy') return { ok: true, value: rawValue };
  if (field === 'requiredReading') {
    const normalized = rawValue.toLowerCase();
    if (normalized === 'true' || normalized === 'yes') return { ok: true, value: true };
    if (normalized === 'false' || normalized === 'no') return { ok: true, value: false };
    issues.push({ severity: 'error', code: 'DOC_UPDATE_BOOLEAN_INVALID_TOKEN', path: documentPath, field, received: rawValue, allowedValues: ['true', 'false', 'yes', 'no'], message: `Invalid boolean value for ${field}: ${rawValue}.` });
    return { ok: false };
  }
  if (field === 'readWhen') {
    const values = rawValue.split(',').map((value) => value.trim()).filter(Boolean);
    const invalid = values.filter((value) => !VALID_READ_WHEN.includes(value as ReadWhen));
    if (invalid.length > 0 || values.length === 0) {
      issues.push({ severity: 'error', code: 'DOC_UPDATE_READ_WHEN_INVALID_TOKEN', path: documentPath, field, received: rawValue, allowedValues: [...VALID_READ_WHEN], message: `Invalid readWhen value: ${rawValue}.` });
      return { ok: false };
    }
    return { ok: true, value: values };
  }
  const enumChecks: Record<string, readonly string[]> = {
    kind: VALID_KINDS,
    status: VALID_STATUSES,
    readTier: VALID_READ_TIERS,
    authority: VALID_AUTHORITIES,
    editPolicy: VALID_EDIT_POLICIES,
    closeSourceRole: ['included', 'excluded', 'task-dependent', 'unknown'],
    updateOwner: ['human', 'hadara-init', 'hadara-task', 'hadara-docs', 'release-operator', 'mixed']
  };
  const allowed = enumChecks[field];
  if (allowed) {
    if (!allowed.includes(rawValue)) {
      issues.push({ severity: 'error', code: 'DOC_UPDATE_FIELD_INVALID_TOKEN', path: documentPath, field, received: rawValue, allowedValues: [...allowed], message: `${field} has invalid value: ${rawValue}.` });
      return { ok: false };
    }
    return { ok: true, value: rawValue };
  }
  issues.push({ severity: 'error', code: 'DOC_UPDATE_FIELD_UNSUPPORTED', path: documentPath, field, received: field, message: `docs update does not support field: ${field}.` });
  return { ok: false };
}

function applyDocumentFieldUpdates(document: Record<string, unknown>, updates: Array<[string, unknown]>): Record<string, unknown> {
  for (const [field, value] of updates) document[field] = value;
  return document;
}

function diffObjects(beforeValue: unknown, afterValue: unknown): Array<{ field: string; before: unknown; after: unknown }> {
  const before = isRecord(beforeValue) ? beforeValue : {};
  const after = isRecord(afterValue) ? afterValue : {};
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  return keys
    .filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
    .map((key) => ({ field: key, before: before[key] ?? null, after: after[key] ?? null }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function appendRegistryNote(current: string | undefined, note: string): string {
  return current ? `${current} ${note}` : note;
}

function mutationReport(input: Omit<DocsRegistryMutationReport, 'schemaVersion' | 'registryPath' | 'executeCommand' | 'ok'> & { executeArgs: string }): DocsRegistryMutationReport {
  const report: DocsRegistryMutationReport = {
    schemaVersion: 'hadara.docs.registryMutation.v1',
    registryPath: DOCS_REGISTRY_PATH,
    command: input.command,
    ok: input.issues.every((issue) => issue.severity !== 'error'),
    mode: input.mode,
    action: input.action,
    path: input.path,
    beforeHash: input.beforeHash,
    before: input.before,
    after: input.after,
    changedFields: input.changedFields,
    writes: input.writes,
    issues: input.issues
  };
  if (report.mode === 'dry-run' && report.ok && report.action !== 'already-current' && report.action !== 'already-unregistered') {
    report.executeCommand = `hadara ${input.executeArgs} --execute --before-hash ${input.beforeHash} --json`;
  }
  return report;
}

function hashText(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content, 'utf8').digest('hex')}`;
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

export function createDocsReadMapReport(projectRoot: string, taskId: string): DocsReadMapReport {
  const normalizedTaskId = taskId.trim();
  const state = loadRegistryOrInfer(projectRoot);
  const task = findTask(projectRoot, normalizedTaskId);
  const issues = [...state.issues, ...validateRegistryMetadata(state.registry)];
  if (!normalizedTaskId) issues.push({ severity: 'error', code: 'DOC_READ_MAP_TASK_REQUIRED', message: 'Task id is required.' });
  if (normalizedTaskId && !task.capsulePath) issues.push({ severity: 'warning', code: 'DOC_READ_MAP_TASK_NOT_FOUND', message: `${normalizedTaskId} task capsule was not found.` });

  const readFirst: DocsReadMapEntry[] = [];
  const readIfNeeded: DocsReadMapEntry[] = [];
  const doNotReadByDefault: DocsReadMapEntry[] = [];
  const driftWarnings: DocsDriftWarning[] = [];

  if (task.capsulePath) {
    for (const file of ['TASK.md', 'HANDOFF.md', 'EVIDENCE.md']) {
      const relativePath = `${task.capsulePath}/${file}`;
      if (fs.existsSync(path.join(projectRoot, relativePath))) {
        readFirst.push({
          path: relativePath,
          title: file.replace(/\.md$/, ''),
          kind: 'task-capsule',
          status: 'active',
          readWhen: ['task-start'],
          readTier: 'active-task',
          authority: 'implementation-source',
          editPolicy: 'agent-assisted',
          source: 'task-capsule',
          reason: 'Active Task Capsule document.'
        });
      }
    }
    const legacyContextPath = `${task.capsulePath}/CONTEXT.md`;
    if (fs.existsSync(path.join(projectRoot, legacyContextPath))) {
      readIfNeeded.push({
        path: legacyContextPath,
        title: 'CONTEXT',
        kind: 'task-capsule',
        status: 'historical',
        readWhen: ['only-when-linked'],
        readTier: 'conditional-reference',
        authority: 'historical',
        editPolicy: 'human-only',
        source: 'task-capsule',
        reason: 'Legacy Task Capsule context document; read only when investigating older capsules or explicit references.'
      });
    }
  }

  for (const doc of state.registry.documents) {
    const entry = createReadMapEntry(doc, normalizedTaskId, task.title);
    if (entry.readTier === 'historical' || entry.readTier === 'excluded') {
      doNotReadByDefault.push(entry);
    } else if (entry.readTier === 'active-spec' || doc.requiredReading || doc.readWhen.includes('session-start') || doc.readWhen.includes('task-start')) {
      readFirst.push(entry);
    } else {
      readIfNeeded.push(entry);
    }
    const warning = createDriftWarning(doc);
    if (warning) driftWarnings.push(warning);
  }

  for (const activePath of findActiveLookingDocs(projectRoot, ACTIVE_DOC_DISCOVERY_LIMIT)) {
    if (!state.registry.documents.some((doc) => doc.path === activePath)) {
      doNotReadByDefault.push({
        path: activePath,
        title: titleFromPath(activePath),
        kind: 'spec',
        status: 'unregistered',
        readWhen: ['never-default'],
        readTier: 'excluded',
        authority: 'historical',
        editPolicy: 'human-only',
        source: 'discovery',
        reason: 'Unregistered spec-looking document; register it before treating it as authority.'
      });
      driftWarnings.push({
        code: 'SPEC_UNREGISTERED',
        path: activePath,
        risk: 'medium',
        reviewRequiredBeforeUse: true,
        reason: `${activePath} looks active but is not registered.`
      });
    }
  }

  return {
    schemaVersion: 'hadara.docs.readMap.v1',
    command: 'docs.read-map',
    ok: issues.every((issue) => issue.severity !== 'error'),
    taskId: normalizedTaskId,
    source: state.source,
    task: { capsulePath: task.capsulePath, capsulePresent: task.capsulePath !== null, title: task.title },
    readFirst: sortReadMapEntries(readFirst),
    readIfNeeded: sortReadMapEntries(readIfNeeded),
    doNotReadByDefault: sortReadMapEntries(doNotReadByDefault),
    driftWarnings: driftWarnings.sort((a, b) => a.path.localeCompare(b.path) || a.code.localeCompare(b.code)),
    issues
  };
}

export function createDocsInboxReport(projectRoot: string): DocsInboxReport {
  const state = loadRegistryOrInfer(projectRoot);
  const items = [...state.issues, ...validateRegistry(projectRoot, state.registry), ...validateRegistryMetadata(state.registry)];
  return {
    schemaVersion: 'hadara.docs.inbox.v1',
    command: 'docs.inbox',
    ok: items.every((item) => item.severity !== 'error'),
    source: state.source,
    summary: {
      items: items.length,
      errors: items.filter((item) => item.severity === 'error').length,
      warnings: items.filter((item) => item.severity === 'warning').length
    },
    items,
    issues: []
  };
}

export function registryJson(registry: DocumentRegistryFile): string {
  return `${JSON.stringify(registry, null, 2)}\n`;
}

export function normalizeDocumentRegistryFile(input: DocumentRegistryFile): DocumentRegistryFile {
  const hadaraProfile = registryHadaraProfile(input);
  const project = input.project ?? {
    id: input.projectProfile === 'hadara-dev' ? 'hadara-dev' : 'project',
    hadaraProfile
  };
  return {
    ...input,
    project,
    documents: input.documents.map((document) => normalizeDocumentRegistryEntry(document, hadaraProfile))
  };
}

function normalizeDocumentRegistryEntry(document: DocumentRegistryEntry, fallbackProfile: InitProfile): DocumentRegistryEntry {
  const raw = document as DocumentRegistryEntry & { applicableProfiles?: unknown; profiles?: unknown; generatedBy?: string };
  const applicableProfiles = normalizeProfiles(raw.applicableProfiles);
  const explicitProfiles = Array.isArray(raw.profiles) ? raw.profiles as InitProfile[] : null;
  const profiles = explicitProfiles ?? applicableProfiles ?? [fallbackProfile];
  const origin = document.origin ?? inferDocumentOrigin(document);
  return {
    ...document,
    profiles,
    ...(applicableProfiles ? { applicableProfiles } : {}),
    ...(origin ? { origin } : {})
  };
}

function normalizeProfiles(value: unknown): InitProfile[] | null {
  if (!Array.isArray(value)) return null;
  const profiles = value.filter((profile): profile is InitProfile => profile === 'basic' || profile === 'standard' || profile === 'governed');
  return profiles.length > 0 && profiles.length === value.length ? profiles : null;
}

function inferDocumentOrigin(document: DocumentRegistryEntry): DocumentOrigin | undefined {
  if (document.generatedBy === 'hadara init') return { type: 'hadara-scaffold', generator: 'hadara init' };
  const taskMatch = document.generatedBy?.match(/^(T-\d{4})$/);
  if (taskMatch) return { type: 'task-generated', taskId: taskMatch[1] };
  return undefined;
}

function registryHadaraProfile(registry: Pick<DocumentRegistryFile, 'project' | 'projectProfile'>): InitProfile {
  if (registry.project?.hadaraProfile === 'basic' || registry.project?.hadaraProfile === 'standard' || registry.project?.hadaraProfile === 'governed') {
    return registry.project.hadaraProfile;
  }
  if (registry.projectProfile === 'basic' || registry.projectProfile === 'standard' || registry.projectProfile === 'governed') return registry.projectProfile;
  if (registry.projectProfile === 'hadara-dev') return 'governed';
  return 'standard';
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
    return { registry: normalizeDocumentRegistryFile(parsed), issues: [], source: { registryPath: DOCS_REGISTRY_PATH, registryPresent: true, inferred: false } };
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
  if (registry.schemaVersion !== 'hadara.docsRegistry.v3' && registry.schemaVersion !== 'hadara.docsRegistry.v2' && registry.schemaVersion !== 'hadara.docs.registry.v1') {
    issues.push({
      severity: 'error',
      code: 'DOC_REGISTRY_SCHEMA_UNSUPPORTED',
      path: DOCS_REGISTRY_PATH,
      message: `${DOCS_REGISTRY_PATH} has unsupported schemaVersion: ${String(registry.schemaVersion)}.`
    });
  }
  const hadaraProfile = registryHadaraProfile(registry);
  const expectedSeed = createSeedDocumentRegistry(hadaraProfile).documents;
  const registeredPaths = new Set(registry.documents.map((doc) => doc.path));
  const seenCanonical = new Map<string, string>();
  for (const expected of expectedSeed) {
    if (!registeredPaths.has(expected.path) && fs.existsSync(path.join(projectRoot, expected.path))) {
      issues.push({
        severity: 'warning',
        code: 'DOC_INIT_PROFILE_DRIFT',
        path: expected.path,
        message: `${expected.path} exists for profile ${hadaraProfile} but is missing from the docs registry.`
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
    if ((doc.status === 'superseded' || doc.status === 'historical') && !isArchivePath(doc.path)) {
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
  for (const activePath of findActiveLookingDocs(projectRoot, ACTIVE_DOC_DISCOVERY_LIMIT)) {
    if (!registry.documents.some((doc) => doc.path === activePath)) {
      issues.push({ severity: 'warning', code: 'DOC_UNREGISTERED_ACTIVE_LOOKING', path: activePath, message: `${activePath} looks active but is not registered.` });
    }
  }
  return issues;
}

function isArchivePath(documentPath: string): boolean {
  const normalized = normalizePath(documentPath);
  return normalized.startsWith('docs/archive/') || normalized.startsWith('docs/history/');
}

function validateRegistryMetadata(registry: DocumentRegistryFile): DocsIssue[] {
  const issues: DocsIssue[] = [];
  if (registry.project && !normalizeProfiles([registry.project.hadaraProfile])) {
    issues.push({
      severity: 'error',
      code: 'DOC_PROJECT_HADARA_PROFILE_INVALID_TOKEN',
      path: DOCS_REGISTRY_PATH,
      message: `project.hadaraProfile has invalid value: ${String(registry.project.hadaraProfile)}.`,
      field: 'project.hadaraProfile',
      received: String(registry.project.hadaraProfile),
      allowedValues: ['basic', 'standard', 'governed']
    });
  }
  for (const doc of registry.documents) {
    const raw = doc as DocumentRegistryEntry & { authority?: string; readTier?: string; editPolicy?: string; profiles?: unknown };
    if (!Array.isArray(raw.profiles) || raw.profiles.some((profile) => profile !== 'basic' && profile !== 'standard' && profile !== 'governed')) {
      issues.push({
        severity: 'error',
        code: 'DOC_PROFILE_INVALID_TOKEN',
        path: doc.path,
        message: `${doc.path} has invalid profiles; document profiles are init scaffold profiles only.`,
        field: 'profiles',
        received: Array.isArray(raw.profiles) ? raw.profiles.join(', ') : String(raw.profiles),
        allowedValues: ['basic', 'standard', 'governed'],
        suggestion: 'Use owner/scope/readTier/status for internal or historical routing; do not use hadara-dev as a document profile.'
      });
    }
    if (raw.authority !== undefined && !VALID_AUTHORITIES.includes(raw.authority as DocsAuthority)) {
      issues.push({ severity: 'error', code: 'DOC_AUTHORITY_INVALID_TOKEN', path: doc.path, message: `${doc.path} has invalid authority: ${raw.authority}` });
    }
    if (raw.readTier !== undefined && !VALID_READ_TIERS.includes(raw.readTier as DocsReadTier)) {
      issues.push({ severity: 'error', code: 'DOC_READ_TIER_INVALID_TOKEN', path: doc.path, message: `${doc.path} has invalid readTier: ${raw.readTier}` });
    }
    if (raw.editPolicy !== undefined && !VALID_EDIT_POLICIES.includes(raw.editPolicy as DocsEditPolicy)) {
      issues.push({ severity: 'error', code: 'DOC_EDIT_POLICY_INVALID_TOKEN', path: doc.path, message: `${doc.path} has invalid editPolicy: ${raw.editPolicy}` });
    }
  }
  return issues;
}

function seedEntries(profile: InitProfile | 'hadara-dev'): DocumentRegistryEntry[] {
  const coreProfiles: DocumentRegistryEntry['profiles'] = ['basic', 'standard', 'governed'];
  const routedProfiles: DocumentRegistryEntry['profiles'] = ['standard', 'governed'];
  const entries: DocumentRegistryEntry[] = [
    entry('AGENTS.md', 'AGENTS', 'protocol', 'canonical', ['session-start'], true, 'mixed', coreProfiles, 'repo'),
    entry('docs/HADARA_WORKFLOW.md', 'HADARA_WORKFLOW', 'workflow-guide', 'canonical', ['session-start', 'task-start'], true, 'mixed', coreProfiles),
    entry('docs/TASK_BOARD.md', 'TASK_BOARD', 'task-board', 'active', ['task-start'], true, 'hadara-task', coreProfiles)
  ];
  if (profile === 'standard' || profile === 'governed' || profile === 'hadara-dev') {
    entries.push(
      entry('.hadara/context/HADARA_CONTEXT.md', 'HADARA_CONTEXT', 'project-context', 'canonical', ['session-start'], true, 'mixed', routedProfiles)
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
  const files = ['AGENTS.md'];
  const found = new Set<string>();
  for (const file of files) {
    const text = fs.existsSync(path.join(projectRoot, file)) ? fs.readFileSync(path.join(projectRoot, file), 'utf8') : '';
    const requiredReading = readMarkdownSection(text, '## Required Reading');
    for (const match of requiredReading.matchAll(/`([^`]+\.(?:md|MD|json))`/g)) {
      const value = normalizePath(match[1]);
      if (value !== 'AGENTS.md' && !value.startsWith('docs/') && value !== '.hadara/context/HADARA_CONTEXT.md') continue;
      if (!value.startsWith('tasks/')) found.add(value);
    }
  }
  return [...found];
}

function findActiveLookingDocs(projectRoot: string, limit = ACTIVE_DOC_DISCOVERY_LIMIT): string[] {
  const dirs = ['docs/specs'];
  const found: string[] = [];
  for (const dir of dirs) {
    const full = path.join(projectRoot, dir);
    if (!fs.existsSync(full)) continue;
    collectMarkdownFiles(projectRoot, full, found, limit);
  }
  return found;
}

function collectMarkdownFiles(projectRoot: string, dir: string, found: string[], limit: number): void {
  if (found.length >= limit) return;
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (found.length >= limit) return;
    if (dirent.name.startsWith('.')) continue;
    const full = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      if (['temp_plan', '_eval', 'tasks', 'node_modules'].includes(dirent.name)) continue;
      collectMarkdownFiles(projectRoot, full, found, limit);
    } else if (dirent.name.endsWith('.md')) {
      found.push(toPortablePath(path.relative(projectRoot, full)));
    }
  }
}

function parseStatus(value?: string): DocumentStatus | null {
  if (value === undefined) return null;
  return VALID_STATUSES.includes(value as DocumentStatus) ? value as DocumentStatus : null;
}

function parseKind(value?: string): DocumentKind | null {
  if (value === undefined) return null;
  return VALID_KINDS.includes(value as DocumentKind) ? value as DocumentKind : null;
}

function parseReadWhen(value?: string): ReadWhen | null {
  if (value === undefined) return null;
  return VALID_READ_WHEN.includes(value as ReadWhen) ? value as ReadWhen : null;
}

function parseReadTier(value?: string): DocsReadTier | null {
  if (value === undefined) return null;
  return VALID_READ_TIERS.includes(value as DocsReadTier) ? value as DocsReadTier : null;
}

function parseAuthority(value?: string): DocsAuthority | null {
  if (value === undefined) return null;
  return VALID_AUTHORITIES.includes(value as DocsAuthority) ? value as DocsAuthority : null;
}

function parseEditPolicy(value?: string): DocsEditPolicy | null {
  if (value === undefined) return null;
  return VALID_EDIT_POLICIES.includes(value as DocsEditPolicy) ? value as DocsEditPolicy : null;
}

function parseDriftRisk(value?: string): 'low' | 'medium' | 'high' | null {
  if (value === undefined) return null;
  return VALID_DRIFT_RISKS.includes(value as 'low' | 'medium' | 'high') ? value as 'low' | 'medium' | 'high' : null;
}

function invalidControlledValueIssue(input: {
  code: string;
  path: string;
  field: keyof typeof DOCS_REGISTER_ALLOWED_VALUES;
  received: string | undefined;
  allowedValues: readonly string[];
}): DocsIssue {
  const suggestion = suggestDocsRegisterToken(input.field, input.received);
  const allowed = [...input.allowedValues];
  const received = input.received ?? '';
  const issue: DocsIssue = {
    severity: 'error',
    code: input.code,
    path: input.path,
    field: input.field,
    received,
    allowedValues: allowed,
    message: `${input.field} has invalid value: ${received}. Allowed values: ${allowed.join(', ')}.${suggestion ? ` Suggested value: ${suggestion}.` : ''}`
  };
  if (suggestion) issue.suggestion = suggestion;
  return issue;
}

function suggestDocsRegisterToken(field: keyof typeof DOCS_REGISTER_ALLOWED_VALUES, received: string | undefined): string | undefined {
  if (!received) return undefined;
  return DOC_REGISTER_TOKEN_ALIASES[field]?.[received.trim().toLowerCase()];
}

function parseScope(value: string): DocsDoctorReport['scope'] | null {
  return value === 'registry' || value === 'profile' || value === 'required-reading' || value === 'links' || value === 'all' ? value : null;
}

function filterIssuesByScope(issues: DocsIssue[], scope: DocsDoctorReport['scope']): DocsIssue[] {
  if (scope === 'all') return issues;
  if (scope === 'registry') return issues.filter((issue) => issue.code.startsWith('DOC_REGISTRY') || issue.code === 'DOC_REGISTERED_FILE_MISSING' || issue.code === 'DOC_CANONICAL_CONFLICT' || issue.code === 'DOC_UNKNOWN_STATUS' || issue.code === 'DOC_SUPERSEDES_MISSING_TARGET' || issue.code === 'DOC_ARCHIVE_CANDIDATE');
  if (scope === 'required-reading') return issues.filter((issue) => issue.code.includes('REQUIRED_READING'));
  if (scope === 'links') return issues.filter((issue) => issue.code === 'DOC_UNREGISTERED_ACTIVE_LOOKING' || issue.code === 'DOC_STALE_INSTALL_VERSION' || issue.code === 'DOC_REMOVED_COMMAND_EXAMPLE' || issue.code === 'DOC_PROJECT_METADATA_PLACEHOLDER' || issue.code.startsWith('DOC_SEMANTIC_'));
  if (scope === 'profile') return issues.filter((issue) => issue.code === 'DOC_INIT_PROFILE_DRIFT');
  return [];
}

function guidanceReason(doc: DocumentRegistryEntry): string {
  if (doc.readWhen.includes('session-start')) return `Canonical ${doc.kind} document used at session start.`;
  if (doc.readWhen.includes('task-start')) return `${doc.kind} document used when starting or closing task work.`;
  if (doc.readWhen.includes('never-default')) return `${doc.kind} document is historical and should not be default required reading.`;
  return `${doc.kind} document should be read ${doc.readWhen.join(', ')}.`;
}

function createReadMapEntry(doc: DocumentRegistryEntry, taskId: string, taskTitle: string | null): DocsReadMapEntry {
  const raw = doc as DocumentRegistryEntry & { documentKind?: string; authority?: DocsAuthority; readTier?: DocsReadTier; editPolicy?: DocsEditPolicy };
  const readTier = raw.readTier && VALID_READ_TIERS.includes(raw.readTier) ? raw.readTier : inferReadTier(doc, taskId, taskTitle);
  return {
    path: doc.path,
    title: doc.title,
    kind: raw.documentKind ?? doc.kind,
    status: doc.status,
    readWhen: doc.readWhen,
    readTier,
    authority: raw.authority && VALID_AUTHORITIES.includes(raw.authority) ? raw.authority : inferAuthority(doc, readTier),
    editPolicy: raw.editPolicy && VALID_EDIT_POLICIES.includes(raw.editPolicy) ? raw.editPolicy : inferEditPolicy(doc),
    source: 'registry',
    reason: reasonForReadTier(doc, readTier)
  };
}

function inferReadTier(doc: DocumentRegistryEntry, taskId: string, taskTitle: string | null): DocsReadTier {
  if (doc.status === 'archived' || doc.readWhen.includes('never-default')) return 'excluded';
  if (doc.status === 'historical' || doc.status === 'superseded') return 'historical';
  if (matchesActiveSpec(doc, taskId, taskTitle)) return 'active-spec';
  if (doc.kind === 'project-context' || doc.kind === 'task-board') return 'current-state';
  if (doc.kind === 'workflow-guide' || doc.kind === 'protocol') return 'workflow-reference';
  if (doc.kind === 'spec' && doc.status === 'reference') return 'conditional-reference';
  return doc.status === 'reference' ? 'conditional-reference' : 'current-state';
}

function inferAuthority(doc: DocumentRegistryEntry, readTier: DocsReadTier): DocsAuthority {
  if (readTier === 'historical' || readTier === 'excluded') return 'historical';
  if (readTier === 'active-spec') return 'implementation-source';
  if (doc.status === 'canonical' || doc.requiredReading) return 'normative';
  return 'reference-only';
}

function inferEditPolicy(doc: DocumentRegistryEntry): DocsEditPolicy {
  if (doc.updateOwner === 'hadara-init' || doc.updateOwner === 'hadara-task' || doc.updateOwner === 'hadara-docs') return 'cli-owned';
  if (doc.updateOwner === 'human') return 'agent-editable-with-review';
  return 'agent-assisted';
}

function matchesActiveSpec(doc: DocumentRegistryEntry, taskId: string, taskTitle: string | null): boolean {
  const raw = doc as DocumentRegistryEntry & { activeForTasks?: string[] };
  if (raw.activeForTasks?.includes(taskId)) return true;
  if (doc.kind !== 'spec' && doc.kind !== 'implementation-guide') return false;
  if (doc.status !== 'active') return false;
  const taskTokens = tokens(`${taskId} ${taskTitle ?? ''}`);
  if (taskTokens.size === 0) return false;
  let overlap = 0;
  for (const token of tokens(`${doc.path} ${doc.title}`)) {
    if (taskTokens.has(token)) overlap += 1;
  }
  return overlap >= 2;
}

function createDriftWarning(doc: DocumentRegistryEntry): DocsDriftWarning | null {
  const raw = doc as DocumentRegistryEntry & { drift?: { risk?: string; reviewRequiredBeforeUse?: boolean; reason?: string } };
  if (raw.drift?.reviewRequiredBeforeUse || raw.drift?.risk === 'medium' || raw.drift?.risk === 'high') {
    return {
      code: 'SPEC_DRIFT_RISK_WITHOUT_REVIEW',
      path: doc.path,
      risk: raw.drift.risk === 'high' ? 'high' : raw.drift.risk === 'medium' ? 'medium' : 'low',
      reviewRequiredBeforeUse: raw.drift.reviewRequiredBeforeUse ?? false,
      reason: raw.drift.reason ?? `${doc.path} is marked as drift risk.`
    };
  }
  if (doc.status === 'historical' || doc.status === 'superseded') {
    return {
      code: 'SPEC_ACTIVE_AFTER_IMPLEMENTED',
      path: doc.path,
      risk: 'low',
      reviewRequiredBeforeUse: true,
      reason: `${doc.path} is ${doc.status} and should not be treated as current authority.`
    };
  }
  return null;
}

function reasonForReadTier(doc: DocumentRegistryEntry, readTier: DocsReadTier): string {
  if (readTier === 'active-spec') return 'Matches the active task or registered activeForTasks metadata.';
  if (readTier === 'current-state') return 'Current project state document.';
  if (readTier === 'workflow-reference') return 'Workflow or protocol reference.';
  if (readTier === 'historical') return 'Historical or superseded document.';
  if (readTier === 'excluded') return 'Excluded from default reading.';
  if (doc.readWhen.includes('only-when-linked')) return 'Read only when linked by the task or read-map.';
  return `Read tier derived from ${doc.readWhen.join(', ')}.`;
}

function findTask(projectRoot: string, taskId: string): { capsulePath: string | null; title: string | null } {
  if (!taskId) return { capsulePath: null, title: null };
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return { capsulePath: null, title: null };
  const name = fs.readdirSync(tasksDir).find((entryName) => entryName.startsWith(`${taskId}-`) && fs.statSync(path.join(tasksDir, entryName)).isDirectory());
  if (!name) return { capsulePath: null, title: null };
  const capsulePath = `tasks/${name}`;
  const taskPath = path.join(projectRoot, capsulePath, 'TASK.md');
  const taskText = fs.existsSync(taskPath) ? fs.readFileSync(taskPath, 'utf8') : '';
  const titleMatch = taskText.match(/^#\s+(.+)$/m);
  return { capsulePath, title: titleMatch ? titleMatch[1].replace(new RegExp(`^${taskId}\\s+`), '') : null };
}

function tokens(value: string): Set<string> {
  const stop = new Set(['and', 'the', 'for', 'with', 'task', 'docs', 'doc', 'map', 't']);
  return new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2 && !stop.has(token)));
}

function sortReadMapEntries(entries: DocsReadMapEntry[]): DocsReadMapEntry[] {
  return [...entries].sort((a, b) => a.path.localeCompare(b.path));
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
  readTier?: DocsReadTier;
  authority?: DocsAuthority;
  editPolicy?: DocsEditPolicy;
  activeForTasks?: string[];
  drift?: DocumentRegistryEntry['drift'];
  requiredReading: boolean;
}): DocumentRegistryEntry {
  const document: DocumentRegistryEntry = {
    path: input.path,
    title: input.title ?? titleFromPath(input.path),
    owner: 'project',
    kind: input.kind,
    status: input.status,
    scope: 'project',
    profiles: profilesForRegistryProject(registry),
    origin: { type: 'project-authored' },
    readWhen: [input.readWhen],
    requiredReading: input.requiredReading,
    updateOwner: 'human',
    updatedByCommands: ['docs.register'],
    managedSections: [],
    closeSourceRole: input.requiredReading ? 'included' : 'task-dependent',
    supersedes: [],
    editPolicy: input.editPolicy ?? 'agent-editable-with-review'
  };
  if (input.readTier) document.readTier = input.readTier;
  if (input.authority) document.authority = input.authority;
  if (input.activeForTasks && input.activeForTasks.length > 0) document.activeForTasks = input.activeForTasks;
  if (input.drift) document.drift = input.drift;
  return document;
}

function profilesForRegistryProject(registry: Pick<DocumentRegistryFile, 'project' | 'projectProfile'>): InitProfile[] {
  return [registryHadaraProfile(registry)];
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

function toPortablePath(value: string): string {
  return value.replace(/\\/g, '/');
}
