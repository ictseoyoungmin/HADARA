import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import packageJson from '../../package.json';
import {
  INIT_ARTIFACT_MANIFEST_VERSION,
  INIT_LIFECYCLE_VERSION,
  INIT_PRESET_SPECS,
  InitModelError,
  assertInitDocuments,
  assertInitProjectConfig,
  createInitDocuments,
  createInitV1ScaffoldFiles,
  createInitV1UpgradeFiles,
  initArtifactManifest,
  presetFromProjectConfig
} from './model';
import { validateInitPaths } from './safety';
import type {
  GeneratedScaffoldFile,
  InitArtifactV1,
  InitIssue,
  InitPlanActionKind,
  InitPlanActionV1,
  InitPlanSummaryV1,
  InitPlanV1,
  InitPreset,
  InitProjectConfigV1,
  InitDocumentsV1,
  InitReportV1
} from './types';

export interface InitPlanningResult {
  plan: InitPlanV1;
  report: InitReportV1;
  files: GeneratedScaffoldFile[];
}

const IGNORED_ROOT_ENTRIES = new Set(['.git', '.DS_Store', 'node_modules']);

export function createInitPlanningResult(
  projectRoot: string,
  preset: InitPreset,
  input: {
    execute?: boolean;
    explicitConfiguration?: boolean;
    warnings?: Array<{ code: string; message: string }>;
  } = {}
): InitPlanningResult {
  const files = createInitV1ScaffoldFiles(createStableProjectId(projectRoot), preset);
  const fileHashes = new Map(files.map((file) => [file.path, hashText(file.content)]));
  let projectMode: InitPlanV1['projectMode'];
  let actions: InitPlanActionV1[] = [];
  const issues: InitIssue[] = (input.warnings ?? []).map((warning) => ({
    severity: 'warning',
    code: warning.code,
    message: warning.message
  }));
  try {
    projectMode = classifyProject(projectRoot);
    actions = planActions(projectRoot, preset, projectMode);
    if (input.explicitConfiguration && (projectMode === 'initialized' || projectMode === 'partial')) {
      issues.push({
        severity: 'error',
        code: 'INIT_PRESET_REQUIRES_NEW_PROJECT',
        message: 'An initialized project cannot be reconfigured by base init; use a new project or a future configuration command.'
      });
    }
    issues.push(...validateInitPaths(projectRoot, actions.map((action) => action.path)));
  } catch (error) {
    projectMode = classifyFailedProject(projectRoot);
    issues.push(modelIssue(error));
  }
  const summary = summarizeActions(actions);
  const planHash = hashJson({
    operation: 'init',
    projectMode,
    preset,
    actions,
    sourceHashes: actions.map((action) => [action.path, action.beforeHash ?? null]),
    contentHashes: actions.map((action) => [action.path, fileHashes.get(action.path) ?? null]),
    packageVersion: packageJson.version,
    lifecycleVersion: INIT_LIFECYCLE_VERSION,
    presetExpansion: INIT_PRESET_SPECS[preset],
    artifactManifestVersion: INIT_ARTIFACT_MANIFEST_VERSION
  });
  const plan: InitPlanV1 = {
    schemaVersion: 'hadara.init.plan.v1',
    operation: 'init',
    projectMode,
    preset,
    actions,
    summary,
    planHash
  };
  const conflicts = summary.conflict;
  if (input.execute) {
    issues.push({
      severity: 'error',
      code: 'INIT_APPLY_NOT_AVAILABLE',
      message: 'Init v1 apply is not available until the reviewed transaction implementation is installed; no files were written.'
    });
  }
  const errorCount = issues.filter((issue) => issue.severity === 'error').length;
  const initialized = projectMode === 'initialized' && errorCount === 0;
  const ok = errorCount === 0 && conflicts === 0 && !input.execute;
  const report: InitReportV1 = {
    schemaVersion: 'hadara.init.report.v1',
    ok: initialized || ok,
    operation: 'init',
    mode: initialized ? 'no-op' : input.execute || errorCount > 0 || conflicts > 0 ? 'error' : 'dry-run',
    projectMode,
    preset,
    summary: {
      planned: actions.length,
      created: 0,
      updated: 0,
      appended: 0,
      preserved: summary.preserve,
      conflicts,
      applied: 0
    },
    planHash,
    plan,
    ...(initialized ? { reason: 'already-initialized' as const } : {}),
    issues
  };
  return { plan, report, files };
}

