import fs from 'node:fs';
import path from 'node:path';
import { resolveHadaraPaths } from '../core/paths';
import { ensureDir, writeFileIfMissing } from '../core/fs';
import { getFlag, getRequiredStringOption, getStringOption } from './args';
import { createLegacyMutationBlockedReport, printLegacyMutationBlockedReport } from './legacy-boundary';
import { printCommandRemovedReport } from './removed-command';
import { DOCS_REGISTRY_PATH, createHadaraContextDoc, createSeedDocumentRegistry, registryJson } from '../services/docs-registry';
import { managedSectionBlock } from '../services/managed-sections';
import type { DocumentRegistryFile } from '../services/docs-registry';

export type InitProfile = 'basic' | 'standard' | 'governed';

interface InitProfileSpec {
  profile: InitProfile;
  generatedDocsDescription: string;
  intendedUse: string;
  specialNotes: string;
  docs: {
    architecture: boolean;
    developmentSlices: boolean;
    decisions: boolean;
    refactorLog: boolean;
    securityModel: boolean;
    testStrategy: boolean;
    roadmap: boolean;
    agentHandoff: boolean;
  };
}

type InitFollowUpMode = 'dry-run' | 'execute';
type InitActionStatus = 'planned' | 'created' | 'updated' | 'exists' | 'skipped';
type InitIssueSeverity = 'warning' | 'error';

interface InitAction {
  action: string;
  path?: string;
  status: InitActionStatus;
  summary: string;
}

interface InitIssue {
  severity: InitIssueSeverity;
  code: string;
  path?: string;
  message: string;
}

interface InitReport {
  schemaVersion: 'hadara.init.v1';
  command: 'init';
  ok: true;
  profile: InitProfile;
  actions: InitAction[];
  issues: [];
}

interface InitFollowUpReport {
  schemaVersion: 'hadara.init.followup.v1';
  command: string;
  ok: boolean;
  summary?: string;
  mode?: InitFollowUpMode;
  profile?: InitProfile;
  integration?: string;
  actions: InitAction[];
  issues: InitIssue[];
}

interface GeneratedScaffoldFile {
  path: string;
  content: string;
}

interface InitWriteOperation {
  path: string;
  content: string;
}

interface InitProjectOptions {
  silent?: boolean;
}

const INIT_PROFILE_SPECS: Record<InitProfile, InitProfileSpec> = {
  basic: {
    profile: 'basic',
    generatedDocsDescription: 'Core current-state docs, workflow reference, registries, and task directory',
    intendedUse: 'Small projects that need Task Capsules, evidence, and handoff discipline without planning overhead.',
    specialNotes: 'Basic keeps continuation fields in PROJECT_STATE instead of generating AGENT_HANDOFF.',
    docs: {
      architecture: false,
      developmentSlices: false,
      decisions: false,
      refactorLog: false,
      securityModel: false,
      testStrategy: false,
      roadmap: false,
      agentHandoff: false
    }
  },
  standard: {
    profile: 'standard',
    generatedDocsDescription: 'Core scaffold plus architecture, roadmap, and decision docs',
    intendedUse: 'Most multi-session projects that need lightweight planning and decision context.',
    specialNotes: 'Default profile. Optional integrations must be registered before agents rely on them.',
    docs: {
      architecture: true,
      developmentSlices: false,
      decisions: true,
      refactorLog: false,
      securityModel: false,
      testStrategy: false,
      roadmap: true,
      agentHandoff: false
    }
  },
  governed: {
    profile: 'governed',
    generatedDocsDescription: 'Standard scaffold plus handoff and security docs',
    intendedUse: 'Long-lived projects with stronger governance, security boundaries, refactor history, or roadmap-level planning.',
    specialNotes: 'Governed projects generate AGENT_HANDOFF for compact continuation state.',
    docs: {
      architecture: true,
      developmentSlices: false,
      decisions: true,
      refactorLog: false,
      securityModel: true,
      testStrategy: false,
      roadmap: true,
      agentHandoff: true
    }
  }
};

export function initProject(projectRoot: string, profile = 'standard', options: InitProjectOptions = {}): InitReport {
  const normalizedProfile = parseInitProfile(profile);
  const spec = INIT_PROFILE_SPECS[normalizedProfile];
  const paths = resolveHadaraPaths({ projectRoot });
  ensureDir(paths.projectDocsDir);
  ensureDir(paths.projectTasksDir);

  const actions: InitAction[] = [];
  for (const file of createGeneratedScaffoldFiles(normalizedProfile)) {
    const absolutePath = path.join(projectRoot, file.path);
    const existed = fs.existsSync(absolutePath);
    writeFileIfMissing(path.join(projectRoot, file.path), file.content);
    actions.push({
      action: 'init-doc',
      path: file.path,
      status: existed ? 'exists' : 'created',
      summary: existed ? `${file.path} already existed and was not overwritten.` : `${file.path} was created.`
    });
  }

  const report: InitReport = {
    schemaVersion: 'hadara.init.v1',
    command: 'init',
    ok: true,
    profile: normalizedProfile,
    actions,
    issues: []
  };
  if (!options.silent) {
    console.log(`[HADARA] Initialized project: ${projectRoot}`);
    console.log(`[HADARA] Init profile: ${normalizedProfile}`);
  }
  return report;
}

export function parseInitProfile(value: string): InitProfile {
  if (value === 'basic' || value === 'standard' || value === 'governed') return value;
  throw new Error(`unsupported init profile: ${value}; expected basic, standard, or governed`);
}

export interface InitCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput?: boolean;
}

export function handleInitCommand(input: InitCommandInput): boolean {
  const subcommand = input.args[1];
  if (subcommand === 'help' || getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
    console.log(renderInitHelp());
    return true;
  }
  if (subcommand === 'doctor') {
    printInitFollowUpReport(createInitDoctorReport(input.projectRoot), input.jsonOutput);
    return true;
  }
  if (subcommand === 'upgrade') {
    const legacyReport = createLegacyMutationBlockedReport(input.projectRoot, 'init.upgrade');
    if (legacyReport) {
      printLegacyMutationBlockedReport(legacyReport, input.jsonOutput === true);
      process.exitCode = 6;
      return true;
    }
    const profile = parseInitProfile(getRequiredStringOption(input.args, '--profile'));
    const report = createInitUpgradeReport(input.projectRoot, profile, getInitFollowUpMode(input.args));
    printInitFollowUpReport(report, input.jsonOutput);
    return true;
  }
  if (subcommand === 'register-doc') {
    return printCommandRemovedReport(
      {
        commandId: 'init.register-doc',
        removedCommand: 'hadara init register-doc',
        replacementCommand: 'hadara docs register --path <path> --json',
        diagnosticCommand: 'hadara docs register --help',
        note: 'Document registration is consolidated under the docs registry command family.'
      },
      input.jsonOutput === true
    );
  }
  if (subcommand === 'enable-integration') {
    if (getFlag(input.args, '--execute') === true) {
      const legacyReport = createLegacyMutationBlockedReport(input.projectRoot, 'init.enable-integration');
      if (legacyReport) {
        printLegacyMutationBlockedReport(legacyReport, input.jsonOutput === true);
        process.exitCode = 6;
        return true;
      }
    }
    const report = createIntegrationEnableReport(input.projectRoot, {
      integration: getRequiredStringOption(input.args, '--integration'),
      mode: getInitFollowUpMode(input.args)
    });
    printInitFollowUpReport(report, input.jsonOutput);
    return true;
  }
  const report = initProject(input.projectRoot, getStringOption(input.args, '--profile', 'standard') ?? 'standard', { silent: input.jsonOutput });
  if (input.jsonOutput) console.log(JSON.stringify(report, null, 2));
  return true;
}

function renderInitHelp(): string {
  return `HADARA init

Usage:
  hadara init [--profile basic|standard|governed] [--json]
  hadara init doctor [--json]
  hadara init upgrade --profile <profile> [--execute] [--json]
  hadara init enable-integration --integration <name> [--execute] [--json]

Profiles:
  basic      Core current-state docs, workflow reference, registries, and task directory.
  standard   Default profile with architecture, roadmap, and decision docs.
  governed   Standard profile plus handoff and security docs.

Notes:
  --help is read-only and does not create scaffold files.
`;
}

function getInitFollowUpMode(args: string[]): InitFollowUpMode {
  return getFlag(args, '--execute') ? 'execute' : 'dry-run';
}

function createGeneratedScaffoldFiles(profile: InitProfile): GeneratedScaffoldFile[] {
  const spec = INIT_PROFILE_SPECS[profile];
  const docsRegistry = createSeedDocumentRegistry(profile);
  const files: GeneratedScaffoldFile[] = [
    { path: '.hadara/context/HADARA_CONTEXT.md', content: createHadaraContextDoc(profile) },
    { path: '.hadara/scaffold.json', content: createScaffoldJson(profile) },
    { path: '.hadara/docs-registry.json', content: registryJson(docsRegistry) },
    { path: '.hadara/slot-registry.json', content: createSlotRegistryJson() },
    { path: 'docs/PROJECT_STATE.md', content: createProjectStateDoc(profile) },
    { path: 'docs/TASK_BOARD.md', content: createTaskBoardDoc() },
    { path: 'docs/HADARA_WORKFLOW.md', content: createHadaraWorkflowDoc() },
    { path: 'AGENTS.md', content: createAgentsDoc(spec) },
    { path: '.gitignore', content: createGitignoreDoc() },
    { path: 'tasks/.gitkeep', content: '' }
  ];
  if (spec.docs.architecture) files.push({ path: 'docs/ARCHITECTURE.md', content: createArchitectureDoc(profile) });
  if (spec.docs.decisions) files.push({ path: 'docs/DECISIONS.md', content: createDecisionsDoc() });
  if (spec.docs.securityModel) files.push({ path: 'docs/SECURITY_MODEL.md', content: createSecurityModelDoc() });
  if (spec.docs.roadmap) files.push({ path: 'docs/ROADMAP.md', content: createRoadmapDoc() });
  if (spec.docs.agentHandoff) files.push({ path: 'docs/AGENT_HANDOFF.md', content: createAgentHandoffDoc() });
  return files;
}

