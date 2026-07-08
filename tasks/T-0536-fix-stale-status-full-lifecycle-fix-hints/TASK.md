# T-0536 Fix stale status full lifecycle fix hints

## Identity

| Field | Value |
|---|---|
| ID | T-0536 |
| Title | Fix stale status full lifecycle fix hints |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove stale low-level lifecycle command suggestions from status/full readiness diagnostics. | T-0535 dogfood found `task status --detail full` still telling agents to run removed `task finish`. |

## Scope

| Boundary | Items |
|---|---|
| In | Update harness/task lifecycle report fix hints and next-action command strings that surface to status/finalize users; add regression coverage that stale `task finish` guidance is gone. |
| Out | Do not reintroduce removed public lifecycle routes. Do not refactor internal finish/ready/close/audit engine boundaries. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Identify stale low-level lifecycle command hints exposed through status/full and related read reports. | Done |
| 2 | Replace agent-facing `task finish`/`task close`/`task audit-close` guidance with current finalize/status commands while keeping internal engines intact. | Done |
| 3 | Update focused regression tests. | Done |
| 4 | Build/validate, refresh `dist`, record evidence, and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task status --detail full` no longer reports fix hints that tell agents to run removed `task finish`. | Done | `ev:T-0536:a9ddd04930314c1c9289f643` | `src/harness/validate.ts` |
| AC-2 | Internal ready/close/finish reports that expose next commands point at current finalize/status surfaces. | Done | `ev:T-0536:ddbc62ab30dc4f8dbc48048e` | `src/task/*.ts` |
| AC-3 | Focused tests cover the replacement guidance. | Done | `ev:T-0536:ddbc62ab30dc4f8dbc48048e` | `tests/` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused lifecycle hint tests | Yes | Passed | ev:T-0536:ddbc62ab30dc4f8dbc48048e |
| TypeScript build | Yes | Passed | ev:T-0536:da34805fe34a42b8a68673a5 |
| Docker sync-build | Yes | Passed | ev:T-0536:c6d62cf0831846479adc9438 |
| Stale lifecycle hint scan | Yes | Passed | ev:T-0536:a9ddd04930314c1c9289f643 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/local/feedback/T-0535-stale-task-finish-fixhint.md` | reference | active | Fresh dogfood finding to fix. |
| `tasks/T-0535-post-dead-code-fresh-tmp-dogfood/DOGFOOD_REPORT.md` | reference | active | Reproduction context and expected replacements. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Current lifecycle replacements for removed public commands. |

## Changes

| Area | Summary |
|---|---|
| `src/harness/validate.ts` | Replaced done-level status and Task Board fix hints that pointed at removed `task finish` with guarded `task finalize --execute --auto` guidance. |
| `src/task/task-ready.ts` | Updated ready-report next actions to point at finalize dry-run or guarded auto finalize instead of removed `task close`/`task finish`. |
| `src/task/task-finish.ts` | Updated finish-report next actions and legacy Status History marker text to use finalize/status guidance. |
| `src/task/task-close.ts` | Updated close/audit report next actions and lifecycle guidance to use finalize/status surfaces instead of removed close/audit commands. |
| `tests/` | Updated focused regression expectations for the current public lifecycle commands. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Session-start read-map count parity from T-0535 remains separate unless it reproduces during validation. | Open | `tasks/T-0535-post-dead-code-fresh-tmp-dogfood/DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Scoped stale lifecycle hint cleanup from T-0535 dogfood. |
