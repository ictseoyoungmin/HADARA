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
| Need files to inspect | Use `hadara task status --task T-XXXX --json`, docs read-map, and explicit file reads. |
| Need project-specific docs | Use `hadara docs add <type> --json`, or create a Markdown file directly and register it with `hadara docs register`. |
| Ready to close | Run `hadara task close --task T-XXXX --json` for the ordinary guarded close path; it records readiness evidence and close proof when needed. Dry-run first only when a separate reviewer needs the plan hash. |

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
9. run `hadara task close --task T-XXXX --json` for ordinary clean work
10. use `task close --dry-run` and reviewed `--plan-hash` only when an external review flow requires it
```

## Read Authority Rules

Agents must follow this read order:

| Order | Authority | Allowed Reads |
|---:|---|---|
| 1 | HADARA CLI read models | `status`, `task status`, docs registry/read-map reports, and explicit context graph diagnostics. |
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

Plain `hadara init` in an interactive terminal is not read-only: it prints the
reviewed dry-run plan, then in the same process prompts `Apply this reviewed
plan? [y/N]` and applies immediately on `y`/`yes`. JSON output and any
non-interactive invocation (CI, a piped/redirected shell, an agent) always stay
two-step: a zero-write dry-run first, then a separate `--execute --plan-hash
<hash>` call to apply.

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
| 3 | `docs/TASK_BOARD.md` | Inspectable task index and active-work source. |
| 4 | `docs/HADARA_WORKFLOW.md` | How to work with HADARA from this point forward. |

Use project-specific docs only after they are created and routed through the docs registry, a read-map, or the active task.

### Installed Package Fallback

Most projects should run the installed `hadara` command directly. In environments where npm cannot create executable bin links, such as some Windows-mounted prefixes, install with `--no-bin-links` and invoke the package entrypoint with Node:

```bash
npm install -g hadara --no-bin-links
node "$(npm prefix -g)/lib/node_modules/hadara/dist/cli/main.js" version --json
node "$(npm prefix -g)/lib/node_modules/hadara/dist/cli/main.js" task status --json
```

For project-local installs, replace `$(npm prefix -g)/lib/node_modules/hadara` with the project-local package path, for example `.hadara-install/node_modules/hadara`. This is an invocation fallback only; generated docs and task command examples still use the normal `hadara ...` form.

A project-local install does not remove or shadow any `hadara` already earlier on PATH from a different install (for example a global install used by other projects); PATH resolution order decides which one actually runs. Before delegating work or relying on generated guidance, confirm which `hadara` will actually be used with `hadara version --json` (check `cliEntry` and `packageVersion`), especially after installing or updating a project-local candidate.

## Generated Docs Completion

`hadara init` creates the minimum docs needed for safe task work. Generated docs are not decorative placeholders. They are routing and task-work surfaces that agents must keep aligned when the task changes their subject.

| Document | Update When |
|---|---|
| `docs/TASK_BOARD.md` | Task status changes. Prefer HADARA lifecycle commands when possible. |
| Task-local `tasks/T-*/HANDOFF.md` | Continuation guidance, carry-forward risks, or next-step guidance changes for the selected capsule. |
| Optional project docs | Architecture, decisions, roadmap, security, or agent guidance changes after those docs have been added. |

Do not leave generated docs in scaffold form after the first real capability exists. If a generated or registered doc is no longer useful, update its registry state with `hadara docs update`, `hadara docs archive`, `hadara docs supersede`, or `hadara docs unregister` instead of silently ignoring it.

## Optional Project Docs

Use `docs add` when the project needs a project-owned doc that init did not create:

```bash
hadara docs add architecture --json
hadara docs add decisions --json
hadara docs add roadmap --json
hadara docs add security-model --json
hadara docs add agent-guide --json
```

`docs add` is dry-run-first. Review its `beforeHash`, then execute with the reported command. It creates the Markdown file only when missing and registers it in `.hadara/docs-registry.json`. If you create a custom Markdown file directly, register it with `hadara docs register --path <path> --json` so read maps and doctor checks can route it.

## HADARA-dev Docker Workflow

HADARA-dev CLI work should prefer the reusable `hadara-dev` Docker workflow when host Node/npm is missing, stale, or inconsistent with the release toolchain.

| Need | Command | Notes |
|---|---|---|
| Check container availability | `docker info` | Start or recreate the reusable container only when Docker itself is available. |
| Sync/build development CLI | `npm run dev:docker-sync-build` | Fast path: copies the minimal build workspace to Docker ext4, runs `npm ci`, `npm run build`, refreshes workspace `dist`, and runs the built CLI smoke. |
| Run the Docker validation wrapper | `npm run dev:docker-check` | Full path: copies the full workspace to Docker ext4 and runs `npm run check`; append `-- --serial` or `-- --low-resource` for HADARA-dev constrained-host validation. |
| Run focused built-CLI smoke | `node dist/cli/main.js <command> ... --json` | Run only after `dist` has been refreshed from the Docker build. |

Do not assume container-global `/usr/local/bin/hadara` is the latest development build. For source changes, build first, refresh `/workspace/dist`, then run built-CLI smokes from `dist/cli/main.js`.

The repo-local JSON wrapper also accepts `--serial` and `--low-resource`. Serial mode uses one Vitest worker with file parallelism disabled. Low-resource mode implies serial execution, a 1024 MiB Node heap cap, and one npm job. These flags belong only to `tools/` and `scripts/`, never the shipped `src/` CLI.

### Release Recycle Quickstart

Release-readiness recycle uses three separate roots:

| Root | Use |
|---|---|
| `sourceRoot` | Clean ext4 clone used for build, artifact, package, gate, dry-run, and publish checks. |
| `evidenceRoot` | Mounted workspace or reviewed capsule root where evidence is appended. |
| `smokeProjectRoot` | Disposable ext4 consumer project for installed-package smoke/recycle. |

Minimal Docker flow:

```bash
docker pull node:22-bookworm
docker rm -f hadara-dev
docker run -dit --name hadara-dev -v "$PWD":/workspace -w /workspace node:22-bookworm bash
bash scripts/release/prepare-publish-env.sh T-XXXX
```

The full contract and command order are in `docs/RELEASE_READINESS.md` under “Release Readiness Recycle Runbook”. Do not attach release-artifact evidence while generating the clean artifact; write a journal first, then attach that journal to `evidenceRoot`.

## Session Start

Use task status at the beginning of a human/agent work session, after switching tasks, or when project state is unclear.

```bash
hadara task status --json
hadara task status --task T-XXXX --json
```

`task status` reads the Task Board, Task Capsules, and human-readable routing docs. It does not create tasks, append evidence, warm caches, validate completion, or close work. The deprecated top-level `status` alias calls the same evaluator. Use docs read-map and explicit file reads when task-specific source context is needed.

## Selecting or Creating Work

```bash
hadara task status --json
hadara task create "task title" --json
hadara task status --task T-XXXX --json
```

Use `task status --json` to decide what to work on when no task is selected. Use `task create` only when no suitable capsule exists. Use `task status --task T-XXXX --json` as a fast selected-task loop cockpit for evidence, loop phase, and suggested next actions. Use `task close --task T-XXXX --dry-run --json` or `task status --task T-XXXX --detail full --json` when you need close-grade readiness diagnostics.

Task selection is a review decision, not title generation. Current human or reviewer instructions have highest priority. Then read `task status`, the Task Board, routed development/roadmap sources, and the relevant task-local `HANDOFF.md`. A task-local `Next Recommended Step` is one input and must not be copied verbatim as a task title. If a new capsule is still warranted, choose a short behavior-focused title. If planned work is exhausted, review for design gaps or useful optimization and propose a next step or ask the reviewer instead of manufacturing work.

## Task Context

Use `hadara task status --task T-XXXX --json`, docs read-map, and the selected Task Capsule to decide which files to inspect. Use `hadara context graph --task T-XXXX --json` only for explicit graph diagnostics; public `context pack` routing has been removed.

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
finish task docs and Task Board state
run task close, or review a close dry-run when an external plan hash is needed
execute task close with the reviewed plan hash when using reviewed mode
stop when task close returns closed-valid
```