function createInitDoctorReport(projectRoot: string): InitFollowUpReport {
  const issues: InitIssue[] = [];
  const actions: InitAction[] = [];
  const requiredCore: Array<{ path: string; code: string }> = [
    { path: 'AGENTS.md', code: 'INIT_CORE_DOC_MISSING' },
    { path: '.gitignore', code: 'INIT_GITIGNORE_MISSING' },
    { path: '.hadara/context/HADARA_CONTEXT.md', code: 'INIT_CORE_DOC_MISSING' },
    { path: '.hadara/scaffold.json', code: 'INIT_PROTOCOL_MISSING' },
    { path: '.hadara/docs-registry.json', code: 'INIT_DOCS_REGISTRY_MISSING' },
    { path: '.hadara/slot-registry.json', code: 'INIT_SLOT_REGISTRY_MISSING' },
    { path: 'docs/PROJECT_STATE.md', code: 'INIT_CORE_DOC_MISSING' },
    { path: 'docs/TASK_BOARD.md', code: 'INIT_CORE_DOC_MISSING' },
    { path: 'docs/HADARA_WORKFLOW.md', code: 'INIT_WORKFLOW_DOC_MISSING' }
  ];
  for (const required of requiredCore) {
    const relativePath = required.path;
    if (!fs.existsSync(path.join(projectRoot, relativePath))) {
      issues.push({ severity: 'error', code: required.code, path: relativePath, message: `${relativePath} is missing from the init scaffold.` });
    }
  }

  const scaffold = readProjectText(projectRoot, '.hadara/scaffold.json');
  if (scaffold !== null) {
    try {
      const parsed = JSON.parse(scaffold) as { hadaraProtocol?: unknown };
      if (parsed.hadaraProtocol !== '0.4') {
        issues.push({ severity: 'error', code: 'INIT_PROTOCOL_UNSUPPORTED', path: '.hadara/scaffold.json', message: '.hadara/scaffold.json must declare hadaraProtocol "0.4".' });
      }
    } catch (error) {
      issues.push({ severity: 'error', code: 'INIT_PROTOCOL_UNSUPPORTED', path: '.hadara/scaffold.json', message: `.hadara/scaffold.json could not be parsed: ${error instanceof Error ? error.message : String(error)}` });
    }
  }

  for (const relativePath of ['HERMES.md', '.hermes.md']) {
    if (fs.existsSync(path.join(projectRoot, relativePath))) {
      issues.push({ severity: 'warning', code: 'INIT_STALE_HERMES_DEFAULT', path: relativePath, message: `${relativePath} looks like an old default Hermes scaffold file.` });
    }
  }

  const gitignore = readProjectText(projectRoot, '.gitignore');
  if (gitignore === null) {
    issues.push({ severity: 'error', code: 'INIT_GITIGNORE_MISSING', path: '.gitignore', message: 'Generated scaffold .gitignore is missing.' });
  } else if (/^data\/$/m.test(gitignore)) {
    issues.push({ severity: 'warning', code: 'INIT_BROAD_DATA_IGNORE', path: '.gitignore', message: 'Top-level data/ is ignored; generated init should only ignore HADARA local/private state.' });
  }

  const workflow = readProjectText(projectRoot, 'docs/HADARA_WORKFLOW.md');
  if (workflow !== null && mentionsLegacyInitProfile(workflow)) {
    issues.push({ severity: 'warning', code: 'INIT_OLD_PROFILE_NAME', path: 'docs/HADARA_WORKFLOW.md', message: 'Workflow guide mentions old init profile names.' });
  }

  issues.push(...detectEntryDocDuplication(projectRoot));
  issues.push(...detectRequiredReadingTooBroad(projectRoot));
  issues.push(...detectProductDefaultLeaks(projectRoot));
  issues.push(...detectProfileMetadataMismatches(projectRoot));

  for (const [relativePath, headers] of Object.entries(CANONICAL_TABLE_HEADERS)) {
    const content = readProjectText(projectRoot, relativePath);
    if (content === null) continue;
    for (const header of headers) {
      if (!content.includes(header)) {
        issues.push({ severity: 'warning', code: 'INIT_TABLE_FRAME_MISSING', path: relativePath, message: `${relativePath} is missing canonical table header: ${header}` });
      }
    }
  }

  if (issues.length === 0) {
    actions.push({ action: 'doctor', status: 'exists', summary: 'Init scaffold matches current Phase 1 expectations.' });
  }
  return {
    schemaVersion: 'hadara.init.followup.v1',
    command: 'init.doctor',
    ok: issues.every((issue) => issue.severity !== 'error'),
    actions,
    issues
  };
}

function mentionsLegacyInitProfile(content: string): boolean {
  return /(?:initialized with|profile(?:\s+name)?|init profile)\s+(?:the\s+)?`?(minimal|full|hadara-protocol)`?/i.test(content);
}

function detectEntryDocDuplication(projectRoot: string): InitIssue[] {
  const issues: InitIssue[] = [];
  const agents = readProjectText(projectRoot, 'AGENTS.md');
  if (agents !== null && commandRecipeCount(agents) >= 2) {
    issues.push({
      severity: 'warning',
      code: 'INIT_AGENTS_COMMAND_COOKBOOK',
      path: 'AGENTS.md',
      message: 'AGENTS.md appears to duplicate lifecycle or context command recipes; keep command usage in docs/HADARA_WORKFLOW.md.'
    });
  }
  const context = readProjectText(projectRoot, '.hadara/context/HADARA_CONTEXT.md');
  if (context !== null && (context.includes('| Document | When to Read | Purpose |') || context.includes('## Required Reading') || commandRecipeCount(context) >= 2)) {
    issues.push({
      severity: 'warning',
      code: 'INIT_CONTEXT_DUPLICATES_WORKFLOW',
      path: '.hadara/context/HADARA_CONTEXT.md',
      message: 'HADARA_CONTEXT.md appears to duplicate Required Reading or command recipes; keep it as a compact routing anchor.'
    });
  }
  return issues;
}

