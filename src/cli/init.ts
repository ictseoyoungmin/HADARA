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
    createProjectStateDoc(normalizedProfile)
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

When adding project-specific specs, contracts, or roadmap files, add them to this table and explain when agents must read them. A future HADARA command may automate this registration; for now, update this table manually.

## Init Profile Matrix

| Profile | Scale | Generated Docs | Intended Use | Special Notes |
|---|---|---|---|---|
| \`basic\` | Small | Core session docs only | Small projects that need Task Capsules, evidence, and handoff discipline without planning overhead. | SOP required reading references only core docs plus active Task Capsule docs. |
| \`standard\` | Medium, default | Core docs plus planning, architecture, decision, and validation docs | Most multi-session projects that need roadmap slices and repeatable validation. | Optional integrations must be registered before agents rely on them. |
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