export function createInitUpgradePlanningResult(
  projectRoot: string,
  input: { configurationChangeRequested?: boolean } = {}
): InitPlanningResult {
  let preset: InitPreset = 'standard';
  let projectMode: InitPlanV1['projectMode'] = 'partial';
  let files: GeneratedScaffoldFile[] = [];
  let actions: InitPlanActionV1[] = [];
  const issues: InitIssue[] = [];
  try {
    const projectPath = path.join(projectRoot, '.hadara', 'project.json');
    if (!fs.existsSync(projectPath)) {
      throw new InitModelError(
        'INIT_PROJECT_CONFIG_MISSING',
        'Init v1 upgrade requires .hadara/project.json; base init does not guess or repair missing configuration.'
      );
    }
    const project = readJson(projectPath, 'INIT_PROJECT_CONFIG_INVALID');
    assertInitProjectConfig(project);
    preset = presetFromProjectConfig(project);
    const documentsPath = path.join(projectRoot, '.hadara', 'documents.json');
    const registry = fs.existsSync(documentsPath)
      ? readJson(documentsPath, 'INIT_DOCUMENT_REGISTRY_INVALID')
      : createInitDocuments(preset);
    if (fs.existsSync(documentsPath)) assertInitDocuments(registry);
    files = createInitV1UpgradeFiles(
      project as InitProjectConfigV1,
      registry as InitDocumentsV1
    );
    projectMode = classifyProject(projectRoot);
    const planned = planUpgradeActions(projectRoot, files);
    actions = planned.actions;
    issues.push(...planned.issues);
    if (input.configurationChangeRequested) {
      issues.push({
        severity: 'error',
        code: 'INIT_CONFIGURATION_CHANGE_UNSUPPORTED',
        message: 'init upgrade repairs managed Init v1 artifacts; it does not change presets, profiles, features, or document packs.'
      });
    }
    issues.push(...validateInitPaths(projectRoot, actions.map((action) => action.path)));
  } catch (error) {
    projectMode = classifyFailedProject(projectRoot);
    issues.push(modelIssue(error));
  }

  return buildPlanningResult({
    operation: 'upgrade',
    projectMode,
    preset,
    actions,
    files,
    issues
  });
}

export function printInitV1Report(report: InitReportV1, jsonOutput = false): void {
  const operation = report.operation === 'upgrade' ? 'init upgrade' : 'init';
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else if (report.mode === 'applied') {
    console.log([
      `applied | ${operation} | preset=${report.preset}`,
      `created=${report.summary.created} updated-managed=${report.summary.updated} appended=${report.summary.appended} failed=${report.results?.failed.length ?? 0}`
    ].join('\n'));
  } else if (report.mode === 'no-op') {
    console.log([
      `no-op | ${operation}`,
      `created=0 updated=0 existing=${report.summary.preserved} applied=0`,
      `reason=${report.reason}`
    ].join('\n'));
  } else {
    const details = [
      ...report.issues.map((issue) => `[${issue.severity}] ${issue.code}: ${issue.message}`),
      ...report.plan.actions
        .filter((action) => action.kind === 'conflict')
        .map((action) => `[conflict] ${action.path}: ${action.reason}`)
    ];
    console.log([
      `${report.mode} | ${operation} | preset=${report.preset} | project=${report.projectMode}`,
      `create=${report.plan.summary.create} update-managed=${report.plan.summary.updateManaged} append=${report.plan.summary.append} preserve=${report.plan.summary.preserve} conflict=${report.plan.summary.conflict} applied=0`,
      `plan-hash=${report.planHash}`,
      ...details
    ].join('\n'));
  }
  if (!report.ok) process.exitCode = 6;
}

