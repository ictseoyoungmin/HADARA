# HADARA_WORKFLOW

## Purpose

This document explains when to use HADARA CLI surfaces and when to update HADARA documents during normal project work.

Use HADARA read models first. Do not manually read broad project files unless a HADARA command points you there or the task explicitly requires it.

## Quickstart

Use this section for the first pass through a new scaffold. Read the detailed sections below only when you reach that situation.

| Situation | First Action |
|---|---|
| New project created | Read `AGENTS.md`, then `.hadara/context/HADARA_CONTEXT.md`, then this Quickstart. |
| Need work to do | Run `hadara task status --json`. |
| Need a task | Run `hadara task create "task title" --json`, then fill `TASK.md` Goal, Source Documents, Plan, and Acceptance. |
| Need files to inspect | Run `hadara context pack --task T-XXXX --json`, then read only routed files. |
| Need project-specific docs | Use `hadara docs add <type> --json`, or create a Markdown file directly and register it with `hadara docs register`. |
| Ready to close | Run `hadara task finalize --task T-XXXX --execute --auto --json` for the ordinary guarded close path; it records readiness evidence and close proof when needed. Dry-run first only when a separate reviewer needs the plan hash. |

## Minimal Loop

```text
1. `hadara task status --json`
2. `hadara task status --task T-XXXX --json` when resuming or changing tasks
3. `hadara task create "task title" --json` only when no suitable capsule exists
4. update `TASK.md`
5. implement the scoped change
6. run real validation
7. record evidence
8. update task docs and any generated `docs/` files whose subject changed
9. review `task finalize --json` when the close needs external review
10. execute finalize with `--execute --auto` for ordinary clean work, or with a reviewed `--plan-hash` when an external review flow requires it
```

## Read Authority Rules

Agents must follow this read order:

| Order | Authority | Allowed Reads |
|---:|---|---|
| 1 | HADARA CLI read models | `status`, `task status`, `context pack`, docs registry/read-map reports. |
| 2 | Command-returned paths | Files, ranges, candidates, or docs explicitly returned by those read models. |
| 3 | Active Task Capsule | `TASK.md`, `HANDOFF.md`, `EVIDENCE.md`, and task-local evidence summaries for the selected task. |
| 4 | Shared state docs | Only when Required Reading says every session, or when a read model/task explicitly references them. |
| 5 | Conditional reference docs | Only when the task, registry, read-map, or source document table points to them. |

Agents must not scan the repository, open unrelated docs, or infer current state from directory structure when a HADARA read model can route the read.

## Project Start

Use `hadara init` only when creating a new HADARA project or initializing HADARA in an existing project that is not already governed by another HADARA protocol.

```bash
hadara init --json
hadara init --profile basic --json
hadara init --profile standard --json
hadara init --profile governed --json
hadara init doctor --json
```

If you need to save init JSON before the scaffold exists, prefer writing it outside
the target directory, for example `hadara init --json > /tmp/hadara-init.json`.
HADARA tolerates a zero-byte `init.json` that a shell creates before the command
starts, but a non-empty output file in the project root is treated as existing
project content.

After init, review:

| Step | Document | Purpose |
|---|---|---|
| 1 | `AGENTS.md` | Entry rules and required reading. |
| 2 | `.hadara/context/HADARA_CONTEXT.md` | Compact read routing. |
| 3 | `.hadara/state/current.json` | Structured current release, task continuity, next intent, problems, and validation baseline. |
| 4 | `docs/PROJECT_STATE.md` | Human-readable product/phase projection. |
| 5 | `docs/TASK_BOARD.md` | Task index. |
| 6 | `docs/HADARA_WORKFLOW.md` | How to work with HADARA from this point forward. |

Use project-specific docs only after they are created and routed through the docs registry, a read-map, or the active task.

### Installed Package Fallback

Most projects should run the installed `hadara` command directly. In environments where npm cannot create executable bin links, such as some Windows-mounted prefixes, install with `--no-bin-links` and invoke the package entrypoint with Node:

```bash
npm install -g hadara --no-bin-links
node "$(npm prefix -g)/lib/node_modules/hadara/dist/cli/main.js" version --json
node "$(npm prefix -g)/lib/node_modules/hadara/dist/cli/main.js" task status --json
```

For project-local installs, replace `$(npm prefix -g)/lib/node_modules/hadara` with the project-local package path, for example `.hadara-install/node_modules/hadara`. This is an invocation fallback only; generated docs and task command examples still use the normal `hadara ...` form.

