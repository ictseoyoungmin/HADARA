import fs from 'node:fs';
import path from 'node:path';
import { validateSchema } from '../core/schema';
import type {
  GeneratedScaffoldFile,
  InitArtifactV1,
  InitDocumentsV1,
  InitDocumentV1,
  InitFeature,
  InitPreset,
  InitPresetSpecV1,
  InitProjectConfigV1,
  TargetRef
} from './types';

export const INIT_LIFECYCLE_VERSION = '1' as const;
export const INIT_ARTIFACT_MANIFEST_VERSION = '1' as const;

const ALL_PRESETS: InitPreset[] = ['minimal', 'standard', 'governed'];
const BASE_FEATURES: InitFeature[] = ['task-lifecycle', 'evidence', 'document-routing'];

export const INIT_PRESET_SPECS: Record<InitPreset, InitPresetSpecV1> = {
  minimal: {
    preset: 'minimal',
    features: [...BASE_FEATURES],
    documentPacks: ['core'],
    optionalDocuments: []
  },
  standard: {
    preset: 'standard',
    features: [...BASE_FEATURES, 'project-documentation'],
    documentPacks: ['core', 'project'],
    optionalDocuments: ['docs/PROJECT_OVERVIEW.md']
  },
  governed: {
    preset: 'governed',
    features: [...BASE_FEATURES, 'project-documentation', 'governance-documentation'],
    documentPacks: ['core', 'project', 'governance'],
    optionalDocuments: [
      'docs/PROJECT_OVERVIEW.md',
      'docs/ARCHITECTURE.md',
      'docs/SECURITY.md',
      'docs/GOVERNANCE.md'
    ]
  }
};

const CORE_ARTIFACTS: InitArtifactV1[] = [
  artifact('AGENTS.md', 'file', 'mixed-managed-block'),
  artifact('.gitignore', 'file', 'mixed-append'),
  artifact('.hadara/project.json', 'file', 'command-managed'),
  artifact('.hadara/documents.json', 'file', 'command-managed'),
  artifact('.hadara/context/READ_MAP.md', 'file', 'generated-projection'),
  artifact('docs/HADARA_WORKFLOW.md', 'file', 'hadara-managed'),
  artifact('docs/TASK_BOARD.md', 'file', 'command-managed'),
  artifact('tasks', 'directory', 'command-managed')
];

const OPTIONAL_ARTIFACTS: Record<string, InitArtifactV1> = {
  'docs/PROJECT_OVERVIEW.md': artifact('docs/PROJECT_OVERVIEW.md', 'file', 'scaffold-once', ['standard', 'governed']),
  'docs/ARCHITECTURE.md': artifact('docs/ARCHITECTURE.md', 'file', 'scaffold-once', ['governed']),
  'docs/SECURITY.md': artifact('docs/SECURITY.md', 'file', 'scaffold-once', ['governed']),
  'docs/GOVERNANCE.md': artifact('docs/GOVERNANCE.md', 'file', 'scaffold-once', ['governed'])
};

export class InitModelError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = 'InitModelError';
  }
}

export type InitV1StateKind = 'none' | 'init-v1' | 'partial' | 'invalid';

export interface InitV1StateIssue {
  severity: 'warning' | 'error';
  code: string;
  path?: string;
  message: string;
}

export interface ValidatedInitV1State {
  kind: InitV1StateKind;
  projectPresent: boolean;
  documentsPresent: boolean;
  legacyRegistryPresent: boolean;
  project: InitProjectConfigV1 | null;
  documents: InitDocumentsV1 | null;
  issues: InitV1StateIssue[];
}

/**
 * Read the two-file Init v1 state boundary once and apply the canonical
 * validators before any consumer is allowed to select an authority.
 *
 * An Init v1 project is a pair. A single file, malformed file, or invalid
 * cross-file state is never upgraded into an inferred writable registry.
 */
