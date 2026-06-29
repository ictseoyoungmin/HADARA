# 02 Agent Entry and HADARA Workflow Document

## Goal

Separate stable agent invariants from versioned CLI workflow guidance.

`AGENTS.md` is compact and stable. It owns required-reading entry rules and safety invariants. `.hadara/context/HADARA_CONTEXT.md` is a routing anchor, not a second Required Reading authority. `docs/HADARA_WORKFLOW.md` owns command usage guidance and document-writing timing.

## `AGENTS.md` Role

`AGENTS.md` must not be a lifecycle command cookbook.

It should contain:

```text
Role
Required Reading
Required Reading Tiers
Operating Rules
Workflow Reference
Project Context
```

It should not contain:

```text
task lifecycle / finalize recipes
context pack recipes
context slice recipes
full validation command lists
release/package command examples
controlled token tables
```

## Suggested `AGENTS.md`

The canonical template is `templates/0.4/AGENTS.md`.

It should keep a compact Required Reading table for:

| Reading | Default Behavior |
|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Every session. |
| `docs/PROJECT_STATE.md` | Every session. |
| `docs/TASK_BOARD.md` | Every session. |
| `docs/HADARA_WORKFLOW.md` | Every session and whenever lifecycle/context/evidence commands are used. |
| `docs/AGENT_HANDOFF.md` | When present in governed or long-running projects. |
| Active Task Capsule docs | Every task-work session. |
| Project-specific docs | Only when referenced by the task, registry, or read-map. |

This keeps the entry contract visible without copying lifecycle command recipes into `AGENTS.md`.

`AGENTS.md` should state that it owns Required Reading and that `.hadara/context/HADARA_CONTEXT.md` is only a compact routing anchor.

## `HADARA_CONTEXT.md` Role

`.hadara/context/HADARA_CONTEXT.md` is a routing anchor, not a command manual.

Suggested content:

```md
# HADARA_CONTEXT

## Purpose

Compact project-local context anchor.

## Project

| Field | Value |
|---|---|
| Profile | basic |
| Protocol | 0.4 |
| Workflow Reference | `docs/HADARA_WORKFLOW.md` |
| Current State | `docs/PROJECT_STATE.md` |
| Task Board | `docs/TASK_BOARD.md` |

## Rule

Prefer `hadara session start --json` and `hadara context pack --task T-XXXX --json` before broad manual reading.
```

## `docs/HADARA_WORKFLOW.md` Role

`HADARA_WORKFLOW.md` explains when to use HADARA CLI surfaces. It should be concise and situation-driven.

It also owns the compact authoring model for humans, agents, and the CLI. Do not repeat that ownership table in every generated Task Capsule.

Required sections:

```text
1. Minimal Loop
2. Read Authority Rules
3. Project Start
4. Session Start
5. Selecting or Creating Work
6. Task Context
7. Exact Source Slices
8. Task Capsule Lifecycle
9. Lifecycle Entry Gate
10. Task Document Timing
11. Evidence
12. Repair and Diagnostics
13. Useful CLI by Situation
14. Common Failure Modes
15. Design Source Documents and Read Maps
16. Authoring Model
17. Automatic Writing Boundary
18. Drift Avoidance
```

## Command Usage Table

The workflow document may include a table like:

| Situation | Use | Avoid |
|---|---|---|
| Starting a session | `hadara session start --json` | Broad manual reading first |
| Need task-specific reading guidance | `hadara context pack --task T-XXXX --json` | Treating context pack as validation |
| Need exact source text | `hadara context slice ... --json` | Reading broad unrelated files |
| Need durable evidence ids | `hadara evidence summary --task T-XXXX --json` | Hand-editing `evidence.jsonl` |
| Normal close | `task lifecycle` then reviewed `task finalize` | Low-level close commands as the default loop |
| Close proof is stale or invalid | `hadara task close-repair-plan --task T-XXXX --json` | Editing close proof by hand |

`HADARA_WORKFLOW.md` should explicitly state:

```text
Read authority is closed: start from read models, then read only returned paths, active capsule docs, or referenced shared/conditional docs.
After context pack, select relevant candidates, use context slice for exact reads, and update TASK.md Source Documents.
Before lifecycle, TASK.md must have Goal, Source Documents or an explicit none-needed note, Plan, Acceptance, and Validation.
Evidence must reflect real execution results.
Agents must inspect finalize dry-run output and use its current plan hash before execute.
```

## Authoring Model

`HADARA_WORKFLOW.md` should explain:

```text
Users provide requests, design source documents, and review feedback.
Agents derive structured task docs and project state updates.
HADARA validates controlled values, close-source boundaries, evidence, and read maps.
```

Recommended compact table:

| Surface | Human / Operator | Agent | CLI |
|---|---|---|---|
| Requirements and source docs | Provides and approves | Summarizes into task docs | Indexes/read-map only |
| `TASK.md` identity slot | Reviews | Does not hand-edit CLI-owned fields | Creates and lifecycle-updates |
| `TASK.md` prose/tables | Reviews | Authors goal, source documents, plan, acceptance, validation, change summary, risks, and follow-ups | Validates controlled values |
| `HANDOFF.md` | Reviews | Writes continuation guidance | May suggest or project summaries |
| `evidence.jsonl` | Supplies command result facts | Does not hand-edit | Appends canonical evidence |
| `EVIDENCE.md` | Reads | Does not hand-edit | Regenerates projection |
| Close proof | Reviews | Does not write by hand | Appends proof and audits freshness |

The table belongs in `HADARA_WORKFLOW.md` because repeating it in every Task Capsule creates boilerplate drift. Task Capsules should stay focused on the actual work.

## Automatic Authoring Support

HADARA 0.4 should reduce documentation labor without silently taking ownership of human or agent prose.

Rules:

```text
CLI auto-writes deterministic state, indexes, managed slots, source hashes, evidence projections, and close snapshots.
CLI reports read-only authoring guidance for missing or inconsistent task prose.
Agents author task-specific prose and tables from user requirements, source documents, and CLI guidance.
Humans review requirements, approvals, accepted risks, and release/external mutation decisions.
```

`task status`, `task lifecycle`, `task finalize --json`, `context pack`, and docs read-map surfaces should be enough for an agent to know what to write next. Provider-backed prose generation is not a 0.4 scaffold default.

## Drift Avoidance

Do not duplicate command registry metadata. For detailed options, point to registry-backed help:

```bash
hadara help lifecycle
hadara help command task.finalize
hadara commands --json
```