function commandRecipeCount(content: string): number {
  const matches = content.match(/^\s*`?hadara\s+(?:task|context|session|evidence|docs|harness|init)\s+[a-z-]+/gm);
  return new Set(matches ?? []).size;
}

function detectRequiredReadingTooBroad(projectRoot: string): InitIssue[] {
  const registry = readDocsRegistryForDoctor(projectRoot);
  if (registry === null) return [];
  const broad = registry.documents.filter((doc) => {
    const raw = doc as DocumentRegistryFile['documents'][number] & {
      readTier?: string;
      drift?: { reviewRequiredBeforeUse?: boolean; risk?: string };
    };
    const defaultRead = doc.requiredReading || doc.readWhen.includes('session-start') || doc.readWhen.includes('task-start');
    if (!defaultRead) return false;
    return doc.status === 'historical'
      || doc.status === 'superseded'
      || doc.status === 'archived'
      || raw.readTier === 'historical'
      || raw.readTier === 'excluded'
      || raw.readTier === 'drift-review'
      || raw.drift?.reviewRequiredBeforeUse === true
      || raw.drift?.risk === 'medium'
      || raw.drift?.risk === 'high';
  });
  return broad.map((doc) => ({
    severity: 'warning' as const,
    code: 'INIT_REQUIRED_READING_TOO_BROAD',
    path: doc.path,
    message: `${doc.path} is in the default read path but is historical, excluded, superseded, archived, or drift-risk.`
  }));
}

function readDocsRegistryForDoctor(projectRoot: string): DocumentRegistryFile | null {
  const registryPath = path.join(projectRoot, DOCS_REGISTRY_PATH);
  if (!fs.existsSync(registryPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(registryPath, 'utf8')) as DocumentRegistryFile;
  } catch {
    return null;
  }
}

function detectProductDefaultLeaks(projectRoot: string): InitIssue[] {
  const paths = [
    'AGENTS.md',
    '.hadara/context/HADARA_CONTEXT.md',
    'docs/HADARA_WORKFLOW.md',
    'docs/PROJECT_STATE.md',
    'docs/AGENT_HANDOFF.md',
    'docs/ARCHITECTURE.md',
    'docs/ROADMAP.md',
    'docs/DECISIONS.md',
    'docs/SECURITY_MODEL.md'
  ];
  const issues: InitIssue[] = [];
  for (const relativePath of paths) {
    const content = readProjectText(projectRoot, relativePath);
    if (content === null) continue;
    const token = productDefaultLeakToken(content);
    if (token) {
      issues.push({
        severity: 'warning',
        code: 'INIT_PRODUCT_DEFAULT_LEAK',
        path: relativePath,
        message: `${relativePath} appears to contain project-specific generated default text (${token}); product scaffolds must stay generic.`
      });
    }
  }
  return issues;
}

function productDefaultLeakToken(content: string): string | null {
  const checks: Array<[RegExp, string]> = [
    [/\bHADARA-dev\b/, 'HADARA-dev'],
    [/\bDocker\b|\bdocker\s+(?:exec|run|compose|ps|build)\b/i, 'Docker'],
    [/\bnpm\s+(?:run|publish|view|ci|install|pack)\b/i, 'npm'],
    [/\bnode\s+dist\/cli\/main\.js\b/i, 'node dist/cli/main.js'],
    [/\bhadara\s+(?:release|package|smoke)\s+(?:publish|artifact|gate|dry-run|closeout|smoke|recycle|clean-checkout)\b/i, 'release/package command'],
    [/\/workspace\b|\/mnt\/|[A-Za-z]:\\/, 'machine-local path'],
    [/\bhadara@\d+\.\d+\.\d+/, 'package version']
  ];
  return checks.find(([pattern]) => pattern.test(content))?.[1] ?? null;
}

function createInitUpgradeReport(projectRoot: string, profile: InitProfile, mode: InitFollowUpMode): InitFollowUpReport {
  const actions: InitAction[] = [];
  const issues: InitIssue[] = [];
  const writes: InitWriteOperation[] = [];
  const summary = 'This command creates missing scaffold docs and updates generated profile metadata in known scaffold files. It does not overwrite unrelated user-authored content.';
  for (const file of createGeneratedScaffoldFiles(profile)) {
    const filePath = path.join(projectRoot, file.path);
    if (fs.existsSync(filePath)) {
      actions.push({ action: 'upgrade-doc', path: file.path, status: 'exists', summary: `${file.path} already exists and will not be overwritten.` });
      continue;
    }
    if (mode === 'execute') {
      writes.push({ path: file.path, content: file.content });
      actions.push({ action: 'upgrade-doc', path: file.path, status: 'created', summary: `${file.path} was created.` });
    } else {
      actions.push({ action: 'upgrade-doc', path: file.path, status: 'planned', summary: `${file.path} would be created.` });
    }
  }
  const metadataMerge = createProfileMetadataMerge(projectRoot, profile, mode);
  actions.push(...metadataMerge.actions);
  writes.push(...metadataMerge.writes);
  issues.push(...metadataMerge.issues);
  const registryMerge = createDocsRegistryProfileMerge(projectRoot, profile, mode);
  actions.push(...registryMerge.actions);
  writes.push(...registryMerge.writes);
  issues.push(...registryMerge.issues);
  if (mode === 'execute') {
    issues.push(...writeFilesAtomically(projectRoot, writes));
  }
  return {
    schemaVersion: 'hadara.init.followup.v1',
    command: 'init.upgrade',
    ok: issues.every((issue) => issue.severity !== 'error'),
    summary,
    mode,
    profile,
    actions,
    issues
  };
}

function createDocsRegistryProfileMerge(projectRoot: string, profile: InitProfile, mode: InitFollowUpMode): {
  actions: InitAction[];
  writes: InitWriteOperation[];
  issues: InitIssue[];
} {
  const registryPath = path.join(projectRoot, DOCS_REGISTRY_PATH);
  if (!fs.existsSync(registryPath)) {
    return { actions: [], writes: [], issues: [] };
  }
  let registry: DocumentRegistryFile;
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as DocumentRegistryFile;
  } catch (error) {
    return {
      actions: [],
      writes: [],
      issues: [{
        severity: 'error',
        code: 'INIT_DOCS_REGISTRY_INVALID_JSON',
        path: DOCS_REGISTRY_PATH,
        message: `.hadara docs registry could not be parsed: ${error instanceof Error ? error.message : String(error)}`
      }]
    };
  }
  const seed = createSeedDocumentRegistry(profile);
  const existingPaths = new Set(registry.documents.map((doc) => doc.path));
  const missing = seed.documents.filter((doc) => !existingPaths.has(doc.path));
  const profileMatches = registry.projectProfile === profile;
  if (missing.length === 0 && profileMatches) {
    return {
      actions: [{
        action: 'upgrade-docs-registry',
        path: DOCS_REGISTRY_PATH,
        status: 'exists',
        summary: `Docs registry already matches the ${profile} seed.`
      }],
      writes: [],
      issues: []
    };
  }
  const merged: DocumentRegistryFile = {
    ...registry,
    projectProfile: profile,
    documents: [...registry.documents, ...missing]
  };
  return {
    actions: [{
      action: 'upgrade-docs-registry',
      path: DOCS_REGISTRY_PATH,
      status: mode === 'execute' ? 'updated' : 'planned',
      summary: describeDocsRegistryProfileMerge(profile, mode, missing.length)
    }],
    writes: mode === 'execute' ? [{ path: DOCS_REGISTRY_PATH, content: registryJson(merged) }] : [],
    issues: []
  };
}

function describeDocsRegistryProfileMerge(profile: InitProfile, mode: InitFollowUpMode, missingCount: number): string {
  const verb = mode === 'execute' ? 'was' : 'would be';
  if (missingCount === 0) return `Docs registry profile metadata ${verb} updated to ${profile}.`;
  return `Docs registry ${verb} updated with ${missingCount} ${profile} profile seed entr${missingCount === 1 ? 'y' : 'ies'}.`;
}

function createRequiredReadingRegistrationReport(
  projectRoot: string,
  input: { documentPath: string; when: string; purpose: string; mode: InitFollowUpMode; requireExists?: boolean }
): InitFollowUpReport {
  const pathResult = normalizeProjectRelativePath(input.documentPath);
  const cellIssues = validateTableCells([input.when, input.purpose]);
  if (!pathResult.ok || cellIssues.length > 0) {
    return {
      schemaVersion: 'hadara.init.followup.v1',
      command: 'init.register-doc',
      ok: false,
      mode: input.mode,
      actions: [],
      issues: [...(pathResult.ok ? [] : [pathResult.issue]), ...cellIssues]
    };
  }
  const relativePath = pathResult.relativePath;
  const issues: InitIssue[] = [];
  if ((input.requireExists ?? false) && !fs.existsSync(path.join(projectRoot, relativePath))) {
    issues.push({
      severity: 'error',
      code: 'INIT_REGISTERED_DOC_MISSING',
      path: relativePath,
      message: `${relativePath} does not exist yet.`
    });
  }
  return {
    schemaVersion: 'hadara.init.followup.v1',
    command: 'init.register-doc',
    ok: issues.every((issue) => issue.severity !== 'error'),
    summary: 'init.register-doc is a compatibility guide only in 0.4 projects; use `hadara docs register` to update .hadara/docs-registry.json.',
    mode: input.mode,
    actions: [{
      action: 'register-doc',
      path: relativePath,
      status: 'skipped',
      summary: `Use hadara docs register --path ${relativePath} --json to register project document metadata.`
    }],
    issues
  };
}

function createIntegrationEnableReport(
  projectRoot: string,
  input: { integration: string; mode: InitFollowUpMode }
): InitFollowUpReport {
  const integration = parseIntegration(input.integration);
  const relativePath = integration === 'hermes' ? 'docs/integrations/HERMES.md' : 'docs/integrations/MCP.md';
  const content = integration === 'hermes' ? createHermesIntegrationDoc() : createMcpIntegrationDoc();
  const actions: InitAction[] = [];
  const issues: InitIssue[] = [];
  const fullPath = path.join(projectRoot, relativePath);
  actions.push({
    action: 'enable-integration-registration',
    path: relativePath,
    status: 'skipped',
    summary: `Use hadara docs register --path ${relativePath} --json after creating this optional integration guide.`
  });

  if (fs.existsSync(fullPath)) {
    actions.push({ action: 'enable-integration-doc', path: relativePath, status: 'exists', summary: `${relativePath} already exists and will not be overwritten.` });
  } else if (input.mode === 'execute') {
    issues.push(...writeFilesAtomically(projectRoot, [{ path: relativePath, content }]));
    actions.push({ action: 'enable-integration-doc', path: relativePath, status: 'created', summary: `${relativePath} was created.` });
  } else {
    actions.push({ action: 'enable-integration-doc', path: relativePath, status: 'planned', summary: `${relativePath} would be created.` });
  }
  return {
    schemaVersion: 'hadara.init.followup.v1',
    command: 'init.enable-integration',
    summary: 'This command registers project guidance only; it does not enable Hermes/MCP runtime behavior.',
    ok: issues.every((issue) => issue.severity !== 'error'),
    mode: input.mode,
    integration,
    actions,
    issues
  };
}

const CANONICAL_TABLE_HEADERS: Record<string, string[]> = {
  'AGENTS.md': ['| Document | When to Read | Purpose |'],
  'docs/PROJECT_STATE.md': ['| Field | Value |', '| Area | Status | Notes |', '| Source | Path | Purpose |'],
  'docs/AGENT_HANDOFF.md': ['| Area | State | Notes |', '| Task | Summary | Evidence |', '| Issue | Impact | Next Step |', '| Step | Reason | Done Evidence |', '| Check | Latest Evidence | Notes |', '| History Type | Path | When to Use |'],
  'docs/TASK_BOARD.md': ['| ID | Title | Status | Capsule | Notes |'],
  'docs/HADARA_WORKFLOW.md': ['| Order | Authority | Allowed Reads |', '| Gate | Required State |', '| Timing | Update |', '| Situation | Use | Notes |', '| Surface | Human / Operator | Agent | CLI |'],
  'docs/ARCHITECTURE.md': ['| Field | Value |', '| Boundary | Rule | Notes |', '| Component | Path / Surface | Responsibility | Status |'],
  'docs/DEVELOPMENT_SLICES.md': ['| Order | Slice | Capsule | Purpose | Done Evidence |'],
  'docs/DECISIONS.md': ['| ID | Date | Decision | Status | Rationale | Evidence |'],
  'docs/TEST_STRATEGY.md': ['| Field | Value |', '| Suite | Command | Purpose | Required For Done |', '| Step | Check | Evidence Location |', '| Check Type | Add Only When |'],
  'docs/SECURITY_MODEL.md': ['| Mode | Rule | Approval Boundary |', '| Invariant | Rule | Evidence |', '| Check Type | Add To | When Required |'],
  'docs/REFACTOR_LOG.md': ['| Date | Area | Change | Rationale | Evidence |'],
  'docs/ROADMAP.md': ['| Order | Item | Purpose | Done Evidence |', '| Item | Reason Deferred | Revisit When |']
};

function printInitFollowUpReport(report: InitFollowUpReport, jsonOutput = false): void {
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exitCode = 6;
    return;
  }
  console.log(`${report.ok ? 'passed' : 'failed'} | ${report.command} | ${report.actions.length} actions | ${report.issues.length} issues`);
  if (!report.ok) process.exitCode = 6;
}

function readProjectText(projectRoot: string, relativePath: string): string | null {
  const fullPath = path.join(projectRoot, relativePath);
  return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf8') : null;
}

function createProfileMetadataMerge(projectRoot: string, profile: InitProfile, mode: InitFollowUpMode): { actions: InitAction[]; writes: InitWriteOperation[]; issues: InitIssue[] } {
  const actions: InitAction[] = [];
  const writes: InitWriteOperation[] = [];
  const issues: InitIssue[] = [];
  const planUpdate = (relativePath: string, nextContent: string | null, summary: string): void => {
    if (nextContent === null) return;
    const current = readProjectText(projectRoot, relativePath);
    if (current === null || current === nextContent) return;
    actions.push({
      action: 'upgrade-profile-metadata',
      path: relativePath,
      status: mode === 'execute' ? 'updated' : 'planned',
      summary
    });
    if (mode === 'execute') writes.push({ path: relativePath, content: nextContent });
  };

  planUpdate(
    'docs/PROJECT_STATE.md',
    replaceProfileTableValue(readProjectText(projectRoot, 'docs/PROJECT_STATE.md'), profile),
    `docs/PROJECT_STATE.md HADARA profile metadata ${mode === 'execute' ? 'was updated' : 'would be updated'} to ${profile}.`
  );
  planUpdate(
    'docs/ARCHITECTURE.md',
    replaceProfileTableValue(readProjectText(projectRoot, 'docs/ARCHITECTURE.md'), profile),
    `docs/ARCHITECTURE.md HADARA profile metadata ${mode === 'execute' ? 'was updated' : 'would be updated'} to ${profile}.`
  );
  planUpdate(
    'AGENTS.md',
    mergeAgentsRequiredReading(readProjectText(projectRoot, 'AGENTS.md'), profile),
    `AGENTS.md Required Reading rows ${mode === 'execute' ? 'were updated' : 'would be updated'} for ${profile}.`
  );

  if (actions.length === 0) {
    actions.push({ action: 'upgrade-profile-metadata', status: 'exists', summary: `Profile metadata already matches ${profile} where generated metadata was found.` });
  }
  return { actions, writes, issues };
}

function replaceProfileTableValue(content: string | null, profile: InitProfile): string | null {
  if (content === null) return null;
  return content.replace(/\|\s*HADARA Profile\s*\|\s*(basic|standard|governed)\s*\|/g, `| HADARA Profile | ${profile} |`);
}

function mergeAgentsRequiredReading(content: string | null, profile: InitProfile): string | null {
  if (content === null || !content.includes('| Order | Document | When | Purpose |')) return content;
  let next = content;
  const missingRows = agentsRequiredReadingRowsForProfile(profile).filter((row) => !next.includes(row.document));
  if (missingRows.length === 0) return next;
  const lines = next.split('\n');
  const headerIndex = lines.findIndex((line) => line.trim() === '| Order | Document | When | Purpose |');
  if (headerIndex < 0) return content;
  let insertAt = headerIndex + 2;
  while (insertAt < lines.length && lines[insertAt].startsWith('|')) {
    if (lines[insertAt].includes('Active `tasks/T-*/TASK.md`') || lines[insertAt].includes('Active Task Capsule docs') || lines[insertAt].includes('Project-specific registered docs')) break;
    insertAt += 1;
  }
  const orders = lines
    .slice(headerIndex + 2, insertAt)
    .map((line) => Number(line.match(/^\|\s*(\d+)\s*\|/)?.[1] ?? 0))
    .filter((order) => Number.isFinite(order));
  let order = Math.max(0, ...orders) + 1;
  const rows = missingRows.map((row) => formatTableRow([String(order++), row.document, row.when, row.purpose]));
  lines.splice(insertAt, 0, ...rows);
  next = lines.join('\n');
  return next;
}

function agentsRequiredReadingRowsForProfile(profile: InitProfile): Array<{ document: string; when: string; purpose: string }> {
  const rows: Array<{ document: string; when: string; purpose: string }> = [
    { document: '`docs/PROJECT_STATE.md`', when: 'Every session', purpose: 'Current product and capability state.' },
    { document: '`docs/TASK_BOARD.md`', when: 'Every session', purpose: 'Current task queue and status.' },
    { document: '`docs/HADARA_WORKFLOW.md`', when: 'Every session', purpose: 'Workflow rules and command-surface routing.' }
  ];
  if (profile === 'standard' || profile === 'governed') {
    rows.push(
      { document: '`docs/ARCHITECTURE.md`', when: 'Architecture, component, or boundary work', purpose: 'Current system shape and ownership boundaries.' },
      { document: '`docs/DECISIONS.md`', when: 'Project-level decision work', purpose: 'Durable project decisions.' },
      { document: '`docs/ROADMAP.md`', when: 'Roadmap, milestone, or scope planning', purpose: 'Longer-term priorities and deferred work.' }
    );
  }
  if (profile === 'governed') {
    rows.push(
      { document: '`docs/AGENT_HANDOFF.md`', when: 'Every session', purpose: 'Compact continuation state.' },
      { document: '`docs/SECURITY_MODEL.md`', when: 'Security, secret, permission, or evidence-safety work', purpose: 'Project security invariants.' },
    );
  }
  return rows;
}

function writeFilesAtomically(projectRoot: string, writes: InitWriteOperation[]): InitIssue[] {
  if (writes.length === 0) return [];
  const prepared: Array<{ relativePath: string; target: string; tmp: string; existed: boolean; original: string | null }> = [];
  const committed: typeof prepared = [];
  try {
    for (const write of writes) {
      const target = path.join(projectRoot, write.path);
      ensureDir(path.dirname(target));
      const tmp = path.join(path.dirname(target), `.hadara-tmp-${process.pid}-${Date.now()}-${path.basename(target)}`);
      prepared.push({
        relativePath: write.path,
        target,
        tmp,
        existed: fs.existsSync(target),
        original: fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null
      });
      fs.writeFileSync(tmp, write.content, { encoding: 'utf8', flag: 'wx' });
    }
    for (const item of prepared) {
      fs.renameSync(item.tmp, item.target);
      committed.push(item);
    }
    return [];
  } catch (error) {
    for (const item of prepared) {
      if (fs.existsSync(item.tmp)) fs.rmSync(item.tmp, { force: true });
    }
    for (const item of committed.reverse()) {
      try {
        if (item.existed && item.original !== null) {
          fs.writeFileSync(item.target, item.original, 'utf8');
        } else {
          fs.rmSync(item.target, { force: true });
        }
      } catch {
        // The returned issue tells the operator to inspect paths before retrying.
      }
    }
    const failedPath = prepared.find((item) => fs.existsSync(item.tmp))?.relativePath ?? writes[0]?.path;
    return [{
      severity: 'error',
      code: 'INIT_ATOMIC_WRITE_FAILED',
      path: failedPath,
      message: `Atomic write failed and rollback was attempted. Inspect generated files before retrying. Cause: ${error instanceof Error ? error.message : String(error)}`
    }];
  }
}

function detectProfileMetadataMismatches(projectRoot: string): InitIssue[] {
  const inferredProfile = inferProfileFromGeneratedDocs(projectRoot);
  const issues: InitIssue[] = [];
  const projectState = readProjectText(projectRoot, 'docs/PROJECT_STATE.md');
  const projectStateProfile = projectState?.match(/\|\s*HADARA Profile\s*\|\s*(basic|standard|governed)\s*\|/)?.[1] as InitProfile | undefined;
  if (projectStateProfile !== undefined && isLowerProfile(projectStateProfile, inferredProfile)) {
    issues.push({
      severity: 'warning',
      code: 'INIT_PROFILE_METADATA_MISMATCH',
      path: 'docs/PROJECT_STATE.md',
      message: `PROJECT_STATE says ${projectStateProfile}, but ${inferredProfile}-level scaffold docs exist.`
    });
  }

  const agents = readProjectText(projectRoot, 'AGENTS.md');
  if (agents !== null) {
    for (const requiredPath of requiredDocsForProfile(inferredProfile)) {
      if (!agents.includes(`\`${requiredPath}\``)) {
        issues.push({
          severity: 'warning',
          code: 'INIT_PROFILE_METADATA_MISMATCH',
          path: 'AGENTS.md',
          message: `AGENTS required reading does not include ${requiredPath}, but ${inferredProfile}-level scaffold docs exist.`
        });
        break;
      }
    }
  }
  return issues;
}