export function readValidatedInitV1State(projectRoot: string): ValidatedInitV1State {
  const projectPath = path.join(projectRoot, '.hadara/project.json');
  const documentsPath = path.join(projectRoot, '.hadara/documents.json');
  const legacyPath = path.join(projectRoot, '.hadara/docs-registry.json');
  const projectPresent = fs.existsSync(projectPath);
  const documentsPresent = fs.existsSync(documentsPath);
  const legacyRegistryPresent = fs.existsSync(legacyPath);
  const base = {
    projectPresent,
    documentsPresent,
    legacyRegistryPresent,
    project: null,
    documents: null,
    issues: [] as InitV1StateIssue[]
  };

  if (!projectPresent && !documentsPresent) return { ...base, kind: 'none' };
  if (!projectPresent || !documentsPresent) {
    const missingPath = projectPresent ? '.hadara/documents.json' : '.hadara/project.json';
    return {
      ...base,
      kind: 'partial',
      issues: [{
        severity: 'error',
        code: 'INIT_V1_PARTIAL_STATE',
        path: missingPath,
        message: 'Init v1 requires both .hadara/project.json and .hadara/documents.json; no writable authority was selected.'
      }]
    };
  }

  let project: InitProjectConfigV1 | null = null;
  let documents: InitDocumentsV1 | null = null;
  const issues: InitV1StateIssue[] = [];
  try {
    const parsed = JSON.parse(fs.readFileSync(projectPath, 'utf8')) as unknown;
    assertInitProjectConfig(parsed);
    project = parsed;
  } catch (error) {
    issues.push(initStateIssue(error, '.hadara/project.json', 'INIT_PROJECT_CONFIG_INVALID', 'Init v1 project config is invalid.'));
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(documentsPath, 'utf8')) as unknown;
    assertInitDocuments(parsed);
    documents = parsed;
  } catch (error) {
    issues.push(initStateIssue(error, '.hadara/documents.json', 'INIT_DOCUMENTS_REGISTRY_INVALID', 'Init v1 document registry is invalid.'));
  }
  if (issues.length > 0) return { ...base, kind: 'invalid', project, documents, issues };

  const warnings: InitV1StateIssue[] = legacyRegistryPresent
    ? [{
      severity: 'warning',
      code: 'INIT_V1_LEGACY_REGISTRY_IGNORED',
      path: '.hadara/docs-registry.json',
      message: 'Init v1 is authoritative; the legacy docs registry is present but is not selected for read or write operations.'
    }]
    : [];
  return { ...base, kind: 'init-v1', project, documents, issues: warnings };
}

function initStateIssue(error: unknown, issuePath: string, fallbackCode: string, prefix: string): InitV1StateIssue {
  const code = error instanceof InitModelError ? error.code : fallbackCode;
  const detail = error instanceof Error ? error.message : String(error);
  return { severity: 'error', code, path: issuePath, message: `${prefix} ${detail}` };
}

export function resolveInitPreset(input?: { preset?: string; profile?: string }): {
  preset: InitPreset;
  warnings: Array<{ code: string; message: string }>;
} {
  if (input?.preset && input.profile) {
    throw new InitModelError('INIT_PRESET_CONFLICT', 'Use --preset or the deprecated --profile option, not both.');
  }
  if (input?.preset !== undefined) {
    return { preset: parsePreset(input.preset), warnings: [] };
  }
  if (input?.profile !== undefined) {
    const preset = input.profile === 'basic' ? 'minimal' : parsePreset(input.profile);
    return {
      preset,
      warnings: [{
        code: 'INIT_PROFILE_DEPRECATED',
        message: `--profile ${input.profile} is deprecated; use --preset ${preset}.`
      }]
    };
  }
  return { preset: 'standard', warnings: [] };
}

export function parsePreset(value: string): InitPreset {
  if (value === 'minimal' || value === 'standard' || value === 'governed') return value;
  throw new InitModelError(
    'INIT_PRESET_UNKNOWN',
    `unknown init preset: ${value}; expected minimal, standard, or governed`
  );
}

export function initArtifactManifest(preset: InitPreset): InitArtifactV1[] {
  return [
    ...CORE_ARTIFACTS,
    ...INIT_PRESET_SPECS[preset].optionalDocuments.map((documentPath) => OPTIONAL_ARTIFACTS[documentPath])
  ].map((entry) => ({ ...entry, presets: [...entry.presets] }));
}

