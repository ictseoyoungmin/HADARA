# T-0715 Post Proof-Last Hardening Followups

## Identity

| Field | Value |
|---|---|
| ID | T-0715 |
| Title | Post Proof-Last Hardening Followups |
| Status | Done |
| Created | 2026-07-28T13:35 |
| Updated | 2026-07-28T13:42 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Close the reviewer-found follow-up gaps left after T-0713/T-0714 without expanding scope into a full close journal redesign. | This capsule is for concrete correctness/lint/continuation fixes, not broader lifecycle redesign. |

## Scope

| Boundary | Items |
|---|---|
| In | Fix Docker dist-sync delete/create TOCTOU gaps in the tool and script paths; fail closed on unreadable init descendant subtrees; lint HANDOFF evidence refs for real existence and repair T-0713 fake ids; restore the T-0712 archived-authority follow-up to current continuation; ensure new rows on extended v1 Task Boards preserve extra header columns. |
| Out | Full journaled close atomicity; redesigning Task Board schemas beyond respecting existing extra columns; broader documentation archive policy changes outside the T-0712 continuation reminder. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm each reviewer finding against current source and tests. | Done |
| 2 | Implement the smallest fixes for dist-sync, init scanning, HANDOFF evidence lint, continuation docs, and extended Board row creation. | Done |
| 3 | Run focused regression coverage, record evidence, and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Docker dist-sync refuses delete/create transitions, not only content mismatch, on both the tool and script paths. | Met | `ev:T-0715:2ded8feff31749dcbba0f718` | User instruction |
| AC-2 | HANDOFF evidence refs are checked for existence, T-0713 fake ids are repaired, and current continuation again mentions the unresolved T-0712 archived-authority follow-up. | Met | `ev:T-0715:2ded8feff31749dcbba0f718` | User instruction |
| AC-3 | Unreadable init descendant subtrees fail closed and new rows on extended v1 Boards keep the extra header width. | Met | `ev:T-0715:2ded8feff31749dcbba0f718` | User instruction |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused regressions for dist-sync, init scanning, protocol/handoff lint, and v1 Board creation | Yes | Passed | `vitest run tests/unit/dev-docker-check.test.ts tests/unit/dev-docker-script.test.ts tests/unit/init-v1-transaction.test.ts tests/harness/harness-validate.test.ts tests/unit/protocol-consistency.test.ts tests/unit/task-board-v1.test.ts tests/unit/task-finalize.test.ts tests/unit/task-close.test.ts` passed. | ev:T-0715:2ded8feff31749dcbba0f718 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User review follow-up after T-0713/T-0714 | decision | active | Defines the five concrete gaps to close in this capsule. |
| `tools/dev-docker-check.ts`, `scripts/dev-docker-sync-build.sh` | implementation-source | active | Own the dist-sync guard semantics. |
| `src/init/safety.ts` | implementation-source | active | Owns descendant nested-project scanning. |
| `src/harness/validate.ts`, `src/services/protocol-consistency.ts` | implementation-source | active | Own HANDOFF evidence-reference validation and current continuation linting. |
| `tasks/T-0712-live-documentation-set-and-archive/HANDOFF.md`, `tasks/T-0713-task-close-atomicity-and-evidence-integrity-hardening/HANDOFF.md` | reference | active | Carry the stale continuation/evidence-id issues called out by the review. |

## Changes

| Area | Summary |
|---|---|
| `tools/dev-docker-check.ts`, `scripts/dev-docker-sync-build.sh` | Dist-sync now compares full before-state semantics, so deletion and first-run creation transitions fail closed instead of slipping through hash-only checks. |
| `src/init/safety.ts` | Unreadable descendant directories now make the nested-project scan incomplete, matching the existing cap-based fail-closed behavior. |
| `src/harness/validate.ts`, `src/services/protocol-consistency.ts` | Task-local HANDOFF and shared `docs/AGENT_HANDOFF.md` evidence refs are now linted for real existence; placeholder-only checking is no longer the only guard. |
| `src/task/task-board.ts`, `src/task/task-capsule.ts` | New rows on an extended v1 Task Board now inherit the header width instead of collapsing back to six cells. |
| `tasks/T-0713.../HANDOFF.md`, `docs/AGENT_HANDOFF.md` | Repaired stale T-0713 evidence refs and restored the unresolved T-0712 archived-authority issue to the current continuation prose. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Even after these fixes, close remains proof-last rather than fully journaled; that larger transaction redesign still needs an explicit decision. | Open | tasks/T-0714-task-close-proof-last-refactor/TASK.md |

## Close Summary

Closed the post-T-0713/T-0714 follow-up gaps: dist-sync now blocks delete/create transitions, unreadable init descendant subtrees fail closed, HANDOFF evidence refs are existence-checked, T-0713 fake ids are repaired, current continuation again carries the T-0712 archived-authority follow-up, and new rows on extended v1 Boards preserve the extra header width.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | Done | Fixed the focused follow-up hardening gaps across dist-sync, init scanning, HANDOFF evidence lint, continuation docs, and v1 Board row creation; focused regressions passed. |