function inferProfileFromGeneratedDocs(projectRoot: string): InitProfile {
  if (['docs/SECURITY_MODEL.md', 'docs/AGENT_HANDOFF.md'].some((relativePath) => fs.existsSync(path.join(projectRoot, relativePath)))) {
    return 'governed';
  }
  if (['docs/ARCHITECTURE.md', 'docs/DECISIONS.md', 'docs/ROADMAP.md'].some((relativePath) => fs.existsSync(path.join(projectRoot, relativePath)))) {
    return 'standard';
  }
  return 'basic';
}

function requiredDocsForProfile(profile: InitProfile): string[] {
  const docs = ['docs/PROJECT_STATE.md', 'docs/TASK_BOARD.md', 'docs/HADARA_WORKFLOW.md'];
  if (profile === 'standard' || profile === 'governed') {
    docs.push('docs/ARCHITECTURE.md', 'docs/DECISIONS.md', 'docs/ROADMAP.md');
  }
  if (profile === 'governed') {
    docs.push('docs/AGENT_HANDOFF.md', 'docs/SECURITY_MODEL.md');
  }
  return docs;
}

function isLowerProfile(current: InitProfile, inferred: InitProfile): boolean {
  const rank: Record<InitProfile, number> = { basic: 1, standard: 2, governed: 3 };
  return rank[current] < rank[inferred];
}