## Generated Docs Completion

`hadara init` creates the minimum docs needed for safe task work. Generated docs are not decorative placeholders. They are current-state surfaces that agents must keep aligned when the task changes their subject.

| Document | Update When |
|---|---|
| `docs/PROJECT_STATE.md` | Product identity, current release, phase, current problems, or validation baseline changes. |
| `docs/TASK_BOARD.md` | Task status changes. Prefer HADARA lifecycle commands when possible. |
| `docs/AGENT_HANDOFF.md` | The governed profile uses this for compact continuation guidance; update it before stopping when active/latest work, risks, or next-step guidance changes. |
| Optional project docs | Architecture, decisions, roadmap, security, test strategy, or agent guidance changes after those docs have been added. |

Do not leave generated docs in scaffold form after the first real capability exists. If a generated or registered doc is no longer useful, update its registry state with `hadara docs update`, `hadara docs archive`, `hadara docs supersede`, or `hadara docs unregister` instead of silently ignoring it.

## Optional Project Docs

Use `docs add` when the project needs a project-owned doc that init did not create:

```bash
hadara docs add architecture --json
hadara docs add decisions --json
hadara docs add roadmap --json
hadara docs add security-model --json
hadara docs add test-strategy --json
hadara docs add agent-guide --json
```

`docs add` is dry-run-first. Review its `beforeHash`, then execute with the reported command. It creates the Markdown file only when missing and registers it in `.hadara/docs-registry.json`. If you create a custom Markdown file directly, register it with `hadara docs register --path <path> --json` so read maps and doctor checks can route it.

## HADARA-dev Docker Workflow

HADARA-dev CLI work should prefer the reusable `hadara-dev` Docker workflow when host Node/npm is missing, stale, or inconsistent with the release toolchain.

| Need | Command | Notes |
|---|---|---|
| Check container availability | `docker info` | Start or recreate the reusable container only when Docker itself is available. |
| Sync/build development CLI | `npm run dev:docker-sync-build` | Fast path: copies the minimal build workspace to Docker ext4, runs `npm ci`, `npm run build`, refreshes workspace `dist`, and runs the built CLI smoke. |
| Run the Docker validation wrapper | `npm run dev:docker-check` | Full path: copies the full workspace to Docker ext4 and runs `npm run check`; use for broader repo validation when time permits. |
| Run focused built-CLI smoke | `node dist/cli/main.js <command> ... --json` | Run only after `dist` has been refreshed from the Docker build. |

Do not assume container-global `/usr/local/bin/hadara` is the latest development build. For source changes, build first, refresh `/workspace/dist`, then run built-CLI smokes from `dist/cli/main.js`.

## Session Start

Use status at the beginning of a human/agent work session, after switching tasks, or when project state is unclear.

```bash
hadara status --json
hadara task status --task T-XXXX --json
hadara context pack --task T-XXXX --json
```

`status` is the project/session ingress read model. It does not create tasks, append evidence, warm caches, validate completion, or close work.
When `.hadara/state/current.json` exists, `status` exposes active/latest task, release, next operator intent, validation baseline, and current known problems directly. Use `context pack` only after a task is selected and file context is actually needed.

## Selecting or Creating Work

```bash
hadara task status --json
hadara task create "task title" --json
hadara task status --task T-XXXX --json
```

Use `task status --json` to decide what to work on when no task is selected. Use `task create` only when no suitable capsule exists. Use `task status --task T-XXXX --json` as a fast selected-task loop cockpit for evidence, loop phase, and suggested next actions. Use `task finalize --task T-XXXX --json` or `task status --task T-XXXX --detail full --json` when you need close-grade readiness diagnostics.

## Task Context

```bash
hadara context pack --task T-XXXX --json
```

Use context pack when starting implementation, resuming after a gap, deciding which files to inspect, or avoiding broad manual repo reads. Context pack is reading guidance, not validation.

`context pack` is task-scoped by default. If no task id is supplied, it returns task-selection guidance without running live project-wide graph discovery. Use `hadara task status --json` first, then rerun `hadara context pack --task T-XXXX --json`. Use `hadara context pack --live --json` only when the slower project-wide graph path is explicitly acceptable.

After context pack:

