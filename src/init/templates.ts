import { managedSectionBlock } from '../services/managed-sections';
import packageJson from '../../package.json';
import {
  createInitialProjectCurrentState,
  PROJECT_CURRENT_STATE_PATH,
  renderHandoffCanonSection,
  renderProjectStateCanonSection,
  type ProjectCurrentState
} from '../services/project-current-state';
import type { InitProfile, InitProfileSpec, InitProjectMetadata } from './types';

export function createScaffoldJson(profile: InitProfile): string {
  return `${JSON.stringify({
    schemaVersion: 'hadara.projectScaffold.v1',
    hadaraProtocol: '0.4',
    profile,
    taskCapsuleSchema: 'hadara.taskCapsule.v1',
    docsRegistrySchema: 'hadara.docsRegistry.v2',
    managedSlotSchema: 'hadara.managedSlot.v2',
    createdWith: `hadara@${packageJson.version}`,
    docsRegistryPath: '.hadara/docs-registry.json',
    slotRegistryPath: '.hadara/slot-registry.json'
  }, null, 2)}\n`;
}

export function createSlotRegistryJson(): string {
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

export function createHadaraWorkflowDoc(profile: InitProfile): string {
  return `# HADARA_WORKFLOW

## Purpose

This document explains when to use HADARA CLI surfaces and when to update HADARA documents during normal project work.

Use HADARA read models first. Do not manually read broad project files unless a HADARA command points you there or the task explicitly requires it.

## Quickstart

Use this section for the first pass through a new scaffold. Read the detailed sections below only when you reach that situation.

| Situation | First Action |
|---|---|
| New project created | Read \`AGENTS.md\`, then follow its profile-specific Required Reading. |
| Need work to do | Run \`hadara task status --json\`. |
| Need a task | Run \`hadara task create "task title" --json\`, then fill \`TASK.md\` Goal, Source Documents, Plan, and Acceptance. |
| Need project-specific docs | Use \`hadara docs add <type> --json\`, or create a Markdown file directly and register it with \`hadara docs register\`. |
| Need files to inspect | Use \`hadara task status --task T-XXXX --json\`, docs read-map, and explicit file reads. |
| Ready to close | Run \`hadara task close --task T-XXXX --json\` for the ordinary guarded close path; it records readiness evidence and close proof when needed. Use \`--dry-run\` only when a separate reviewer needs the plan. |

## Minimal Loop

\`\`\`text
1. \`hadara task status --json\`
2. \`hadara task status --task T-XXXX --json\` when resuming or changing tasks
3. \`hadara task create "task title" --json\` only when no suitable capsule exists
4. update \`TASK.md\`
5. implement the scoped change
6. run real validation
7. record evidence
8. update task docs and any generated \`docs/\` files whose subject changed
9. run \`task close --json\` for ordinary clean work
10. use \`task close --dry-run\` and a reviewed \`--plan-hash\` only when an external review flow requires it
\`\`\`

## Read Authority Rules

Agents must follow this read order:

| Order | Authority | Allowed Reads |
|---:|---|---|
| 1 | HADARA CLI read models | \`status\`, \`task status\`, docs registry/read-map reports, and explicit context graph diagnostics. |
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

If you need to save init JSON before the scaffold exists, prefer writing it outside
the target directory, for example \`hadara init --json > /tmp/hadara-init.json\`.
HADARA tolerates a zero-byte \`init.json\` that a shell creates before the command
starts, but a non-empty output file in the project root is treated as existing
project content.

After init, review:

| Step | Document | Purpose |
|---|---|---|
| 1 | \`AGENTS.md\` | Entry rules and required reading. |
${profile === 'basic' ? '' : '| 2 | `.hadara/context/HADARA_CONTEXT.md` | Compact read routing. |\n| 3 | `docs/PROJECT_STATE.md` | Human-readable product and phase state. |\n'}| ${profile === 'basic' ? '2' : '4'} | \`docs/TASK_BOARD.md\` | Inspectable task index and active-work source. |
| ${profile === 'basic' ? '3' : '5'} | \`docs/HADARA_WORKFLOW.md\` | How to work with HADARA from this point forward. |

Use project-specific docs only after they are created and routed through the docs registry, a read-map, or the active task.

## Generated Docs Completion

\`hadara init\` creates the minimum docs needed for safe work. Generated docs are not decorative placeholders. When a task changes the product, architecture, workflow, validation, security boundary, roadmap, or agent operating model, update the matching generated or project-owned \`docs/\` file before task close.

At minimum:

| Document | Update When |
|---|---|
| \`docs/PROJECT_STATE.md\` | When present, product name, purpose, current phase, or capability state changes. |
| \`docs/TASK_BOARD.md\` | Task lifecycle changes; normally \`task create\` and \`task close\` own this. |
| \`docs/AGENT_HANDOFF.md\` | Present in governed projects and continuation state or warnings change. |
| Optional docs | Their subject changes after they are added. |

Do not leave generated docs in scaffold form after completing the first real capability. If a document is no longer useful, remove it from desired state with docs registry commands instead of letting stale prose remain authoritative.

## Optional Project Docs

Do not create broad planning docs just because a profile exists. Add them only when the project has real content to maintain.

\`\`\`bash
hadara docs add architecture --json
hadara docs add decisions --json
hadara docs add roadmap --json
hadara docs add security-model --json
hadara docs add agent-guide --json
\`\`\`

\`docs add\` is dry-run-first. Review the returned \`executeCommand\`, then run it when the file should become part of the project. If you write a custom Markdown file directly, register it with \`hadara docs register --path <path> --json\` and execute the reviewed registry update.

## Session Start

Use task status at the beginning of a human/agent work session, after switching tasks, or when project state is unclear.

\`\`\`bash
hadara task status --json
hadara task status --task T-XXXX --json
\`\`\`

\`task status\` reads the Task Board, Task Capsules, and human-readable routing docs. It does not create tasks, append evidence, warm caches, validate completion, or close work. The deprecated top-level \`status\` alias calls the same evaluator. Use docs read-map and explicit file reads when task-specific source context is needed.

## Selecting or Creating Work

\`\`\`bash
hadara task status --json
hadara task create "task title" --json
hadara task status --task T-XXXX --json
\`\`\`

Use \`task status --json\` to decide what to work on when no task is selected. Use \`task create\` only when no suitable capsule exists. Use \`task status --task T-XXXX --json\` as a fast selected-task loop cockpit for evidence, loop phase, and suggested next actions. Use \`task close --task T-XXXX --dry-run --json\` or \`task status --task T-XXXX --detail full --json\` when you need close-grade readiness diagnostics.

Task selection is a review decision, not title generation. Current human or reviewer instructions have highest priority. Then read the routed project state, governed handoff when present, development/roadmap sources, Task Board, and the previous capsule handoff. A handoff \`Next Recommended Step\` is one input and must not be copied verbatim as a task title. If a new capsule is still warranted, choose a short behavior-focused title. If planned work is exhausted, review for design gaps or useful optimization and propose a next step or ask the reviewer instead of manufacturing work.

## Task Context

Use \`hadara task status --task T-XXXX --json\`, docs read-map, and the selected Task Capsule to decide which files to inspect. Use \`hadara context graph --task T-XXXX --json\` only for explicit graph diagnostics; public \`context pack\` routing has been removed.

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
run the guarded task close transaction
stop when task close returns closed-valid
\`\`\`

Use the high-level lifecycle path for ordinary work:

\`\`\`bash
hadara task status --task T-XXXX --json
hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --dry-run --json
hadara task close --task T-XXXX --execute --plan-hash sha256:... --json
\`\`\`

Use the explicit \`--plan-hash\` form only when a reviewed dry-run plan needs to cross a human or external automation boundary. The ordinary path is \`task close --json\`; it still performs the dry-run, folds in the current plan hash internally, and aborts if the close-source world changes before the write.

\`task close\` is the public close transaction. Use \`task status --task T-XXXX --detail full --json\` for diagnostics.

Do not hand-edit lifecycle-owned status fields to force closure. \`TASK.md\` Identity \`Status\` and \`docs/TASK_BOARD.md\` Status are updated by \`task create\` and \`task close\`. Before close, keep prose tables such as Plan, Acceptance, Validation, Changes, Risks, and History current; let close move the lifecycle status to Done.

## Close Entry Gate

Before running \`hadara task close\`, all of these must be true:

| Gate | Required State |
|---|---|
| Goal | \`TASK.md\` has a concrete task goal. |
| Source Documents | Relevant sources are listed, or the task explicitly records that none are required. |
| Plan | \`TASK.md\` Plan has the intended work steps. |
| Acceptance | \`TASK.md\` Acceptance has the completion criteria. |
| Validation | At least one validation method is defined, or a documented reason explains why validation is not applicable. |

Do not use status/close to avoid authoring the task contract.

## Task Document Timing

HADARA Task Capsules contain \`TASK.md\`, \`HANDOFF.md\`, \`EVIDENCE.md\`, and \`evidence.jsonl\`.

| Timing | Update |
|---|---|
| Capsule created | Start \`TASK.md\` Goal, Source Documents, Plan, and Acceptance. |
| Before execution | Refine \`TASK.md\` Plan, Source Documents, and Acceptance. |
| During execution | Update \`TASK.md\` Plan, Change Summary, Risks / Follow-ups; update \`HANDOFF.md\` warnings if continuity changes. |
| After validation | Use \`validation run\` when possible; record evidence, then update \`TASK.md\` Validation and Acceptance deliberately with evidence ids or residual notes. |
| Before close | Finish \`TASK.md\` Change Summary, Acceptance, Validation, Risks / Follow-ups; update task-local \`HANDOFF.md\`. Registered existing Project State/Handoff managed checkpoints are projected by close. |
| Close execute | Run \`task close --json\`. Do not edit close-source docs during execute. |
| Close review | Use \`task close --dry-run --json\` only when a separate review/debug path is needed. |
| After close | Only clarify docs if the task contract did not change; rerun task close after close-source edits. |

Do not hand-edit \`TASK.md\` Identity \`Status\`, \`docs/TASK_BOARD.md\` Status, \`evidence.jsonl\`, or generated \`EVIDENCE.md\` projections. Use \`task close --json\` for normal closure; use \`task status --task T-XXXX --detail full --json\` or \`task close --dry-run --json\` when the close path is blocked and you need repair guidance.

## Evidence

\`\`\`bash
hadara validation run --task T-XXXX --check "Focused tests" -- npm test
hadara validation run --task T-XXXX --check "Focused tests" --json -- npm test
hadara validation run --task T-XXXX --check "Focused tests" --direct-result passed --direct-summary "npm test passed directly" --update-task --json
hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --json
hadara evidence list --task T-XXXX --json
hadara evidence project --task T-XXXX --json
\`\`\`

Use \`validation run\` for ordinary validation because it executes the command, records durable evidence from the real exit status, and refreshes \`EVIDENCE.md\`. Its controlled \`execution.failureClass\` is \`assertion\` for a started non-zero command, \`timeout\` for an expired command, \`environment-setup\` for launch/preparation failures, and \`none\` for success. Add \`--update-task\` only when you intentionally want the matching \`TASK.md\` Validation row updated by the CLI.
Place HADARA flags such as \`--json\` before the child-command separator \`--\`; tokens after \`--\` are passed to the validation command.

If the wrapper cannot launch a command in the current tool environment (for example \`EPERM\`, \`EACCES\`, or \`ENOENT\`) but the same command runs directly, record the direct result through \`validation run\` so validation-check resolution tags and optional TASK.md row sync remain consistent:

\`\`\`bash
hadara validation run --task T-XXXX --check "Focused tests" --direct-result passed --direct-summary "npm test passed directly after validation wrapper launch failure" --update-task --json
\`\`\`

Use \`evidence add-command\` only when recording an already-run result supplied by the operator. It does not execute shell commands. Use \`evidence list\` to find durable evidence ids for docs and resolution markers.

Do not hand-edit \`evidence.jsonl\`.
Evidence appends are task-scoped and internally serialized by a local lock, so independent \`validation run\` or \`evidence add-command\` calls may run in parallel. JSON evidence responses include \`evidence.appendLock\` so lock contention and wait time are visible when it happens.

Evidence must reflect real execution results. Fabricated or assumed results are invalid.

\`evidence project\` is the 0.4 projection refresh surface. It refreshes the generated \`EVIDENCE.md\` projection file without rewriting canonical evidence.

## Repair and Diagnostics

\`\`\`bash
hadara task status --task T-XXXX --detail full --json
hadara task close --task T-XXXX --dry-run --json
hadara harness validate --task T-XXXX --level done --json
hadara init doctor --json
\`\`\`

Use task close dry-run as the ordinary close-proof repair plan. Use diagnostics when task close reports blockers. Do not repair close proof by editing evidence files by hand.

Agents should inspect \`task close --dry-run --json\` before close when the result is not already familiar. For ordinary clean capsules, \`task close --json\` performs the dry-run and current-plan verification internally and records idempotent validation-category readiness evidence before close proof when close evidence is still required. For externally reviewed flows, use the current \`planHash\` from the reviewed dry-run.

Before task close, finish all close-source text, including the manual \`TASK.md ## History\` table. Append a final row such as \`| 2026-06-12 | Done | Finished task capsule. |\`; done-level validation blocks \`TASK.md\` when its persistent status is \`Done\` but the latest History row is not \`Done\`.

## Useful CLI by Situation

| Situation | Use | Notes |
|---|---|---|
| New HADARA project | \`hadara init --profile <profile> --json\` | Creates scaffold docs and registries. |
| Check scaffold health | \`hadara init doctor --json\` | Reports missing or inconsistent scaffold files. |
| Update product metadata | \`hadara project-state update --name "..." --purpose "..." --json\` | Dry-run managed update for \`docs/PROJECT_STATE.md\` Name/Purpose; execute with the reviewed \`beforeHash\`. |
| Find next work | \`hadara task status --json\` | Read-only selection cockpit. |
| Inspect selected task | \`hadara task status --task T-XXXX --json\` | Fast loop phase and next-action projection. |
| Inspect close-grade diagnostics | \`hadara task status --task T-XXXX --detail full --json\` | Heavier readiness/protocol projection for explicit diagnostics. |
| Find task-specific context | \`hadara task status --task T-XXXX --json\` and docs read-map | Use before broad manual reads. |
| Read exact source text | \`hadara context slice ... --json\` | Use after a context candidate points to a range. |
| Update slice state | \`hadara slice add/set/render ... --json\` | Use when roadmap/development slice state applies. |
| Run and record validation | \`hadara validation run --task T-XXXX --check "..." -- <command>\` | Executes the command and records evidence without editing \`TASK.md\` by default. |
| Run and record validation JSON | \`hadara validation run --task T-XXXX --check "..." --json -- <command>\` | Put \`--json\` before \`--\`; everything after \`--\` belongs to the child command. |
| Run, record, and sync task row | \`hadara validation run --task T-XXXX --check "..." --update-task -- <command>\` | Executes the command, records evidence, and updates the matching \`TASK.md\` Validation row. |
| Record direct validation result | \`hadara validation run --task T-XXXX --check "..." --direct-result passed --direct-summary "..." --update-task --json\` | Records an already-run direct result when wrapper launch is blocked by the tool environment. |
| Record already-run validation | \`hadara evidence add-command ... --json\` | Append-only evidence writer; does not execute commands. |
| Find evidence ids | \`hadara evidence list --task T-XXXX --json\` | Durable id discovery. |
| Review loop phase | \`hadara task status --task T-XXXX --json\` | Normal lifecycle state and next action. |
| Close ordinary work | \`hadara task close --task T-XXXX --json\` | Default guarded close path for clean capsules; records readiness evidence and close proof when needed. |
| Externally reviewed close | \`hadara task close --task T-XXXX --dry-run --json\` then execute with its \`planHash\` | Use when a human or automation explicitly reviews and carries the dry-run plan. |
| Repair close drift | \`hadara task close --task T-XXXX --dry-run --json\` then execute with the reviewed \`planHash\`, or rerun ordinary \`task close --json\` | Default repair path for stale close proof. |
| Register project-specific docs | \`hadara docs register --path <path> --json\` | 0.4 registry surface. Canonical state belongs in \`.hadara/docs-registry.json\`; use registry-backed help for exact options. |
| Discover command details | \`hadara help lifecycle\`, \`hadara help command <id>\`, \`hadara commands --json\` | Prefer registry-backed help over copied command tables. |

## Common Failure Modes

| Failure Mode | Correct Behavior |
|---|---|
| Skipping read models and scanning the repository. | Start with session/task/context read models and only open routed files. |
| Opening unrelated specs or historical docs. | Use read tiers, registry metadata, and task/docs read models. |
| Running lifecycle before \`TASK.md\` is authored. | Satisfy the Lifecycle Entry Gate first. |
| Treating read-routing as validation. | Use read models only for guidance; run real checks separately. |
| Recording evidence for checks that were not run. | Record only real execution results, including failed or blocked checks. |
| Running close from memory without current docs. | Use \`task close --json\` after close-source docs are current, or review fresh \`task close --dry-run\` output and copy its current plan hash for external review flows. |
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
| \`HANDOFF.md\` identity | Reviews | Does not hand-edit CLI-owned fields | Creates and lifecycle-updates |
| \`HANDOFF.md\` prose/tables | Reviews | Writes WIP checkpoints and close-time continuation guidance | Validates during close; does not rewrite prose |
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

export function createHermesIntegrationDoc(): string {
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

export function createMcpIntegrationDoc(): string {
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

export function createProjectStateDoc(profile: InitProfile, providedState?: ProjectCurrentState, metadata: InitProjectMetadata = {}): string {
  const currentState = providedState ?? createInitialProjectCurrentState(profile);
  const productName = metadata.name?.trim() || 'Project name not set';
  const productPurpose = metadata.purpose?.trim() || 'Project purpose not set';
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
| Name | ${escapeTableCell(productName)} |
| Purpose | ${escapeTableCell(productPurpose)} |
| HADARA Profile | ${profile} |
`);
  return `# PROJECT_STATE

${renderProjectStateCanonSection(currentState)}

## Product

${productTable}

## Current Phase

| Field | Value |
|---|---|
| Phase | bootstrap-development |
| Status | initialized |

## Current Status

| Area | Status | Notes |
|---|---|---|
| Continuation | Canonical projection above | Use the structured state and active Task Capsule instead of reconstructing status from prose. |

## Single Source of Truth

| Source | Path | Purpose |
|---|---|---|
| Structured current state | \`${PROJECT_CURRENT_STATE_PATH}\` | Release, task continuity, next intent, current problems, and validation baseline. |
| Current-state projection | \`docs/PROJECT_STATE.md\` | Human-readable product and capability projection. |
| Work queue | \`docs/TASK_BOARD.md\` | Task status and queue. |
${handoffRow}| Workflow | \`docs/HADARA_WORKFLOW.md\` | Generic HADARA lifecycle and evidence rules. |
| Task details | \`tasks/T-*/\` | Task-local evidence and decisions. |
`;
}