export function summarizeActions(actions: InitPlanActionV1[]): InitPlanSummaryV1 {
  const summary: InitPlanSummaryV1 = {
    create: 0,
    updateManaged: 0,
    append: 0,
    register: 0,
    migrate: 0,
    preserve: 0,
    skip: 0,
    conflict: 0,
    delete: 0
  };
  for (const action of actions) {
    summary[summaryKey(action.kind)] += 1;
  }
  return summary;
}

function classifyProject(projectRoot: string): InitPlanV1['projectMode'] {
  if (fs.existsSync(projectRoot) && fs.lstatSync(projectRoot).isSymbolicLink()) return 'unsafe';
  const projectPath = path.join(projectRoot, '.hadara', 'project.json');
  const documentsPath = path.join(projectRoot, '.hadara', 'documents.json');
  const hasProject = fs.existsSync(projectPath);
  const hasDocuments = fs.existsSync(documentsPath);
  if (hasProject) assertInitProjectConfig(readJson(projectPath, 'INIT_PROJECT_CONFIG_INVALID'));
  if (hasDocuments) assertInitDocuments(readJson(documentsPath, 'INIT_DOCUMENT_REGISTRY_INVALID'));
  if (hasProject && hasDocuments) {
    const complete = initArtifactManifest('minimal').every((artifact) => fs.existsSync(path.join(projectRoot, artifact.path)));
    return complete ? 'initialized' : 'partial';
  }
  if (hasProject || hasDocuments) return 'partial';
  if (
    fs.existsSync(path.join(projectRoot, '.hadara', 'scaffold.json'))
    || fs.existsSync(path.join(projectRoot, '.hadara', 'docs-registry.json'))
  ) return 'legacy';
  return meaningfulRootEntries(projectRoot).length === 0 ? 'greenfield' : 'brownfield';
}

function buildPlanningResult(input: {
  operation: InitPlanV1['operation'];
  projectMode: InitPlanV1['projectMode'];
  preset: InitPreset;
  actions: InitPlanActionV1[];
  files: GeneratedScaffoldFile[];
  issues: InitIssue[];
}): InitPlanningResult {
  const fileHashes = new Map(input.files.map((file) => [file.path, hashText(file.content)]));
  const summary = summarizeActions(input.actions);
  const planHash = hashJson({
    operation: input.operation,
    projectMode: input.projectMode,
    preset: input.preset,
    actions: input.actions,
    sourceHashes: input.actions.map((action) => [action.path, action.beforeHash ?? null]),
    contentHashes: input.actions.map((action) => [action.path, fileHashes.get(action.path) ?? null]),
    packageVersion: packageJson.version,
    lifecycleVersion: INIT_LIFECYCLE_VERSION,
    artifactManifestVersion: INIT_ARTIFACT_MANIFEST_VERSION
  });
  const plan: InitPlanV1 = {
    schemaVersion: 'hadara.init.plan.v1',
    operation: input.operation,
    projectMode: input.projectMode,
    preset: input.preset,
    actions: input.actions,
    summary,
    planHash
  };
  const errors = input.issues.filter((issue) => issue.severity === 'error').length;
  const changed = input.actions.some((action) => !['preserve', 'skip'].includes(action.kind));
  const noOp = input.projectMode === 'initialized' && errors === 0 && summary.conflict === 0 && !changed;
  const report: InitReportV1 = {
    schemaVersion: 'hadara.init.report.v1',
    ok: errors === 0 && summary.conflict === 0,
    operation: input.operation,
    mode: errors > 0 || summary.conflict > 0 ? 'error' : noOp ? 'no-op' : 'dry-run',
    projectMode: input.projectMode,
    preset: input.preset,
    summary: {
      planned: input.actions.length,
      created: 0,
      updated: 0,
      appended: 0,
      preserved: summary.preserve,
      conflicts: summary.conflict,
      applied: 0
    },
    planHash,
    plan,
    ...(noOp ? { reason: 'already-current' as const } : {}),
    issues: input.issues
  };
  return { plan, report, files: input.files };
}

