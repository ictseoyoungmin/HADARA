import fs from 'node:fs';
import path from 'node:path';
import { resolveHadaraPaths } from '../core/paths';
import { ensureDir, writeFileIfMissing } from '../core/fs';
import { getFlag, getRequiredStringOption, getStringOption } from './args';
import { DOCS_REGISTRY_PATH, createHadaraContextDoc, createSeedDocumentRegistry, registryJson, renderDocRegistryMarkdown } from '../services/docs-registry';
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
    generatedDocsDescription: 'Core session docs plus task workflow commands',
    intendedUse: 'Small projects that need Task Capsules, evidence, and handoff discipline without planning overhead.',
    specialNotes: 'SOP required reading references core docs, task workflow docs, and active Task Capsule docs.',
    docs: {
      architecture: false,
      developmentSlices: false,
      decisions: false,
      refactorLog: false,
      securityModel: false,
      testStrategy: false,
      roadmap: false
    }
  },
  standard: {
    profile: 'standard',
    generatedDocsDescription: 'Core docs plus planning, architecture, decision, and validation docs',
    intendedUse: 'Most multi-session projects that need roadmap slices and repeatable validation.',
    specialNotes: 'Default profile. Optional integrations must be registered before agents rely on them.',
    docs: {
      architecture: true,
      developmentSlices: true,
      decisions: true,
      refactorLog: false,
      securityModel: false,
      testStrategy: true,
      roadmap: false
    }
  },
  governed: {
    profile: 'governed',
    generatedDocsDescription: 'Standard docs plus security, refactor log, and roadmap docs',
    intendedUse: 'Long-lived projects with stronger governance, security boundaries, refactor history, or roadmap-level planning.',
    specialNotes: 'Project-specific contracts still must be manually registered in the SOP when they become real.',
    docs: {
      architecture: true,
      developmentSlices: true,
      decisions: true,
      refactorLog: true,
      securityModel: true,
      testStrategy: true,
      roadmap: true
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
  if (subcommand === 'doctor') {
    printInitFollowUpReport(createInitDoctorReport(input.projectRoot), input.jsonOutput);
    return true;
  }
  if (subcommand === 'upgrade') {
    const profile = parseInitProfile(getRequiredStringOption(input.args, '--profile'));
    const report = createInitUpgradeReport(input.projectRoot, profile, getInitFollowUpMode(input.args));
    printInitFollowUpReport(report, input.jsonOutput);
    return true;
  }
  if (subcommand === 'register-doc') {
    const report = createRequiredReadingRegistrationReport(input.projectRoot, {
      documentPath: getRequiredStringOption(input.args, '--path'),
      when: getRequiredStringOption(input.args, '--when'),
      purpose: getRequiredStringOption(input.args, '--purpose'),
      mode: getInitFollowUpMode(input.args),
      requireExists: getFlag(input.args, '--require-exists')
    });
    printInitFollowUpReport(report, input.jsonOutput);
    return true;
  }
  if (subcommand === 'enable-integration') {
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

function getInitFollowUpMode(args: string[]): InitFollowUpMode {
  return getFlag(args, '--execute') ? 'execute' : 'dry-run';
}

function createGeneratedScaffoldFiles(profile: InitProfile): GeneratedScaffoldFile[] {
  const spec = INIT_PROFILE_SPECS[profile];
  const docsRegistry = createSeedDocumentRegistry(profile);
  const files: GeneratedScaffoldFile[] = [
    { path: '.hadara/context/HADARA_CONTEXT.md', content: createHadaraContextDoc(profile) },
    { path: '.hadara/docs-registry.json', content: registryJson(docsRegistry) },
    { path: 'docs/DOC_REGISTRY.md', content: renderDocRegistryMarkdown(docsRegistry) },
    { path: 'docs/PROJECT_STATE.md', content: createProjectStateDoc(profile) },
    { path: 'docs/TASK_BOARD.md', content: createTaskBoardDoc() },
    { path: 'docs/AGENT_HANDOFF.md', content: createAgentHandoffDoc() },
    { path: 'docs/IMPLEMENTATION_SOP.md', content: createImplementationSopDoc(spec) },
    { path: 'docs/TASK_WORKFLOW_COMMANDS.md', content: createTaskWorkflowCommandsDoc() },
    { path: 'AGENTS.md', content: createAgentsDoc(spec) },
    { path: '.gitignore', content: createGitignoreDoc() }
  ];
  if (spec.docs.architecture) files.push({ path: 'docs/ARCHITECTURE.md', content: createArchitectureDoc(profile) });
  if (spec.docs.developmentSlices) files.push({ path: 'docs/DEVELOPMENT_SLICES.md', content: createDevelopmentSlicesDoc() });
  if (spec.docs.decisions) files.push({ path: 'docs/DECISIONS.md', content: createDecisionsDoc() });
  if (spec.docs.refactorLog) files.push({ path: 'docs/REFACTOR_LOG.md', content: createRefactorLogDoc() });
  if (spec.docs.securityModel) files.push({ path: 'docs/SECURITY_MODEL.md', content: createSecurityModelDoc() });
  if (spec.docs.testStrategy) files.push({ path: 'docs/TEST_STRATEGY.md', content: createTestStrategyDoc() });
  if (spec.docs.roadmap) files.push({ path: 'docs/ROADMAP.md', content: createRoadmapDoc() });
  return files;
}

function createInitDoctorReport(projectRoot: string): InitFollowUpReport {
  const issues: InitIssue[] = [];
  const actions: InitAction[] = [];
  const requiredCore = ['AGENTS.md', '.gitignore', '.hadara/context/HADARA_CONTEXT.md', 'docs/PROJECT_STATE.md', 'docs/AGENT_HANDOFF.md', 'docs/TASK_BOARD.md', 'docs/IMPLEMENTATION_SOP.md', 'docs/TASK_WORKFLOW_COMMANDS.md'];
  for (const relativePath of requiredCore) {
    if (!fs.existsSync(path.join(projectRoot, relativePath))) {
      issues.push({ severity: 'error', code: 'INIT_CORE_DOC_MISSING', path: relativePath, message: `${relativePath} is missing from the init scaffold.` });
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

  const sop = readProjectText(projectRoot, 'docs/IMPLEMENTATION_SOP.md');
  if (sop !== null && mentionsLegacyInitProfile(sop)) {
    issues.push({ severity: 'warning', code: 'INIT_OLD_PROFILE_NAME', path: 'docs/IMPLEMENTATION_SOP.md', message: 'SOP mentions old init profile names.' });
  }

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
  const row = formatTableRow([`\`${relativePath}\``, input.when, input.purpose]);
  const plan = createSopRowUpdatePlan(projectRoot, {
    command: 'init.register-doc',
    mode: input.mode,
    requireExists: input.requireExists ?? false,
    row,
    relativePath,
    action: 'register-doc',
    plannedSummary: `${relativePath} would be registered in SOP Required Reading.`,
    createdSummary: `${relativePath} was registered in SOP Required Reading.`,
    existsSummary: `${relativePath} is already registered in SOP Required Reading.`
  });
  if (input.mode === 'execute' && plan.ok && plan.write !== undefined) {
    plan.issues.push(...writeFilesAtomically(projectRoot, [plan.write]));
  }
  return {
    schemaVersion: 'hadara.init.followup.v1',
    command: 'init.register-doc',
    ok: plan.issues.every((issue) => issue.severity !== 'error'),
    mode: input.mode,
    actions: plan.actions,
    issues: plan.issues
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
  const registration = createSopRowUpdatePlan(projectRoot, {
    command: 'init.enable-integration',
    mode: input.mode,
    allowMissingDocument: true,
    row: formatTableRow([`\`${relativePath}\``, `${integration.toUpperCase()} integration work only`, `Project-specific optional ${integration.toUpperCase()} integration guidance registration. This does not enable runtime behavior.`]),
    relativePath,
    action: 'enable-integration-registration',
    plannedSummary: `${relativePath} would be registered in SOP Required Reading.`,
    createdSummary: `${relativePath} was registered in SOP Required Reading.`,
    existsSummary: `${relativePath} is already registered in SOP Required Reading.`
  });

  if (!registration.ok) {
    return {
      schemaVersion: 'hadara.init.followup.v1',
      command: 'init.enable-integration',
      ok: false,
      summary: 'This command registers project guidance only; it does not enable Hermes/MCP runtime behavior.',
      mode: input.mode,
      integration,
      actions: registration.actions,
      issues: registration.issues
    };
  }

  if (fs.existsSync(fullPath)) {
    actions.push({ action: 'enable-integration-doc', path: relativePath, status: 'exists', summary: `${relativePath} already exists and will not be overwritten.` });
  } else if (input.mode === 'execute') {
    issues.push(...writeFilesAtomically(projectRoot, [
      { path: relativePath, content },
      ...(registration.write === undefined ? [] : [registration.write])
    ]));
    actions.push({ action: 'enable-integration-doc', path: relativePath, status: 'created', summary: `${relativePath} was created.` });
  } else {
    actions.push({ action: 'enable-integration-doc', path: relativePath, status: 'planned', summary: `${relativePath} would be created.` });
  }
  return {
    schemaVersion: 'hadara.init.followup.v1',
    command: 'init.enable-integration',
    summary: 'This command registers project guidance only; it does not enable Hermes/MCP runtime behavior.',
    ok: issues.every((issue) => issue.severity !== 'error') && registration.ok,
    mode: input.mode,
    integration,
    actions: [...actions, ...registration.actions],
    issues: [...issues, ...registration.issues]
  };
}

function createSopRowUpdatePlan(
  projectRoot: string,
  input: {
    command: string;
    mode: InitFollowUpMode;
    requireExists?: boolean;
    allowMissingDocument?: boolean;
    row: string;
    relativePath: string;
    action: string;
    plannedSummary: string;
    createdSummary: string;
    existsSummary: string;
  }
): { ok: boolean; actions: InitAction[]; issues: InitIssue[]; write?: InitWriteOperation } {
  const actions: InitAction[] = [];
  const issues: InitIssue[] = [];
  const sopPath = path.join(projectRoot, 'docs', 'IMPLEMENTATION_SOP.md');
  const sop = fs.existsSync(sopPath) ? fs.readFileSync(sopPath, 'utf8') : null;
  if (sop === null) {
    issues.push({ severity: 'error', code: 'INIT_SOP_MISSING', path: 'docs/IMPLEMENTATION_SOP.md', message: 'SOP Required Reading table cannot be updated because IMPLEMENTATION_SOP.md is missing.' });
    return { ok: false, actions, issues };
  }
  if (!input.allowMissingDocument && !fs.existsSync(path.join(projectRoot, input.relativePath))) {
    issues.push({
      severity: input.requireExists ? 'error' : 'warning',
      code: 'INIT_REGISTERED_DOC_MISSING',
      path: input.relativePath,
      message: `${input.relativePath} does not exist yet.`
    });
  }
  if (sop.includes(`\`${input.relativePath}\``)) {
    actions.push({ action: input.action, path: 'docs/IMPLEMENTATION_SOP.md', status: 'exists', summary: input.existsSummary });
    return { ok: true, actions, issues };
  }
  if (!sop.includes('| Document | When to Read | Purpose |')) {
    issues.push({ severity: 'error', code: 'INIT_REQUIRED_READING_TABLE_MISSING', path: 'docs/IMPLEMENTATION_SOP.md', message: 'SOP Required Reading table header was not found.' });
    return { ok: false, actions, issues };
  }
  if (issues.some((issue) => issue.severity === 'error')) {
    return { ok: false, actions, issues };
  }
  if (input.mode === 'execute') {
    actions.push({ action: input.action, path: 'docs/IMPLEMENTATION_SOP.md', status: 'created', summary: input.createdSummary });
    return {
      ok: issues.every((issue) => issue.severity !== 'error'),
      actions,
      issues,
      write: { path: 'docs/IMPLEMENTATION_SOP.md', content: insertRequiredReadingRow(sop, input.row) }
    };
  } else {
    actions.push({ action: input.action, path: 'docs/IMPLEMENTATION_SOP.md', status: 'planned', summary: input.plannedSummary });
  }
  return {
    ok: issues.every((issue) => issue.severity !== 'error'),
    actions,
    issues
  };
}

const CANONICAL_TABLE_HEADERS: Record<string, string[]> = {
  'AGENTS.md': ['| Order | Document | When | Purpose |', '| Rule | Requirement | Evidence / Update Location |'],
  'docs/PROJECT_STATE.md': ['| Field | Value |', '| Area | Status | Notes |', '| Source | Path | Purpose |'],
  'docs/AGENT_HANDOFF.md': ['| Area | State | Notes |', '| Task | Summary | Evidence |', '| Issue | Impact | Next Step |', '| Step | Reason | Done Evidence |', '| Check | Latest Evidence | Notes |', '| History Type | Path | When to Use |'],
  'docs/TASK_BOARD.md': ['| ID | Title | Status | Capsule | Notes |'],
  'docs/IMPLEMENTATION_SOP.md': ['| Document | When to Read | Purpose |', '| Profile | Scale | Generated Docs | Intended Use | Special Notes |', '| Document | Required Structure |'],
  'docs/TASK_WORKFLOW_COMMANDS.md': ['| Command | Default Write Behavior | Notes |'],
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
    'docs/IMPLEMENTATION_SOP.md',
    mergeSopProfileMetadata(readProjectText(projectRoot, 'docs/IMPLEMENTATION_SOP.md'), profile),
    `docs/IMPLEMENTATION_SOP.md profile text and Required Reading rows ${mode === 'execute' ? 'were updated' : 'would be updated'} for ${profile}.`
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

function mergeSopProfileMetadata(content: string | null, profile: InitProfile): string | null {
  if (content === null) return null;
  let next = content
    .replace(/This project was initialized with the `(basic|standard|governed)` HADARA profile\./, `This project uses the \`${profile}\` HADARA profile.`)
    .replace(/This project uses the `(basic|standard|governed)` HADARA profile\./, `This project uses the \`${profile}\` HADARA profile.`);
  for (const row of sopRequiredReadingRowsForProfile(profile)) {
    const documentPath = row[0].replace(/`/g, '');
    if (!next.includes(`\`${documentPath}\``)) {
      next = insertRequiredReadingRow(next, formatTableRow(row));
    }
  }
  return next;
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

function sopRequiredReadingRowsForProfile(profile: InitProfile): string[][] {
  const rows = [
    ['`docs/PROJECT_STATE.md`', 'Every session', 'Current product state and source-of-truth map.'],
    ['`docs/AGENT_HANDOFF.md`', 'Every session', 'Compact handoff and next recommended step.'],
    ['`docs/TASK_BOARD.md`', 'Every session', 'Work queue and task status.'],
    ['`docs/IMPLEMENTATION_SOP.md`', 'Every session', 'Local HADARA workflow rules and project-specific required-reading registry.'],
    ['`docs/TASK_WORKFLOW_COMMANDS.md`', 'Starting, finishing, closing, auditing, or explaining task workflow commands', 'Standard task loop, dry-run boundaries, and command `ok` semantics.']
  ];
  if (profile === 'standard' || profile === 'governed') {
    rows.push(
      ['`docs/ARCHITECTURE.md`', 'Architecture, component, or boundary work', 'Current system shape and ownership boundaries.'],
      ['`docs/DEVELOPMENT_SLICES.md`', 'Starting, completing, or reclassifying slices', 'Roadmap ordering and completion evidence.'],
      ['`docs/DECISIONS.md`', 'Project-level decision work', 'Durable decisions that affect architecture or workflow.'],
      ['`docs/TEST_STRATEGY.md`', 'Validation planning or completion checks', 'Routine suites and special-case smoke boundaries.']
    );
  }
  if (profile === 'governed') {
    rows.push(
      ['`docs/SECURITY_MODEL.md`', 'Security, secret, permission, or evidence-safety work', 'Project security invariants and special checks.'],
      ['`docs/ROADMAP.md`', 'Roadmap, milestone, or scope planning', 'Longer-term priorities and deferred work.']
    );
  }
  return rows;
}

function agentsRequiredReadingRowsForProfile(profile: InitProfile): Array<{ document: string; when: string; purpose: string }> {
  const rows: Array<{ document: string; when: string; purpose: string }> = [
    { document: '`docs/PROJECT_STATE.md`', when: 'Every session', purpose: 'Current product and capability state.' },
    { document: '`docs/AGENT_HANDOFF.md`', when: 'Every session', purpose: 'Compact continuation state.' },
    { document: '`docs/TASK_BOARD.md`', when: 'Every session', purpose: 'Current task queue and status.' },
    { document: '`docs/IMPLEMENTATION_SOP.md`', when: 'Every session', purpose: 'Local workflow and required-reading registry.' },
    { document: '`docs/TASK_WORKFLOW_COMMANDS.md`', when: 'Starting, finishing, closing, auditing, or explaining task workflow commands', purpose: 'Standard task loop, dry-run boundaries, and command `ok` semantics.' }
  ];
  if (profile === 'standard' || profile === 'governed') {
    rows.push(
      { document: '`docs/ARCHITECTURE.md`', when: 'Architecture, component, or boundary work', purpose: 'Current system shape and ownership boundaries.' },
      { document: '`docs/DEVELOPMENT_SLICES.md`', when: 'Starting, completing, or reclassifying a development slice', purpose: 'Roadmap ordering, prerequisites, and completion evidence.' },
      { document: '`docs/DECISIONS.md`', when: 'Project-level decision work', purpose: 'Durable project decisions.' },
      { document: '`docs/TEST_STRATEGY.md`', when: 'Validation planning or completion checks', purpose: 'Routine suites and special-case checks.' }
    );
  }
  if (profile === 'governed') {
    rows.push(
      { document: '`docs/SECURITY_MODEL.md`', when: 'Security, secret, permission, or evidence-safety work', purpose: 'Project security invariants.' },
      { document: '`docs/ROADMAP.md`', when: 'Roadmap, milestone, or scope planning', purpose: 'Longer-term priorities and deferred work.' }
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

  const sop = readProjectText(projectRoot, 'docs/IMPLEMENTATION_SOP.md');
  const sopProfile = sop?.match(/initialized with the `(basic|standard|governed)` HADARA profile/)?.[1] as InitProfile | undefined;
  if (sopProfile !== undefined && isLowerProfile(sopProfile, inferredProfile)) {
    issues.push({
      severity: 'warning',
      code: 'INIT_PROFILE_METADATA_MISMATCH',
      path: 'docs/IMPLEMENTATION_SOP.md',
      message: `SOP says ${sopProfile}, but ${inferredProfile}-level scaffold docs exist.`
    });
  }
  if (sop !== null) {
    for (const requiredPath of requiredDocsForProfile(inferredProfile)) {
      if (!sop.includes(`\`${requiredPath}\``)) {
        issues.push({
          severity: 'warning',
          code: 'INIT_PROFILE_METADATA_MISMATCH',
          path: 'docs/IMPLEMENTATION_SOP.md',
          message: `SOP Required Reading does not include ${requiredPath}, but ${inferredProfile}-level scaffold docs exist.`
        });
        break;
      }
    }
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
  if (['docs/SECURITY_MODEL.md', 'docs/REFACTOR_LOG.md', 'docs/ROADMAP.md'].some((relativePath) => fs.existsSync(path.join(projectRoot, relativePath)))) {
    return 'governed';
  }
  if (['docs/ARCHITECTURE.md', 'docs/DEVELOPMENT_SLICES.md', 'docs/DECISIONS.md', 'docs/TEST_STRATEGY.md'].some((relativePath) => fs.existsSync(path.join(projectRoot, relativePath)))) {
    return 'standard';
  }
  return 'basic';
}

function requiredDocsForProfile(profile: InitProfile): string[] {
  const docs = ['docs/PROJECT_STATE.md', 'docs/AGENT_HANDOFF.md', 'docs/TASK_BOARD.md', 'docs/IMPLEMENTATION_SOP.md', 'docs/TASK_WORKFLOW_COMMANDS.md'];
  if (profile === 'standard' || profile === 'governed') {
    docs.push('docs/ARCHITECTURE.md', 'docs/DEVELOPMENT_SLICES.md', 'docs/DECISIONS.md', 'docs/TEST_STRATEGY.md');
  }
  if (profile === 'governed') {
    docs.push('docs/SECURITY_MODEL.md', 'docs/ROADMAP.md');
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

function insertRequiredReadingRow(sop: string, row: string): string {
  const lines = sop.split('\n');
  const headerIndex = lines.findIndex((line) => line.trim() === '| Document | When to Read | Purpose |');
  if (headerIndex < 0) return sop;
  let insertAt = headerIndex + 2;
  while (insertAt < lines.length && lines[insertAt].startsWith('|')) insertAt += 1;
  lines.splice(insertAt, 0, row);
  return lines.join('\n');
}

function parseIntegration(value: string): 'hermes' | 'mcp' {
  if (value === 'hermes' || value === 'mcp') return value;
  throw new Error(`unsupported init integration: ${value}; expected hermes or mcp`);
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
| Registration | Keep this document registered in \`docs/IMPLEMENTATION_SOP.md\` before agents rely on it. |
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
| Registration | Keep this document registered in \`docs/IMPLEMENTATION_SOP.md\` before agents rely on it. |
| Runtime | This document is project guidance registration only; it does not enable MCP runtime behavior or change capability gates. |
| Scope | Treat MCP behavior as project-specific integration work, not generic HADARA init behavior. |
| Writes | Do not add MCP write tools without explicit project approval and safety evidence. |
`;
}

function createProjectStateDoc(profile: InitProfile): string {
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
| Next-session handoff | \`docs/AGENT_HANDOFF.md\` | Compact continuation state. |
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
    owner: 'handoff.update',
    kind: 'markdown-table',
    mode: 'update-row',
    version: 1,
    required: true,
    closeSourceRole: 'included'
  }, `| Area | State | Notes |
|---|---|---|
| Scaffold | Initialized | HADARA protocol scaffold is initialized. |
| Required Reading | Pending | Read \`PROJECT_STATE\`, \`AGENT_HANDOFF\`, \`TASK_BOARD\`, \`IMPLEMENTATION_SOP\`, and \`TASK_WORKFLOW_COMMANDS\` before starting. |
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
| Handoff | \`docs/AGENT_HANDOFF.md\` | Next-session continuation state. | Active |
`;
}

function createImplementationSopDoc(spec: InitProfileSpec): string {
  const sessionStart = [
    'Read `.hadara/context/HADARA_CONTEXT.md` as the compact project-local context anchor.',
    'Read `docs/PROJECT_STATE.md`.',
    'Read `docs/AGENT_HANDOFF.md`.',
    'Read `docs/TASK_BOARD.md`.',
    ...(spec.docs.developmentSlices
      ? ['Read `docs/DEVELOPMENT_SLICES.md` when the work may start, complete, or reclassify a roadmap slice.']
      : []),
    'Follow the Historical Index in `docs/AGENT_HANDOFF.md` when older completed-task or validation history is needed.',
    'Pick or create one Task Capsule. Create new capsules through `hadara task create <title>` by default.',
    'Read the active Task Capsule files before implementation.',
    'Read project-specific docs listed in the Required Reading table below.',
    'Summarize the current state from the required docs.',
    'Identify the active Task Capsule and explain why it fits the work.',
    'Propose or choose the smallest useful implementation slice.'
  ];

  const requiredReadingRows = [
    ['`.hadara/context/HADARA_CONTEXT.md`', 'Every session', 'Compact project-local context anchor and read-routing guide.'],
    ['`docs/PROJECT_STATE.md`', 'Every session', 'Current product state and source-of-truth map.'],
    ['`docs/AGENT_HANDOFF.md`', 'Every session', 'Compact handoff and next recommended step.'],
    ['`docs/TASK_BOARD.md`', 'Every session', 'Work queue and task status.'],
    ['`docs/IMPLEMENTATION_SOP.md`', 'Every session', 'Local HADARA workflow rules and project-specific required-reading registry.'],
    ['`docs/TASK_WORKFLOW_COMMANDS.md`', 'Starting, finishing, closing, auditing, or explaining task workflow commands', 'Standard task loop, dry-run boundaries, and command `ok` semantics.']
  ];
  if (spec.docs.architecture) {
    requiredReadingRows.push(['`docs/ARCHITECTURE.md`', 'Architecture, component, or boundary work', 'Current system shape and ownership boundaries.']);
  }
  if (spec.docs.developmentSlices) {
    requiredReadingRows.push(['`docs/DEVELOPMENT_SLICES.md`', 'Starting, completing, or reclassifying slices', 'Roadmap ordering and completion evidence.']);
  }
  if (spec.docs.decisions) {
    requiredReadingRows.push(['`docs/DECISIONS.md`', 'Project-level decision work', 'Durable decisions that affect architecture or workflow.']);
  }
  if (spec.docs.testStrategy) {
    requiredReadingRows.push(['`docs/TEST_STRATEGY.md`', 'Validation planning or completion checks', 'Routine suites and special-case smoke boundaries.']);
  }
  if (spec.docs.securityModel) {
    requiredReadingRows.push(['`docs/SECURITY_MODEL.md`', 'Security, secret, permission, or evidence-safety work', 'Project security invariants and special checks.']);
  }
  if (spec.docs.roadmap) {
    requiredReadingRows.push(['`docs/ROADMAP.md`', 'Roadmap, milestone, release, or scope planning', 'Longer-term priorities and deferred work.']);
  }
  requiredReadingRows.push(
    ['Active `tasks/T-*/TASK.md`', 'Working a task', 'Task-specific goal, scope, and status.'],
    ['Active Task Capsule docs', 'Working a task', '`DECISIONS.md`, `PLAN.md`, `CONTEXT.md`, `ACCEPTANCE.md`, `FILES.md`, `TESTS.md`, `RISKS.md`, and `HANDOFF.md`.']
  );
  const requiredReadingTable = managedSectionBlock('required-reading', {
    schema: 'hadara.managedSection.v1',
    owner: 'init.register-doc',
    kind: 'markdown-table',
    mode: 'insert-row',
    version: 1,
    required: true,
    closeSourceRole: 'included'
  }, `| Document | When to Read | Purpose |
|---|---|---|
${requiredReadingRows.map(formatTableRow).join('\n')}
`);

  const structureRows = [
    ['`AGENTS.md`', 'Required Reading and Rules sections.'],
    ['`docs/PROJECT_STATE.md`', 'Product, Current Phase, Current Status, and Single Source of Truth sections.'],
    ['`docs/AGENT_HANDOFF.md`', 'Current State, Last 3 Completed Tasks, Current Known Problems, Next Recommended Step, Validation Baseline, and Historical Index sections.'],
    ['`docs/TASK_BOARD.md`', 'One task table with ID, Title, Status, Capsule, and Notes columns.'],
    ['`docs/IMPLEMENTATION_SOP.md`', 'Session Start, Required Reading, Project-Specific Documents, Init Profile Matrix, Scaffold Document Structure, Implementation, Standard Task Workflow Loop, Validation, Evidence Records, Session End, and Handoff Compaction sections.'],
    ['`docs/TASK_WORKFLOW_COMMANDS.md`', 'Standard Task Loop, Command Semantics, Non-Overlap Rules, and State Documents sections.']
  ];
  if (spec.docs.architecture) structureRows.push(['`docs/ARCHITECTURE.md`', 'Overview, Boundaries, and Current Components sections.']);
  if (spec.docs.developmentSlices) structureRows.push(['`docs/DEVELOPMENT_SLICES.md`', 'Evidence-backed slice table with ordering and done evidence.']);
  if (spec.docs.decisions) structureRows.push(['`docs/DECISIONS.md`', 'Decision table with ID, Date, Decision, Status, Rationale, and Evidence columns.']);
  if (spec.docs.testStrategy) structureRows.push(['`docs/TEST_STRATEGY.md`', 'Current Validation Environment, Suites, Required Session Checks, and Special-Case Checks sections.']);
  if (spec.docs.securityModel) structureRows.push(['`docs/SECURITY_MODEL.md`', 'Default Mode, Invariants, and Special Checks sections.']);
  if (spec.docs.refactorLog) structureRows.push(['`docs/REFACTOR_LOG.md`', 'Format section with Date, Area, Change, Rationale, and Evidence columns.']);
  if (spec.docs.roadmap) structureRows.push(['`docs/ROADMAP.md`', 'Near Term and Deferred sections.']);
  const stateTrackingDocs = spec.docs.developmentSlices
    ? '`docs/TASK_BOARD.md` and `docs/DEVELOPMENT_SLICES.md`'
    : '`docs/TASK_BOARD.md`';

  return `# IMPLEMENTATION_SOP

This project was initialized with the \`${spec.profile}\` HADARA profile.

## Session Start

${numberedList(sessionStart)}

## Required Reading Tiers

Use semantic tiers to keep session startup compact and deterministic:

| Tier | Meaning | Default Read Behavior |
|---|---|---|
| \`current-state\` | Compact docs that establish live project state and route deeper reading, starting with \`.hadara/context/HADARA_CONTEXT.md\`. | Read first at session start or resume. |
| \`task-work\` | Active Task Capsule docs, \`docs/TASK_BOARD.md\`, and \`docs/TASK_WORKFLOW_COMMANDS.md\`. | Read when selecting, implementing, finishing, closing, or auditing a task. |
| \`conditional-reference\` | Architecture, security, roadmap, validation, release, or project-specific specs. | Read only when the task type, capsule, or Required Reading row condition applies. |
| \`historical\` | Completed-task history, older validation records, and previous-state detail. | Never default required reading; read only when investigating history through the handoff Historical Index. |
| \`excluded\` | Superseded, archived, local-only, or intentionally non-default material. | Never default required reading unless explicitly reclassified. |

\`.hadara/context/HADARA_CONTEXT.md\` is the current-state entry point and read-routing guide. Full historical review of \`docs/PROJECT_STATE.md\` is not mandatory every session; rely on compact current-state docs first and follow \`docs/AGENT_HANDOFF.md\` Historical Index only when older history matters. Historical and superseded docs are never default required reading.

## Required Reading

${requiredReadingTable}

## Project-Specific Documents

When adding project-specific specs, contracts, roadmap files, or human/agent operating notes, register them in the Required Reading table before expecting people or agents to rely on them. Each row must explain when to read the document and what decision or workflow boundary it owns.

\`\`\`bash
hadara init register-doc --path docs/specs/example.md --when "When changing example behavior" --purpose "Example behavior contract" --json
hadara init register-doc --path docs/specs/example.md --when "When changing example behavior" --purpose "Example behavior contract" --execute --json
\`\`\`

Use \`--require-exists\` when the document must already exist before registration. Keep local-only notes out of committed required reading unless they are intentionally part of the project handoff.

## Init Profile Matrix

| Profile | Scale | Generated Docs | Intended Use | Special Notes |
|---|---|---|---|---|
| \`basic\` | Small | Core session docs plus task workflow commands | Small projects that need Task Capsules, evidence, and handoff discipline without planning overhead. | SOP required reading references core docs, task workflow docs, and active Task Capsule docs. |
| \`standard\` | Medium, default | Basic docs plus planning, architecture, decision, and validation docs | Most multi-session projects that need roadmap slices and repeatable validation. | Optional integrations must be registered before agents rely on them. |
| \`governed\` | Heavy | Standard docs plus security, refactor log, and roadmap docs | Long-lived projects with stronger governance, security boundaries, refactor history, or roadmap-level planning. | Project-specific contracts still must be manually registered in Required Reading. |

## Scaffold Document Structure

Generated HADARA docs should follow a stable structure so agents do not reinterpret the same filename differently across projects.

| Document | Required Structure |
|---|---|
${structureRows.map(formatTableRow).join('\n')}

Prefer tables for repeated records and \`##\`/\`###\` headings for durable sections. Do not leave scaffold docs as unstructured prose when a table or named section would make agent interpretation more deterministic.

## Implementation

1. Keep work inside one Task Capsule whenever possible.
2. Preserve the portable/project store boundary.
3. Make the smallest coherent change that satisfies acceptance criteria.
4. Update task-local docs when scope changes.

## Documentation Timing and Write Coordination

Do not defer all documentation until after implementation. Documentation is part of the work, not a post-work report.

Keep capsule docs current as work changes:

| Timing | Documents |
|---|---|
| Before execution | \`PLAN.md\` |
| During execution | \`DECISIONS.md\`, \`RISKS.md\`, and \`FILES.md\` |
| Immediately after validation | \`TESTS.md\` and \`EVIDENCE.md\` |
| Before finish/ready/close | \`ACCEPTANCE.md\`, \`HANDOFF.md\`, and shared state docs |
| Before close-source hash is captured | \`docs/TASK_BOARD.md\`, \`docs/PROJECT_STATE.md\`, \`docs/AGENT_HANDOFF.md\`, and roadmap/slice docs when applicable |

Parallelize read-only discovery, \`rg\`/file inspection, independent validation commands, package or registry metadata inspection, read-only diagnostics, and draft preparation before writes. Serialize same-file writes, evidence append, Task Capsule doc writes, Task Board writes, Project State writes, Agent Handoff writes, before-hash execute operations, \`task finish --execute\`, \`task close --execute\`, and release artifact or publish operations.

## Status Token And Document Ownership Policy

Use distinct token families for persistent task state, close proof state, document registry state, and evidence outcomes. \`TaskStatus\` belongs to Task Capsule metadata, \`TASK.md\` Status/Status History, and command-owned \`docs/TASK_BOARD.md\` cells. Valid persistent task tokens are \`Draft\`, \`In Progress\`, \`Blocked\`, \`Done\`, \`Partial\`, \`Superseded\`, and \`Archived\`.

\`CloseState\` is derived from close evidence and \`task audit-close\`; do not write close proof values as \`TaskStatus\`, and do not persist \`CloseState\` in task-local \`HANDOFF.md\` close-source current-state tables. Canonical close-state tokens are \`not-closed\`, \`closed-valid\`, \`closed-stale\`, \`closed-invalid\`, and \`unknown\`. Compatibility diagnostics such as \`close-evidence-found-invalid\`, \`close-evidence-malformed\`, and \`closed-with-drift-warnings\` are close-state details, not task status.

\`DocStatus\` belongs only to the docs registry and uses \`canonical\`, \`active\`, \`reference\`, \`historical\`, \`superseded\`, and \`archived\`. Evidence outcomes are \`passed\`, \`failed\`, \`blocked\`, and \`unknown\`; preserve failed or blocked evidence and append newer corrective evidence instead of rewriting history.

Ownership boundaries follow the lifecycle command model. \`task finish --execute\` owns bounded status bookkeeping in \`TASK.md\` and command-owned \`docs/TASK_BOARD.md\` cells. \`task close --execute\` owns only close evidence append. Operators own close-source prose and shared state docs before close, then rerun ready/close/audit after any intentional close-source edit.

## Standard Task Workflow Loop

The authoritative command semantics live in \`docs/TASK_WORKFLOW_COMMANDS.md\`. For ordinary implementation capsules, use this loop:

\`\`\`bash
hadara task next --json

# If a matching capsule already exists:
hadara task status --task T-XXXX --json

# If no matching capsule exists, create one first:
hadara task create "task title" --json
hadara task status --task T-XXXX --json

# Do the scoped work.

hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --idempotency-key "command:T-XXXX:check" --json

hadara task finish --task T-XXXX --json
hadara task finish --task T-XXXX --execute --json

# Finalize Task Capsule docs and tracked state docs before closing.

hadara task ready --task T-XXXX --level done --json

# Optional workflow compression / next action preview:
hadara task complete --task T-XXXX --json

hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --execute --json

hadara task audit-close --task T-XXXX --json
\`\`\`

| Command | Default Write Behavior | Notes |
|---|---|---|
| \`task next\` | Read-only | Recommends work; does not create tasks. |
| \`task status\` | Read-only | \`ok\` means report generation succeeded; readiness is in \`state.ready\`, \`summary.blockers\`, and \`issues\`. |
| \`evidence add-command\` | Write | Appends command-log evidence; does not execute shell commands; optional \`--category\`/\`--outcome\`/\`--resolves\`/\`--supersedes\` enrich v2 metadata, result/outcome mismatches are rejected, and optional \`--idempotency-key\` prevents duplicate same-key records. |
| \`task ready\` | Read-only | Checks readiness; does not mutate evidence or status docs. |
| \`task finish\` | Dry-run by default; writes only with \`--execute\` | Bounded to \`TASK.md\` and \`docs/TASK_BOARD.md\`. |
| \`task close\` | Dry-run by default; writes only with \`--execute\` | Bounded to close evidence append. |
| \`task audit-close\` | Read-only | Verifies close evidence after close. |

Before running \`task ready\` and \`task close\`, finish all close-source edits: Task Capsule docs, acceptance/tests/handoff notes, evidence summaries, \`docs/TASK_BOARD.md\`, and tracked state docs such as \`docs/PROJECT_STATE.md\`, \`docs/AGENT_HANDOFF.md\`, and roadmap/slice docs when they apply. After \`task close --execute --json\`, do not edit those close-source documents unless you intend to rerun \`task ready\`, \`task close\`, and \`task audit-close\`. Avoid writing volatile close evidence ids into close-source docs; use stable wording such as "close evidence appended; audit returned closed-valid".

## Validation

1. Run relevant tests.
2. Record meaningful evidence in \`EVIDENCE.md\` and \`evidence.jsonl\`.
3. Preview and execute \`hadara task finish --task <task-id> --json\` and \`hadara task finish --task <task-id> --execute --json\`.
4. Finalize Task Capsule docs and tracked state docs before close so the close source hash remains stable.
5. Run \`hadara task ready --task <task-id> --level done --json\` after finish and before close.
6. Preview and execute \`hadara task close --task <task-id> --json\` and \`hadara task close --task <task-id> --execute --json\`, then run \`hadara task audit-close --task <task-id> --json\`.
7. Add project-specific integration or deployment smoke checks only after those surfaces exist and are documented for this project.

\`task ready\` and \`task close\` include done-level Task Capsule validation. Use \`hadara harness validate --task <task-id> --level done --json\` directly when you need to debug capsule format or done-level validation failures.

## Evidence Records

1. Do not hand-edit Task Capsule \`evidence.jsonl\`.
2. Append evidence through HADARA commands so schema, visibility, and artifact-safety checks run consistently.
3. Record failed or blocked checks honestly. Do not replace them later with optimistic summaries; add newer evidence that explains the fix or residual risk.
4. Use \`hadara evidence add-command --task <task-id> --summary <text> --result passed|failed|blocked|unknown --json\` for command results when no artifact file is attached. Add \`--category <category>\` or \`--outcome <outcome>\` when summary heuristics are not precise enough; if both \`--result\` and \`--outcome\` are supplied, matching outcomes must match the legacy result, while \`recorded\` and \`not-applicable\` require \`--result unknown\` or no explicit result. Use \`--resolves <evidence-id>\` or \`--supersedes <evidence-id>\` for exact v2 resolution markers from passed or recorded follow-up evidence, and \`--idempotency-key <key>\` when rerunning the same logical check should report one durable evidence identity instead of appending duplicates.
5. Use \`hadara evidence lint --task <task-id> --json\` when evidence drift is suspected or before close if evidence files were touched manually by mistake.

## Session End

1. Update Task Capsule status.
2. Update \`docs/TASK_BOARD.md\`.
3. Update \`docs/PROJECT_STATE.md\` when capability state changes.
4. Update \`docs/AGENT_HANDOFF.md\` before stopping.

## Handoff Compaction

1. \`docs/AGENT_HANDOFF.md\` should describe current handoff state, not the full project history.
2. Keep only recent completed-task summaries in \`docs/AGENT_HANDOFF.md\`.
3. Move older completed-task and validation history to indexed history documents when the handoff grows too large.
4. Keep authoritative per-task evidence in Task Capsules and state tracking in ${stateTrackingDocs}.
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
| 3 | Preview and execute \`task finish\` to synchronize status bookkeeping. | Task Capsule \`TASK.md\` and \`docs/TASK_BOARD.md\` |
| 4 | Finalize Task Capsule docs and tracked state docs before close. | Task Capsule docs and tracked state docs |
| 5 | Run \`hadara task ready --task <task-id> --level done --json\` after finish and before close. | Task Capsule \`EVIDENCE.md\` and \`evidence.jsonl\` |
| 6 | Preview and execute \`task close\`, then run \`task audit-close\`. | Task Capsule close evidence |

## Diagnostic Checks

| Check | Command | When To Use |
|---|---|---|
| Task Capsule format | \`hadara harness validate --task <task-id> --level done --json\` | \`task ready\` or \`task close\` reports done-level validation failures. |
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

Use this loop for ordinary implementation capsules:

\`\`\`bash
hadara task next --json

# If a matching capsule already exists:
hadara task status --task T-XXXX --json

# If no matching capsule exists, create one first:
hadara task create "task title" --json
hadara task status --task T-XXXX --json

# Do the scoped work.

hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --idempotency-key "command:T-XXXX:check" --json

hadara task finish --task T-XXXX --json
hadara task finish --task T-XXXX --execute --json

# Finalize Task Capsule docs and tracked state docs before closing.

hadara task ready --task T-XXXX --level done --json

# Optional workflow compression / next action preview:
hadara task complete --task T-XXXX --json

hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --execute --json

hadara task audit-close --task T-XXXX --json
\`\`\`

\`task finish\`, \`task ready\`, and \`task close\` are intentionally separate. \`finish\` synchronizes bounded status bookkeeping first. \`ready\` then validates the Done-level state. \`close\` records close evidence after validation succeeds. \`audit-close\` checks the resulting close evidence after the write.

The close model has three separate phases: validation proves readiness, close records the proof, and audit checks the already-recorded close evidence. Close evidence is excluded from the current validation loop because it is appended after validation; requiring it as a same-run precondition would create a fixed-point loop.

\`task ready\` and \`task close\` include done-level Task Capsule validation. Use \`hadara harness validate --task T-XXXX --level done --json\` directly when debugging capsule format, status-history, acceptance, evidence, or handoff validation failures.

## Status Token And Ownership Policy

HADARA uses separate token families for persistent state, derived proof state, document registry state, and evidence outcomes. Do not collapse these families into a single Markdown \`Status\` field.

### TaskStatus

\`TaskStatus\` is persistent task lifecycle state in \`TASK.md\` metadata, the \`## Status\` section, Status History rows, and the command-owned cells of \`docs/TASK_BOARD.md\`.

| Token | Meaning | Writer |
|---|---|---|
| \`Draft\` | Task capsule exists but implementation is not started or not yet ready for done-level validation. | \`task create\`, worker docs |
| \`In Progress\` | Work is actively being performed. | Worker docs |
| \`Blocked\` | Work cannot proceed without a recorded blocker. | Worker docs |
| \`Done\` | Scoped work is implemented and ready for done-level validation/close. | \`task finish --execute\` |
| \`Partial\` | Deliberate partial completion with remaining scope deferred or split. | Worker/coordinator docs |
| \`Superseded\` | Task has been replaced by another task or line. | Worker/coordinator docs |
| \`Archived\` | Task is no longer active state and is retained only for history. | Worker/coordinator docs |

Reserved non-TaskStatus strings include \`Closed\`, \`Ready\`, \`Approved\`, \`Complete\`, \`closed-valid\`, \`not-closed\`, and phrases such as \`Done pending lifecycle close\`. Use \`TaskStatus: Done\`; get close proof state from \`task status\`, \`task audit-close\`, proof status, or \`state verify\` read models.

### CloseState

\`CloseState\` is derived proof state from close evidence and \`task audit-close\`; it is not written as persistent \`TaskStatus\` and should not be stored in task-local \`HANDOFF.md\` current-state tables.

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
| \`TASK.md\` status metadata, \`## Status\`, and Status History | Command-owned for finish bookkeeping; worker-owned before finish. |
| \`docs/TASK_BOARD.md\` ID/title/status/capsule cells | Command-owned by \`task finish\`; Notes and extra cells are mixed/human-owned. |
| \`EVIDENCE.md\` and \`evidence.jsonl\` | Evidence writer-owned; do not hand-edit \`evidence.jsonl\`. |
| \`HANDOFF.md\` managed current-state table | Managed/mixed; persist \`TaskStatus\` only. \`CloseState\` is derived by status/audit/proof/state read models and should not be written into close-source handoff tables. |
| Shared state docs | Mixed/human-owned; update before close when they are close-source relevant. |
| \`.hadara/docs-registry.json\` and \`docs/DOC_REGISTRY.md\` | Docs registry-owned; registry mutations should stay dry-run-first or explicitly scoped. |

Before close, finish all close-source edits: Task Capsule docs, acceptance/tests/handoff notes, evidence summaries, \`docs/TASK_BOARD.md\`, and tracked state docs such as \`docs/PROJECT_STATE.md\`, \`docs/AGENT_HANDOFF.md\`, and roadmap/slice docs when they apply. After \`task close --execute --json\`, changing those documents changes the close source hash and requires rerunning \`task ready\`, \`task close\`, and \`task audit-close\`. Do not paste volatile close evidence ids into close-source docs; prefer stable wording such as "close evidence appended; audit returned closed-valid".

## Documentation Timing and Write Coordination

Do not defer all documentation until after implementation. Keep \`PLAN.md\` current before execution; update \`DECISIONS.md\`, \`RISKS.md\`, and \`FILES.md\` during execution; update \`TESTS.md\` and \`EVIDENCE.md\` immediately after validation; update \`ACCEPTANCE.md\`, \`HANDOFF.md\`, and shared state docs before finish/ready/close; and update shared close-source docs before the close-source hash is captured.

Parallelize read-only discovery, \`rg\`/file inspection, independent validation commands, package or registry metadata inspection, read-only diagnostics, and draft preparation before writes.

Serialize same-file writes, evidence append, Task Capsule doc writes, Task Board writes, Project State writes, Agent Handoff writes, before-hash execute operations, \`task finish --execute\`, \`task close --execute\`, and release artifact or publish operations.

## Command Semantics

| Command | Default Write Behavior | Notes |
|---|---|---|
| \`task next\` | Read-only | Recommends work; does not create tasks. |
| \`task status\` | Read-only | \`ok\` means report generation succeeded; readiness is in \`state.ready\`, \`summary.blockers\`, and \`issues\`. |
| \`task create\` | Write | Creates a Draft Task Capsule and Task Board row. It does not imply the task is ready or done. |
| \`evidence add-command\` | Write | Appends operator-supplied command-log evidence. It does not execute shell commands or capture stdout/stderr; optional \`--category\`/\`--outcome\`/\`--resolves\`/\`--supersedes\` enrich v2 metadata, result/outcome mismatches are rejected, and optional \`--idempotency-key\` prevents duplicate same-key records. |
| \`task finish\` | Dry-run by default; writes only with \`--execute\` | Updates only \`TASK.md\` status bookkeeping and the matching \`docs/TASK_BOARD.md\` row. |
| \`task ready\` | Read-only | Checks whether the task can satisfy the requested readiness level after finish. |
| \`task complete\` | Read-only | Summarizes the current completion stage and next command; it does not execute lifecycle writes. |
| \`task close\` | Dry-run by default; writes only with \`--execute\` | Appends only canonical close evidence after close preconditions pass. |
| \`task audit-close\` | Read-only | Verifies close evidence after close. |

## Non-Overlap Rules

- \`task next\` chooses work; it does not create a capsule or infer completion.
- \`task status\` is an operator console; \`ok: true\` means report generation succeeded, not that the task is ready.
- \`task ready\` checks readiness; it does not write evidence or status.
- \`harness validate\` is a direct diagnostic for Task Capsule structure and done-level gates; it is not a replacement for close evidence.
- \`task complete\` is a read-only workflow compressor. It may report the next lifecycle command, but it must not execute finish, ready, close, or audit commands.
- \`evidence add-command\` records an operator-supplied command result; it does not run the command. \`--category\` and \`--outcome\` set persisted v2 metadata explicitly, while \`--result\` remains the legacy-compatible command result. When both are supplied, \`--result\` must match \`--outcome\` for \`passed\`, \`failed\`, \`blocked\`, and \`unknown\`; \`recorded\` and \`not-applicable\` require \`--result unknown\` or no explicit \`--result\`. \`--resolves\` and \`--supersedes\` append exact v2 resolution tags from passed or recorded follow-up evidence. \`--idempotency-key\` is optional; when supplied, same-key repeats return the existing record without appending duplicate Markdown or JSONL rows.
- \`task finish\` may update only the Task Capsule \`TASK.md\` status and the matching \`docs/TASK_BOARD.md\` row's command-owned cells: \`ID\`, \`Title\`, \`Status\`, and \`Capsule\`. It preserves human/mixed-owned \`Notes\` and any extra cells.
- \`task close\` may append only close evidence. It must not update status docs, Task Board rows, handoff, Project State, roadmap docs, or arbitrary evidence.
- After \`task close --execute --json\`, close-source document edits intentionally invalidate the previous close proof. Make those edits before close, or rerun ready/close/audit if the edit is unavoidable.
- \`task audit-close\` is read-only and should be run after \`task close --execute --json\`.

## State Documents

\`task finish --execute --json\` deliberately does not update broad prose state. Operators still update \`docs/PROJECT_STATE.md\`, \`docs/AGENT_HANDOFF.md\`, and any roadmap/slice docs generated for the selected profile when the task changes project state.
`;
}

function createAgentsDoc(spec: InitProfileSpec): string {
  const requiredReadingRows = [
    ['1', '`.hadara/context/HADARA_CONTEXT.md`', 'Every session', 'Compact project-local context anchor and read routing.'],
    ['2', '`docs/PROJECT_STATE.md`', 'Every session', 'Current product and capability state.'],
    ['3', '`docs/AGENT_HANDOFF.md`', 'Every session', 'Compact continuation state.'],
    ['4', '`docs/TASK_BOARD.md`', 'Every session', 'Current task queue and status.'],
    ['5', '`docs/IMPLEMENTATION_SOP.md`', 'Every session', 'Local workflow and required-reading registry.'],
    ['6', '`docs/TASK_WORKFLOW_COMMANDS.md`', 'Starting, finishing, closing, auditing, or explaining task workflow commands', 'Standard task loop, dry-run boundaries, and command `ok` semantics.']
  ];
  let order = 7;
  if (spec.docs.architecture) requiredReadingRows.push([String(order++), '`docs/ARCHITECTURE.md`', 'Architecture, component, or boundary work', 'Current system shape and ownership boundaries.']);
  if (spec.docs.developmentSlices) requiredReadingRows.push([String(order++), '`docs/DEVELOPMENT_SLICES.md`', 'Starting, completing, or reclassifying a development slice', 'Roadmap ordering, prerequisites, and completion evidence.']);
  if (spec.docs.decisions) requiredReadingRows.push([String(order++), '`docs/DECISIONS.md`', 'Project-level decision work', 'Durable project decisions.']);
  if (spec.docs.testStrategy) requiredReadingRows.push([String(order++), '`docs/TEST_STRATEGY.md`', 'Validation planning or completion checks', 'Routine suites and special-case checks.']);
  if (spec.docs.securityModel) requiredReadingRows.push([String(order++), '`docs/SECURITY_MODEL.md`', 'Security, secret, permission, or evidence-safety work', 'Project security invariants.']);
  if (spec.docs.roadmap) requiredReadingRows.push([String(order++), '`docs/ROADMAP.md`', 'Roadmap, milestone, or scope planning', 'Longer-term priorities and deferred work.']);
  requiredReadingRows.push(
    [String(order++), 'Active `tasks/T-*/TASK.md`', 'Working a task', 'Task-specific goal, scope, and status.'],
    [String(order++), 'Active Task Capsule docs', 'Working a task', 'Decisions, plan, context, acceptance, files, tests, risks, handoff, and evidence.'],
    [String(order++), 'Project-specific registered docs', 'When listed in `docs/IMPLEMENTATION_SOP.md`', 'Specs, contracts, or roadmap files explicitly added by this project.']
  );
  const trackedStateDocs = ['`docs/TASK_BOARD.md`', '`docs/PROJECT_STATE.md`', ...(spec.docs.developmentSlices ? ['`docs/DEVELOPMENT_SLICES.md`'] : [])];
  const ruleRows = [
    ['Task boundary', 'Keep work inside one Task Capsule whenever possible.', 'Active Task Capsule'],
    ['Task creation', 'If no suitable capsule exists, create one with `hadara task create <title>`.', '`docs/TASK_BOARD.md`'],
    ['Evidence', 'Do not mark work done without evidence. Do not hand-edit `evidence.jsonl`; record failed or blocked checks honestly instead of replacing them with optimistic summaries.', '`EVIDENCE.md`, `evidence.jsonl`'],
    ['Documentation timing', 'Do not defer all documentation until after implementation; keep capsule docs current as work changes.', 'Task Capsule docs and shared state docs'],
    ['Write coordination', 'Parallelize read-only discovery and independent validation; serialize evidence append, Task Capsule doc writes, shared state doc writes, before-hash executes, finish/close executes, and release/publish operations.', 'Task Capsule evidence'],
    ['Task workflow', 'For task workflow commands, follow `docs/TASK_WORKFLOW_COMMANDS.md`: record evidence, preview and execute `task finish`, finalize close-source docs, run `task ready`, preview and execute `task close`, then run `task audit-close`.', 'Task Capsule evidence'],
    ['Safety', 'Do not execute dangerous commands without explicit user approval.', 'Task Capsule evidence'],
    ['Secrets', 'Do not write secrets, private logs, or machine-local state into committed files.', 'Changed-file review'],
    ['Store boundary', 'Preserve the portable/project store boundary.', spec.docs.architecture ? '`.gitignore`, `docs/ARCHITECTURE.md`' : '`.gitignore`'],
    ['Validation', 'Follow validation constraints recorded in `docs/AGENT_HANDOFF.md` and the active Task Capsule.', 'Task Capsule evidence'],
    ['Tracked state', `Update ${formatInlineList(trackedStateDocs)} when tracked state changes.`, 'Tracked docs'],
    ['Handoff', 'Update `docs/AGENT_HANDOFF.md` before stopping.', '`docs/AGENT_HANDOFF.md`'],
    ['Required reading', 'Register project-specific docs in `docs/IMPLEMENTATION_SOP.md` before expecting agents to rely on them.', '`docs/IMPLEMENTATION_SOP.md`']
  ];
  if (spec.docs.developmentSlices) {
    ruleRows.push(['Slice order', 'Respect prerequisite order in `docs/DEVELOPMENT_SLICES.md`.', '`docs/DEVELOPMENT_SLICES.md`']);
  }

  return `# AGENTS

This repository must be developed using the HADARA protocol.

## Required Reading

| Order | Document | When | Purpose |
|---|---|---|---|
${requiredReadingRows.map(formatTableRow).join('\n')}

\`docs/AGENT_HANDOFF.md\` is compact current-state handoff, not full project history. Follow its Historical Index when older completed-task or validation history is needed.

## Required Reading Tiers

Use semantic tiers to keep session startup compact:

| Tier | Meaning | Default Read Behavior |
|---|---|---|
| \`current-state\` | Compact docs that establish the live project state and route deeper reading. | Read first at session start or resume. |
| \`task-work\` | Active Task Capsule docs and task workflow docs needed to safely perform lifecycle commands. | Read when selecting, implementing, finishing, closing, or auditing a task. |
| \`conditional-reference\` | Architecture, security, roadmap, validation, release, or project-specific specs. | Read only when the task type or active capsule references them. |
| \`historical\` | Completed-task history, older validation records, and previous-state detail. | Never default required reading; read only when investigating history. |
| \`excluded\` | Superseded, archived, local-only, or intentionally non-default material. | Never default required reading unless explicitly reclassified. |

\`.hadara/context/HADARA_CONTEXT.md\` is the current-state entry point. It should route readers to compact state before task-work or conditional-reference docs. Full historical review of \`docs/PROJECT_STATE.md\` is not mandatory every session; use \`docs/AGENT_HANDOFF.md\` and its Historical Index when older history is needed. Historical and superseded docs are never default required reading.

## Rules

| Rule | Requirement | Evidence / Update Location |
|---|---|---|
${ruleRows.map(formatTableRow).join('\n')}
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
