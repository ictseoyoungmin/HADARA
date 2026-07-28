# T-0729 Close Recovery Marker Reconciliation

## Identity

| Field | Value |
|---|---|
| ID | T-0729 |
| Title | Close Recovery Marker Reconciliation |
| Status | Done |
| Created | 2026-07-28T20:45 |
| Updated | 2026-07-28T21:06 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Close the reviewer Px gaps left by T-0728 in task-close recovery markers and durable journal semantics. | Prevent valid marker overwrite, validate marker schema, make close source hashing source-backed, describe all planned evidence appends, preserve proof-pending/closed-valid phases, separate progress from journal persistence, and tighten schema/tests. |

## Scope

| Boundary | Items |
|---|---|
| In | P1-1 through P1-5 and P2-1 through P2-5 from the reviewer attachment: recovery marker validation/overwrite fail-closed, close basis hash, evidence append descriptors, proof-pending phase preservation, applying persistence before writes, progress/journal separation, marker write budget, semantic unchanged skips, and task-local expectedWrite schema strictness. |
| Out | Physical deletion/rename of `bookkeeping.ts`, public close command redesign, installed-package fault dogfood, release promotion, and distributed/background recovery. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Existing schema-valid non-terminal recovery markers are not overwritten by a newly computed plan; they either reconcile safely or fail closed as recovery-required. | Done | `ev:T-0729:57ccb717baef4af2a5a700bb` | Reviewer P1-1 |
| AC-2 | Schema-invalid recovery markers fail closed, not only malformed JSON or task mismatch markers. | Done | `ev:T-0729:57ccb717baef4af2a5a700bb` | Reviewer P1-2 |
| AC-3 | `closeSourceHash` is backed by actual close-source units or the field is renamed/paired so the source-content basis is unambiguous. | Done | `ev:T-0729:57ccb717baef4af2a5a700bb` | Reviewer P1-3 |
| AC-4 | Expected writes describe readiness evidence and close proof appends with idempotency key, append kind, ordering, and record hash in addition to task-local writes. | Done | `ev:T-0729:57ccb717baef4af2a5a700bb` | Reviewer P1-4 |
| AC-5 | Proof append progress cannot regress persisted `proof-pending`/terminal operation state back to `applying`. | Done | `ev:T-0729:57ccb717baef4af2a5a700bb` | Reviewer P1-5 |
| AC-6 | The marker reaches durable `applying` before the first target-file mutation, and durable marker writes are journal-boundary writes rather than UI progress writes. | Done | `ev:T-0729:57ccb717baef4af2a5a700bb` | Reviewer P2-1/P2-2 |
| AC-7 | Clean close marker content writes remain within the four-write budget, and semantic unchanged skips are possible despite `updatedAt`. | Done | `ev:T-0729:57ccb717baef4af2a5a700bb` | Reviewer P2-3/P2-4 |
| AC-8 | Task-local expected write schema requires before/after hash fields conditionally. | Done | `ev:T-0729:57ccb717baef4af2a5a700bb` | Reviewer P2-5 |
| AC-9 | Validation evidence is recorded, including focused regressions and build/check. | Done | `ev:T-0729:57ccb717baef4af2a5a700bb`; `ev:T-0729:af98b12c49cb47fdafeec591`; `ev:T-0729:67eb19a8b24c4d23a952baca`; `ev:T-0729:f71405796cda44fdb814bc43`; `ev:T-0729:eea005a254fa4cb4aa12af7c` | HADARA workflow |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused close/schema tests | Yes | Passed | `npm test -- --run tests/unit/task-close.test.ts tests/unit/schema-command.test.ts`; 44 tests passed. | `ev:T-0729:57ccb717baef4af2a5a700bb` |
| TypeScript build | Yes | Passed | `npm run build`. | `ev:T-0729:af98b12c49cb47fdafeec591` |
| Full check | Yes | Passed | `npm run check`; public 136 passed / 1 skipped, 1080 tests passed / 8 skipped; HADARA-dev 16 passed, 134 passed / 1 skipped. | `ev:T-0729:67eb19a8b24c4d23a952baca` |
| Built dist smoke | Yes | Passed | `node dist/cli/main.js version --verbose --json` returned `ok:true` and `distLooksStale:false`. | `ev:T-0729:f71405796cda44fdb814bc43` |
| Docker sync dist build | No | Blocked | `npm run dev:docker-sync-build` was attempted but interrupted after hanging in container `npm ci`; local build refreshed dist and smoke confirmed freshness. | `ev:T-0729:ac30f77a5735485ba2a49a89` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| AGENTS.md | constraint | active | HADARA protocol and task capsule workflow. |
| docs/TASK_WORKFLOW_COMMANDS.md | constraint | active | Task close lifecycle and close-source write rules. |
| docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md | constraint | active | Normative close recovery, journal, schema, and write summary contract. |
| Reviewer Px attachment | reference | active | P1/P2 feedback for T-0728 follow-up. |
| src/task/close/execute.ts | implementation-source | active | Operation marker, transaction report, locks, and journal orchestration. |
| src/task/close/plan.ts | implementation-source | active | Close plan execution and progress/fault seams. |
| src/task/close/proof.ts | implementation-source | active | Close source hash and evidence idempotency key source. |
| src/schemas/task-close-v3.schema.json | implementation-source | active | Public v3 report schema. |
| tests/unit/task-close.test.ts | implementation-source | active | Focused close transaction regression coverage. |

## Changes

| Area | Summary |
|---|---|
| Close transaction operation marker | Added strict marker shape validation, valid-marker reconciliation/fail-closed before overwrite, source-backed `closeSourceHash`, separate `planFingerprint`, and evidence append descriptors. |
| Durable journal semantics | Persist initial `applying`, stop persisting UI progress events, preserve proof-pending/terminal phases, and make unchanged marker skips compare semantic payload before `updatedAt`. |
| Schema/tests | Tightened v3 expectedWrite conditionals and added focused regressions for invalid marker JSON, mismatched marker refusal, evidence descriptors, close source hash, proof-pending preservation, and write-budget/progress counts. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Physical removal or rename of the legacy `bookkeeping` implementation/report domain remains a later naming/refactor pass after recovery correctness is stable. | Open | docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md |

## Close Summary

All reviewer P1/P2 items in scope were implemented. The remaining legacy `bookkeeping` naming/report split is intentionally left as RF-1 because this task was limited to recovery correctness and schema semantics.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | Done | Implemented close recovery marker reconciliation, schema tightening, durable journal fixes, tests, and validation evidence. |