1. Select only relevant files or candidates from the report.
2. Use `context slice` for exact source reads when a range/candidate is available.
3. Add or update `TASK.md` Source Documents for sources that constrain the work.

## Exact Source Slices

```bash
hadara context slice --path <path> --from <line> --to <line> --json
hadara context slice --task T-XXXX --candidate <candidate-id> --json
```

Use context slice only after a read model points to a specific file or range.

## Slice State

Use slice state when the project tracks roadmap or milestone slices.

```bash
hadara slice list --json
hadara slice add --id M1 --title "First slice" --status not-started --json
hadara slice set --id M1 --status done --done-evidence ev:T-XXXX:... --json
hadara slice render --json
```

`.hadara/state/slices.json` is the canonical slice state. `docs/DEVELOPMENT_SLICES.md` is the generated projection. Edit slice state through `hadara slice`; if the Markdown projection drifts, run `hadara slice render --execute --json` after reviewing the dry-run.

## Task Capsule Lifecycle

The authoritative command semantics live in `docs/TASK_WORKFLOW_COMMANDS.md`.

The normal task lifecycle is:

```text
select or create task
read task context
author task contract
do scoped work
record evidence
finish task docs and shared state
review finalize plan
execute finalize with the reviewed plan hash
stop when finalize returns closed-valid
```

Use the high-level lifecycle path for ordinary work:

```bash
hadara task status --task T-XXXX --json

# Finalize Task Capsule docs and tracked state docs before closing.
# Active/latest task facts in the structured canon are synchronized by task finalize; separately authored product/phase context must already be current.

hadara task finalize --task T-XXXX --json
hadara task finalize --task T-XXXX --execute --auto --json
hadara task finalize --task T-XXXX --execute --plan-hash sha256:... --json
```

Use `--execute --auto` for the ordinary guarded close path. Use the explicit `--plan-hash` form only when a reviewed dry-run plan crosses a human or external automation boundary.

Standalone low-level lifecycle command surfaces (`task finish`, `task ready`, `task close`, `task audit-close`, `task complete`, and `task lifecycle`) were removed from public routing. Use `hadara task finalize --task T-XXXX --json` for the step-level dry-run report, `hadara task finalize --task T-XXXX --execute --auto --json` for guarded execution, and `hadara task status --task T-XXXX --detail full --json` for done-level diagnostics including `state.closeState`. Recovery of partially executed finalize runs also completes by rerunning finalize.

Do not hand-edit lifecycle-owned status fields to force closure. `TASK.md` Identity `Status` and `docs/TASK_BOARD.md` Status are updated by `task create` and `task finalize`. Before finalize, keep prose tables such as Plan, Acceptance, Validation, Changes, Risks, and History current; let finalize move the lifecycle status to Done.

## Finalize Entry Gate

Before running `hadara task finalize`, all of these must be true:

| Gate | Required State |
|---|---|
| Goal | `TASK.md` has a concrete task goal. |
| Source Documents | Relevant sources are listed, or the task explicitly records that none are required. |
| Plan | `TASK.md` Plan has the intended work steps. |
| Acceptance | `TASK.md` Acceptance has the completion criteria. |
| Validation | At least one validation method is defined, or a documented reason explains why validation is not applicable. |

Do not use status/finalize to avoid authoring the task contract.

Before running `task finalize --execute`, finish all close-source edits.
Avoid writing volatile close evidence ids into close-source docs.
`HANDOFF.md` may be updated during the task as a work-in-progress checkpoint. Before finalize execute, reread it and convert it into close-time handoff: keep only guidance that remains true after this task closes, remove stale next-step prose, or mark already-completed follow-up work as completed/superseded with the task id that closed it.

## Task Document Timing

HADARA 0.4 Task Capsules contain `TASK.md`, `HANDOFF.md`, `EVIDENCE.md`, and `evidence.jsonl`.

| Timing | Update |
|---|---|
| Capsule created | Start `TASK.md` Goal, Source Documents, Plan, and Acceptance. |
| Before execution | Refine `TASK.md` Plan, Source Documents, and Acceptance. |
| During execution | Update `TASK.md` Plan, Change Summary, Risks / Follow-ups; update `HANDOFF.md` warnings if continuity changes. |
| After validation | Use `validation run` when possible; record evidence, then update `TASK.md` Validation and Acceptance deliberately with evidence ids or residual notes. |
| Before finalize dry-run | Finish `TASK.md` Change Summary, Acceptance, Validation, Risks / Follow-ups; convert `HANDOFF.md` from any WIP checkpoint into close-time handoff with current next-step guidance; update shared state docs when the task changed them. |
| Finalize review | Inspect `task finalize --json` dry-run output and fix reported blockers before execute. |
| Finalize execute | Do not edit close-source docs during execute. |
| After close | Only clarify docs if the task contract did not change; rerun finalize after close-source edits. |