export function createInitProjectConfig(projectId: string, preset: InitPreset): InitProjectConfigV1 {
  const spec = INIT_PRESET_SPECS[preset];
  const config: InitProjectConfigV1 = {
    schemaVersion: 'hadara.project.v1',
    projectId,
    lifecycleVersion: INIT_LIFECYCLE_VERSION,
    presetOrigin: preset,
    features: [...spec.features],
    documentPacks: [...spec.documentPacks]
  };
  assertInitProjectConfig(config);
  return config;
}

export function createInitDocuments(preset: InitPreset): InitDocumentsV1 {
  const documents: InitDocumentV1[] = [
    {
      id: 'hadara-agents',
      path: 'AGENTS.md',
      management: 'mixed-managed-block',
      status: 'active',
      readPolicy: 'session-start'
    },
    {
      id: 'hadara-workflow',
      path: 'docs/HADARA_WORKFLOW.md',
      management: 'hadara-managed',
      status: 'active',
      readPolicy: 'session-start'
    },
    {
      id: 'hadara-task-board',
      path: 'docs/TASK_BOARD.md',
      management: 'hadara-managed',
      status: 'active',
      readPolicy: 'explicit-only'
    },
    {
      id: 'hadara-read-map',
      path: '.hadara/context/READ_MAP.md',
      management: 'generated-projection',
      status: 'active',
      readPolicy: 'explicit-only'
    }
  ];
  for (const documentPath of INIT_PRESET_SPECS[preset].optionalDocuments) {
    documents.push({
      id: optionalDocumentId(documentPath),
      path: documentPath,
      management: 'user-authored',
      status: 'draft',
      readPolicy: 'on-target',
      appliesTo: [{ namespace: 'project' }]
    });
  }
  const registry: InitDocumentsV1 = {
    schemaVersion: 'hadara.documents.v1',
    documents
  };
  assertInitDocuments(registry);
  return registry;
}

export function createInitV1ScaffoldFiles(projectId: string, preset: InitPreset): GeneratedScaffoldFile[] {
  const project = createInitProjectConfig(projectId, preset);
  const registry = createInitDocuments(preset);
  const files: GeneratedScaffoldFile[] = [
    { path: 'AGENTS.md', content: createAgentsBootstrap() },
    { path: '.gitignore', content: '.hadara/local/\n' },
    { path: '.hadara/project.json', content: jsonFile(project) },
    { path: '.hadara/documents.json', content: jsonFile(registry) },
    { path: '.hadara/context/READ_MAP.md', content: createReadMap(registry) },
    { path: 'docs/HADARA_WORKFLOW.md', content: createWorkflow() },
    { path: 'docs/TASK_BOARD.md', content: createTaskBoard() }
  ];
  for (const documentPath of INIT_PRESET_SPECS[preset].optionalDocuments) {
    files.push({ path: documentPath, content: createOptionalDocument(documentPath) });
  }
  return files;
}

export function presetFromProjectConfig(project: InitProjectConfigV1): InitPreset {
  if (project.documentPacks.includes('governance')) return 'governed';
  if (project.documentPacks.includes('project')) return 'standard';
  return 'minimal';
}

export function createInitV1UpgradeFiles(
  project: InitProjectConfigV1,
  registry: InitDocumentsV1
): GeneratedScaffoldFile[] {
  const generated = createInitV1ScaffoldFiles(project.projectId, presetFromProjectConfig(project));
  const coreFiles = new Set(CORE_ARTIFACTS.filter((artifact) => artifact.type === 'file').map((artifact) => artifact.path));
  return generated
    .filter((file) => coreFiles.has(file.path))
    .map((file) => {
      if (file.path === '.hadara/project.json') return { ...file, content: jsonFile(project) };
      if (file.path === '.hadara/documents.json') return { ...file, content: jsonFile(registry) };
      if (file.path === '.hadara/context/READ_MAP.md') return { ...file, content: createReadMap(registry) };
      return file;
    });
}

