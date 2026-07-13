import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type {
  InitAdoptionAction,
  InitAdoptionProject,
  InitAdoptionReport,
  InitAdoptionSignal,
  InitIssue,
  InitProfile,
  InitRepositoryState
} from './types';
import { createGeneratedScaffoldFiles } from './scaffold';

const HADARA_STATE_PATHS = [
  '.hadara',
  '.hadara/scaffold.json',
  '.hadara/docs-registry.json',
  '.hadara/state/current.json'
] as const;

const TARGET_DOC_PATHS = [
  'docs/HADARA_WORKFLOW.md',
  'docs/PROJECT_STATE.md',
  'docs/TASK_BOARD.md',
  'docs/AGENT_HANDOFF.md',
  'docs/ARCHITECTURE.md',
  'docs/DECISIONS.md',
  'docs/ROADMAP.md',
  'docs/SECURITY_MODEL.md'
] as const;

const MANIFEST_PATHS = [
  'README.md',
  'package.json',
  'pyproject.toml',
  'Cargo.toml',
  'go.mod',
  'pom.xml',
  'build.gradle',
  'build.gradle.kts'
] as const;

const SOURCE_ROOTS = ['src', 'app', 'lib', 'packages'] as const;
const PROJECT_REFERENCE_DOCS = new Set(['docs/ARCHITECTURE.md', 'docs/DECISIONS.md', 'docs/ROADMAP.md', 'docs/SECURITY_MODEL.md']);
const CORE_PATCH_DOCS = new Set(['.gitignore', 'AGENTS.md', 'docs/PROJECT_STATE.md', 'docs/TASK_BOARD.md', 'docs/AGENT_HANDOFF.md']);

export function createInitAdoptionReport(projectRoot: string, input: {
  profile: InitProfile;
  mode?: 'dry-run' | 'execute';
  planHash?: string;
}): InitAdoptionReport {
  const mode = input.mode ?? 'dry-run';
  const signals = collectSignals(projectRoot);
  const blockers = collectSafetyBlockers(projectRoot, signals);
  const repositoryState = classifyRepository(projectRoot, signals, blockers);
  const project = inferProject(projectRoot);
  const actions = planActions(signals, repositoryState, input.profile);
  const warnings = collectWarnings(repositoryState);
  const snapshotHash = hashJson({
    signals: signals.filter((signal) => signal.type !== 'missing'),
    repositoryState,
    blockers
  });
  const planCore = {
    repositoryState,
    profile: input.profile,
    project,
    actions,
    blockers,
    warnings,
    snapshotHash
  };
  const planHash = hashJson(planCore);
  const executeIssues: InitIssue[] = [];
  if (mode === 'execute') {
    if (!input.planHash) {
      executeIssues.push({
        severity: 'error',
        code: 'INIT_ADOPTION_PLAN_HASH_REQUIRED',
        message: 'Brownfield adoption execute requires --plan-hash from the reviewed dry-run.'
      });
    } else if (input.planHash !== planHash) {
      executeIssues.push({
        severity: 'error',
        code: 'INIT_ADOPTION_PLAN_MISMATCH',
        message: `Adoption plan hash ${planHash} does not match reviewed hash ${input.planHash}.`
      });
    }
    executeIssues.push({
      severity: 'error',
      code: 'INIT_ADOPTION_EXECUTE_NOT_IMPLEMENTED',
      message: 'Brownfield adoption execute is planned for the managed merge/writer capsule; this planner writes zero files.'
    });
  }
  const allBlockers = [...blockers, ...executeIssues];
  return {
    schemaVersion: 'hadara.init.adoption.v1',
    command: 'init',
    ok: allBlockers.length === 0,
    mode,
    repositoryState,
    profile: input.profile,
    project,
    detectedManifests: signals.filter((signal) => signal.kind === 'manifest' && signal.type !== 'missing'),
    actions,
    preservedPaths: actions.filter((action) => action.disposition === 'preserve').map((action) => action.path),
    managedPatches: actions.filter((action) => action.disposition === 'patch-managed-section'),
    registeredExistingDocs: actions.filter((action) => action.disposition === 'register-existing'),
    blockers: allBlockers,
    warnings,
    snapshotHash,
    planHash,
    executeCommand: mode === 'dry-run' && repositoryState === 'brownfield' && allBlockers.length === 0
      ? `hadara init --profile ${input.profile} --adopt --execute --plan-hash ${planHash} --json`
      : undefined,
    writes: [],
    issues: [...allBlockers, ...warnings]
  };
}

export function shouldUseAdoptionPlan(projectRoot: string): boolean {
  const signals = collectSignals(projectRoot);
  const blockers = collectSafetyBlockers(projectRoot, signals);
  return classifyRepository(projectRoot, signals, blockers) !== 'greenfield';
}

