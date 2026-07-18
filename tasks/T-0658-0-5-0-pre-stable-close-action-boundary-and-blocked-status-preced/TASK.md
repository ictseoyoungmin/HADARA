# T-0658 0.5.0 pre-stable close action boundary and blocked status precedence

## Identity

| Field | Value |
|---|---|
| ID | T-0658 |
| Title | 0.5.0 pre-stable close action boundary and blocked status precedence |
| Status | Done |
| Created | 2026-07-19T00:31 |
| Updated | 2026-07-19T00:54 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0658 --json`.

## Goal

| Goal | Notes |
|---|---|
| Harden remaining pre-stable public action contracts for task close recovery and blocked project status routing. | Follows reviewer feedback after T-0657; keeps the change narrow before a fresh 0.5.0-rc.1 readiness pass. |

## Scope

| Boundary | Items |
|---|---|
| In | Normalize public `task close` recovery/write action boundaries to `task-close-transaction`; route blocked project health to a state-consistency review action before active-task routing; record PID reuse as a future fail-closed edge. |
| Out | Version bump, npm/GitHub release, package recycle, process-kill fault injection, heartbeat lease design, and broad status/read-model redesign. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract from reviewer feedback and locate affected action builders. | Done |
| 2 | Add focused regression tests for close recovery boundary and blocked status precedence. | Done |
| 3 | Implement narrow contract fixes and update docs where public semantics are described. | Done |
| 4 | Run focused/full validation, Docker sync build, and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Lock-timeout recovery action reports `writeBoundary: task-close-transaction` for the public `hadara task close --task T-XXXX --json` retry command. | Done | `ev:T-0658:31af69477c6f41598ead6ea3` | `src/task/task-close-transaction.ts`, `tests/unit/task-close.test.ts` |
| AC-2 | `normalizeCloseNextAction()` converts public non-dry-run `task close` commands to command-level `task-close-transaction` even when the underlying finalize action was task-local or evidence-append. | Done | `ev:T-0658:31af69477c6f41598ead6ea3` | `src/task/task-close-transaction.ts`, `tests/unit/task-close.test.ts` |
| AC-3 | Blocked project health is routed before active-task inspection; state-consistency errors use a dedicated review action when present. | Done | `ev:T-0658:31af69477c6f41598ead6ea3` | `src/services/project-status-v2.ts`, `tests/unit/status-json.test.ts` |
| AC-4 | PID reuse remains a documented fail-closed future edge, not a silent stable-blocking gap. | Done | `ev:T-0658:31af69477c6f41598ead6ea3` | `.hadara/local/feedback/T-0658-task-close-pid-reuse-fail-closed-edge.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused task-close/status/next-action regression tests: 5 files, 82 tests | Yes | Passed | `ev:T-0658:31af69477c6f41598ead6ea3` |
| TypeScript build | Yes | Passed | `ev:T-0658:31af69477c6f41598ead6ea3` |
| Full unit suite: 153 files passed, 1 skipped; 1141 tests passed, 7 skipped | Yes | Passed | `ev:T-0658:31af69477c6f41598ead6ea3` |
| Docker sync build / dist freshness: built CLI smoke reported `distLooksStale:false` | Yes | Passed | `ev:T-0658:31af69477c6f41598ead6ea3` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer feedback in user request | reference | active | Defines High/Medium/Low residuals after T-0657. |
| `src/task/task-close-transaction.ts` | implementation-source | active | Owns public `task close` transaction report, recovery action, and finalize action normalization. |
| `src/services/project-status-v2.ts` | implementation-source | active | Owns project status v2 phase/health/readiness/primary action routing. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Public task lifecycle write-boundary contract. |

## Changes

| Area | Summary |
|---|---|
| Task close transaction | Lock-timeout recovery and normalized public close execute actions now report `task-close-transaction` as the command-level write boundary. |
| Next-action vocabulary | Added `task-close-transaction` to the shared `HadaraNextAction` write-boundary tokens and JSON schema. |
| Project status v2 | Blocked project health now preempts active-task routing, with dedicated state-consistency review guidance when blocking state-consistency errors exist. |
| Tests/docs | Added/updated regression coverage and aligned task workflow docs with the next-action boundary vocabulary. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | PID reuse can keep stale locks fail-closed until manual cleanup because lock metadata has no process start identity or heartbeat. | Open | `.hadara/local/feedback/T-0658-task-close-pid-reuse-fail-closed-edge.md` |
| RF-2 | Follow-up | Current source still needs fresh 0.5.0-rc.1 readiness/recycle after T-0657/T-0658. | Open | `tasks/T-0648-0-5-0-rc-0-release-readiness-and-publish-preparation/` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-19 | Draft | Initial task scaffold. |
| 2026-07-19 | In Progress | Scoped action-boundary and blocked-status precedence fixes before RC.1 readiness. |
| 2026-07-19 | Done | Focused tests, full suite, TypeScript build, and Docker sync build passed. |