export function createTaskBoardDoc(): string {
  const taskBoardTable = managedSectionBlock('task-board', {
    schema: 'hadara.managedSection.v1',
    owner: 'task.close',
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

export function createAgentHandoffDoc(providedState?: ProjectCurrentState): string {
  const currentState = providedState ?? createInitialProjectCurrentState('governed');
  return `# AGENT_HANDOFF

${renderHandoffCanonSection(currentState)}

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Task queue | \`docs/TASK_BOARD.md\` | Locate open and completed capsules. |
| Task handoffs | \`tasks/T-*/HANDOFF.md\` | Review a specific capsule outcome. |
| Task evidence | \`tasks/T-*/evidence.jsonl\` | Audit canonical evidence records. |
| Validation summaries | \`tasks/T-*/EVIDENCE.md\` | Review human-readable validation summaries. |
`;
}

function escapeTableCell(value: string): string {
  return value.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim();
}

export function createArchitectureDoc(profile: InitProfile): string {
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

export function formatTableRow(columns: string[]): string {
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

export function createDecisionsDoc(): string {
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

export function createSecurityModelDoc(): string {
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
| Security smoke | Task Capsule evidence | The project has documented security boundaries. |
| Secret scan | Task Capsule evidence | The project handles credentials, tokens, private logs, or environment dumps. |
| Permission review | Task Capsule evidence | A change modifies write, delete, publish, or deploy behavior. |
`;
}

export function createRoadmapDoc(): string {
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

export function createAgentGuideDoc(): string {
  return `# AGENT_GUIDE

## Purpose

Describe how coding agents should work with this project beyond the generic HADARA workflow.

## Project Modules

| Path | Purpose | Notes |
|---|---|---|
| TBD | TBD | Replace with project-specific entry points. |

## Working Rules

1. Keep changes inside the active Task Capsule scope.
2. Prefer deterministic local validation.
3. Record project-specific constraints here only when they help future agents avoid mistakes.

## Common Commands

| Need | Command |
|---|---|
| Run the primary validation check | TBD |
| Start the local app or tool | TBD |

## Extension Notes

Add concise guidance for new modules, templates, integrations, or domain-specific conventions as they become real.
`;
}

function createTaskWorkflowCommandsDoc(): string {
  return `# TASK_WORKFLOW_COMMANDS

HADARA task workflow commands are split by responsibility. Similar-looking commands are not interchangeable: some only report state, some check readiness, some perform bounded bookkeeping writes, and some append close evidence.

## Required Reading Tier

\`docs/TASK_WORKFLOW_COMMANDS.md\` is \`task-work\` required reading. Read it when selecting, implementing, finishing, closing, auditing, or changing task workflow commands; do not treat it as a historical archive or a replacement for current-state docs. Start from \`.hadara/context/HADARA_CONTEXT.md\` and compact state docs, then use this document for lifecycle command semantics.

## Standard Task Loop

From 0.5 onward, agents should use the status-first close loop for ordinary implementation capsules:

\`\`\`bash
hadara task status --json

# If a matching capsule already exists:
hadara task status --task T-XXXX --json

# If no matching capsule exists, create one first:
hadara task create "task title" --json
hadara task status --task T-XXXX --json

# Do the scoped work.

# If this task changes roadmap/development slice state:
hadara slice list --json
hadara slice set --id M1 --status done --done-evidence ev:T-XXXX:... --json

hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --idempotency-key "command:T-XXXX:check" --json

# Finalize Task Capsule docs and tracked state docs before closing.

hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --dry-run --json
hadara task close --task T-XXXX --execute --plan-hash sha256:... --json
\`\`\`

\`task close --json\` is the ordinary guarded close path. \`task close --dry-run --json\` reports the current lifecycle step, write boundaries, expected write paths, and a current \`planHash\` when a human or external automation explicitly needs to carry a reviewed dry-run plan.

Low-level proof-boundary command surfaces were removed from public routing:

\`\`\`bash
hadara task status --task T-XXXX --detail full --json
hadara task close --task T-XXXX --dry-run --json
hadara task close --task T-XXXX --json
\`\`\`

\`task close\` owns the bounded close sequence. \`task status --task T-XXXX --detail full --json\` owns diagnostics.

The close model has three separate phases: validation proves readiness, close records the proof, and audit checks the already-recorded close evidence. Close evidence is excluded from the current validation loop because it is appended after validation; requiring it as a same-run precondition would create a fixed-point loop.

\`task close --dry-run\` and \`task status --detail full\` include done-level Task Capsule validation. In the ordinary path, do not run \`validation run -- ... harness validate ...\` only to create a readiness proof: \`task close --json\` records readiness evidence and close proof against the virtual post-finish capsule state when needed, then commits lifecycle-owned Done bookkeeping before the final audit. Use \`hadara harness validate --task T-XXXX --level done --json\` directly only when debugging capsule format, status-history, acceptance, evidence, or handoff validation failures.

For current v2 \`TASK.md\`, the manual \`## History\` table is close-source. Before task close, append a final row such as \`| 2026-06-12 | Done | Finished task capsule. |\`. \`task status\` and \`task close --dry-run\` surface this as authoring guidance before close; done-level validation blocks a \`TASK.md\` whose persistent status is \`Done\` but whose latest History row is not \`Done\`.

## Status Token And Ownership Policy

HADARA uses separate token families for persistent state, derived proof state, document registry state, and evidence outcomes. Do not collapse these families into a single Markdown \`Status\` field.

### TaskStatus

\`TaskStatus\` is persistent task lifecycle state in \`TASK.md\` metadata, the \`## Status\` section, Status History rows, and the command-owned cells of \`docs/TASK_BOARD.md\`.

| Token | Meaning | Writer |
|---|---|---|
| \`Draft\` | Task capsule exists but implementation is not started or not yet ready for done-level validation. | \`task create\`, worker docs |
| \`In Progress\` | Work is actively being performed. | Worker docs |
| \`Blocked\` | Work cannot proceed without a recorded blocker. | Worker docs |
| \`Done\` | Scoped work is implemented and ready for done-level validation/close. | \`task close\` |
| \`Partial\` | Deliberate partial completion with remaining scope deferred or split. | Worker/coordinator docs |
| \`Superseded\` | Task has been replaced by another task or line. | Worker/coordinator docs |
| \`Archived\` | Task is no longer active state and is retained only for history. | Worker/coordinator docs |

Reserved non-TaskStatus strings include \`Closed\`, \`Ready\`, \`Approved\`, \`Complete\`, \`closed-valid\`, \`not-closed\`, and phrases such as \`Done pending lifecycle close\`. Use \`TaskStatus: Done\`; get close proof state from \`task status --detail full\`, \`task close\`, \`status\`, or \`protocol doctor\` read models.

### CloseState

\`CloseState\` is derived proof state from close evidence and close/status read models; it is not written as persistent \`TaskStatus\` and should not be stored in task-local \`HANDOFF.md\` current-state tables.

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
| \`TASK.md\` status metadata, \`## Status\`, and Status History | Command-owned for task close bookkeeping; worker-owned before close. |
| \`docs/TASK_BOARD.md\` ID/title/status/capsule cells | Command-owned by \`task close\`; Notes and extra cells are mixed/human-owned. |
| \`EVIDENCE.md\` and \`evidence.jsonl\` | Evidence writer-owned; do not hand-edit \`evidence.jsonl\`. Treat \`evidence.jsonl\` as canonical and \`EVIDENCE.md\` as a non-canonical human summary; evidence rebuild is not implemented in this scaffold and any future execute mode must be dry-run-first and before-hash guarded. |
| Task-local \`HANDOFF.md\` Identity table | Command-owned for \`ID\`, \`Title\`, \`Status\`, \`Created\`, and \`Updated\` during task create/close bookkeeping. |
| Task-local \`HANDOFF.md\` prose/tables | Worker-owned close-time handoff guidance. Persist \`TaskStatus\` only; \`CloseState\` is derived by status/close/state read models and should not be written into close-source handoff tables. |
| Shared state docs | Optional registered documents. Close updates existing Project State/Handoff managed checkpoints; human prose remains user-owned. |
| \`.hadara/docs-registry.json\` and \`docs/DOC_REGISTRY.md\` | Docs registry-owned; registry mutations should stay dry-run-first or explicitly scoped. |

Before task close, finish Task Capsule docs, acceptance/tests/handoff notes, and evidence summaries. Task Board bookkeeping and existing registered Project State/Handoff managed checkpoints are projected by close. Optional shared prose remains human-owned, and Development Slices applies only when it already links the selected task. \`HANDOFF.md\` may be updated during the task as a work-in-progress checkpoint. Before close, reread it and convert it into close-time handoff: keep only guidance that remains true after this task closes. After \`task close --json\` or \`task close --execute --plan-hash ...\` reaches close proof, changing close-source documents requires rerunning task close.

## Documentation Timing and Write Coordination

Do not defer all documentation until after implementation. Keep \`PLAN.md\` current before execution; update \`DECISIONS.md\`, \`RISKS.md\`, and \`FILES.md\` during execution; update \`TESTS.md\` and \`EVIDENCE.md\` immediately after validation; update \`ACCEPTANCE.md\` and convert \`HANDOFF.md\` from any WIP checkpoint into close-time handoff. Finish any human-owned shared prose before the close-source hash is captured.

Parallelize read-only discovery, \`rg\`/file inspection, independent validation commands, package or registry metadata inspection, read-only diagnostics, and draft preparation before writes.

Serialize same-file prose writes, Task Capsule doc writes, Task Board writes, Project State writes, Agent Handoff writes, before-hash execute operations, \`task close\`, and release artifact or publish operations. Evidence commands may run in parallel because each append is internally serialized by a task-scoped local lock; JSON responses include \`evidence.appendLock\` with \`contended\`, \`waitedMs\`, \`timeoutMs\`, and the lock path.

## Command Semantics

| Command | Default Write Behavior | Notes |
|---|---|---|
| \`task status\` | Read-only | Without \`--task\`, selects next work. With \`--task\`, default output is a fast loop cockpit; use \`--detail full\` or \`task close --dry-run\` for close-grade readiness diagnostics. |
| \`task create\` | Write | Creates a Draft Task Capsule and Task Board row. It does not imply the task is ready or done. |
| \`evidence add-command\` | Write | Appends operator-supplied command-log evidence. It does not execute shell commands or capture stdout/stderr; optional \`--category\`/\`--outcome\`/\`--resolves\`/\`--supersedes\` enrich v2 metadata, result/outcome mismatches are rejected, optional \`--idempotency-key\` prevents duplicate same-key records, and JSON responses expose \`evidence.appendLock\` wait diagnostics. |
| \`validation run\` | Execute + evidence append | Runs a real command, records validation evidence, and classifies failure as assertion, timeout, or environment-setup. If the wrapper cannot launch the command in the current environment, run the command directly and record the direct result with \`validation run --direct-result\`. |
| \`task next\` / \`task show\` | Fully removed public commands | Prefer \`task status --json\` and \`task status --task T-XXXX --json\`. |
| \`task lifecycle\` | Fully removed public command | Prefer \`task status --task T-XXXX --json\`. |
| \`task close\` | Executes by default; \`--dry-run\` is read-only; reviewed execute uses \`--plan-hash\` | Default agent close path. Rechecks the current plan, records readiness evidence and close proof against the virtual post-finish state when needed, commits lifecycle-owned Done bookkeeping, stops on blockers, and succeeds only after final audit is \`closed-valid\`. |
| Legacy lifecycle step commands | Removed from public guidance | Use \`task status --detail full\` for diagnostics and \`task close\` for close execution. |
| \`task complete\` | Fully removed public command | Prefer \`task status\` and \`task close\` for current agent flows. |

## Non-Overlap Rules

- \`task status --json\` chooses work; it does not create a capsule or infer completion.
- \`task status\` is an operator console; \`ok: true\` means report generation succeeded, not that the task is ready.
- Readiness diagnostics are exposed through \`task status --detail full\` and \`task close --dry-run --json\`.
- \`harness validate\` is a direct diagnostic for Task Capsule structure and done-level gates; it is not a replacement for close evidence and is not required as a separate evidence wrapper before ordinary \`task close --json\`.
- \`task complete\` and \`task lifecycle\` are fully removed public commands. Prefer \`task status\` and \`task close\`.
- \`task close\` owns close-proof repair planning and ordinary execution. Reviewed execute uses a matching current dry-run \`planHash\`, runs phases serially, stops on blockers, and returns success only after the final audit is \`closed-valid\`.
- \`evidence list\` is the supported evidence id discovery surface. Text output shows \`[id] time | category/outcome | visibility | summary\`; JSON records expose \`id\`, \`idSource\`, \`idStability\`, \`persistedSchemaVersion\`, \`category\`, \`outcome\`, and \`tags\`. Use durable persisted \`ev:\` ids for long-lived \`--resolves\` and \`--supersedes\` references. Legacy compatibility ids are inspection-only and are not the preferred durable reference.
- \`evidence add-command\` records an operator-supplied command result; it does not run the command. \`--category\` and \`--outcome\` set persisted v2 metadata explicitly, while \`--result\` remains the legacy-compatible command result. When both are supplied, \`--result\` must match \`--outcome\` for \`passed\`, \`failed\`, \`blocked\`, and \`unknown\`; \`recorded\` and \`not-applicable\` require \`--result unknown\` or no explicit \`--result\`. \`--resolves\` and \`--supersedes\` append exact v2 resolution tags from passed or recorded follow-up evidence. \`--idempotency-key\` is optional; when supplied, same-key repeats return the existing record without appending duplicate Markdown or JSONL rows. Evidence append responses include \`evidence.appendLock\`; if \`contended\` is true, another process held the task-scoped append lock before this write.
- Evidence v2 deferred scope remains explicit: rebuild preview/execute, \`check-id\`, \`subject\`, and a new add-command report schema id are future candidates. Do not infer those commands or schema changes from the current \`evidence list\` and \`evidence add-command\` ergonomics.
- Finalize may update only the bounded Task Capsule status bookkeeping, the matching \`docs/TASK_BOARD.md\` row's command-owned cells, and close evidence append. It must not update handoff, Project State, roadmap docs, or arbitrary evidence after the close-source hash is captured.
- After close proof is recorded, close-source document edits intentionally invalidate the previous close proof. Make those edits before task close, or rerun task close if the edit is unavoidable.
- When \`task close\` returns \`ok:true\` and \`closed-valid\`, report the result and stop. Do not call \`task status\` to reconfirm the audit or select follow-up work unless the current human/reviewer instruction explicitly requires continued work.

## State Documents

\`task close --json\` and \`task close --execute --plan-hash <hash>\` never create optional shared documents or invent broad prose. They update bounded managed checkpoints in registered existing Project State/Handoff documents. Development Slices participates only when it already links the selected task; product narrative remains human-owned.
`;
}

export function createAgentsDoc(spec: InitProfileSpec): string {
  const requiredReadingRows = [
    ['`docs/TASK_BOARD.md`', 'Every session', 'Task queue, task status, and capsule paths.'],
    ['`docs/HADARA_WORKFLOW.md`', 'Every session; whenever using HADARA CLI workflow commands', 'Project start, task lifecycle, evidence, context, document timing, repair, and useful CLI guidance.']
  ];
  if (spec.docs.contextRouter) requiredReadingRows.unshift(['`.hadara/context/HADARA_CONTEXT.md`', 'Every session', 'Compact project-local context anchor and read-routing guide.']);
  if (spec.docs.projectState) requiredReadingRows.splice(spec.docs.contextRouter ? 1 : 0, 0, ['`docs/PROJECT_STATE.md`', 'Every session', 'Human-readable product and phase projection.']);
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

\`AGENTS.md\` owns Required Reading.${spec.docs.contextRouter ? ' `.hadara/context/HADARA_CONTEXT.md` is a compact routing anchor that points to current-state and workflow documents; it is not a second Required Reading authority.' : ''}

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
- Name capsule commits \`T-XXXX Task Title\`, using the capsule ID and title.
- Prefer HADARA read models before broad manual file reading.
- Keep committed state reproducible and project-local.
- Do not write secrets, private logs, raw transcripts, credentials, or machine-local state into committed files.
- Do not hand-edit canonical evidence logs.
- Do not mark work done without evidence.
- Keep Task Capsule docs current as work changes; do not defer all documentation until after implementation.
- Keep generated or project-owned \`docs/\` files current when a task changes their subject. Use \`hadara docs add <type>\` for optional docs, or create Markdown directly and register it with \`hadara docs register\`.
- The selected init profile intentionally omits some project-state and governance documents. Their absence is not a defect. Add optional documents only for a concrete project need, never merely to imitate a larger profile.
- Current human or reviewer instructions override persisted \`Next Recommended Step\` prose when they conflict. Treat handoff next steps as review input, read the routed current/project/development sources, and choose a concise task title yourself only after deciding that a new capsule is still appropriate.
- When planned milestone work is exhausted and no explicit instruction remains, review the result and either propose a justified next step, identify a planning flaw or optimization, or ask the reviewer what to do next. Do not turn stale handoff prose into an automatic task.
- A successful \`task close\` result with \`closed-valid\` is terminal for that capsule. Report it and stop; do not run \`task status\` merely to confirm close or discover another capsule unless the current human/reviewer instruction explicitly requires continued work.
- Do not execute destructive commands.
- Do not run release, publish, package, installer, or other external mutation workflows without explicit operator approval.

## Workflow Reference

Use \`docs/HADARA_WORKFLOW.md\` for project start, task lifecycle, context, evidence, document timing, repair, docs read-map, and useful CLI guidance.
${spec.docs.contextRouter ? '\n## Project Context\n\nUse `.hadara/context/HADARA_CONTEXT.md` as the compact project-local context anchor.\n' : ''}
`;
}

function formatInlineList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export function createGitignoreDoc(): string {
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