function collectSignals(projectRoot: string): InitAdoptionSignal[] {
  const rawSignals: Array<[string, InitAdoptionSignal['kind']]> = [
    ...HADARA_STATE_PATHS.map((signal): [string, InitAdoptionSignal['kind']] => [signal, 'hadara-state']),
    ['AGENTS.md', 'agent-entry'],
    ['.gitignore', 'ignore-rules'],
    ['tasks', 'task-area'],
    ...TARGET_DOC_PATHS.map((signal): [string, InitAdoptionSignal['kind']] => [signal, 'hadara-target-doc']),
    ...MANIFEST_PATHS.map((signal): [string, InitAdoptionSignal['kind']] => [signal, 'manifest']),
    ...SOURCE_ROOTS.map((signal): [string, InitAdoptionSignal['kind']] => [signal, 'source-root'])
  ];
  return rawSignals.map(([relativePath, kind]) => inspectSignal(projectRoot, relativePath, kind));
}

function inspectSignal(projectRoot: string, relativePath: string, kind: InitAdoptionSignal['kind']): InitAdoptionSignal {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(absolutePath)) return { path: relativePath, kind, type: 'missing', size: null, hash: null };
  const stat = fs.lstatSync(absolutePath);
  const type: InitAdoptionSignal['type'] = stat.isSymbolicLink()
    ? 'symlink'
    : stat.isFile()
      ? 'file'
      : stat.isDirectory()
        ? 'directory'
        : 'other';
  return {
    path: relativePath,
    kind,
    type,
    size: stat.size,
    hash: type === 'file' ? hashBuffer(fs.readFileSync(absolutePath)) : hashText(`${type}:${stat.size}`)
  };
}

function collectSafetyBlockers(projectRoot: string, signals: InitAdoptionSignal[]): InitIssue[] {
  const blockers: InitIssue[] = [];
  for (const signal of signals) {
    if (signal.type === 'symlink') {
      blockers.push({ severity: 'error', code: 'INIT_ADOPTION_TARGET_SYMLINK', path: signal.path, message: `${signal.path} is a symlink and cannot be safely adopted.` });
    } else if (signal.type === 'other') {
      blockers.push({ severity: 'error', code: 'INIT_ADOPTION_TARGET_UNSUPPORTED_TYPE', path: signal.path, message: `${signal.path} is not a regular file or directory.` });
    }
  }
  for (const jsonPath of ['.hadara/scaffold.json', '.hadara/docs-registry.json', '.hadara/state/current.json']) {
    const signal = signals.find((candidate) => candidate.path === jsonPath);
    if (signal?.type === 'file') {
      try {
        JSON.parse(fs.readFileSync(path.join(projectRoot, jsonPath), 'utf8'));
      } catch (error) {
        blockers.push({
          severity: 'error',
          code: 'INIT_ADOPTION_INVALID_JSON',
          path: jsonPath,
          message: `${jsonPath} could not be parsed: ${error instanceof Error ? error.message : String(error)}`
        });
      }
    }
  }
  return blockers;
}

function classifyRepository(projectRoot: string, signals: InitAdoptionSignal[], blockers: InitIssue[]): InitRepositoryState {
  if (blockers.length > 0) return 'unsafe';
  const scaffoldSignal = signals.find((signal) => signal.path === '.hadara/scaffold.json');
  const registrySignal = signals.find((signal) => signal.path === '.hadara/docs-registry.json');
  const currentStateSignal = signals.find((signal) => signal.path === '.hadara/state/current.json');
  const hadaraDir = signals.find((signal) => signal.path === '.hadara');
  if (scaffoldSignal?.type === 'file') {
    const scaffold = readJsonObject(path.join(projectRoot, '.hadara/scaffold.json'));
    if (scaffold?.hadaraProtocol && scaffold.hadaraProtocol !== '0.4') return 'hadara-legacy';
    if (registrySignal?.type === 'file' && currentStateSignal?.type === 'file') return 'hadara-current';
    return 'hadara-partial';
  }
  if (hadaraDir?.type !== 'missing' || registrySignal?.type === 'file' || currentStateSignal?.type === 'file') return 'hadara-partial';
  const hasProjectSignals = signals.some((signal) =>
    signal.type !== 'missing' && (
      signal.kind === 'manifest' ||
      signal.kind === 'source-root' ||
      signal.kind === 'agent-entry' ||
      signal.kind === 'ignore-rules' ||
      signal.kind === 'hadara-target-doc' ||
      signal.kind === 'task-area'
    )
  );
  return hasProjectSignals ? 'brownfield' : 'greenfield';
}