function planUpgradeActions(
  projectRoot: string,
  files: GeneratedScaffoldFile[]
): { actions: InitPlanActionV1[]; issues: InitIssue[] } {
  const generated = new Map(files.map((file) => [file.path, file.content]));
  const issues: InitIssue[] = [];
  const actions = initArtifactManifest('minimal').map((artifact): InitPlanActionV1 => {
    const target = path.join(projectRoot, artifact.path);
    if (!fs.existsSync(target)) {
      return {
        path: artifact.path,
        kind: 'create',
        management: artifact.management,
        reason: 'Restore a missing Init v1 core artifact from current project configuration.'
      };
    }
    const stat = fs.lstatSync(target);
    const beforeHash = stat.isFile()
      ? hashBuffer(fs.readFileSync(target))
      : hashText(stat.isDirectory() ? 'directory' : 'other');
    if (stat.isSymbolicLink() || (artifact.type === 'file' ? !stat.isFile() : !stat.isDirectory())) {
      return {
        path: artifact.path,
        kind: 'conflict',
        management: artifact.management,
        reason: `Existing ${artifact.path} has an unsafe or incompatible path type.`,
        beforeHash
      };
    }
    if (artifact.path === 'AGENTS.md') {
      const content = fs.readFileSync(target, 'utf8');
      const expectedBlock = extractManagedBlock(generated.get(artifact.path) ?? '');
      const markers = [...content.matchAll(/<!-- hadara:managed:(start|end) bootstrap -->/g)];
      if (markers.length === 0) {
        return {
          path: artifact.path,
          kind: 'insert-managed-block',
          management: artifact.management,
          reason: 'Insert the missing HADARA bootstrap block while preserving user-owned instructions.',
          beforeHash
        };
      }
      const existingBlock = content.match(/<!-- hadara:managed:start bootstrap -->[\s\S]*?<!-- hadara:managed:end bootstrap -->/)?.[0];
      if (
        markers.length !== 2
        || markers[0][1] !== 'start'
        || markers[1][1] !== 'end'
        || !existingBlock
      ) {
        issues.push({
          severity: 'error',
          code: 'INIT_MANAGED_BLOCK_MALFORMED',
          path: artifact.path,
          message: 'AGENTS.md contains malformed or duplicate HADARA bootstrap markers; no upgrade writes are allowed.'
        });
        return {
          path: artifact.path,
          kind: 'conflict',
          management: artifact.management,
          reason: 'Malformed HADARA bootstrap markers require manual repair.',
          beforeHash
        };
      }
      return {
        path: artifact.path,
        kind: existingBlock === expectedBlock ? 'preserve' : 'update-managed-block',
        management: artifact.management,
        reason: existingBlock === expectedBlock
          ? 'The HADARA bootstrap block is current.'
          : 'Replace only the HADARA-managed bootstrap block.',
        beforeHash
      };
    }
    if (artifact.path === '.gitignore') {
      const content = fs.readFileSync(target, 'utf8');
      const present = content.split(/\r?\n/).includes('.hadara/local/');
      return {
        path: artifact.path,
        kind: present ? 'preserve' : 'append-line',
        management: artifact.management,
        reason: present ? 'The runtime-local ignore rule already exists.' : 'Append only the runtime-local ignore rule.',
        beforeHash
      };
    }
    if (artifact.path === 'docs/HADARA_WORKFLOW.md' || artifact.path === '.hadara/context/READ_MAP.md') {
      const expected = generated.get(artifact.path);
      const current = fs.readFileSync(target, 'utf8');
      const currentArtifact = current === expected;
      return {
        path: artifact.path,
        kind: currentArtifact
          ? 'preserve'
          : artifact.path === 'docs/HADARA_WORKFLOW.md' ? 'replace-hadara-managed' : 'regenerate',
        management: artifact.management,
        reason: currentArtifact
          ? `The managed ${artifact.path} artifact is current.`
          : `Regenerate the HADARA-managed ${artifact.path} artifact.`,
        beforeHash
      };
    }
    return {
      path: artifact.path,
      kind: 'preserve',
      management: artifact.management,
      reason: `Preserve current ${artifact.management} state; this upgrade slice does not migrate its content.`,
      beforeHash
    };
  });
  return { actions, issues };
}