export function assertInitProjectConfig(value: unknown): asserts value is InitProjectConfigV1 {
  const schemaResult = validateSchema('hadara.project.v1', value);
  if (!schemaResult.ok) fail('INIT_PROJECT_CONFIG_INVALID', schemaResult.issues[0]?.message ?? 'schema validation failed');
  const object = asObject(value);
  assertExactKeys(object, ['schemaVersion', 'projectId', 'lifecycleVersion', 'presetOrigin', 'features', 'documentPacks'], 'project config');
  if (typeof object.projectId !== 'string' || object.projectId.trim().length === 0 || object.projectId !== object.projectId.trim()) {
    fail('INIT_PROJECT_CONFIG_INVALID', 'projectId must be a non-empty, trimmed string.');
  }
  const features = stringArray(object.features, 'features', 'INIT_PROJECT_CONFIG_INVALID');
  const packs = stringArray(object.documentPacks, 'documentPacks', 'INIT_PROJECT_CONFIG_INVALID');
  assertUnique(features, 'features', 'INIT_PROJECT_CONFIG_INVALID');
  assertUnique(packs, 'documentPacks', 'INIT_PROJECT_CONFIG_INVALID');
  for (const feature of BASE_FEATURES) {
    if (!features.includes(feature)) fail('INIT_PROJECT_CONFIG_INVALID', `features must include ${feature}.`);
  }
  if (!packs.includes('core')) fail('INIT_PROJECT_CONFIG_INVALID', 'documentPacks must include core.');
  const hasProjectFeature = features.includes('project-documentation');
  const hasProjectPack = packs.includes('project');
  const hasGovernanceFeature = features.includes('governance-documentation');
  const hasGovernancePack = packs.includes('governance');
  if (hasProjectFeature !== hasProjectPack || hasGovernanceFeature !== hasGovernancePack) {
    fail('INIT_PROJECT_CONFIG_INVALID', 'documentation features and document packs must be consistent.');
  }
  if (hasGovernancePack && !hasProjectPack) {
    fail('INIT_PROJECT_CONFIG_INVALID', 'governance document pack requires the project document pack.');
  }
}

export function assertInitDocuments(value: unknown): asserts value is InitDocumentsV1 {
  const schemaResult = validateSchema('hadara.documents.v1', value);
  if (!schemaResult.ok) fail('INIT_DOCUMENT_REGISTRY_INVALID', schemaResult.issues[0]?.message ?? 'schema validation failed');
  const object = asObject(value);
  assertExactKeys(object, ['schemaVersion', 'documents'], 'documents registry', 'INIT_DOCUMENT_REGISTRY_INVALID');
  if (!Array.isArray(object.documents)) fail('INIT_DOCUMENT_REGISTRY_INVALID', 'documents must be an array.');
  const ids = new Set<string>();
  const paths = new Set<string>();
  const entries = object.documents.map((entry, index) => validateDocument(entry, index, ids, paths));
  const knownIds = new Set(entries.map((entry) => entry.id));
  for (const entry of entries) {
    for (const supersededId of entry.supersedes ?? []) {
      if (!knownIds.has(supersededId)) {
        fail('INIT_DOCUMENT_REGISTRY_INVALID', `${entry.id} supersedes missing document ${supersededId}.`);
      }
      if (supersededId === entry.id) {
        fail('INIT_DOCUMENT_REGISTRY_INVALID', `${entry.id} must not supersede itself.`);
      }
    }
  }
  assertAcyclicSupersedes(entries);
}

export function assertTargetRef(value: unknown): asserts value is TargetRef {
  const object = asObject(value, 'INIT_DOCUMENT_REGISTRY_INVALID', 'TargetRef must be an object.');
  const namespace = object.namespace;
  if (namespace === 'project') {
    assertExactKeys(object, ['namespace'], 'project TargetRef', 'INIT_DOCUMENT_REGISTRY_INVALID');
    return;
  }
  if (namespace !== 'release' && namespace !== 'milestone' && namespace !== 'component' && namespace !== 'task') {
    fail('INIT_DOCUMENT_REGISTRY_INVALID', `unsupported TargetRef namespace: ${String(namespace)}.`);
  }
  assertExactKeys(object, ['namespace', 'id'], `${namespace} TargetRef`, 'INIT_DOCUMENT_REGISTRY_INVALID');
  if (typeof object.id !== 'string' || object.id.trim().length === 0 || object.id !== object.id.trim()) {
    fail('INIT_DOCUMENT_REGISTRY_INVALID', `${namespace} TargetRef id must be a non-empty, trimmed opaque string.`);
  }
}