function planActions(signals: InitAdoptionSignal[], repositoryState: InitRepositoryState, profile: InitProfile): InitAdoptionAction[] {
  if (repositoryState !== 'brownfield') return [];
  const existingPaths = new Set(signals.filter((signal) => signal.type !== 'missing').map((signal) => signal.path));
  const existingActions: InitAdoptionAction[] = signals
    .filter((signal) => signal.type !== 'missing')
    .filter((signal) => signal.kind !== 'manifest' && signal.kind !== 'source-root')
    .map((signal) => {
      const role = roleForPath(signal.path);
      const disposition = dispositionForSignal(signal);
      const ownership: InitAdoptionAction['ownership'] = disposition === 'already-managed' ? 'hadara' : signal.path.startsWith('.hadara/') ? 'unknown' : 'project';
      return {
        path: signal.path,
        role,
        existingType: signal.type,
        ownership,
        disposition,
        beforeHash: signal.hash,
        preservesExistingContent: disposition !== 'block' && disposition !== 'create',
        reason: reasonForDisposition(signal.path, disposition)
      };
    });
  const createActions: InitAdoptionAction[] = [
    ...createGeneratedScaffoldFiles(profile).map((file) => file.path),
    'tasks'
  ]
    .filter((targetPath, index, paths) => paths.indexOf(targetPath) === index)
    .filter((targetPath) => !existingPaths.has(targetPath))
    .map((targetPath) => ({
      path: targetPath,
      role: roleForPath(targetPath),
      existingType: 'missing',
      ownership: 'hadara',
      disposition: 'create',
      beforeHash: null,
      preservesExistingContent: true,
      reason: reasonForDisposition(targetPath, 'create')
    }));
  return [...existingActions, ...createActions].sort((left, right) => left.path.localeCompare(right.path));
}

function dispositionForSignal(signal: InitAdoptionSignal): InitAdoptionAction['disposition'] {
  if (signal.type === 'symlink' || signal.type === 'other') return 'block';
  if (CORE_PATCH_DOCS.has(signal.path)) return 'patch-managed-section';
  if (PROJECT_REFERENCE_DOCS.has(signal.path)) return 'register-existing';
  if (signal.path === 'tasks') return signal.type === 'directory' ? 'preserve' : 'block';
  if (signal.path === 'docs/HADARA_WORKFLOW.md') return 'block';
  if (signal.path === '.hadara') return 'block';
  return 'preserve';
}

function roleForPath(relativePath: string): string {
  if (relativePath === '.gitignore') return 'local-state-ignore';
  if (relativePath === 'AGENTS.md') return 'agent-entry';
  if (relativePath === 'docs/PROJECT_STATE.md') return 'project-state-projection';
  if (relativePath === 'docs/TASK_BOARD.md') return 'task-board-projection';
  if (relativePath === 'docs/AGENT_HANDOFF.md') return 'handoff-projection';
  if (PROJECT_REFERENCE_DOCS.has(relativePath)) return 'project-reference-doc';
  if (relativePath === 'tasks') return 'task-area';
  return 'adoption-target';
}

function reasonForDisposition(relativePath: string, disposition: InitAdoptionAction['disposition']): string {
  if (disposition === 'patch-managed-section') return `${relativePath} remains project-owned; HADARA will patch only a bounded managed section in a later execute capsule.`;
  if (disposition === 'register-existing') return `${relativePath} is an existing project document and will be registered as project-authored.`;
  if (disposition === 'preserve') return `${relativePath} is preserved byte-for-byte by the dry-run planner.`;
  if (disposition === 'block') return `${relativePath} requires a safer adoption writer or manual review before mutation.`;
  if (disposition === 'already-managed') return `${relativePath} already appears managed by HADARA.`;
  return `${relativePath} can be created during reviewed adoption execute.`;
}

function collectWarnings(repositoryState: InitRepositoryState): InitIssue[] {
  if (repositoryState === 'brownfield') {
    return [{
      severity: 'warning',
      code: 'INIT_ADOPTION_BROWNFIELD_DRY_RUN',
      message: 'Existing project signals were detected; bare init returned a zero-write adoption plan.'
    }];
  }
  if (repositoryState === 'hadara-current') {
    return [{
      severity: 'warning',
      code: 'INIT_ADOPTION_ALREADY_CURRENT',
      message: 'A current HADARA scaffold was detected; init did not reinitialize the project.'
    }];
  }
  return [];
}

function inferProject(projectRoot: string): InitAdoptionProject {
  const packageJson = readJsonObject(path.join(projectRoot, 'package.json'));
  const directoryName = path.basename(path.resolve(projectRoot));
  const packageName = typeof packageJson?.name === 'string' && packageJson.name.trim() ? packageJson.name.trim() : undefined;
  const version = typeof packageJson?.version === 'string' && packageJson.version.trim() ? packageJson.version.trim() : 'unversioned';
  return {
    id: slug(packageName ?? directoryName),
    name: packageName ?? directoryName,
    currentRelease: version
  };
}

function readJsonObject(filePath: string): Record<string, unknown> | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function hashJson(value: unknown): string {
  return hashText(JSON.stringify(value));
}

function hashText(value: string): string {
  return `sha256:${crypto.createHash('sha256').update(value, 'utf8').digest('hex')}`;
}

function hashBuffer(value: Buffer): string {
  return `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project';
}
