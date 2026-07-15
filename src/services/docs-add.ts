import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { InitProfile } from '../init/types';
import {
  createAgentGuideDoc,
  createArchitectureDoc,
  createDecisionsDoc,
  createRoadmapDoc,
  createSecurityModelDoc,
  createTestStrategyDoc
} from '../init/templates';
import {
  DOCS_REGISTRY_PATH,
  createSeedDocumentRegistry,
  registryJson,
  type DocsIssue,
  type DocumentKind,
  type DocumentRegistryEntry,
  type DocumentRegistryFile,
  type ReadWhen
} from './docs-registry';

export type DocsAddType = 'architecture' | 'decisions' | 'roadmap' | 'security-model' | 'test-strategy' | 'agent-guide';

export interface DocsAddReport {
  schemaVersion: 'hadara.docs.add.v1';
  command: 'docs.add';
  ok: boolean;
  mode: 'dry-run' | 'execute';
  type: DocsAddType | null;
  path: string | null;
  beforeHash: string;
  action: 'create' | 'register-existing' | 'already-current' | 'blocked';
  writes: string[];
  document: DocumentRegistryEntry | null;
  issues: DocsIssue[];
  executeCommand?: string;
}

interface DocsAddDefinition {
  type: DocsAddType;
  path: string;
  title: string;
  kind: DocumentKind;
  status: DocumentRegistryEntry['status'];
  readWhen: ReadWhen[];
  requiredReading: boolean;
  content: (profile: InitProfile) => string;
}

const DEFINITIONS: Record<DocsAddType, DocsAddDefinition> = {
  architecture: {
    type: 'architecture',
    path: 'docs/ARCHITECTURE.md',
    title: 'ARCHITECTURE',
    kind: 'architecture',
    status: 'reference',
    readWhen: ['only-when-linked'],
    requiredReading: false,
    content: createArchitectureDoc
  },
  decisions: {
    type: 'decisions',
    path: 'docs/DECISIONS.md',
    title: 'DECISIONS',
    kind: 'decision-log',
    status: 'reference',
    readWhen: ['only-when-linked'],
    requiredReading: false,
    content: () => createDecisionsDoc()
  },
  roadmap: {
    type: 'roadmap',
    path: 'docs/ROADMAP.md',
    title: 'ROADMAP',
    kind: 'roadmap',
    status: 'reference',
    readWhen: ['only-when-linked'],
    requiredReading: false,
    content: () => createRoadmapDoc()
  },
  'security-model': {
    type: 'security-model',
    path: 'docs/SECURITY_MODEL.md',
    title: 'SECURITY_MODEL',
    kind: 'security-model',
    status: 'reference',
    readWhen: ['only-when-linked'],
    requiredReading: false,
    content: () => createSecurityModelDoc()
  },
  'test-strategy': {
    type: 'test-strategy',
    path: 'docs/TEST_STRATEGY.md',
    title: 'TEST_STRATEGY',
    kind: 'test-strategy',
    status: 'reference',
    readWhen: ['only-when-linked'],
    requiredReading: false,
    content: () => createTestStrategyDoc()
  },
  'agent-guide': {
    type: 'agent-guide',
    path: 'docs/AGENT_GUIDE.md',
    title: 'AGENT_GUIDE',
    kind: 'implementation-guide',
    status: 'reference',
    readWhen: ['only-when-linked'],
    requiredReading: false,
    content: () => createAgentGuideDoc()
  }
};

export const DOCS_ADD_TYPES = Object.keys(DEFINITIONS) as DocsAddType[];