Use the high-level lifecycle path for ordinary work:

```bash
hadara task status --task T-XXXX --json

# Finalize Task Capsule docs before closing.
# Task Board and Task Capsule prose must be current before close.

hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --dry-run --json
hadara task close --task T-XXXX --execute --plan-hash sha256:... --json
```

Use `task close --json` for the ordinary guarded close path. Use the explicit `--plan-hash` form only when a reviewed dry-run plan crosses a human or external automation boundary.

Use `task close --json` for the ordinary guarded close path. Use `hadara task close --task T-XXXX --dry-run --json` for a no-write close plan, and `hadara task status --task T-XXXX --detail full --json` for done-level diagnostics including `state.closeState`. Recovery of partially executed close runs also completes by rerunning task close.

Do not hand-edit lifecycle-owned status fields to force closure. `TASK.md` Identity `Status` and `docs/TASK_BOARD.md` Status are updated by `task create` and `task close`. Before task close, keep prose tables such as Plan, Acceptance, Validation, Changes, Risks, and History current; let task close move the lifecycle status to Done.

## Close Entry Gate

Before running `hadara task close`, all of these must be true:

| Gate | Required State |
|---|---|
| Goal | `TASK.md` has a concrete task goal. |
| Source Documents | Relevant sources are listed, or the task explicitly records that none are required. |
| Plan | `TASK.md` Plan has the intended work steps. |
| Acceptance | `TASK.md` Acceptance has the completion criteria. |
| Validation | At least one validation method is defined, or a documented reason explains why validation is not applicable. |