function extractManagedBlock(content: string): string {
  const block = content.match(/<!-- hadara:managed:start bootstrap -->[\s\S]*?<!-- hadara:managed:end bootstrap -->/)?.[0];
  if (!block) throw new InitModelError('INIT_MANAGED_BLOCK_MALFORMED', 'Generated AGENTS.md bootstrap block is missing.');
  return block;
}

function classifyFailedProject(projectRoot: string): InitPlanV1['projectMode'] {
  const hadaraPath = path.join(projectRoot, '.hadara');
  return fs.existsSync(hadaraPath) ? 'unsafe' : 'brownfield';
}

function planActions(
  projectRoot: string,
  preset: InitPreset,
  projectMode: InitPlanV1['projectMode']
): InitPlanActionV1[] {
  if (projectMode === 'initialized') {
    return initArtifactManifest(preset)
      .filter((artifact) => fs.existsSync(path.join(projectRoot, artifact.path)))
      .map((artifact) => {
        const target = path.join(projectRoot, artifact.path);
        const stat = fs.lstatSync(target);
        return {
          path: artifact.path,
          kind: 'preserve' as const,
          management: artifact.management,
          reason: 'The canonical Init v1 artifact already exists.',
          beforeHash: stat.isFile() ? hashBuffer(fs.readFileSync(target)) : hashText('directory')
        };
      });
  }
  if (projectMode === 'partial' || projectMode === 'legacy' || projectMode === 'unsafe') {
    return [{
      path: '.hadara',
      kind: 'conflict',
      management: 'command-managed',
      reason: projectMode === 'partial'
        ? 'A partial Init v1 installation requires hadara init upgrade.'
        : projectMode === 'legacy'
          ? 'Legacy HADARA state requires an explicit migration plan.'
          : 'The project root is unsafe for init planning.'
    }];
  }
  return initArtifactManifest(preset).map((artifact) => planArtifact(projectRoot, artifact, projectMode));
}

function planArtifact(
  projectRoot: string,
  artifact: InitArtifactV1,
  projectMode: 'greenfield' | 'brownfield'
): InitPlanActionV1 {
  const target = path.join(projectRoot, artifact.path);
  if (!fs.existsSync(target)) {
    return {
      path: artifact.path,
      kind: 'create',
      management: artifact.management,
      reason: `Create the Init v1 ${artifact.management} ${artifact.type}.`
    };
  }
  const stat = fs.lstatSync(target);
  const beforeHash = stat.isFile() ? hashBuffer(fs.readFileSync(target)) : hashText(stat.isDirectory() ? 'directory' : 'other');
  if (stat.isSymbolicLink() || (artifact.type === 'file' ? !stat.isFile() : !stat.isDirectory())) {
    return {
      path: artifact.path,
      kind: 'conflict',
      management: artifact.management,
      reason: `Existing ${artifact.path} has an unsafe or incompatible path type.`,
      beforeHash
    };
  }
  if (projectMode === 'greenfield') {
    return {
      path: artifact.path,
      kind: 'conflict',
      management: artifact.management,
      reason: `Greenfield classification found an unexpected existing artifact at ${artifact.path}.`,
      beforeHash
    };
  }
  if (artifact.path === 'AGENTS.md') {
    const content = fs.readFileSync(target, 'utf8');
    if (/hadara:managed:(?:start|end)\s+bootstrap/.test(content)) {
      return {
        path: artifact.path,
        kind: 'conflict',
        management: artifact.management,
        reason: 'Existing HADARA bootstrap markers require explicit upgrade or malformed-marker repair.',
        beforeHash
      };
    }
    return {
      path: artifact.path,
      kind: 'insert-managed-block',
      management: artifact.management,
      reason: 'Preserve user instructions and insert the HADARA bootstrap block.',
      beforeHash
    };
  }
  if (artifact.path === '.gitignore') {
    const content = fs.readFileSync(target, 'utf8');
    return {
      path: artifact.path,
      kind: content.split(/\r?\n/).includes('.hadara/local/') ? 'preserve' : 'append-line',
      management: artifact.management,
      reason: content.split(/\r?\n/).includes('.hadara/local/')
        ? 'The runtime-local ignore rule already exists.'
        : 'Append only the runtime-local ignore rule.',
      beforeHash
    };
  }
  if (artifact.path === 'tasks' || artifact.management === 'scaffold-once') {
    return {
      path: artifact.path,
      kind: 'preserve',
      management: artifact.management,
      reason: `Preserve existing project-owned ${artifact.path}.`,
      beforeHash
    };
  }
  return {
    path: artifact.path,
    kind: 'conflict',
    management: artifact.management,
    reason: `Existing canonical path ${artifact.path} requires explicit adoption review.`,
    beforeHash
  };
}