function normalizeProjectRelativePath(value: string): { ok: true; relativePath: string } | { ok: false; issue: InitIssue } {
  const normalized = value.trim().replace(/\\/g, '/').replace(/^\.?\//, '');
  const issue = (message: string): { ok: false; issue: InitIssue } => ({
    ok: false,
    issue: { severity: 'error', code: 'INIT_INVALID_REGISTER_DOC_PATH', path: value, message }
  });
  if (normalized.length === 0) return issue('Registered document path must not be empty.');
  if (value.startsWith('/') || /^[A-Za-z]:\//.test(value.replace(/\\/g, '/'))) return issue('Registered document path must be project-relative.');
  if (normalized.split('/').includes('..')) return issue('Registered document path must not contain .. segments.');
  if (/[|\r\n]/.test(normalized)) return issue('Registered document path must not contain table delimiters or newlines.');
  return { ok: true, relativePath: normalized };
}

function validateTableCells(values: string[]): InitIssue[] {
  return values.flatMap((value) => (/[|\r\n]/.test(value)
    ? [{ severity: 'error' as const, code: 'INIT_INVALID_TABLE_CELL', message: 'Required Reading table cells must not contain | or newline characters.' }]
    : []));
}

function parseIntegration(value: string): 'hermes' | 'mcp' {
  if (value === 'hermes' || value === 'mcp') return value;
  throw new Error(`unsupported init integration: ${value}; expected hermes or mcp`);
}

function createScaffoldJson(profile: InitProfile): string {
  return `${JSON.stringify({
    schemaVersion: 'hadara.projectScaffold.v1',
    hadaraProtocol: '0.4',
    profile,
    taskCapsuleSchema: 'hadara.taskCapsule.v1',
    docsRegistrySchema: 'hadara.docsRegistry.v2',
    managedSlotSchema: 'hadara.managedSlot.v2',
    createdWith: 'hadara@0.4.0',
    docsRegistryPath: '.hadara/docs-registry.json',
    slotRegistryPath: '.hadara/slot-registry.json'
  }, null, 2)}\n`;
}

function createSlotRegistryJson(): string {
  return `${JSON.stringify({
    schemaVersion: 'hadara.managedSlot.registry.v1',
    registryVersion: 1,
    slots: [
      {
        id: 'task.identity',
        schemaVersion: 'hadara.managedSlot.v2',
        owner: 'task.lifecycle',
        allowedPaths: ['tasks/*/TASK.md'],
        closeSourceRole: 'included',
        kind: 'key-value-table',
        fields: [
          { name: 'ID', required: true, editable: 'cli-only', pattern: '^T-[0-9]{4,}$' },
          { name: 'Title', required: true, editable: 'cli-on-create' },
          { name: 'Status', required: true, editable: 'lifecycle-or-constrained-md', allowedValues: ['Draft', 'In Progress', 'Blocked', 'Done', 'Partial', 'Superseded', 'Archived'] },
          { name: 'Created', required: true, editable: 'cli-only', pattern: '^\\\\d{4}-\\\\d{2}-\\\\d{2}$' },
          { name: 'Updated', required: true, editable: 'cli-or-managed', pattern: '^\\\\d{4}-\\\\d{2}-\\\\d{2}$' }
        ]
      }
    ],
    tableSchemas: [
      {
        id: 'task.acceptance',
        kind: 'markdown-table',
        allowedPaths: ['tasks/*/TASK.md'],
        closeSourceRole: 'included',
        columns: [
          { name: 'ID', pattern: '^AC-[0-9]+$', required: true },
          { name: 'Criterion', editable: 'agent-derived-prose', required: true },
          { name: 'Required', allowedValues: ['Yes', 'No'], required: true },
          { name: 'Status', allowedValues: ['Pending', 'Met', 'Not Met', 'Blocked', 'Not Applicable'], required: true },
          { name: 'Evidence', pattern: '^(TBD|ev:.*|)$', required: false },
          { name: 'Disposition', allowedValues: ['Required', 'Optional', 'Deferred', 'Accepted Risk', 'Not Applicable', 'Superseded'], required: true },
          { name: 'Reference', requiredWhenDispositionIn: ['Deferred', 'Accepted Risk', 'Superseded'] }
        ]
      }
    ]
  }, null, 2)}\n`;
}

function createHadaraWorkflowDoc(): string {
  return `# HADARA_WORKFLOW

## Purpose

This document explains when to use HADARA CLI surfaces and when to update HADARA documents during normal project work.

Use HADARA read models first. Do not manually read broad project files unless a HADARA command points you there or the task explicitly requires it.

## Quickstart

Use this section for the first pass through a new scaffold. Read the detailed sections below only when you reach that situation.

| Situation | First Action |
|---|---|
| New project created | Read \`AGENTS.md\`, then \`.hadara/context/HADARA_CONTEXT.md\`, then this Quickstart. |
| Need work to do | Run \`hadara task status --json\`. |
| Need a task | Run \`hadara task create "task title" --json\`, then fill \`TASK.md\` Goal, Source Documents, Plan, and Acceptance. |
| Need files to inspect | Run \`hadara session start --task T-XXXX --json\` or \`hadara context pack --task T-XXXX --json\`, then read only routed files. |
| Ready to close | Run \`hadara task finalize --task T-XXXX --execute --auto --json\` for the ordinary guarded close path; it records readiness evidence and close proof when needed. Dry-run first only when a separate reviewer needs the plan hash. |

## Minimal Loop

\`\`\`text
1. \`hadara task status --json\`
2. \`hadara session start --task T-XXXX --json\` when resuming or changing tasks
3. \`hadara task create "task title" --json\` only when no suitable capsule exists
4. update \`TASK.md\`
5. implement the scoped change
6. run real validation
7. record evidence
8. update task/global docs
9. review \`task finalize --json\`
10. execute finalize with \`--execute --auto\` for ordinary clean work, or with a reviewed \`--plan-hash\` when an external review flow requires it
\`\`\`

## Read Authority Rules

Agents must follow this read order:

| Order | Authority | Allowed Reads |
|---:|---|---|
| 1 | HADARA CLI read models | \`session start\`, \`task status\`, \`context pack\`, docs registry/read-map reports. |
| 2 | Command-returned paths | Files, ranges, candidates, or docs explicitly returned by those read models. |
| 3 | Active Task Capsule | \`TASK.md\`, \`HANDOFF.md\`, \`EVIDENCE.md\`, and task-local evidence summaries for the selected task. |
| 4 | Shared state docs | Only when Required Reading says every session, or when a read model/task explicitly references them. |
| 5 | Conditional reference docs | Only when the task, registry, read-map, or source document table points to them. |

Agents must not scan the repository, open unrelated docs, or infer current state from directory structure when a HADARA read model can route the read.

## Project Start

Use \`hadara init\` only when creating a new HADARA project or initializing HADARA in an existing project that is not already governed by another HADARA protocol.

\`\`\`bash
hadara init --json
hadara init --profile basic --json
hadara init --profile standard --json
hadara init --profile governed --json
hadara init doctor --json
\`\`\`

After init, review:

| Step | Document | Purpose |
|---|---|---|
| 1 | \`AGENTS.md\` | Entry rules and required reading. |
| 2 | \`.hadara/context/HADARA_CONTEXT.md\` | Compact read routing. |
| 3 | \`docs/PROJECT_STATE.md\` | Initial project state and next recommended step. |
| 4 | \`docs/TASK_BOARD.md\` | Task index. |
| 5 | \`docs/HADARA_WORKFLOW.md\` | How to work with HADARA from this point forward. |

Use project-specific docs only after they are created and routed through the docs registry, a read-map, or the active task.

## Session Start

Use session start at the beginning of a work session, after switching tasks, or when project state is unclear.

\`\`\`bash
hadara session start --json
hadara session start --task T-XXXX --json
\`\`\`

Session start is a read model. It does not create tasks, append evidence, warm caches, validate completion, or close work.

## Selecting or Creating Work

\`\`\`bash
hadara task status --json
hadara task create "task title" --json
hadara task status --task T-XXXX --json
\`\`\`

Use \`task status --json\` to decide what to work on when no task is selected. Use \`task create\` only when no suitable capsule exists. Use \`task status --task T-XXXX --json\` as a fast selected-task loop cockpit for evidence, loop phase, and suggested next actions. Use \`task finalize --task T-XXXX --json\` or \`task status --task T-XXXX --detail full --json\` when you need close-grade readiness diagnostics.

## Task Context

\`\`\`bash
hadara context pack --task T-XXXX --json
\`\`\`

Use context pack when starting implementation, resuming after a gap, deciding which files to inspect, or avoiding broad manual repo reads. Context pack is reading guidance, not validation.

After context pack:

1. Select only relevant files or candidates from the report.
2. Use \`context slice\` for exact source reads when a range/candidate is available.
3. Add or update \`TASK.md\` Source Documents for sources that constrain the work.

## Exact Source Slices

\`\`\`bash
hadara context slice --path <path> --from <line> --to <line> --json
hadara context slice --task T-XXXX --candidate <candidate-id> --json
\`\`\`

Use context slice only after a read model points to a specific file or range.

## Slice State

Use slice state when the project has roadmap/development slices that need a generated \`docs/DEVELOPMENT_SLICES.md\` projection.

\`\`\`bash
hadara slice list --json
hadara slice add --id M1 --title "First slice" --status not-started --json
hadara slice set --id M1 --status done --done-evidence ev:T-XXXX:... --json
hadara slice render --json
\`\`\`

\`.hadara/state/slices.json\` is canonical once it exists. \`docs/DEVELOPMENT_SLICES.md\` is a generated projection; do not hand-edit it to repair state drift. Use \`hadara slice render --json\` to discard projection drift or \`hadara slice migrate --execute --json\` to import a legacy Markdown slice table deliberately.

## Task Capsule Lifecycle

The normal task lifecycle is:

\`\`\`text
select or create task
read task context
author task contract
do scoped work
record evidence
finish task docs and shared state
review finalize plan
execute finalize through the guarded auto path
stop when finalize returns closed-valid
\`\`\`

Use the high-level lifecycle path for ordinary work:

\`\`\`bash
hadara task status --task T-XXXX --json
hadara task finalize --task T-XXXX --json
hadara task finalize --task T-XXXX --execute --auto --json
hadara task finalize --task T-XXXX --execute --plan-hash sha256:... --json
\`\`\`

Use the explicit \`--plan-hash\` form only when a reviewed dry-run plan needs to cross a human or external automation boundary. The ordinary path is \`--execute --auto\`; it still performs the dry-run, folds in the current plan hash internally, and aborts if the close-source world changes before the write.

Low-level lifecycle command surfaces (\`task finish\`, \`task ready\`, \`task close\`, \`task audit-close\`, \`task complete\`, and \`task lifecycle\`) were removed in 0.4.1-rc.0. They now return structured redirect stubs with replacement commands. Use \`task status --task T-XXXX --detail full --json\` for diagnostics and \`task finalize\` for close execution.

## Finalize Entry Gate

Before running \`hadara task finalize\`, all of these must be true:

| Gate | Required State |
|---|---|
| Goal | \`TASK.md\` has a concrete task goal. |
| Source Documents | Relevant sources are listed, or the task explicitly records that none are required. |
| Plan | \`TASK.md\` Plan has the intended work steps. |
| Acceptance | \`TASK.md\` Acceptance has the completion criteria. |
| Validation | At least one validation method is defined, or a documented reason explains why validation is not applicable. |

Do not use status/finalize to avoid authoring the task contract.

## Task Document Timing

HADARA 0.4 Task Capsules contain \`TASK.md\`, \`HANDOFF.md\`, \`EVIDENCE.md\`, and \`evidence.jsonl\`.

| Timing | Update |
|---|---|
| Capsule created | Start \`TASK.md\` Goal, Source Documents, Plan, and Acceptance. |
| Before execution | Refine \`TASK.md\` Plan, Source Documents, and Acceptance. |
| During execution | Update \`TASK.md\` Plan, Change Summary, Risks / Follow-ups; update \`HANDOFF.md\` warnings if continuity changes. |
| After validation | Use \`validation run\` when possible; record evidence, then update \`TASK.md\` Validation and Acceptance deliberately with evidence ids or residual notes. |
| Before finalize dry-run | Finish \`TASK.md\` Change Summary, Acceptance, Validation, Risks / Follow-ups; update \`HANDOFF.md\`; update shared state docs when the task changed them. |
| Finalize review | Inspect \`task finalize --json\` dry-run output and fix reported blockers before execute. |
| Finalize execute | Do not edit close-source docs during execute. |
| After close | Only clarify docs if the task contract did not change; rerun finalize after close-source edits. |

Do not hand-edit \`evidence.jsonl\`. Treat \`EVIDENCE.md\` as a CLI-generated projection file.

## Evidence

\`\`\`bash
hadara validation run --task T-XXXX --check "Focused tests" -- npm test
hadara validation run --task T-XXXX --check "Focused tests" --direct-result passed --direct-summary "npm test passed directly" --update-task --json
hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --json
hadara evidence list --task T-XXXX --json
hadara evidence project --task T-XXXX --json
\`\`\`

Use \`validation run\` for ordinary validation because it executes the command, records durable evidence from the real exit status, and refreshes \`EVIDENCE.md\`. Add \`--update-task\` only when you intentionally want the matching \`TASK.md\` Validation row updated by the CLI.

If the wrapper cannot launch a command in the current tool environment (for example \`EPERM\`, \`EACCES\`, or \`ENOENT\`) but the same command runs directly, record the direct result through \`validation run\` so validation-check resolution tags and optional TASK.md row sync remain consistent:

\`\`\`bash
hadara validation run --task T-XXXX --check "Focused tests" --direct-result passed --direct-summary "npm test passed directly after validation wrapper launch failure" --update-task --json
\`\`\`

Use \`evidence add-command\` only when recording an already-run result supplied by the operator. It does not execute shell commands. Use \`evidence list\` to find durable evidence ids for docs and resolution markers.

Evidence must reflect real execution results. Fabricated or assumed results are invalid.

\`evidence project\` is the 0.4 projection refresh surface. It refreshes the generated \`EVIDENCE.md\` projection file without rewriting canonical evidence.

## Repair and Diagnostics

\`\`\`bash
hadara task status --task T-XXXX --detail full --json
hadara task finalize --task T-XXXX --json
hadara harness validate --task T-XXXX --level done --json
hadara init doctor --json
\`\`\`

Use finalize dry-run as the ordinary close-proof repair plan. Use diagnostics when finalize reports blockers. Do not repair close proof by editing evidence files by hand.

Agents should inspect \`task finalize --json\` before close when the result is not already familiar. For ordinary clean capsules, \`task finalize --execute --auto --json\` performs the dry-run and current-plan verification internally and records idempotent validation-category readiness evidence before close proof when close evidence is still required. For externally reviewed flows, use the current \`planHash\` from the reviewed dry-run.

## Useful CLI by Situation

| Situation | Use | Notes |
|---|---|---|
| New HADARA project | \`hadara init --profile <profile> --json\` | Creates scaffold docs and registries. |
| Check scaffold health | \`hadara init doctor --json\` | Reports missing or inconsistent scaffold files. |
| Find next work | \`hadara task status --json\` | Read-only selection cockpit. |
| Inspect selected task | \`hadara task status --task T-XXXX --json\` | Fast loop phase and next-action projection. |
| Inspect close-grade diagnostics | \`hadara task status --task T-XXXX --detail full --json\` | Heavier readiness/protocol projection for explicit diagnostics. |
| Find task-specific context | \`hadara context pack --task T-XXXX --json\` | Use before broad manual reads. |
| Read exact source text | \`hadara context slice ... --json\` | Use after a context candidate points to a range. |
| Update slice state | \`hadara slice add/set/render ... --json\` | Use when roadmap/development slice state applies. |
| Run and record validation | \`hadara validation run --task T-XXXX --check "..." -- <command>\` | Executes the command and records evidence without editing \`TASK.md\` by default. |
| Run, record, and sync task row | \`hadara validation run --task T-XXXX --check "..." --update-task -- <command>\` | Executes the command, records evidence, and updates the matching \`TASK.md\` Validation row. |
| Record direct validation result | \`hadara validation run --task T-XXXX --check "..." --direct-result passed --direct-summary "..." --update-task --json\` | Records an already-run direct result when wrapper launch is blocked by the tool environment. |
| Record already-run validation | \`hadara evidence add-command ... --json\` | Append-only evidence writer; does not execute commands. |
| Find evidence ids | \`hadara evidence list --task T-XXXX --json\` | Durable id discovery. |
| Review loop phase | \`hadara task status --task T-XXXX --json\` | Normal lifecycle state and next action. |
| Close ordinary work | \`hadara task finalize --task T-XXXX --execute --auto --json\` | Default guarded close path for clean capsules; records readiness evidence and close proof when needed. |
| Externally reviewed close | \`hadara task finalize --task T-XXXX --json\` then execute with its \`planHash\` | Use when a human or automation explicitly reviews and carries the dry-run plan. |
| Repair close drift | \`hadara task finalize --task T-XXXX --json\` then execute with \`--auto\` or the reviewed \`planHash\` | Default repair path for stale close proof. |
| Register project-specific docs | \`hadara docs register --path <path> --json\` | 0.4 registry surface. Canonical state belongs in \`.hadara/docs-registry.json\`; use registry-backed help for exact options. |
| Discover command details | \`hadara help lifecycle\`, \`hadara help command <id>\`, \`hadara commands --json\` | Prefer registry-backed help over copied command tables. |

## Common Failure Modes

| Failure Mode | Correct Behavior |
|---|---|
| Skipping read models and scanning the repository. | Start with session/task/context read models and only open routed files. |
| Opening unrelated specs or historical docs. | Use read tiers, registry metadata, and context pack candidates. |
| Running lifecycle before \`TASK.md\` is authored. | Satisfy the Lifecycle Entry Gate first. |
| Treating context pack as validation. | Use it only for read guidance; run real checks separately. |
| Recording evidence for checks that were not run. | Record only real execution results, including failed or blocked checks. |
| Running finalize execute from memory. | Use \`--execute --auto\` for the ordinary guarded path, or review fresh dry-run output and copy its current plan hash for external review flows. |
| Putting same-capsule chores in \`HANDOFF.md\` Next Recommended Step. | Use that section for next capsule or global-state recommendations. |

## Design Source Documents and Read Maps

Design source documents may live under \`docs/specs/**\` or other registered paths. Use registry/read-map output to decide whether they are active, conditional, implemented, drift-risk, historical, or excluded.

Do not treat every file under \`docs/specs/**\` as default Required Reading.

Document registration writes registry metadata, not prose rows in entry docs. Do not append project-specific document rows to \`AGENTS.md\`, \`.hadara/context/HADARA_CONTEXT.md\`, or this workflow document.

## Authoring Model

| Surface | Human / Operator | Agent | CLI |
|---|---|---|---|
| Requirements and source docs | Provides and approves | Summarizes into task docs | Indexes/read-map only |
| \`TASK.md\` identity | Reviews | Does not hand-edit CLI-owned fields | Creates and lifecycle-updates |
| \`TASK.md\` prose/tables | Reviews | Authors goal, source documents, plan, acceptance, validation, change summary, risks, and follow-ups | Validates controlled values |
| \`HANDOFF.md\` | Reviews | Writes continuation guidance | May suggest or project summaries |
| \`evidence.jsonl\` | Supplies command result facts | Does not hand-edit | Appends canonical evidence |
| \`EVIDENCE.md\` | Reads | Does not hand-edit generated projection | Regenerates projection file |
| Close proof | Reviews | Does not write by hand | Appends proof and audits freshness |

## Automatic Writing Boundary

HADARA auto-writes deterministic state, managed slots, indexes, evidence projections, and close snapshots. It reports read-only guidance for missing task prose.

Agents write task-specific goal, source documents, plan, acceptance, validation, change summary, risks, follow-ups, and handoff guidance from user requirements and source documents.

## Drift Avoidance

Do not duplicate command registry metadata. For detailed options, point to registry-backed help:

\`\`\`bash
hadara help lifecycle
hadara help command <id>
hadara commands --json
\`\`\`
`;
}

function createHermesIntegrationDoc(): string {
  return `# Hermes Integration

## Status

| Field | Value |
|---|---|
| Enabled By | \`hadara init enable-integration --integration hermes --execute\` |
| Default Init Surface | No |

## Boundaries

| Boundary | Rule |
|---|---|
| Registration | Register this document with \`hadara docs register\` before agents rely on it. |
| Runtime | This document is project guidance registration only; it does not enable Hermes runtime behavior. |
| Scope | Treat Hermes behavior as project-specific integration work, not generic HADARA init behavior. |
`;
}

function createMcpIntegrationDoc(): string {
  return `# MCP Integration

## Status

| Field | Value |
|---|---|
| Enabled By | \`hadara init enable-integration --integration mcp --execute\` |
| Default Init Surface | No |

## Boundaries

| Boundary | Rule |
|---|---|
| Registration | Register this document with \`hadara docs register\` before agents rely on it. |
| Runtime | This document is project guidance registration only; it does not enable MCP runtime behavior or change capability gates. |
| Scope | Treat MCP behavior as project-specific integration work, not generic HADARA init behavior. |
| Writes | Do not add MCP write tools without explicit project approval and safety evidence. |
`;
}

function createProjectStateDoc(profile: InitProfile): string {
  const handoffRow = profile === 'governed'
    ? '| Next-session handoff | `docs/AGENT_HANDOFF.md` | Compact continuation state. |\n'
    : '';
  const productTable = managedSectionBlock('project-state-metadata', {
    schema: 'hadara.managedSection.v1',
    owner: 'project-state.update',
    kind: 'key-value-table',
    mode: 'update-row',
    version: 1,
    required: true,
    closeSourceRole: 'included'
  }, `| Field | Value |
|---|---|
| Name | TBD |
| Purpose | Describe the project in one or two sentences. |
| HADARA Profile | ${profile} |
`);
  return `# PROJECT_STATE

## Product

${productTable}

## Current Phase

| Field | Value |
|---|---|
| Phase | bootstrap-development |
| Status | initialized |
| Active Task | TBD |

## Current Status

| Area | Status | Notes |
|---|---|---|
| Scaffold | Initialized | HADARA protocol scaffold is initialized. |
| Task Capsule | Not selected | Create or select the first Task Capsule. |

## Single Source of Truth

| Source | Path | Purpose |
|---|---|---|
| Current state | \`docs/PROJECT_STATE.md\` | Product and capability state. |
| Work queue | \`docs/TASK_BOARD.md\` | Task status and queue. |
${handoffRow}| Workflow | \`docs/HADARA_WORKFLOW.md\` | Generic HADARA lifecycle and evidence rules. |
| Task details | \`tasks/T-*/\` | Task-local evidence and decisions. |
`;
}

function createTaskBoardDoc(): string {
  const taskBoardTable = managedSectionBlock('task-board', {
    schema: 'hadara.managedSection.v1',
    owner: 'task.finish',
    kind: 'markdown-table',
    mode: 'update-row',
    version: 1,
    required: true,
    closeSourceRole: 'included'
  }, `| ID | Title | Status | Capsule | Notes |
|---|---|---|---|---|
`);
  return `# TASK_BOARD

${taskBoardTable}
`;
}

function createAgentHandoffDoc(): string {
  const currentStateTable = managedSectionBlock('current-state', {
    schema: 'hadara.managedSection.v1',
    owner: 'human',
    kind: 'markdown-table',
    mode: 'update-row',
    version: 1,
    required: true,
    closeSourceRole: 'included'
  }, `| Area | State | Notes |
|---|---|---|
| Scaffold | Initialized | HADARA protocol scaffold is initialized. |
| Required Reading | Pending | Read \`PROJECT_STATE\`, \`AGENT_HANDOFF\`, \`TASK_BOARD\`, and \`HADARA_WORKFLOW\` before starting. |
`);
  return `# AGENT_HANDOFF

## Current State

${currentStateTable}

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Create or select first Task Capsule | Establish one bounded unit of work. | Task Capsule exists and is referenced from \`docs/TASK_BOARD.md\`. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed tasks | TBD | Add when handoff grows too large. |
| Validation history | TBD | Add when validation notes grow too large. |
`;
}

function createArchitectureDoc(profile: InitProfile): string {
  return `# ARCHITECTURE

## Overview

| Field | Value |
|---|---|
| HADARA Profile | ${profile} |
| Summary | Describe the current system architecture. |

## Boundaries

| Boundary | Rule | Notes |
|---|---|---|
| Project state | Keep project source, docs, and Task Capsules in the repository. | Reproducible state only. |
| Local state | Keep portable/local machine state under \`.hadara/local/\`. | Must be ignored. |
| Secrets | Do not commit secrets, private logs, or machine-local state. | Use local/private stores. |

## Current Components

| Component | Path / Surface | Responsibility | Status |
|---|---|---|---|
| Task Capsules | \`tasks/T-*/\` | Task-local scope, evidence, decisions, and handoff. | Active |
| Evidence records | \`EVIDENCE.md\`, \`evidence.jsonl\` | Validation evidence and artifact references. | Active |
| Handoff | \`docs/PROJECT_STATE.md\` or \`docs/AGENT_HANDOFF.md\` | Next-session continuation state. | Active |
`;
}

function numberedList(items: string[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
}

function formatTableRow(columns: string[]): string {
  return `| ${columns.join(' | ')} |`;
}

function createDevelopmentSlicesDoc(): string {
  return `# DEVELOPMENT_SLICES

HADARA development should proceed in small, evidence-backed slices.

| Order | Slice | Capsule | Purpose | Done Evidence |
|---|---|---|---|---|
| 1 | First validated task | TBD | Create a Task Capsule, implement a small change, and attach evidence. | Harness validation passes. |
`;
}

function createDecisionsDoc(): string {
  return `# DECISIONS

| ID | Date | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|---|

Record project-level decisions here. Keep task-local decisions inside the active Task Capsule unless they change project architecture or workflow.
`;
}

function createRefactorLogDoc(): string {
  return `# REFACTOR_LOG

## Format

| Date | Area | Change | Rationale | Evidence |
|---|---|---|---|---|

Record meaningful removals, replacements, and migrations here.
`;
}

function createSecurityModelDoc(): string {
  return `# SECURITY_MODEL

## Default Mode

| Mode | Rule | Approval Boundary |
|---|---|---|
| Assisted development | Read, edit, and validate deliberately. | Ask for explicit approval before risky mutation. |

## Invariants

| Invariant | Rule | Evidence |
|---|---|---|
| Secrets | Do not write secrets, private logs, environment dumps, or token values into committed files. | Review changed files before completion. |
| Local state | Keep machine-local state under ignored local paths such as \`.hadara/local/\`. | \`.gitignore\` includes HADARA local state. |
| Evidence | Public evidence must be reduced and safe to commit. | Evidence files do not contain private logs or secrets. |
| Commands | Do not run dangerous or destructive commands unless explicitly requested and approved. | Risky commands are recorded in task evidence. |

## Special Checks

| Check Type | Add To | When Required |
|---|---|---|
| Security smoke | \`docs/TEST_STRATEGY.md\` | The project has documented security boundaries. |
| Secret scan | \`docs/TEST_STRATEGY.md\` | The project handles credentials, tokens, private logs, or environment dumps. |
| Permission review | Task Capsule evidence | A change modifies write, delete, publish, or deploy behavior. |
`;
}

function createTestStrategyDoc(): string {
  return `# TEST_STRATEGY

## Current Validation Environment

| Field | Value |
|---|---|
| Primary Environment | TBD |
| Package Manager | TBD |
| Runtime | TBD |
| Notes | Describe normal validation constraints for this project. |

## Suites

| Suite | Command | Purpose | Required For Done |
|---|---|---|---|
| Unit | TBD | Fast checks for local logic. | TBD |
| Integration | TBD | Cross-module or external-boundary checks when they exist. | TBD |
| Full | TBD | The strongest routine validation command for task completion. | TBD |

## Required Session Checks

| Step | Check | Evidence Location |
|---|---|---|
| 1 | Run the relevant suite from the table above. | Task Capsule \`EVIDENCE.md\` |
| 2 | Record meaningful evidence in the Task Capsule. | Task Capsule \`EVIDENCE.md\` and \`evidence.jsonl\` |
| 3 | Finalize Task Capsule docs and tracked state docs before close. | Task Capsule docs and tracked state docs |
| 4 | Run \`hadara task status --task <task-id> --json\` when you need a compact phase check or next action. | Task Capsule docs and evidence |
| 5 | Run \`hadara task finalize --task <task-id> --execute --auto --json\` for the ordinary guarded close path; use a reviewed \`--plan-hash\` only for external review flows. | Task Capsule close evidence |
| 6 | Use \`hadara task status --task <task-id> --detail full --json\` when debugging readiness or close-proof blockers. | Task Capsule evidence |

## Diagnostic Checks

| Check | Command | When To Use |
|---|---|---|
| Task Capsule format | \`hadara harness validate --task <task-id> --level done --json\` | \`task finalize\` or \`task status --detail full\` reports done-level validation failures. |
| Evidence index | \`hadara evidence lint --task <task-id> --json\` | Evidence files were touched manually by mistake or evidence drift is suspected. |

## Special-Case Checks

| Check Type | Add Only When |
|---|---|
| Security smoke | The project has documented security boundaries or secret-handling behavior. |
| Release smoke | The project has documented release or package behavior. |
| Install smoke | The project has documented installer or deployment behavior. |
| Integration smoke | The project has documented external integration surfaces. |
`;
}

function createRoadmapDoc(): string {
  return `# ROADMAP

## Near Term

| Order | Item | Purpose | Done Evidence |
|---|---|---|---|
| 1 | Define the first Task Capsule | Establish the first concrete work unit. | Task Capsule exists and is referenced from \`docs/TASK_BOARD.md\`. |
| 2 | Attach first evidence | Verify that evidence flow works. | \`EVIDENCE.md\` and \`evidence.jsonl\` contain a meaningful check. |
| 3 | Update handoff | Make continuation safe across sessions. | \`docs/AGENT_HANDOFF.md\` reflects current state. |

## Deferred

| Item | Reason Deferred | Revisit When |
|---|---|---|
`;
}

function createTaskWorkflowCommandsDoc(): string {
  return `# TASK_WORKFLOW_COMMANDS

HADARA task workflow commands are split by responsibility. Similar-looking commands are not interchangeable: some only report state, some check readiness, some perform bounded bookkeeping writes, and some append close evidence.

## Required Reading Tier

\`docs/TASK_WORKFLOW_COMMANDS.md\` is \`task-work\` required reading. Read it when selecting, implementing, finishing, closing, auditing, or changing task workflow commands; do not treat it as a historical archive or a replacement for current-state docs. Start from \`.hadara/context/HADARA_CONTEXT.md\` and compact state docs, then use this document for lifecycle command semantics.

## Standard Task Loop

From 0.4 onward, agents should use the status-first finalize loop for ordinary implementation capsules:

\`\`\`bash
hadara task status --json

# If a matching capsule already exists:
hadara task status --task T-XXXX --json
hadara session start --task T-XXXX --json

# If no matching capsule exists, create one first:
hadara task create "task title" --json
hadara task status --task T-XXXX --json
hadara session start --task T-XXXX --json

# Do the scoped work.

# If this task changes roadmap/development slice state:
hadara slice list --json
hadara slice set --id M1 --status done --done-evidence ev:T-XXXX:... --json

hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --idempotency-key "command:T-XXXX:check" --json

# Finalize Task Capsule docs and tracked state docs before closing.

hadara task finalize --task T-XXXX --json
hadara task finalize --task T-XXXX --execute --auto --json
hadara task finalize --task T-XXXX --execute --plan-hash sha256:... --json
\`\`\`

\`task finalize --json\` is the reviewed dry-run. It reports the current lifecycle step, write boundaries, expected write paths, and a current \`planHash\`. \`task finalize --execute --auto\` performs that review and current-plan verification internally for the ordinary clean path. \`task finalize --execute --plan-hash ...\` is still available when a human or external automation explicitly carries a reviewed dry-run plan.

Low-level proof-boundary command surfaces were removed in 0.4.1-rc.0 and now return structured redirect stubs:

\`\`\`bash
hadara task status --task T-XXXX --detail full --json
hadara task finalize --task T-XXXX --json
hadara task finalize --task T-XXXX --execute --auto --json
\`\`\`

\`task finish\`, \`task ready\`, \`task close\`, \`task audit-close\`, \`task complete\`, and \`task lifecycle\` are no longer the agent-facing cycle. \`task finalize\` owns the bounded finish/readiness/close/audit sequence internally.

The close model has three separate phases: validation proves readiness, close records the proof, and audit checks the already-recorded close evidence. Close evidence is excluded from the current validation loop because it is appended after validation; requiring it as a same-run precondition would create a fixed-point loop.

\`task finalize\` and \`task status --detail full\` include done-level Task Capsule validation. In the ordinary path, do not run \`validation run -- ... harness validate ...\` only to create a readiness proof: \`task finalize --execute --auto\` records that readiness evidence before appending close proof. Use \`hadara harness validate --task T-XXXX --level done --json\` directly only when debugging capsule format, status-history, acceptance, evidence, or handoff validation failures.

## Status Token And Ownership Policy

HADARA uses separate token families for persistent state, derived proof state, document registry state, and evidence outcomes. Do not collapse these families into a single Markdown \`Status\` field.

### TaskStatus

\`TaskStatus\` is persistent task lifecycle state in \`TASK.md\` metadata, the \`## Status\` section, Status History rows, and the command-owned cells of \`docs/TASK_BOARD.md\`.

| Token | Meaning | Writer |
|---|---|---|
| \`Draft\` | Task capsule exists but implementation is not started or not yet ready for done-level validation. | \`task create\`, worker docs |
| \`In Progress\` | Work is actively being performed. | Worker docs |
| \`Blocked\` | Work cannot proceed without a recorded blocker. | Worker docs |
| \`Done\` | Scoped work is implemented and ready for done-level validation/close. | \`task finalize --execute --auto\` |
| \`Partial\` | Deliberate partial completion with remaining scope deferred or split. | Worker/coordinator docs |
| \`Superseded\` | Task has been replaced by another task or line. | Worker/coordinator docs |
| \`Archived\` | Task is no longer active state and is retained only for history. | Worker/coordinator docs |

Reserved non-TaskStatus strings include \`Closed\`, \`Ready\`, \`Approved\`, \`Complete\`, \`closed-valid\`, \`not-closed\`, and phrases such as \`Done pending lifecycle close\`. Use \`TaskStatus: Done\`; get close proof state from \`task status --detail full\`, \`task finalize\`, or \`state verify\` read models.

### CloseState

\`CloseState\` is derived proof state from close evidence and finalize/status read models; it is not written as persistent \`TaskStatus\` and should not be stored in task-local \`HANDOFF.md\` current-state tables.

| Canonical Token | Meaning |
|---|---|
| \`not-closed\` | No valid close proof has been recorded. |
| \`closed-valid\` | Close evidence exists and audit reports current/fresh proof. |
| \`closed-stale\` | Close evidence exists but source or validation hashes drifted after close. |
| \`closed-invalid\` | Close-like evidence exists but audit reports invalid shape, failed result, or mismatch. |
| \`unknown\` | The projection cannot determine close state. |

Current compatibility read models may expose more specific diagnostic values such as \`close-evidence-found-invalid\`, \`close-evidence-malformed\`, or \`closed-with-drift-warnings\`. Treat those as CloseState diagnostics, not TaskStatus values.

### DocStatus

\`DocStatus\` is stored in the document registry only.

| Token | Meaning |
|---|---|
| \`canonical\` | Core scaffold/current-state document. |
| \`active\` | Active working document or task-work document. |
| \`reference\` | Conditional reference document. |
| \`historical\` | Historical context, never default required reading. |
| \`superseded\` | Replaced by another registered document. |
| \`archived\` | Retained only as archive candidate/history. |

### EvidenceOutcome

Evidence outcome tokens are \`passed\`, \`failed\`, \`blocked\`, and \`unknown\`. Failed or blocked evidence must remain visible; add newer evidence that explains the fix or residual risk instead of editing old records.

### Write Ownership

| Surface | Ownership |
|---|---|
| \`TASK.md\` status metadata, \`## Status\`, and Status History | Command-owned for finalize bookkeeping; worker-owned before finalize. |
| \`docs/TASK_BOARD.md\` ID/title/status/capsule cells | Command-owned by \`task finalize\`; Notes and extra cells are mixed/human-owned. |
| \`EVIDENCE.md\` and \`evidence.jsonl\` | Evidence writer-owned; do not hand-edit \`evidence.jsonl\`. Treat \`evidence.jsonl\` as canonical and \`EVIDENCE.md\` as a non-canonical human summary; evidence rebuild is not implemented in this scaffold and any future execute mode must be dry-run-first and before-hash guarded. |
| \`HANDOFF.md\` managed current-state table | Managed/mixed; persist \`TaskStatus\` only. \`CloseState\` is derived by status/finalize/state read models and should not be written into close-source handoff tables. |
| Shared state docs | Mixed/human-owned; update before close when they are close-source relevant. |
| \`.hadara/docs-registry.json\` and \`docs/DOC_REGISTRY.md\` | Docs registry-owned; registry mutations should stay dry-run-first or explicitly scoped. |

Before finalize execute, finish all close-source edits: Task Capsule docs, acceptance/tests/handoff notes, evidence summaries, \`docs/TASK_BOARD.md\`, and tracked state docs such as \`docs/PROJECT_STATE.md\`, \`docs/AGENT_HANDOFF.md\`, and roadmap/slice docs when they apply. After \`task finalize --execute --auto\` or \`task finalize --execute --plan-hash ...\` reaches close proof, changing those documents changes the close source hash and requires rerunning finalize. Do not paste volatile close evidence ids into close-source docs; prefer stable wording such as "close evidence appended; audit returned closed-valid".

## Documentation Timing and Write Coordination

Do not defer all documentation until after implementation. Keep \`PLAN.md\` current before execution; update \`DECISIONS.md\`, \`RISKS.md\`, and \`FILES.md\` during execution; update \`TESTS.md\` and \`EVIDENCE.md\` immediately after validation; update \`ACCEPTANCE.md\`, \`HANDOFF.md\`, and shared state docs before finalize execute; and update shared close-source docs before the close-source hash is captured.

Parallelize read-only discovery, \`rg\`/file inspection, independent validation commands, package or registry metadata inspection, read-only diagnostics, and draft preparation before writes.

Serialize same-file writes, evidence append, Task Capsule doc writes, Task Board writes, Project State writes, Agent Handoff writes, before-hash execute operations, \`task finalize --execute\`, and release artifact or publish operations.

## Command Semantics

| Command | Default Write Behavior | Notes |
|---|---|---|
| \`task status\` | Read-only | Without \`--task\`, selects next work. With \`--task\`, default output is a fast loop cockpit; use \`--detail full\` or \`task finalize\` for close-grade readiness diagnostics. |
| \`task create\` | Write | Creates a Draft Task Capsule and Task Board row. It does not imply the task is ready or done. |
| \`evidence add-command\` | Write | Appends operator-supplied command-log evidence. It does not execute shell commands or capture stdout/stderr; optional \`--category\`/\`--outcome\`/\`--resolves\`/\`--supersedes\` enrich v2 metadata, result/outcome mismatches are rejected, and optional \`--idempotency-key\` prevents duplicate same-key records. |
| \`validation run\` | Execute + evidence append | Runs a real command and records validation evidence. If the wrapper cannot launch the command in the current environment, run the command directly and record the direct result with \`validation run --direct-result\`. |
| \`task next\` / \`task show\` | Removed redirect stubs | Prefer \`task status --json\` and \`task status --task T-XXXX --json\`. |
| \`task lifecycle\` | Removed redirect stub | Prefer \`task status --task T-XXXX --json\`. |
| \`task finalize\` | Read-only by default; guarded execute uses \`--auto\` or \`--plan-hash\` | Default agent close path. Rechecks the current plan, records readiness evidence in the \`--auto\` close path when needed, executes phases serially, stops on blockers, and succeeds only after final audit is \`closed-valid\`. |
| \`task finish\` / \`task ready\` / \`task close\` / \`task audit-close\` | Removed redirect stubs | Use \`task status --detail full\` for diagnostics and \`task finalize\` for close execution. |
| \`task complete\` | Removed redirect stub | Prefer \`task status\` and \`task finalize\` for current agent flows. |

## Non-Overlap Rules

- \`task status --json\` chooses work; it does not create a capsule or infer completion.
- \`task status\` is an operator console; \`ok: true\` means report generation succeeded, not that the task is ready.
- Readiness diagnostics are exposed through \`task status --detail full\` and \`task finalize --json\`.
- \`harness validate\` is a direct diagnostic for Task Capsule structure and done-level gates; it is not a replacement for close evidence and is not required as a separate evidence wrapper before ordinary \`task finalize --execute --auto\`.
- \`task complete\` and \`task lifecycle\` are removed redirect stubs. Prefer \`task status\` and \`task finalize\`.
- \`task finalize\` is read-only by default and owns close-proof repair planning. Guarded execute uses \`--auto\` or a matching current dry-run \`planHash\`, runs phases serially, stops on blockers, and returns success only after the final audit is \`closed-valid\`.
- \`evidence list\` is the supported evidence id discovery surface. Text output shows \`[id] time | category/outcome | visibility | summary\`; JSON records expose \`id\`, \`idSource\`, \`idStability\`, \`persistedSchemaVersion\`, \`category\`, \`outcome\`, and \`tags\`. Use durable persisted \`ev:\` ids for long-lived \`--resolves\` and \`--supersedes\` references. Legacy compatibility ids are inspection-only and are not the preferred durable reference.
- \`evidence add-command\` records an operator-supplied command result; it does not run the command. \`--category\` and \`--outcome\` set persisted v2 metadata explicitly, while \`--result\` remains the legacy-compatible command result. When both are supplied, \`--result\` must match \`--outcome\` for \`passed\`, \`failed\`, \`blocked\`, and \`unknown\`; \`recorded\` and \`not-applicable\` require \`--result unknown\` or no explicit \`--result\`. \`--resolves\` and \`--supersedes\` append exact v2 resolution tags from passed or recorded follow-up evidence. \`--idempotency-key\` is optional; when supplied, same-key repeats return the existing record without appending duplicate Markdown or JSONL rows.
- Evidence v2 deferred scope remains explicit: rebuild preview/execute, \`check-id\`, \`subject\`, and a new add-command report schema id are future candidates. Do not infer those commands or schema changes from the current \`evidence list\` and \`evidence add-command\` ergonomics.
- Finalize may update only the bounded Task Capsule status bookkeeping, the matching \`docs/TASK_BOARD.md\` row's command-owned cells, and close evidence append. It must not update handoff, Project State, roadmap docs, or arbitrary evidence after the close-source hash is captured.
- After close proof is recorded, close-source document edits intentionally invalidate the previous close proof. Make those edits before finalize execute, or rerun finalize if the edit is unavoidable.

## State Documents

\`task finalize --execute --auto\` and \`task finalize --execute --plan-hash <hash>\` deliberately preserve narrow write boundaries; they do not update broad prose state beyond bounded status bookkeeping and close evidence. Operators still update \`docs/PROJECT_STATE.md\`, \`docs/AGENT_HANDOFF.md\`, and any roadmap/slice docs generated for the selected profile before finalize when the task changes project state.
`;
}

function createAgentsDoc(spec: InitProfileSpec): string {
  const requiredReadingRows = [
    ['`.hadara/context/HADARA_CONTEXT.md`', 'Every session', 'Compact project-local context anchor and read-routing guide.'],
    ['`docs/PROJECT_STATE.md`', 'Every session', 'Current state, active work, known problems, and next recommended step.'],
    ['`docs/TASK_BOARD.md`', 'Every session', 'Task queue, task status, and capsule paths.'],
    ['`docs/HADARA_WORKFLOW.md`', 'Every session; whenever using HADARA CLI workflow commands', 'Project start, task lifecycle, evidence, context, document timing, repair, and useful CLI guidance.']
  ];
  if (spec.docs.agentHandoff) requiredReadingRows.push(['`docs/AGENT_HANDOFF.md`', 'When present in governed or long-running projects', 'Compact continuation handoff and current coordination notes.']);
  if (spec.docs.architecture) requiredReadingRows.push(['`docs/ARCHITECTURE.md`', 'Architecture, component, or boundary work', 'Current system shape and ownership boundaries.']);
  if (spec.docs.decisions) requiredReadingRows.push(['`docs/DECISIONS.md`', 'Project-level decision work', 'Durable project decisions.']);
  if (spec.docs.securityModel) requiredReadingRows.push(['`docs/SECURITY_MODEL.md`', 'Security, secret, permission, or evidence-safety work', 'Project security invariants.']);
  if (spec.docs.roadmap) requiredReadingRows.push(['`docs/ROADMAP.md`', 'Roadmap, milestone, or scope planning', 'Longer-term priorities and deferred work.']);
  requiredReadingRows.push(
    ['Active `tasks/T-*/TASK.md`', 'Every task-work session', 'Task scope, source documents, plan, acceptance, validation, and change summary.'],
    ['Active Task Capsule `HANDOFF.md` and `EVIDENCE.md`', 'Resuming, validating, finishing, or handing off a task', 'Continuation guidance and human-readable evidence projection.'],
    ['Project-specific docs referenced by the task, registry, or read-map', 'When referenced', 'Task-specific architecture, design, roadmap, validation, security, or integration constraints.']
  );

  return `# AGENTS

This repository uses the HADARA protocol for scoped, evidenced, resumable AI-assisted development.

## Required Reading

| Document | When to Read | Purpose |
|---|---|---|
${requiredReadingRows.map(formatTableRow).join('\n')}

\`AGENTS.md\` owns Required Reading. \`.hadara/context/HADARA_CONTEXT.md\` is a compact routing anchor that points to current-state and workflow documents; it is not a second Required Reading authority.

## Required Reading Tiers

| Tier | Meaning | Default Read Behavior |
|---|---|---|
| \`current-state\` | Compact docs that establish live project state and route deeper reading. | Read first at session start or resume. |
| \`workflow\` | Shared HADARA workflow and command-use guidance. | Read before selecting, creating, implementing, finishing, closing, or auditing tasks. |
| \`task-work\` | Active Task Capsule docs and task-local evidence/handoff surfaces. | Read when working inside a task. |
| \`conditional-reference\` | Architecture, roadmap, decisions, validation, security, integration, or project-specific specs. | Read only when the task or read-map points to them. |
| \`historical\` | Completed-task history and older validation records. | Do not read by default; use only when investigating history. |
| \`excluded\` | Superseded, archived, local-only, or intentionally non-default material. | Do not read unless explicitly reclassified. |

## Operating Rules

- Work inside one Task Capsule whenever possible.
- If no suitable Task Capsule exists, create one through the HADARA workflow before implementation.
- Prefer HADARA read models before broad manual file reading.
- Keep committed state reproducible and project-local.
- Do not write secrets, private logs, raw transcripts, credentials, or machine-local state into committed files.
- Do not hand-edit canonical evidence logs.
- Do not mark work done without evidence.
- Keep Task Capsule docs current as work changes; do not defer all documentation until after implementation.
- Do not execute destructive commands.
- Do not run release, publish, package, installer, or other external mutation workflows without explicit operator approval.

## Workflow Reference

Use \`docs/HADARA_WORKFLOW.md\` for project start, task lifecycle, context, evidence, document timing, repair, docs read-map, and useful CLI guidance.

## Project Context

Use \`.hadara/context/HADARA_CONTEXT.md\` as the compact project-local context anchor.
`;
}

function formatInlineList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function createGitignoreDoc(): string {
  return `node_modules/
dist/
coverage/
*.log

# Python and test artifacts
__pycache__/
*.py[cod]
*$py.class
.pytest_cache/
.mypy_cache/
.ruff_cache/
.coverage
htmlcov/
.venv/
venv/
env/
*.db
*.sqlite
*.sqlite3

# HADARA local/private state
.hadara/local/
.hadara/tmp/
.hadara/cache/

# Environment and machine-local files
.env
.env.*
.DS_Store
Thumbs.db
`;
}
