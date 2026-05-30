import fs from 'node:fs';
import path from 'node:path';
import { resolveHadaraPaths } from '../core/paths';
import { ensureDir, writeFileIfMissing } from '../core/fs';
import { getFlag, getRequiredStringOption, getStringOption } from './args';

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

const INIT_PROFILE_SPECS: Record<InitProfile, InitProfileSpec> = {
  basic: {
    profile: 'basic',
    generatedDocsDescription: 'Core session docs only',
    intendedUse: 'Small projects that need Task Capsules, evidence, and handoff discipline without planning overhead.',
    specialNotes: 'SOP required reading references only core docs plus active Task Capsule docs.',
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

export function initProject(projectRoot: string, profile = 'standard'): void {
  const normalizedProfile = parseInitProfile(profile);
  const spec = INIT_PROFILE_SPECS[normalizedProfile];
  const paths = resolveHadaraPaths({ projectRoot });
  ensureDir(paths.projectDocsDir);
  ensureDir(paths.projectTasksDir);

  for (const file of createGeneratedScaffoldFiles(normalizedProfile)) {
    writeFileIfMissing(path.join(projectRoot, file.path), file.content);
  }

  console.log(`[HADARA] Initialized project: ${projectRoot}`);
  console.log(`[HADARA] Init profile: ${normalizedProfile}`);
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
  initProject(input.projectRoot, getStringOption(input.args, '--profile', 'standard') ?? 'standard');
  return true;
}

function getInitFollowUpMode(args: string[]): InitFollowUpMode {
  return getFlag(args, '--execute') ? 'execute' : 'dry-run';
}

function createGeneratedScaffoldFiles(profile: InitProfile): GeneratedScaffoldFile[] {
  const spec = INIT_PROFILE_SPECS[profile];
  const files: GeneratedScaffoldFile[] = [
    { path: 'docs/PROJECT_STATE.md', content: createProjectStateDoc(profile) },
    { path: 'docs/TASK_BOARD.md', content: '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n' },
    { path: 'docs/AGENT_HANDOFF.md', content: createAgentHandoffDoc() },
    { path: 'docs/IMPLEMENTATION_SOP.md', content: createImplementationSopDoc(spec) },
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
  const requiredCore = ['AGENTS.md', '.gitignore', 'docs/PROJECT_STATE.md', 'docs/AGENT_HANDOFF.md', 'docs/TASK_BOARD.md', 'docs/IMPLEMENTATION_SOP.md'];
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
  if (sop !== null && /minimal|full|hadara-protocol/.test(sop)) {
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
    ['`docs/IMPLEMENTATION_SOP.md`', 'Every session', 'Local HADARA workflow rules and project-specific required-reading registry.']
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
      ['`docs/REFACTOR_LOG.md`', 'Refactor, migration, removal, or replacement work', 'Project-level refactor history.'],
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
    { document: '`docs/IMPLEMENTATION_SOP.md`', when: 'Every session', purpose: 'Local workflow and required-reading registry.' }
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
      { document: '`docs/REFACTOR_LOG.md`', when: 'Refactor, migration, removal, or replacement work', purpose: 'Project-level refactor history.' },
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
  const docs = ['docs/PROJECT_STATE.md', 'docs/AGENT_HANDOFF.md', 'docs/TASK_BOARD.md', 'docs/IMPLEMENTATION_SOP.md'];
  if (profile === 'standard' || profile === 'governed') {
    docs.push('docs/ARCHITECTURE.md', 'docs/DEVELOPMENT_SLICES.md', 'docs/DECISIONS.md', 'docs/TEST_STRATEGY.md');
  }
  if (profile === 'governed') {
    docs.push('docs/SECURITY_MODEL.md', 'docs/REFACTOR_LOG.md', 'docs/ROADMAP.md');
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
  return `# PROJECT_STATE

## Product

| Field | Value |
|---|---|
| Name | TBD |
| Purpose | Describe the project in one or two sentences. |
| HADARA Profile | ${profile} |

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

function createAgentHandoffDoc(): string {
  return `# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Scaffold | Initialized | HADARA protocol scaffold is initialized. |
| Required Reading | Pending | Read \`PROJECT_STATE\`, \`TASK_BOARD\`, and \`IMPLEMENTATION_SOP\` before starting. |

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
    ['`docs/PROJECT_STATE.md`', 'Every session', 'Current product state and source-of-truth map.'],
    ['`docs/AGENT_HANDOFF.md`', 'Every session', 'Compact handoff and next recommended step.'],
    ['`docs/TASK_BOARD.md`', 'Every session', 'Work queue and task status.'],
    ['`docs/IMPLEMENTATION_SOP.md`', 'Every session', 'Local HADARA workflow rules and project-specific required-reading registry.']
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
  if (spec.docs.refactorLog) {
    requiredReadingRows.push(['`docs/REFACTOR_LOG.md`', 'Refactor, migration, removal, or replacement work', 'Project-level refactor history.']);
  }
  if (spec.docs.roadmap) {
    requiredReadingRows.push(['`docs/ROADMAP.md`', 'Roadmap, milestone, release, or scope planning', 'Longer-term priorities and deferred work.']);
  }
  requiredReadingRows.push(
    ['Active `tasks/T-*/TASK.md`', 'Working a task', 'Task-specific goal, scope, and status.'],
    ['Active Task Capsule docs', 'Working a task', '`DECISIONS.md`, `PLAN.md`, `CONTEXT.md`, `ACCEPTANCE.md`, `FILES.md`, `TESTS.md`, `RISKS.md`, and `HANDOFF.md`.']
  );

  const structureRows = [
    ['`AGENTS.md`', 'Required Reading and Rules sections.'],
    ['`docs/PROJECT_STATE.md`', 'Product, Current Phase, Current Status, and Single Source of Truth sections.'],
    ['`docs/AGENT_HANDOFF.md`', 'Current State, Last 3 Completed Tasks, Current Known Problems, Next Recommended Step, Validation Baseline, and Historical Index sections.'],
    ['`docs/TASK_BOARD.md`', 'One task table with ID, Title, Status, Capsule, and Notes columns.'],
    ['`docs/IMPLEMENTATION_SOP.md`', 'Session Start, Required Reading, Init Profile Matrix, Scaffold Document Structure, Implementation, Validation, Session End, and Handoff Compaction sections.']
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

## Required Reading

| Document | When to Read | Purpose |
|---|---|---|
${requiredReadingRows.map(formatTableRow).join('\n')}

When adding project-specific specs, contracts, or roadmap files, add them to this table and explain when agents must read them. Use \`hadara init register-doc --path <path> --when <text> --purpose <text> --json\` to preview registration, and add \`--execute\` to update this table.

## Init Profile Matrix

| Profile | Scale | Generated Docs | Intended Use | Special Notes |
|---|---|---|---|---|
| \`basic\` | Small | Core session docs only | Small projects that need Task Capsules, evidence, and handoff discipline without planning overhead. | SOP required reading references only core docs plus active Task Capsule docs. |
| \`standard\` | Medium, default | Core docs plus planning, architecture, decision, and validation docs | Most multi-session projects that need roadmap slices and repeatable validation. | Optional integrations must be registered before agents rely on them. |
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

## Validation

1. Run relevant tests.
2. Run \`hadara harness validate --task <task-id> --json\`.
3. Record evidence in \`EVIDENCE.md\` and \`evidence.jsonl\`.
4. Add project-specific integration or deployment smoke checks only after those surfaces exist and are documented for this project.

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
| 2 | Run \`hadara harness validate --task <task-id> --json\`. | Task Capsule \`EVIDENCE.md\` and \`evidence.jsonl\` |
| 3 | Record meaningful evidence in the Task Capsule. | Task Capsule files |

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

function createAgentsDoc(spec: InitProfileSpec): string {
  const requiredReadingRows = [
    ['1', '`docs/PROJECT_STATE.md`', 'Every session', 'Current product and capability state.'],
    ['2', '`docs/AGENT_HANDOFF.md`', 'Every session', 'Compact continuation state.'],
    ['3', '`docs/TASK_BOARD.md`', 'Every session', 'Current task queue and status.'],
    ['4', '`docs/IMPLEMENTATION_SOP.md`', 'Every session', 'Local workflow and required-reading registry.']
  ];
  let order = 5;
  if (spec.docs.architecture) requiredReadingRows.push([String(order++), '`docs/ARCHITECTURE.md`', 'Architecture, component, or boundary work', 'Current system shape and ownership boundaries.']);
  if (spec.docs.developmentSlices) requiredReadingRows.push([String(order++), '`docs/DEVELOPMENT_SLICES.md`', 'Starting, completing, or reclassifying a development slice', 'Roadmap ordering, prerequisites, and completion evidence.']);
  if (spec.docs.decisions) requiredReadingRows.push([String(order++), '`docs/DECISIONS.md`', 'Project-level decision work', 'Durable project decisions.']);
  if (spec.docs.testStrategy) requiredReadingRows.push([String(order++), '`docs/TEST_STRATEGY.md`', 'Validation planning or completion checks', 'Routine suites and special-case checks.']);
  if (spec.docs.securityModel) requiredReadingRows.push([String(order++), '`docs/SECURITY_MODEL.md`', 'Security, secret, permission, or evidence-safety work', 'Project security invariants.']);
  if (spec.docs.refactorLog) requiredReadingRows.push([String(order++), '`docs/REFACTOR_LOG.md`', 'Refactor, migration, removal, or replacement work', 'Project-level refactor history.']);
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
    ['Evidence', 'Do not mark work done without evidence.', '`EVIDENCE.md`, `evidence.jsonl`'],
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