Do not hand-edit `TASK.md` Identity `Status`, `docs/TASK_BOARD.md` Status, `evidence.jsonl`, or generated `EVIDENCE.md` projections. Use `task finalize --execute --auto --json` for normal closure; use `task status --task T-XXXX --detail full --json` when the close path is blocked and you need repair guidance.

## Evidence

```bash
hadara validation run --task T-XXXX --check "Focused tests" -- npm test
hadara validation run --task T-XXXX --check "Focused tests" -- npm run test:focused -- tests/unit/<file>.test.ts
hadara validation run --task T-XXXX --check "Focused tests" --direct-result passed --direct-summary "npm test passed directly" --update-task --json
hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --idempotency-key "command:T-XXXX:check" --json
hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --json
hadara evidence list --task T-XXXX --json
hadara evidence project --task T-XXXX --json
```

Use `validation run` for ordinary validation because it executes the command, records durable evidence from the real exit status, and refreshes `EVIDENCE.md`. Add `--update-task` only when you intentionally want the matching `TASK.md` Validation row updated by the CLI.

If the wrapper cannot launch a command in the current tool environment (for example `EPERM`, `EACCES`, or `ENOENT`) but the same command runs directly, record the direct result through `validation run` so validation-check resolution tags and optional TASK.md row sync remain consistent:

```bash
hadara validation run --task T-XXXX --check "Focused tests" --direct-result passed --direct-summary "npm test passed directly after validation wrapper launch failure" --update-task --json
```

For focused Vitest checks, use `npm run test:focused -- tests/unit/<file>.test.ts`. Do not use `npm run test:unit -- tests/unit/<file>.test.ts`; `test:unit` already supplies the broad unit suite path.

Use `evidence add-command` only when recording an already-run result supplied by the operator. It does not execute shell commands. Use `evidence list` to find durable evidence ids for docs and resolution markers.

Do not hand-edit `evidence.jsonl`.
Evidence appends are task-scoped and serialized by a local lock. Do not start multiple `validation run` or `evidence add-command` writes for the same task in parallel; JSON evidence responses include `evidence.appendLock` so lock contention and wait time are visible when it happens.

Evidence must reflect real execution results. Fabricated or assumed results are invalid.

`evidence project` is the 0.4 projection refresh surface. It refreshes the generated `EVIDENCE.md` projection file without rewriting canonical evidence.

## Repair and Diagnostics

```bash
hadara task status --task T-XXXX --detail full --json
hadara task finalize --task T-XXXX --json
hadara harness validate --task T-XXXX --level done --json
hadara init doctor --json
```

Use finalize dry-run as the ordinary close-proof repair plan. Use diagnostics when finalize reports blockers. Do not repair close proof by editing evidence files by hand.

Agents may use `task finalize --execute --auto` for ordinary clean capsules; it performs the dry-run and current-plan verification internally. Use the explicit dry-run plus `--plan-hash` form when a separate reviewer or automation boundary must carry the reviewed plan.

## Useful CLI by Situation