function validateDocument(
  value: unknown,
  index: number,
  ids: Set<string>,
  paths: Set<string>
): InitDocumentV1 {
  const object = asObject(value, 'INIT_DOCUMENT_REGISTRY_INVALID', `documents[${index}] must be an object.`);
  assertExactKeys(
    object,
    ['id', 'path', 'management', 'status', 'readPolicy', 'appliesTo', 'supersedes'],
    `documents[${index}]`,
    'INIT_DOCUMENT_REGISTRY_INVALID',
    true
  );
  const id = stringValue(object.id, `documents[${index}].id`, 'INIT_DOCUMENT_REGISTRY_INVALID');
  if (id !== id.trim()) fail('INIT_DOCUMENT_REGISTRY_INVALID', `documents[${index}].id must be trimmed.`);
  if (ids.has(id)) fail('INIT_DOCUMENT_REGISTRY_INVALID', `duplicate document id: ${id}.`);
  ids.add(id);
  const documentPath = stringValue(object.path, `documents[${index}].path`, 'INIT_DOCUMENT_REGISTRY_INVALID');
  assertSafeRelativePath(documentPath);
  if (paths.has(documentPath)) fail('INIT_DOCUMENT_REGISTRY_INVALID', `duplicate document path: ${documentPath}.`);
  paths.add(documentPath);
  if (object.readPolicy === 'on-target' && (!Array.isArray(object.appliesTo) || object.appliesTo.length === 0)) {
    fail('INIT_DOCUMENT_REGISTRY_INVALID', `${id} uses on-target and requires appliesTo.`);
  }
  if (object.appliesTo !== undefined) {
    if (!Array.isArray(object.appliesTo)) fail('INIT_DOCUMENT_REGISTRY_INVALID', `${id}.appliesTo must be an array.`);
    const targetKeys = new Set<string>();
    for (const target of object.appliesTo) {
      assertTargetRef(target);
      const key = JSON.stringify(target);
      if (targetKeys.has(key)) fail('INIT_DOCUMENT_REGISTRY_INVALID', `${id} contains a duplicate TargetRef.`);
      targetKeys.add(key);
    }
  }
  if (object.supersedes !== undefined) {
    const supersedes = stringArray(object.supersedes, `${id}.supersedes`, 'INIT_DOCUMENT_REGISTRY_INVALID');
    assertUnique(supersedes, `${id}.supersedes`, 'INIT_DOCUMENT_REGISTRY_INVALID');
  }
  return object as unknown as InitDocumentV1;
}

function assertSafeRelativePath(value: string): void {
  if (
    value !== value.trim()
    || value.includes('\\')
    || path.posix.isAbsolute(value)
    || path.win32.isAbsolute(value)
    || value.split('/').includes('..')
    || path.posix.normalize(value) !== value
    || value === '.'
  ) {
    fail('INIT_DOCUMENT_REGISTRY_INVALID', `document path must be a normalized project-relative POSIX path: ${value}.`);
  }
}

function assertAcyclicSupersedes(entries: InitDocumentV1[]): void {
  const edges = new Map(entries.map((entry) => [entry.id, entry.supersedes ?? []]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): void => {
    if (visiting.has(id)) fail('INIT_DOCUMENT_REGISTRY_INVALID', `supersedes cycle detected at ${id}.`);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const next of edges.get(id) ?? []) visit(next);
    visiting.delete(id);
    visited.add(id);
  };
  for (const entry of entries) visit(entry.id);
}

function createAgentsBootstrap(): string {
  return `# AGENTS.md

<!-- hadara:managed:start bootstrap -->
This is a HADARA project.

At the start of each session:

1. Read \`docs/HADARA_WORKFLOW.md\`.
2. Run \`hadara task status --json\`.
3. Prefer the selected Task Capsule and its registered required documents over broad repository reading.
4. Use \`.hadara/context/READ_MAP.md\` and \`docs/TASK_BOARD.md\` only as Markdown fallbacks when the CLI is unavailable or routing needs investigation.

Only registered documents are HADARA routing authority. Do not hand-edit command-managed files such as \`.hadara/project.json\`, \`.hadara/documents.json\`, or \`docs/TASK_BOARD.md\`.
Identity fields in Task Capsules are command-owned; update them with \`task create\` or \`task close\`. See \`docs/HADARA_WORKFLOW.md#task-capsule-identity-ownership\`.
<!-- hadara:managed:end bootstrap -->
`;
}

