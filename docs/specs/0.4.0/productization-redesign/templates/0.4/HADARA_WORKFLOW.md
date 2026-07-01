# HADARA_WORKFLOW

## Purpose

This document explains when to use HADARA CLI surfaces and when to update HADARA documents during normal project work.

Use HADARA read models first. Do not manually read broad project files unless a HADARA command points you there or the task explicitly requires it.

## Minimal Loop

```text
1. `hadara task next --json`
2. `hadara session start --task T-XXXX --json` when resuming or changing tasks
3. `hadara task create "task title" --json` only when no suitable capsule exists
4. update `TASK.md`
5. implement the scoped change
6. run real validation
7. record evidence
8. update task/global docs
9. review `task finalize --json`
10. execute finalize only with the reviewed plan hash
```

## Read Authority Rules

Agents must follow this read order:

| Order | Authority | Allowed Reads |
|---:|---|---|
| 1 | HADARA CLI read models | `session start`, `task status`, `context pack`, docs registry/read-map reports. |
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

After init, review:

| Step | Document | Purpose |
|---|---|---|
| 1 | `AGENTS.md` | Entry rules and required reading. |
| 2 | `.hadara/context/HADARA_CONTEXT.md` | Compact read routing. |
| 3 | `docs/PROJECT_STATE.md` | Initial project state and next recommended step. |
| 4 | `docs/TASK_BOARD.md` | Task index. |
| 5 | `docs/HADARA_WORKFLOW.md` | How to work with HADARA from this point forward. |

Use project-specific docs only after they are created and routed through the docs registry, a read-map, or the active task.

## Session Start

Use session start at the beginning of a work session, after switching tasks, or when project state is unclear.

```bash
hadara session start --json
hadara session start --task T-XXXX --json
```

Session start is a read model. It does not create tasks, append evidence, warm caches, validate completion, or close work.

## Selecting or Creating Work

```bash
hadara task next --json
hadara task create "task title" --json
hadara task status --task T-XXXX --json
```

Use `task next` to decide what to work on. Use `task create` only when no suitable capsule exists. Use `task status` to inspect readiness, blockers, evidence, and suggested next actions for a selected task.

## Task Context

```bash
hadara context pack --task T-XXXX --json
```

Use context pack when starting implementation, resuming after a gap, deciding which files to inspect, or avoiding broad manual repo reads. Context pack is reading guidance, not validation.

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