function meaningfulRootEntries(projectRoot: string): string[] {
  try {
    return fs.readdirSync(projectRoot)
      .filter((entry) => !IGNORED_ROOT_ENTRIES.has(entry))
      .filter((entry) => !entry.startsWith('.npm'))
      .filter((entry) => entry !== '.hadara' || !containsOnlyRuntimeState(path.join(projectRoot, entry)))
      .filter((entry) => !isEmptyReportPlaceholder(projectRoot, entry))
      .sort();
  } catch {
    return [];
  }
}

function containsOnlyRuntimeState(hadaraRoot: string): boolean {
  try {
    return fs.readdirSync(hadaraRoot).every((entry) => entry === 'local');
  } catch {
    return false;
  }
}

function isEmptyReportPlaceholder(projectRoot: string, entry: string): boolean {
  if (!['init.json', 'hadara-init.json', 'hadara-init-report.json'].includes(entry)) return false;
  try {
    const stat = fs.lstatSync(path.join(projectRoot, entry));
    return stat.isFile() && stat.size === 0;
  } catch {
    return false;
  }
}

function readJson(filePath: string, code: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new InitModelError(code, `${path.basename(filePath)} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function modelIssue(error: unknown): InitIssue {
  return {
    severity: 'error',
    code: error instanceof InitModelError ? error.code : 'INIT_CONFLICT',
    message: error instanceof Error ? error.message : String(error)
  };
}

function summaryKey(kind: InitPlanActionKind): Exclude<keyof InitPlanSummaryV1, 'delete'> {
  if (kind === 'create') return 'create';
  if (kind === 'insert-managed-block' || kind === 'update-managed-block' || kind === 'replace-hadara-managed' || kind === 'regenerate') {
    return 'updateManaged';
  }
  if (kind === 'append-line') return 'append';
  if (kind === 'register') return 'register';
  if (kind === 'migrate') return 'migrate';
  if (kind === 'preserve') return 'preserve';
  if (kind === 'skip') return 'skip';
  return 'conflict';
}

function createStableProjectId(projectRoot: string): string {
  return `project-${crypto.createHash('sha256').update(path.resolve(projectRoot)).digest('hex').slice(0, 16)}`;
}

function hashJson(value: unknown): string {
  return hashText(JSON.stringify(sortJson(value)));
}

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJson);
  if (typeof value !== 'object' || value === null) return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, sortJson(item)])
  );
}

function hashText(value: string): string {
  return hashBuffer(Buffer.from(value, 'utf8'));
}

function hashBuffer(value: Buffer): string {
  return `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
}