function createWorkflow(): string {
  return `# HADARA Workflow

## Required Reading

Read this file at every agent session start, then use \`hadara task status --json\` as the primary ingress.

## Task Loop

Keep implementation, validation evidence, and handoff inside the selected Task Capsule. Create a capsule only when no suitable task exists. Finish capsule documents and evidence before \`hadara task close --task T-XXXX --json\`.

## Document Routing

Read registered \`session-start\` documents first. Resolve additional documents from the selected task and exact TargetRef matches. Unregistered documents are not automatic authority.

## Task Capsule Identity Ownership

The \`ID\`, \`Title\`, \`Status\`, \`Created\`, and \`Updated\` fields in Task Capsule Identity tables are command-owned. Do not hand-edit them. Use \`task create\` to create identity and \`task close\` to apply lifecycle updates.

Task prose, acceptance, validation, changes, risks, history, and handoff guidance remain worker-authored before close. Close proof state is derived by task status and audit reports, not stored as a TaskStatus token.

## Read Map Lifecycle

\`.hadara/documents.json\` is the Init v1 document-routing authority. \`.hadara/context/READ_MAP.md\` is a generated fallback projection and must not be edited directly. Use \`hadara docs read-map --task T-XXXX --json\` for task-specific dynamic routing; read the projection directly only when the CLI is unavailable or routing drift is being investigated.

## Ownership

Do not directly edit command-managed files. HADARA-managed files are replaced only by lifecycle commands; mixed-managed files preserve user-owned content outside HADARA markers.
`;
}

function createTaskBoard(): string {
  return `# Task Board

| ID | Title | Status | Targets | Capsule | Result |
|---|---|---|---|---|---|
`;
}

export function createReadMap(registry: InitDocumentsV1): string {
  const rows = [...registry.documents].sort((a, b) => a.path.localeCompare(b.path))
    .map((document) => `| \`${document.path}\` | ${document.readPolicy} | ${document.status} |`)
    .join('\n');
  return `# HADARA Read Map

Generated from \`.hadara/documents.json\`. Do not edit directly.

| Document | Read Policy | Status |
|---|---|---|
${rows}
`;
}

function createOptionalDocument(documentPath: string): string {
  const title = path.posix.basename(documentPath, '.md').split('_').map(titleCase).join(' ');
  return `# ${title}

Replace this scaffold with project-owned content. HADARA will preserve it during upgrade.
`;
}

function titleCase(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function optionalDocumentId(documentPath: string): string {
  return path.posix.basename(documentPath, '.md').toLowerCase().replaceAll('_', '-');
}

function artifact(
  artifactPath: string,
  type: InitArtifactV1['type'],
  management: InitArtifactV1['management'],
  presets: InitPreset[] = ALL_PRESETS
): InitArtifactV1 {
  return { path: artifactPath, type, management, presets: [...presets] };
}

function jsonFile(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function asObject(value: unknown, code = 'INIT_PROJECT_CONFIG_INVALID', message = 'value must be an object.'): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) fail(code, message);
  return value as Record<string, unknown>;
}

function assertExactKeys(
  value: Record<string, unknown>,
  keys: string[],
  label: string,
  code = 'INIT_PROJECT_CONFIG_INVALID',
  optional = false
): void {
  const allowed = new Set(keys);
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length > 0) fail(code, `${label} contains unsupported field(s): ${unknown.join(', ')}.`);
  if (optional) return;
  const missing = keys.filter((key) => !Object.prototype.hasOwnProperty.call(value, key));
  if (missing.length > 0) fail(code, `${label} is missing field(s): ${missing.join(', ')}.`);
}

function stringValue(value: unknown, label: string, code: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) fail(code, `${label} must be a non-empty string.`);
  return value as string;
}

function stringArray(value: unknown, label: string, code: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.trim().length === 0)) {
    fail(code, `${label} must be an array of non-empty strings.`);
  }
  return value as string[];
}

function assertUnique(values: string[], label: string, code: string): void {
  if (new Set(values).size !== values.length) fail(code, `${label} must not contain duplicates.`);
}

function fail(code: string, message: string): never {
  throw new InitModelError(code, message);
}
