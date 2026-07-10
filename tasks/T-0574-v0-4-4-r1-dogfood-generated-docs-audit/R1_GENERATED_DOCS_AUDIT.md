# R1 Generated Docs Audit

## Scope

Audited the R1 delegated dogfood project at `/mnt/f/NowWorking/dev/hadara-r1-basic-dogfood`.

Reviewed:

- `docs/PROJECT_STATE.md`
- `docs/HADARA_WORKFLOW.md`
- `docs/TASK_BOARD.md`
- `AGENTS.md`
- `.hadara/context/HADARA_CONTEXT.md`
- `tasks/T-0001` through `tasks/T-0005`: `TASK.md`, `HANDOFF.md`, and `EVIDENCE.md`

Ignored:

- `node_modules/**` package internals, except where a grep result confirmed a finding belongs to installed HADARA rather than the dogfood project docs.

## Summary

The R1 dogfood project is functionally closed: five capsules are `Done` and the final capsule is `closed-valid`.

The human-readable documents still contain several stale or misleading states that `docs doctor`, `harness validate`, and task close proof do not currently block. This is the main issue: the lifecycle succeeds, but generated/global docs and a few task-local handoff/plan cells can still look unfinished or contradictory to a human reader.

## Findings

| Severity | Area | Finding | Evidence / Reproduction | Suggested Fix |
|---|---|---|---|---|
| High | Global state / projection | `docs/PROJECT_STATE.md` still says `Name = TBD` and `Purpose = Describe the project in one or two sentences` after five closed capsules. | `docs/PROJECT_STATE.md` Product table. `docs doctor --json` still reports `healthy` and `clean`. | Init should either derive obvious package metadata when available or `docs doctor` should warn after first completed task when Product metadata is still scaffold text. |
| High | Current-state next work | `.hadara/state/current.json` and `docs/PROJECT_STATE.md` still say `Next Work = Create first Task Capsule` even though latest completed is T-0005. | `hadara session start --json` exposes the stale nextWork; `hadara task status --json` suppresses it and returns no recommendation. | After the first task is created/completed, remove or retire the bootstrap nextWork candidate. Read models should not disagree about whether it is actionable. |
| High | Done-level validation gap | T-0001 `TASK.md` is `Status = Done`, but all Plan rows remain `Pending`. | `hadara harness validate --task T-0001 --level done --json` returns ok true; `task status --task T-0001 --json` only shows read-only `authoringGuidance.status = needs-authoring`. | Done-level validation should block Done tasks with non-Done/In-Progress plan rows, or task status should emit an issue/nextAction even for closed-valid tasks. |
| Medium | Handoff evidence quality | T-0002 `HANDOFF.md` contains `ev:T-0002:pending` in Last Completed evidence. | `task status --task T-0002 --json` remains `closed-valid` with no issues. | Handoff validation should reject placeholder-looking evidence ids in completed task handoff rows, or avoid evidence ids in handoff rows if they are not validated. |
| Medium | Session start UX | `session start --json` shows stale `nextWork` from current state while also telling the agent to run `task status --json`, which then returns no recommendations. | `session start` currentState says `Create first Task Capsule`; `task status --json` says recommendations 0. | Align session start and task selection semantics for retired bootstrap nextWork. |
| Medium | Closed-valid output noise | `task status --task T-0001 --json` reports `closed-valid` but also `authoringGuidance.status = needs-authoring`; T-0002 reports `authoringSuggestions.acceptance.status = placeholder` despite no lifecycle action needed. | `task status --task T-0001 --json`, `task status --task T-0002 --json`. | Closed-valid output should separate "close proof valid" from "human prose polish" more sharply, or downgrade prose polish to a clearly non-blocking section. |
| Low | Workflow docs | `docs/HADARA_WORKFLOW.md` correctly says removed lifecycle commands are removed, not recommended. | Lines around Task Capsule Lifecycle. | No fix required for removed-command drift in this R1 project. |
| Low | Basic profile optional docs | `.hadara/context/HADARA_CONTEXT.md` says `docs/AGENT_HANDOFF.md when present`; basic profile does not create it. | Context file read. | No fix required; this profile-optional wording is good. |

## Validation Commands

| Command | Result | Note |
|---|---|---|
| `hadara docs doctor --json` | ok true | Did not flag stale Product metadata or bootstrap nextWork. |
| `hadara harness validate --task T-0001 --level done --json` | ok true | Did not flag Pending Plan rows in a Done task. |
| `hadara task status --task T-0001 --json` | ok true / closed-valid | Shows authoring guidance needs-authoring, but no issue or next action. |
| `hadara task status --task T-0002 --json` | ok true / closed-valid | Did not flag `ev:T-0002:pending` in `HANDOFF.md`. |
| `hadara session start --json` | ok true | Exposed stale `Create first Task Capsule` nextWork. |

## Priority For Cleanup

1. Retire bootstrap `nextWork` once a project has any task or when no recommendation remains.
2. Warn on uncustomized Product metadata after the first completed task.
3. Promote Done task + Pending Plan rows from authoring guidance to validation issue.
4. Detect placeholder evidence tokens in `HANDOFF.md`.
5. Reduce closed-valid task-status prose-polish noise.