Do not use status/task close to avoid authoring the task contract.

Before running `task close`, finish all close-source edits.
Avoid writing volatile close evidence ids into close-source docs.
`HANDOFF.md` may be updated during the task as a work-in-progress checkpoint. Before task close, reread it and convert it into close-time handoff: keep only guidance that remains true after this task closes, remove stale next-step prose, or mark already-completed follow-up work as completed/superseded with the task id that closed it.

For `HANDOFF.md` `## Next Recommended Step`, prefer the structured continuation table:

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Start the next capsule title. | actionable | yes | Why this is the next work. | `docs/TASK_WORKFLOW_COMMANDS.md`; task-specific plan |

Use `terminal` with `Create Task` = `no` when no further work is queued. Use `waiting-for-operator` with `Create Task` = `no` when publication, approval, or external coordination must happen first.

## Task Document Timing

HADARA Task Capsules contain `TASK.md`, `HANDOFF.md`, `EVIDENCE.md`, and `evidence.jsonl`.

| Timing | Update |
|---|---|
| Capsule created | Start `TASK.md` Goal, Source Documents, Plan, and Acceptance. |
| Before execution | Refine `TASK.md` Plan, Source Documents, and Acceptance. |
| During execution | Update `TASK.md` Plan, Change Summary, Risks / Follow-ups; update `HANDOFF.md` warnings if continuity changes. |
| After validation | Use `validation run` when possible; record evidence, then update `TASK.md` Validation and Acceptance deliberately with evidence ids or residual notes. |
| Before task close | Finish `TASK.md` Change Summary, Acceptance, Validation, Risks / Follow-ups; convert task-local `HANDOFF.md` into close-time guidance. Optional shared prose remains human-owned and is not created by close. |
| Close review | Inspect `task close --dry-run --json` output and fix reported blockers when a separate review needs the plan hash. |
| Close execute | Do not edit close-source docs during execute. |
| After close | Only clarify docs if the task contract did not change; rerun task close after close-source edits. |

Do not hand-edit `TASK.md` Identity `Status`, `docs/TASK_BOARD.md` Status, `evidence.jsonl`, or generated `EVIDENCE.md` projections. Use `task close --task T-XXXX --json` for normal closure; use `task status --task T-XXXX --detail full --json` when the close path is blocked and you need repair guidance.

## Evidence

```bash
hadara validation run --task T-XXXX --check "Focused tests" -- npm test
hadara validation run --task T-XXXX --check "Focused tests" --json -- npm test
hadara validation run --task T-XXXX --check "Focused tests" -- npm run test:focused -- tests/unit/<file>.test.ts
hadara validation run --task T-XXXX --check "Focused tests" --direct-result passed --direct-summary "npm test passed directly" --update-task --json
hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --idempotency-key "command:T-XXXX:check" --json
hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --json
hadara evidence list --task T-XXXX --json
hadara evidence project --task T-XXXX --json
```

Use `validation run` for ordinary validation because it executes the command, records durable evidence from the real exit status, and refreshes `EVIDENCE.md`. Add `--update-task` only when you intentionally want the matching `TASK.md` Validation row updated by the CLI.
Place HADARA flags such as `--json` before the child-command separator `--`; tokens after `--` are passed to the validation command.

If the wrapper cannot launch a command in the current tool environment (for example `EPERM`, `EACCES`, or `ENOENT`) but the same command runs directly, record the direct result through `validation run` so validation-check resolution tags and optional TASK.md row sync remain consistent:

```bash
hadara validation run --task T-XXXX --check "Focused tests" --direct-result passed --direct-summary "npm test passed directly after validation wrapper launch failure" --update-task --json
```

For focused Vitest checks, use `npm run test:focused -- tests/unit/<file>.test.ts`. Do not use `npm run test:unit -- tests/unit/<file>.test.ts`; `test:unit` already supplies the broad unit suite path.

Use `evidence add-command` only when recording an already-run result supplied by the operator. It does not execute shell commands. Use `evidence list` to find durable evidence ids for docs and resolution markers.

