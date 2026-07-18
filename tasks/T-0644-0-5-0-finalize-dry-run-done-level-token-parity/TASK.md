# T-0644 0.5.0 finalize dry-run done-level token parity

## Identity

| Field | Value |
|---|---|
| ID | T-0644 |
| Title | 0.5.0 finalize dry-run done-level token parity |
| Status | Done |
| Created | 2026-07-18T15:52 |
| Updated | 2026-07-18T16:00 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0644 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Make `task finalize --json` surface done-level controlled-token blockers before recommending execute. | Reuse the existing auto preflight path narrowly so dry-run and execute agree on invalid task-table tokens without changing the initial scaffold authoring flow. |

## Scope

| Boundary | Items |
|---|---|
| In | `task finalize` dry-run behavior, done-level invalid-token/plan-status preflight filtering, regression coverage, build validation. |
| Out | Full state-first lifecycle rewrite, project-state update command design, validation baseline semantics, context slice warning changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the dry-run parity target from T-0643 delegated dogfood findings. | Done |
| 2 | Reuse finalize auto preflight for dry-run when authored capsules have done-level token/plan blockers. | Done |
| 3 | Validate with focused tests and TypeScript build, then record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A default scaffold Draft task still receives the existing finish-required dry-run plan. | Met | ev:T-0644:0bf5f72203f34e28902a5088 | `tests/unit/task-finalize.test.ts` |
| AC-2 | An authored task with invalid done-level table tokens is blocked in dry-run before finish writes are recommended. | Met | ev:T-0644:0bf5f72203f34e28902a5088 | `tests/unit/task-finalize.test.ts` |
| AC-3 | Lifecycle-owned Task Board Draft mismatch remains finish-resolvable and is not misclassified as an agent repair blocker. | Met | ev:T-0644:0bf5f72203f34e28902a5088 | `src/task/task-finalize.ts` |
| AC-4 | Validation evidence is recorded. | Met | ev:T-0644:0bf5f72203f34e28902a5088 | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- tests/unit/task-finalize.test.ts` | Yes | Passed | ev:T-0644:0bf5f72203f34e28902a5088 |
| `npm run build` | Yes | Passed | ev:T-0644:0bf5f72203f34e28902a5088 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0643 dogfood report | implementation-source | active | Delegated Codex and local finalize both hit execute-time token blockers after dry-run looked executable. |
| `src/task/task-finalize.ts` | implementation-source | active | Owns dry-run, auto, finish/ready/close/audit orchestration. |
| `tests/unit/task-finalize.test.ts` | implementation-source | active | Holds finalize dry-run and auto regression coverage. |

## Changes

| Area | Summary |
|---|---|
| `src/task/task-finalize.ts` | Dry-run now applies a narrow post-finish preflight for invalid controlled-token and plan-status blockers when authoring is not untouched scaffold state; blocked dry-runs no longer expose pending writes/deferred checks. |
| `tests/unit/task-finalize.test.ts` | Added a regression proving dry-run blocks invalid table tokens before recommending finish writes while preserving the initial Draft plan contract. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Broader validation baseline and project-state update discoverability findings remain separate from this lifecycle dry-run parity fix. | Open | `tasks/T-0643-0-5-0-latest-dist-delegated-codex-dogfood/DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | Done | Implemented dry-run done-level token parity and validated focused finalize coverage plus TypeScript build. |
