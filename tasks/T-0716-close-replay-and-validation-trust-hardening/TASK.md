# T-0716 Close Replay and Validation Trust Hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0716 |
| Title | Close Replay and Validation Trust Hardening |
| Status | Done |
| Created | 2026-07-28T14:28 |
| Updated | 2026-07-28T14:40 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Re-close stale capsules and harden close/finalize replay trust. | Re-close `T-0711` and `T-0713`, preserve actual close append outcomes, and harden finalize reviewed-plan execution. |

## Scope

| Boundary | Items |
|---|---|
| In | Re-close `T-0711` and `T-0713` with fresh close proof; reuse reviewed finish writes inside finalize execute; derive `closeProofAppended` from actual append outcome; add regression coverage; run broader validation. |
| Out | Full journal transaction across proof append, finish writes, state projection, and final audit; non-close lifecycle redesign. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Re-close stale capsules and confirm fresh proof. | Done |
| 2 | Harden finalize/close replay semantics and regressions. | Done |
| 3 | Run broader validation and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `T-0711` and `T-0713` are re-closed to `closed-valid`, and stale close replay no longer reports a false append. | Met | `ev:T-0716:5d0792aa27dd4c348032e2a6` | `tasks/T-0711-automatic-validation-failure-classification/evidence.jsonl`, `tasks/T-0713-task-close-atomicity-and-evidence-integrity-hardening/evidence.jsonl` |
| AC-2 | Finalize/close regressions, tool typecheck/build, and full `npm test` are recorded. | Met | `ev:T-0716:5d0792aa27dd4c348032e2a6` | `src/task/task-finalize.ts`, `src/task/task-close-transaction.ts`, `tests/unit/task-finalize.test.ts` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| `npm test -- tests/unit/task-finalize.test.ts tests/unit/task-close.test.ts tests/unit/task-finish.test.ts` | Yes | Passed | Targeted lifecycle and close replay regressions passed. | `ev:T-0716:5d0792aa27dd4c348032e2a6` |
| `npm run typecheck:tools` | Yes | Passed | Tools TypeScript compile passed. | `ev:T-0716:5d0792aa27dd4c348032e2a6` |
| `npm run build` | Yes | Passed | Project TypeScript build passed. | `ev:T-0716:5d0792aa27dd4c348032e2a6` |
| `npm test` | Yes | Passed | Full repository Vitest suite passed: 141 files, 1107 tests, 1 skipped file, 8 skipped tests. | `ev:T-0716:5d0792aa27dd4c348032e2a6` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Proof-last close contract and public task close routing. |
| `tasks/T-0713-task-close-atomicity-and-evidence-integrity-hardening/HANDOFF.md` | reference | active | Prior proof-last gap and stale close replay context. |
| `tasks/T-0715-post-proof-last-hardening-followups/HANDOFF.md` | reference | active | Follow-up trust hardening backlog carried into this task. |

## Changes

| Area | Summary |
|---|---|
| `src/task/task-finalize.ts` | `--auto` now executes the reviewed in-memory finalize plan, reuses reviewed finish writes during execute, records close write outcome, and fingerprints reviewed plans more strictly before execute. |
| `src/task/task-finish.ts` | Reviewed finish plans can now be executed without regenerating writes. |
| `src/task/task-close-transaction.ts` | `closeProofAppended` now derives from the actual close append outcome instead of any successful close step. |
| `src/schemas/task-finalize.schema.json`, `tests/unit/task-finalize.test.ts`, `tests/unit/task-close.test.ts` | Added regression coverage and schema support for close write outcome semantics. |
| `tasks/T-0711-*`, `tasks/T-0713-*` | Re-closed stale capsules with fresh close proof through the public `task close` flow. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Explicit reviewed `task finalize --execute --plan-hash` still refuses when the recomputed reviewed plan fingerprint drifts, rather than replaying a persisted reviewed write-set across long review gaps. Public `task close` is safe because `--auto` now reuses the reviewed in-memory plan. | Open | `src/task/task-finalize.ts` |

## Close Summary

Re-closed `T-0711` and `T-0713` to refresh stale close proof under current semantics. `task close` now reports actual append/no-op outcomes, and finalize execute no longer regenerates finish writes after proof planning inside the `--auto` path.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | Done | Re-closed stale capsules, hardened finalize replay semantics, and recorded broader validation. |