Do not hand-edit `evidence.jsonl`.
Evidence appends are task-scoped and internally serialized by a local lock, so independent `validation run` or `evidence add-command` calls may run in parallel. JSON evidence responses include `evidence.appendLock` so lock contention and wait time are visible when it happens.

Evidence must reflect real execution results. Fabricated or assumed results are invalid.

`evidence project` is the 0.4 projection refresh surface. It refreshes the generated `EVIDENCE.md` projection file without rewriting canonical evidence.

## Repair and Diagnostics

```bash
hadara task status --task T-XXXX --detail full --json
hadara task close --task T-XXXX --dry-run --json
hadara harness validate --task T-XXXX --level done --json
hadara init doctor --json
```

Use task close dry-run as the ordinary close-proof repair plan. Use diagnostics when task close reports blockers. Do not repair close proof by editing evidence files by hand.

Agents should use `task close --json` for ordinary clean capsules; it performs the dry-run and current-plan verification internally. Use the explicit dry-run plus `--plan-hash` form when a separate reviewer or automation boundary must carry the reviewed plan.

## Useful CLI by Situation

| Situation | Use | Notes |
|---|---|---|
| New HADARA project | `hadara init --profile <profile> --json` | Creates scaffold docs and registries. |
| Check scaffold health | `hadara init doctor --json` | Reports missing or inconsistent scaffold files. |
| Find next work | `hadara task status --json` | Read-only selection cockpit. |
| Inspect selected task | `hadara task status --task T-XXXX --json` | Fast loop phase and next-action projection. |
| Inspect close-grade diagnostics | `hadara task status --task T-XXXX --detail full --json` | Heavier readiness/protocol projection for explicit diagnostics. |
| Find task-specific context | `hadara task status --task T-XXXX --json` and docs read-map | Use before broad manual reads. |
| Read exact source text | `hadara context slice ... --json` | Use after a context candidate points to a range. |
| Run and record validation | `hadara validation run --task T-XXXX --check "..." -- <command>` | Executes the command and records evidence without editing `TASK.md` by default. |
| Run and record validation JSON | `hadara validation run --task T-XXXX --check "..." --json -- <command>` | Put `--json` before `--`; everything after `--` belongs to the child command. |
| Run, record, and sync task row | `hadara validation run --task T-XXXX --check "..." --update-task -- <command>` | Executes the command, records evidence, and updates the matching `TASK.md` Validation row. |
| Record direct validation result | `hadara validation run --task T-XXXX --check "..." --direct-result passed --direct-summary "..." --update-task --json` | Records an already-run direct result when wrapper launch is blocked by the tool environment. |
| Record already-run validation | `hadara evidence add-command ... --json` | Append-only evidence writer; does not execute commands. |
| Find evidence ids | `hadara evidence list --task T-XXXX --json` | Durable id discovery. |
| Add optional project doc | `hadara docs add <type> --json` | Dry-run-first creator/registrar for architecture, decisions, roadmap, security model, and agent guide docs. |
| Review loop phase | `hadara task status --task T-XXXX --json` | Normal lifecycle state and next action. |
| Close ordinary work | `hadara task close --task T-XXXX --json` | Default guarded close path for clean capsules; records readiness evidence and close proof when needed. |
| Externally reviewed close | `hadara task close --task T-XXXX --dry-run --json` then execute with its `planHash` | Use when a human or automation explicitly reviews and carries the dry-run plan. |
| Repair close drift | `hadara task close --task T-XXXX --dry-run --json` then rerun close or execute with the reviewed `planHash` | Default repair path for stale close proof. |
| Register project-specific docs | `hadara docs register --path <path> --json` | 0.4 registry surface. Canonical state belongs in `.hadara/docs-registry.json`; use registry-backed help for exact options. |
| Discover command details | `hadara help lifecycle`, `hadara help command <id>`, `hadara commands --json` | Prefer registry-backed help over copied command tables. |

## Common Failure Modes

| Failure Mode | Correct Behavior |
|---|---|
| Skipping read models and scanning the repository. | Start with session/task/context read models and only open routed files. |
| Opening unrelated specs or historical docs. | Use read tiers, registry metadata, and task/docs read models. |
| Running lifecycle before `TASK.md` is authored. | Satisfy the Lifecycle Entry Gate first. |
| Treating read-routing as validation. | Use read models only for guidance; run real checks separately. |
| Recording evidence for checks that were not run. | Record only real execution results, including failed or blocked checks. |
| Running reviewed close execute from memory. | Review fresh dry-run output and copy its current plan hash. |
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
