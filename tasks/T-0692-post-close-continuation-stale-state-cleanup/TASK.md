# T-0692 Post-close continuation stale state cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0692 |
| Title | Post-close continuation stale state cleanup |
| Status | Done |
| Created | 2026-07-23T21:43 |
| Updated | 2026-07-23T22:14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prevent post-close stale continuation state from keeping a closed capsule selected as the next action. | Self-close HANDOFF reminders must not survive into project-level continuation. |

## Scope

| Boundary | Items |
|---|---|
| In | `src/services/project-current-state.ts` continuation promotion/write-path behavior; focused continuation/status regression tests. |
| Out | Broader task-selection wording changes; unrelated Task Board or workflow refactors. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm stale continuation source and write path. | Done |
| 2 | Suppress self-close HANDOFF promotion and clear same-task stale continuation on close. | Done |
| 3 | Run focused validation and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Closing a task does not persist a continuation when the HANDOFF step only instructs that same task to run `hadara task close`/`finalize`. | Done | `ev:T-0692:347ee4ffadd5401c8c6714d4` | `src/services/project-current-state.ts`, `tests/unit/status-continuation.test.ts` |
| AC-2 | Existing continuation state is preserved for unrelated tasks but cleared when a stale continuation belongs to the task being completed. | Done | `ev:T-0692:347ee4ffadd5401c8c6714d4`, `ev:T-0692:834c65bfa1fd4523821a14dd` | `src/services/project-current-state.ts`, `tests/unit/status-continuation.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `vitest tests/unit/status-continuation.test.ts` | Yes | Passed | ev:T-0692:347ee4ffadd5401c8c6714d4 |
| `tsc -p tsconfig.json --noEmit` | Yes | Passed | ev:T-0692:834c65bfa1fd4523821a14dd |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Close semantics and proof-last workflow language. |
| `.hadara/state/current.json` | reference | active | Stale continuation sourced from closed T-0691 reproduced the bug and was cleared as part of this capsule. |

## Changes

| Area | Summary |
|---|---|
| Continuation promotion/write path | Add a narrow self-close suppression rule and same-task stale continuation clearing path. |
| Focused regression coverage | Lock the self-close and same-task cleanup cases without changing unrelated continuation persistence. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Re-check `task status --json` after this capsule closes to confirm the continuation-ready stale path is gone. | Open | `src/services/task-selection-status-v2.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-23 | Draft | Initial task scaffold. |
| 2026-07-23 | In Progress | Scoped the regression to self-close HANDOFF promotion plus same-task stale continuation cleanup. |
| 2026-07-23 | Done | Added the narrow self-close suppression/cleanup path, cleared the persisted T-0691 stale continuation, and recorded focused regression evidence. |
