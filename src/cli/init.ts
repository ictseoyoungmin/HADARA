import path from 'node:path';
import { resolveHadaraPaths } from '../core/paths';
import { ensureDir, writeFileIfMissing } from '../core/fs';
import { writeAuditEvent } from '../core/audit';
import { getStringOption } from './args';

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
    specialNotes: 'Default profile. It does not assume release, security-smoke, MCP, provider, dashboard, or Hermes surfaces.',
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
    intendedUse: 'Long-lived projects with stronger governance, release planning, security boundaries, or operational surfaces.',
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
  for (const dir of [
    paths.dataRoot,
    paths.configDir,
    paths.secretsDir,
    paths.sessionsDir,
    paths.logsDir,
    paths.auditDir,
    paths.exportsDir,
    paths.projectDocsDir,
    paths.projectTasksDir,
    paths.projectContextDir
  ]) {
    ensureDir(dir);
  }

  writeFileIfMissing(
    path.join(projectRoot, 'docs', 'PROJECT_STATE.md'),
    createProjectStateDoc()
  );
  writeFileIfMissing(path.join(projectRoot, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n');
  writeFileIfMissing(path.join(projectRoot, 'docs', 'AGENT_HANDOFF.md'), createAgentHandoffDoc());
  writeFileIfMissing(path.join(projectRoot, 'docs', 'IMPLEMENTATION_SOP.md'), createImplementationSopDoc(spec));
  if (spec.docs.architecture) {
    writeFileIfMissing(path.join(projectRoot, 'docs', 'ARCHITECTURE.md'), createArchitectureDoc(normalizedProfile));
  }
  if (spec.docs.developmentSlices) {
    writeFileIfMissing(path.join(projectRoot, 'docs', 'DEVELOPMENT_SLICES.md'), createDevelopmentSlicesDoc());
  }
  if (spec.docs.decisions) {
    writeFileIfMissing(path.join(projectRoot, 'docs', 'DECISIONS.md'), createDecisionsDoc());
  }
  if (spec.docs.refactorLog) {
    writeFileIfMissing(path.join(projectRoot, 'docs', 'REFACTOR_LOG.md'), createRefactorLogDoc());
  }
  if (spec.docs.securityModel) {
    writeFileIfMissing(path.join(projectRoot, 'docs', 'SECURITY_MODEL.md'), createSecurityModelDoc());
  }
  if (spec.docs.testStrategy) {
    writeFileIfMissing(path.join(projectRoot, 'docs', 'TEST_STRATEGY.md'), createTestStrategyDoc());
  }
  if (spec.docs.roadmap) {
    writeFileIfMissing(path.join(projectRoot, 'docs', 'ROADMAP.md'), createRoadmapDoc());
  }

  writeFileIfMissing(path.join(projectRoot, 'AGENTS.md'), createAgentsDoc(spec));
  writeFileIfMissing(path.join(projectRoot, '.gitignore'), createGitignoreDoc());

  writeAuditEvent(paths.auditDir, {
    actor: 'system',
    event_type: 'init',
    summary: `Initialized project at ${projectRoot} with ${normalizedProfile} profile`,
    payload: { projectRoot, profile: normalizedProfile, requestedProfile: profile }
  });

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
}

export function handleInitCommand(input: InitCommandInput): boolean {
  initProject(input.projectRoot, getStringOption(input.args, '--profile', 'standard') ?? 'standard');
  return true;
}

function createProjectStateDoc(): string {
  return `# PROJECT_STATE

## Product

Describe the project in one or two sentences.

## Current Phase

bootstrap-development

## Current Status

- HADARA protocol scaffold is initialized.
- First Task Capsule has not been selected yet.

## Single Source of Truth

- Current state: \`docs/PROJECT_STATE.md\`
- Work queue: \`docs/TASK_BOARD.md\`
- Next-session handoff: \`docs/AGENT_HANDOFF.md\`
- Task details: \`tasks/T-*/\`
`;
}

function createAgentHandoffDoc(): string {
  return `# AGENT_HANDOFF

## Current State

- HADARA protocol scaffold is initialized.
- Read \`docs/PROJECT_STATE.md\`, \`docs/TASK_BOARD.md\`, and \`docs/IMPLEMENTATION_SOP.md\` before starting work.

## Last 3 Completed Tasks

| Task | Summary |
|---|---|

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|

## Next Recommended Step

Create or select the first Task Capsule, then record evidence before marking work done.

## Validation Baseline

| Check | Latest Evidence |
|---|---|

## Historical Index

- Completed task history: add a history document here if this handoff grows too large.
- Validation history: add a validation history document here if validation notes grow too large.
`;
}

function createArchitectureDoc(profile: InitProfile): string {
  return `# ARCHITECTURE

## Overview

This project was initialized with HADARA using the \`${profile}\` profile.

## Boundaries

- Keep project source, docs, and Task Capsules in the repository.
- Keep portable/local machine state under \`.hadara/local/\`.
- Do not commit secrets, private logs, or machine-local state.

## Current Components

- Task Capsules in \`tasks/T-*/\`.
- Evidence records in \`EVIDENCE.md\` and \`evidence.jsonl\`.
- Handoff state in \`docs/AGENT_HANDOFF.md\`.
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
  if (spec.docs.decisions) structureRows.push(['`docs/DECISIONS.md`', 'Decision table with ID, Decision, Status, and Rationale columns.']);
  if (spec.docs.testStrategy) structureRows.push(['`docs/TEST_STRATEGY.md`', 'Current Validation Environment, Suites, Required Session Checks, and Special-Case Checks sections.']);
  if (spec.docs.securityModel) structureRows.push(['`docs/SECURITY_MODEL.md`', 'Default Mode, Invariants, and Special Checks sections.']);
  if (spec.docs.refactorLog) structureRows.push(['`docs/REFACTOR_LOG.md`', 'Format section with Date, Area, Change, and Evidence columns.']);
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

When adding project-specific specs, contracts, or roadmap files, add them to this table and explain when agents must read them. A future HADARA command may automate this registration; for now, update this table manually.

## Init Profile Matrix

| Profile | Scale | Generated Docs | Intended Use | Special Notes |
|---|---|---|---|---|
| \`basic\` | Small | Core session docs only | Small projects that need Task Capsules, evidence, and handoff discipline without planning overhead. | SOP required reading references only core docs plus active Task Capsule docs. |
| \`standard\` | Medium, default | Core docs plus planning, architecture, decision, and validation docs | Most multi-session projects that need roadmap slices and repeatable validation. | Does not assume release, security-smoke, MCP, provider, dashboard, or Hermes surfaces. |
| \`governed\` | Heavy | Standard docs plus security, refactor log, and roadmap docs | Long-lived projects with stronger governance, release planning, security boundaries, or operational surfaces. | Project-specific contracts still must be manually registered in Required Reading. |

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
4. Add security, release, install, provider, MCP, or dashboard smoke checks only after those surfaces exist and are documented for this project.

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

| ID | Decision | Status | Rationale |
|---|---|---|---|

Record project-level decisions here. Keep task-local decisions inside the active Task Capsule unless they change project architecture or workflow.
`;
}

function createRefactorLogDoc(): string {
  return `# REFACTOR_LOG

## Format

| Date | Area | Change | Evidence |
|---|---|---|---|

Record meaningful removals, replacements, and migrations here.
`;
}

function createSecurityModelDoc(): string {
  return `# SECURITY_MODEL

## Default Mode

Use assisted development by default: read, edit, and validate deliberately, and ask for explicit approval before risky mutation.

## Invariants

| Invariant | Rule |
|---|---|
| Secrets | Do not write secrets, private logs, environment dumps, or token values into committed files. |
| Local state | Keep machine-local state under ignored local paths such as \`.hadara/local/\`. |
| Evidence | Public evidence must be reduced and safe to commit. |
| Commands | Do not run dangerous or destructive commands unless the user explicitly requests and approves them. |

## Special Checks

Security, release, install, provider, MCP, or deployment smoke tests are project-specific. Add them to \`docs/TEST_STRATEGY.md\` only after those surfaces exist.
`;
}

function createTestStrategyDoc(): string {
  return `# TEST_STRATEGY

## Current Validation Environment

Describe the normal validation environment for this project.

## Suites

| Suite | Command | Purpose |
|---|---|---|
| Unit | TBD | Fast checks for local logic. |
| Integration | TBD | Cross-module or external-boundary checks when they exist. |
| Full | TBD | The strongest routine validation command for task completion. |

## Required Session Checks

Before marking a Task Capsule Done:

1. Run the relevant suite from the table above.
2. Run \`hadara harness validate --task <task-id> --json\`.
3. Record evidence in the Task Capsule.

## Special-Case Checks

| Check Type | Add Only When |
|---|---|
| Security smoke | The project has documented security boundaries or secret-handling behavior. |
| Release smoke | The project has documented release or package behavior. |
| Install smoke | The project has documented installer or deployment behavior. |
| Provider/MCP smoke | The project has documented provider or MCP surfaces. |
`;
}

function createRoadmapDoc(): string {
  return `# ROADMAP

## Near Term

- Define the first Task Capsule.
- Attach evidence for meaningful checks.
- Keep handoff current between sessions.

## Deferred

- Dashboard read model.
- Real provider adapters.
- MCP server expansion.
`;
}

function createAgentsDoc(spec: InitProfileSpec): string {
  const requiredReading = [
    '`docs/PROJECT_STATE.md`',
    '`docs/AGENT_HANDOFF.md`',
    '`docs/TASK_BOARD.md`',
    '`docs/IMPLEMENTATION_SOP.md`',
    ...(spec.docs.developmentSlices
      ? ['`docs/DEVELOPMENT_SLICES.md` when starting, completing, or reclassifying a development slice']
      : []),
    'Active `tasks/T-*/TASK.md`',
    'Task Capsule files required by `docs/IMPLEMENTATION_SOP.md`',
    'Project-specific specs, contracts, or roadmap documents listed in `docs/IMPLEMENTATION_SOP.md`'
  ];
  const trackedStateDocs = [
    '`docs/TASK_BOARD.md`',
    '`docs/PROJECT_STATE.md`',
    ...(spec.docs.developmentSlices ? ['`docs/DEVELOPMENT_SLICES.md`'] : [])
  ];

  return `# AGENTS

This repository must be developed using the HADARA protocol.

## Required Reading

${numberedList(requiredReading)}

\`docs/AGENT_HANDOFF.md\` is compact current-state handoff, not full project history. Follow its Historical Index when older completed-task or validation history is needed.

## Rules

- Keep work inside one Task Capsule whenever possible.
- If no suitable Task Capsule exists, create one before implementation with \`hadara task create <title>\` by default.
- Do not mark work done without evidence.
- Do not execute dangerous commands.
- Do not write secrets, private logs, or machine-local state into committed files.
- Preserve the portable/project store boundary.
- Follow validation constraints recorded in \`docs/AGENT_HANDOFF.md\` and the active Task Capsule.
- Update \`EVIDENCE.md\` and \`evidence.jsonl\` for meaningful checks.
- Update ${formatInlineList(trackedStateDocs)} when their tracked state changes.
- Update \`docs/AGENT_HANDOFF.md\` before stopping.
${spec.docs.developmentSlices ? '- Respect prerequisite order in `docs/DEVELOPMENT_SLICES.md`.' : ''}
- Add project-specific required reading to \`docs/IMPLEMENTATION_SOP.md\` before expecting agents to rely on it.
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
data/

# Environment and machine-local files
.env
.env.*
.DS_Store
Thumbs.db
`;
}