export function createDocsAddReport(projectRoot: string, options: {
  type: string;
  mode?: 'dry-run' | 'execute';
  beforeHash?: string;
}): DocsAddReport {
  const mode = options.mode ?? 'dry-run';
  const type = parseDocsAddType(options.type);
  const state = readRegistry(projectRoot);
  const issues = [...state.issues];
  if (!type) {
    issues.push({
      severity: 'error',
      code: 'DOCS_ADD_UNKNOWN_TYPE',
      message: `Unsupported docs add type: ${options.type}`,
      received: options.type,
      allowedValues: [...DOCS_ADD_TYPES]
    });
  }
  const definition = type ? DEFINITIONS[type] : null;
  const existing = definition ? state.registry.documents.find((doc) => doc.path === definition.path) ?? null : null;
  validateExecuteGuard(mode, options.beforeHash, state.beforeHash, issues);

  const document = definition ? existing ?? buildDocument(definition, state.profile) : null;
  const action = issues.some((issue) => issue.severity === 'error')
    ? 'blocked'
    : existing
    ? 'already-current'
    : fs.existsSync(path.join(projectRoot, definition!.path))
    ? 'register-existing'
    : 'create';

  const writes: string[] = [];
  if (mode === 'execute' && document && action !== 'already-current' && issues.every((issue) => issue.severity !== 'error')) {
    if (action === 'create') {
      const absolutePath = path.join(projectRoot, definition!.path);
      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
      fs.writeFileSync(absolutePath, definition!.content(state.profile), { encoding: 'utf8', flag: 'wx' });
      writes.push(definition!.path);
    }
    state.registry.documents = [...state.registry.documents, document].sort((a, b) => a.path.localeCompare(b.path));
    state.registry.generatedAt = new Date().toISOString();
    fs.mkdirSync(path.dirname(path.join(projectRoot, DOCS_REGISTRY_PATH)), { recursive: true });
    fs.writeFileSync(path.join(projectRoot, DOCS_REGISTRY_PATH), registryJson(state.registry), 'utf8');
    writes.push(DOCS_REGISTRY_PATH);
  }

  const report: DocsAddReport = {
    schemaVersion: 'hadara.docs.add.v1',
    command: 'docs.add',
    ok: issues.every((issue) => issue.severity !== 'error'),
    mode,
    type,
    path: definition?.path ?? null,
    beforeHash: state.beforeHash,
    action,
    writes,
    document,
    issues
  };
  if (mode === 'dry-run' && report.ok && action !== 'already-current') {
    report.executeCommand = `hadara docs add ${type} --execute --before-hash ${state.beforeHash} --json`;
  }
  return report;
}

function parseDocsAddType(value: string): DocsAddType | null {
  return DOCS_ADD_TYPES.includes(value as DocsAddType) ? value as DocsAddType : null;
}

function readRegistry(projectRoot: string): {
  registry: DocumentRegistryFile;
  profile: InitProfile;
  beforeHash: string;
  issues: DocsIssue[];
} {
  const registryPath = path.join(projectRoot, DOCS_REGISTRY_PATH);
  if (!fs.existsSync(registryPath)) {
    const registry = createSeedDocumentRegistry('standard');
    return { registry, profile: 'standard', beforeHash: hashText(''), issues: [] };
  }
  try {
    const text = fs.readFileSync(registryPath, 'utf8');
    const registry = JSON.parse(text) as DocumentRegistryFile;
    return { registry, profile: registryProfile(registry), beforeHash: hashText(text), issues: [] };
  } catch (error) {
    return {
      registry: createSeedDocumentRegistry('standard'),
      profile: 'standard',
      beforeHash: hashText(''),
      issues: [{
        severity: 'error',
        code: 'DOCS_ADD_REGISTRY_INVALID',
        path: DOCS_REGISTRY_PATH,
        message: `${DOCS_REGISTRY_PATH} could not be read: ${error instanceof Error ? error.message : String(error)}`
      }]
    };
  }
}

function registryProfile(registry: DocumentRegistryFile): InitProfile {
  const value = registry.project?.hadaraProfile ?? registry.projectProfile;
  return value === 'basic' || value === 'standard' || value === 'governed' ? value : 'standard';
}

function buildDocument(definition: DocsAddDefinition, profile: InitProfile): DocumentRegistryEntry {
  return {
    path: definition.path,
    title: definition.title,
    owner: 'project',
    kind: definition.kind,
    status: definition.status,
    scope: 'project',
    profiles: [profile],
    readWhen: definition.readWhen,
    requiredReading: definition.requiredReading,
    updateOwner: 'human',
    updatedByCommands: ['docs.add', 'docs.register', 'docs.update'],
    managedSections: [],
    closeSourceRole: 'task-dependent',
    readTier: 'conditional-reference',
    authority: 'approved',
    editPolicy: 'agent-assisted',
    origin: { type: 'hadara-scaffold', generator: 'docs.add', template: definition.type },
    supersedes: [],
    notes: 'Optional project-owned document. Keep it current when a task materially changes its subject; otherwise archive or unregister it.'
  };
}

function validateExecuteGuard(mode: 'dry-run' | 'execute', requestedHash: string | undefined, beforeHash: string, issues: DocsIssue[]): void {
  if (mode !== 'execute') return;
  if (!requestedHash) {
    issues.push({ severity: 'error', code: 'DOCS_ADD_BEFORE_HASH_REQUIRED', message: 'docs add --execute requires --before-hash from a reviewed dry-run.' });
  } else if (requestedHash !== beforeHash) {
    issues.push({ severity: 'error', code: 'DOCS_ADD_BEFORE_HASH_MISMATCH', message: `docs add before-hash mismatch: expected ${beforeHash}, received ${requestedHash}.` });
  }
}

function hashText(value: string): string {
  return `sha256:${crypto.createHash('sha256').update(value, 'utf8').digest('hex')}`;
}