## Task Capsule Lifecycle

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
audit close proof
```

Use the high-level lifecycle path for ordinary work:

```bash
hadara task lifecycle --task T-XXXX --json
hadara task finalize --task T-XXXX --json
hadara task finalize --task T-XXXX --execute --plan-hash sha256:... --json
hadara task audit-close --task T-XXXX --json
```

Low-level lifecycle commands are for debugging, recovery, or command implementation work:

```bash
hadara task finish --task T-XXXX --json
hadara task ready --task T-XXXX --level done --json
hadara task close --task T-XXXX --json
hadara task close-repair-plan --task T-XXXX --json
```

## Lifecycle Entry Gate

Before running `hadara task lifecycle`, all of these must be true:

| Gate | Required State |
|---|---|
| Goal | `TASK.md` has a concrete task goal. |
| Source Documents | Relevant sources are listed, or the task explicitly records that none are required. |
| Plan | `TASK.md` Plan has the intended work steps. |
| Acceptance | `TASK.md` Acceptance has the completion criteria. |
| Validation | At least one validation method is defined, or a documented reason explains why validation is not applicable. |

Do not use lifecycle/finalize to discover that the task contract was never authored.

## Task Document Timing

HADARA 0.4 Task Capsules contain `TASK.md`, `HANDOFF.md`, `EVIDENCE.md`, and `evidence.jsonl`.

| Phase | CLI Surfaces | Agent-Written Docs | Meaning |
|---|---|---|---|
| Capsule created | `task create`, `task status` | Start `TASK.md` Goal, Source Documents, Plan, and Acceptance. | Define the task before implementation. |
| Before execution | `context pack`, `context slice` | Refine `TASK.md` Plan, Source Documents, and Acceptance. | Make the work bounded and source-backed. |
| During execution | `task status` as needed | Update `TASK.md` Plan, Change Summary, Risks / Follow-ups; update `HANDOFF.md` warnings if continuity changes. | Keep docs aligned with actual work. |
| After validation | `validation run`, `evidence summary`, `evidence project` when available | Update `TASK.md` Validation and Acceptance with evidence ids or residual notes. | Execute real checks through HADARA when possible and record what remains. |
| Before finalize dry-run | `task lifecycle` | Finish `TASK.md` Change Summary, Acceptance, Validation, Risks / Follow-ups; update `HANDOFF.md`; update shared state docs when the task changed them. | Stabilize close-source docs before hashing. |
| Finalize review | `task finalize --json` | Inspect the dry-run output and fix reported blockers before execute. | Review planned writes and the current plan hash. |
| Finalize execute | `task finalize --execute --plan-hash ...` | Do not edit close-source docs during execute. | Let HADARA perform bounded status bookkeeping and close proof append. |
| After close | `task audit-close`, `task status` | Only clarify `HANDOFF.md` if the task contract did not change. | Keep close proof fresh; rerun finalize after close-source edits. |

Do not hand-edit `evidence.jsonl`. Treat `EVIDENCE.md` as a CLI-generated projection file.

## Evidence

```bash
hadara validation run --task T-XXXX --check "Focused tests" -- npm test
hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --json
hadara evidence summary --task T-XXXX --json
hadara evidence project --task T-XXXX --json
```

Use `validation run` for ordinary validation because it executes the command, records durable evidence from the real exit status, refreshes `EVIDENCE.md`, and updates the matching `TASK.md` Validation row.

Use `evidence add-command` only when recording an already-run result supplied by the operator. It does not execute shell commands. Use `evidence summary` to find durable evidence ids for docs and resolution markers.

Evidence must reflect real execution results. Fabricated, assumed, or aspirational results are invalid.

`evidence project` is the 0.4 projection refresh surface. It refreshes the generated `EVIDENCE.md` projection file without rewriting canonical evidence.

## Repair and Diagnostics

```bash
hadara task close-repair-plan --task T-XXXX --json
hadara task audit-close --task T-XXXX --json
hadara harness validate --task T-XXXX --level done --json
hadara init doctor --json
```

Use repair and diagnostic commands when lifecycle or finalize reports blockers. Do not repair close proof by editing evidence files by hand.

Agents must not run `task finalize --execute` without inspecting the dry-run output and using the current `planHash` from that reviewed dry-run.

## Useful CLI by Situation

| Situation | Use | Notes |
|---|---|---|
| New HADARA project | `hadara init --profile <profile> --json` | Creates scaffold docs and registries. |
| Check scaffold health | `hadara init doctor --json` | Reports missing or inconsistent scaffold files. |
| Find next work | `hadara task next --json` | Read-only recommendation. |
| Inspect selected task | `hadara task status --task T-XXXX --json` | Readiness and next-action projection. |
| Find task-specific context | `hadara context pack --task T-XXXX --json` | Use before broad manual reads. |
| Read exact source text | `hadara context slice ... --json` | Use after a context candidate points to a range. |
| Run and record validation | `hadara validation run --task T-XXXX --check "..." -- <command>` | Executes the command and records evidence. |
| Record already-run validation | `hadara evidence add-command ... --json` | Append-only evidence writer; does not execute commands. |
| Find evidence ids | `hadara evidence summary --task T-XXXX --json` | Compact copy hints. |
| Review close path | `hadara task lifecycle --task T-XXXX --json` | Normal lifecycle state. |
| Close ordinary work | `hadara task finalize --task T-XXXX --json` then execute with its `planHash` | Default close path. |
| Diagnose close drift | `hadara task close-repair-plan --task T-XXXX --json` | Read-only repair plan. |
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
| `HANDOFF.md` | Reviews | Writes continuation guidance | May suggest or project summaries |
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
