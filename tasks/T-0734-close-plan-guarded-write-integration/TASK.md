# T-0734 Close plan guarded write integration

## Identity

| Field | Value |
|---|---|
| ID | T-0734 |
| Title | Close plan guarded write integration |
| Status | Done |
| Created | 2026-07-29T17:10 |
| Updated | 2026-07-29T17:25 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Close the two remaining task-close proof-boundary and close-plan ownership gaps identified after T-0733. | Proof append must fail closed if the operation marker required for that proof boundary is missing, malformed, or no longer matches the explicit operation identity/write set. Guarded task-local writes must become a top-level close-plan component instead of a separate sync/bookkeeping phase/report. |

## Scope

| Boundary | Items |
|---|---|
| In | Explicit proof append marker guard, marker identity/write-set validation immediately before proof append, missing/malformed marker fail-closed tests, top-level close-plan guarded write set, removal of `sync` step semantics and `CloseBookkeepingReport` usage, schema/docs/tests/evidence updates. |
| Out | Release publish, broad task lifecycle redesign, unrelated command surfaces, and installed abrupt-kill harness expansion beyond deterministic close fault tests. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract from the final reviewer gap list. | Done |
| 2 | Add an explicit proof append guard carrying operation marker identity and write-set expectations, and fail closed on missing/malformed/mismatched markers. | Done |
| 3 | Refactor guarded task-local writes into the top-level close plan and remove `sync` step / `CloseBookkeepingReport` orchestration. | Done |
| 4 | Update runtime schema, docs, and focused regressions for the new close-plan contract. | Done |
| 5 | Run validation, record evidence, update handoff/current docs, and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A write-capable close transaction passes an explicit proof append guard into `executeTaskCloseEvidence()` with operation id, operation idempotency key, plan hash, close-basis hash, write-set hash, expected writes, and proof idempotency key. | Met | ev:T-0734:d0758a2fc0b04709b969e0ab | Reviewer final gap 1 |
| AC-2 | Immediately before proof append, the persisted marker must exist, parse, match the explicit guard identity/hash/write-set, have `phase: proof-pending`, and have `hashObject(expectedWrites) === writeSetHash`; otherwise close fails closed with no close proof append. | Met | ev:T-0734:d0758a2fc0b04709b969e0ab | Reviewer final gap 1 |
| AC-3 | Fault tests cover marker deletion and marker corruption after proof intent and before proof append. | Met | ev:T-0734:d0758a2fc0b04709b969e0ab | Reviewer final gap 1 |
| AC-4 | Close-plan public `steps` no longer include `sync`; guarded task-local writes are represented by a top-level close-plan guarded write set and public pending write summary, not by `CloseBookkeepingReport`. | Met | ev:T-0734:d0758a2fc0b04709b969e0ab, ev:T-0734:e398f0e50a1a42858ba556f9 | Reviewer final gap 2 |
| AC-5 | Implementation no longer depends on `CloseBookkeepingReport` or exposes a separate sync/bookkeeping report identity for guarded writes. | Met | ev:T-0734:d0758a2fc0b04709b969e0ab, ev:T-0734:13b3bcbd143340ca90c5ff51 | Reviewer final gap 2 |
| AC-6 | Recovery/operation expected writes use the guarded-write-set component consistently and schema/runtime tests cover the new step/source tokens. | Met | ev:T-0734:d0758a2fc0b04709b969e0ab | Reviewer final gap 2 |
| AC-7 | Focused close/schema tests and full validation pass and are recorded as canonical evidence. | Met | ev:T-0734:d0758a2fc0b04709b969e0ab, ev:T-0734:13b3bcbd143340ca90c5ff51 | HADARA workflow |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused task-close/schema/current-state tests | Yes | Passed | `npx vitest run tests/unit/task-close.test.ts tests/unit/schema-runtime.test.ts tests/unit/schema-fixtures.test.ts tests/unit/status-continuation.test.ts tests/unit/project-current-state.test.ts tests/unit/task-board-v1.test.ts tests/unit/workbench-next-actions.test.ts` passed 7 files / 122 tests. | ev:T-0734:d0758a2fc0b04709b969e0ab |
| TypeScript no-emit | Yes | Passed | `./node_modules/.bin/tsc -p tsconfig.json --noEmit` passed. | ev:T-0734:8a2681c3764c4f7297fa9956 |
| Full check | Yes | Passed | `npm run check` passed build, tools typecheck, 136 public test files / 1090 tests, and 16 HADARA-dev files / 134 tests. | ev:T-0734:13b3bcbd143340ca90c5ff51 |
| Built command registry | Yes | Passed | Built CLI command registry exposes `task-close-guarded-writes` and no `task-status-sync` entry. | ev:T-0734:e398f0e50a1a42858ba556f9 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer final T-0733 judgment | constraint | active | Limits this capsule to proof-boundary marker fail-closed and guarded write-set integration. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Close workflow command and proof-last transaction semantics. |
| `docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md` | reference | active | Normative close transaction contract. |
| `docs/CLI_JSON_CONTRACT.md` | constraint | active | Public JSON contract behavior. |
| `src/task/close/execute.ts`, `src/task/close/plan.ts`, `src/task/close/proof.ts` | implementation-source | active | Close transaction, close plan, and proof append implementation. |
| `src/task/close/guardedWrites.ts` | implementation-source | active | Guarded write planning/execution code absorbed into the close plan. |
| `tests/unit/task-close.test.ts`, `tests/unit/schema-runtime.test.ts`, `tests/unit/schema-fixtures.test.ts` | implementation-source | active | Focused regression coverage. |

## Changes

| Area | Summary |
|---|---|
| Proof append | Added `TaskCloseProofAppendGuard` and pass the active operation marker identity/write-set from the transaction executor into `executeTaskCloseEvidence()`. Proof append now fails closed on missing, malformed, mismatched, non-`proof-pending`, or write-set-inconsistent markers. |
| Close plan | Removed `sync` from public close-plan `steps`; guarded task-local writes now live in top-level `closePlan.guardedWrites` and public pending write summaries use `guarded-writes`. |
| Operation marker/recovery | Expected task-local writes now use `step: guarded-writes`; operation journals and recovery reports accept the same token. |
| Public registry/docs | Command registry write boundary changed from `task-status-sync` to `task-close-guarded-writes`; close workflow docs describe close-plan guarded writes. |
| Tests/schema | Added marker deletion and malformed-marker fault regressions; updated close v3 schema step enums and focused tests. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Removing the `sync` step touched close-plan hashes, operation marker recovery, schema fixtures, and existing tests; focused and full checks passed after the scoped refactor. | Closed | ev:T-0734:13b3bcbd143340ca90c5ff51 |

## Close Summary

T-0734 completes the two final reviewer constraints after T-0733: proof append is now explicitly bound to the persisted operation marker identity/write set and fails closed if the marker is missing, malformed, mismatched, or not proof-pending; guarded task-local writes are now a top-level close-plan component rather than a `sync`/bookkeeping step or report.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-29 | Draft | Initial task scaffold. |
| 2026-07-29 | In Progress | Accepted final reviewer scope: proof-boundary marker fail-closed and top-level guarded write-set integration only. |
| 2026-07-29 | Done | Implemented proof-boundary marker guard and top-level guarded write-set close-plan integration; focused and full checks passed. |