| Situation | Use | Notes |
|---|---|---|
| New HADARA project | `hadara init --profile <profile> --json` | Creates scaffold docs and registries. |
| Check scaffold health | `hadara init doctor --json` | Reports missing or inconsistent scaffold files. |
| Find next work | `hadara task status --json` | Read-only selection cockpit. |
| Inspect selected task | `hadara task status --task T-XXXX --json` | Fast loop phase and next-action projection. |
| Inspect close-grade diagnostics | `hadara task status --task T-XXXX --detail full --json` | Heavier readiness/protocol projection for explicit diagnostics. |
| Find task-specific context | `hadara context pack --task T-XXXX --json` | Use before broad manual reads. |
| Read exact source text | `hadara context slice ... --json` | Use after a context candidate points to a range. |
| Run and record validation | `hadara validation run --task T-XXXX --check "..." -- <command>` | Executes the command and records evidence without editing `TASK.md` by default. |
| Run, record, and sync task row | `hadara validation run --task T-XXXX --check "..." --update-task -- <command>` | Executes the command, records evidence, and updates the matching `TASK.md` Validation row. |
| Record direct validation result | `hadara validation run --task T-XXXX --check "..." --direct-result passed --direct-summary "..." --update-task --json` | Records an already-run direct result when wrapper launch is blocked by the tool environment. |
| Record already-run validation | `hadara evidence add-command ... --json` | Append-only evidence writer; does not execute commands. |
| Find evidence ids | `hadara evidence list --task T-XXXX --json` | Durable id discovery. |
| Add optional project doc | `hadara docs add <type> --json` | Dry-run-first creator/registrar for architecture, decisions, roadmap, security model, test strategy, and agent guide docs. |
| Review loop phase | `hadara task status --task T-XXXX --json` | Normal lifecycle state and next action. |
| Close ordinary work | `hadara task finalize --task T-XXXX --execute --auto --json` | Default guarded close path for clean capsules; records readiness evidence and close proof when needed. |
| Externally reviewed close | `hadara task finalize --task T-XXXX --json` then execute with its `planHash` | Use when a human or automation explicitly reviews and carries the dry-run plan. |
| Repair close drift | `hadara task finalize --task T-XXXX --json` then execute with `--auto` or the reviewed `planHash` | Default repair path for stale close proof. |
| Register project-specific docs | `hadara docs register --path <path> --json` | 0.4 registry surface. Canonical state belongs in `.hadara/docs-registry.json`; use registry-backed help for exact options. |
| Discover command details | `hadara help lifecycle`, `hadara help command <id>`, `hadara commands --json` | Prefer registry-backed help over copied command tables. |

## Common Failure Modes

| Failure Mode | Correct Behavior |
|---|---|
| Skipping read models and scanning the repository. | Start with session/task/context read models and only open routed files. |
| Opening unrelated specs or historical docs. | Use read tiers, registry metadata, and context pack candidates. |
| Running lifecycle before `TASK.md` is authored. | Satisfy the Lifecycle Entry Gate first. |
| Treating context pack as validation. | Use it only for read guidance; run real checks separately. |
| Recording evidence for checks that were not run. | Record only real execution results, including failed or blocked checks. |
| Running finalize execute from memory. | Review fresh dry-run output and copy its current plan hash. |
| Putting same-capsule chores in `HANDOFF.md` Next Recommended Step. | Use that section for next capsule or global-state recommendations. |

## Design Source Documents and Read Maps

Design source documents may live under `docs/specs/**` or other registered paths. Use registry/read-map output to decide whether they are active, conditional, implemented, drift-risk, historical, or excluded.

Do not treat every file under `docs/specs/**` as default Required Reading.

Document registration writes registry metadata, not prose rows in entry docs. Do not append project-specific document rows to `AGENTS.md`, `.hadara/context/HADARA_CONTEXT.md`, or this workflow document.

## Authoring Model

| Surface | Human / Operator | Agent | CLI |
|---|---|---|---|
| Requirements and source docs | Provides and approves | Summarizes into task docs | Indexes/read-map only |
| `TASK.md` identity | Reviews | Does not hand-edit CLI-owned fields | Creates and lifecycle-updates |
| `TASK.md` prose/tables | Reviews | Authors goal, source documents, plan, acceptance, validation, change summary, risks, and follow-ups | Validates controlled values |
| `HANDOFF.md` identity | Reviews | Does not hand-edit CLI-owned fields | Creates and lifecycle-updates |
| `HANDOFF.md` prose/tables | Reviews | Writes WIP checkpoints and close-time continuation guidance | Validates during close; does not rewrite prose |
| `evidence.jsonl` | Supplies command result facts | Does not hand-edit | Appends canonical evidence |
| `EVIDENCE.md` | Reads | Does not hand-edit generated projection | Regenerates projection file |
| Close proof | Reviews | Does not write by hand | Appends proof and audits freshness |

## Automatic Writing Boundary

HADARA auto-writes deterministic state, managed slots, indexes, evidence projections, and close snapshots. It reports read-only guidance for missing task prose.

Agents write task-specific goal, source documents, plan, acceptance, validation, change summary, risks, follow-ups, and handoff guidance from user requirements and source documents.

## Drift Avoidance

Do not duplicate command registry metadata. For detailed options, point to registry-backed help:

```bash
hadara help lifecycle
hadara help command <id>
hadara commands --json
```
