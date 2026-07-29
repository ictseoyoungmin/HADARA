# T-0733 Close transaction proof and marker hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0733 |
| Title | Close transaction proof and marker hardening |
| Status | Done |
| Created | 2026-07-29T14:58 |
| Updated | 2026-07-29T15:24 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Close the remaining reviewer-identified task-close correctness and contract gaps after T-0732. | The close proof must revalidate actual source/write state immediately before append, recovery markers must bind `writeSetHash` to `expectedWrites`, missing-target writes must not escape through symlink ancestors, proof-pending resume/reporting must stay phase-accurate, stale current-state continuation data must be cleaned up, and the public close contract must stop exposing legacy bookkeeping-domain terminology while separating close basis and final source hashes. |

## Scope

| Boundary | Items |
|---|---|
| In | Proof append preflight revalidation, marker hash invariant validation/reuse gating, path confinement for missing-target writes, proof-pending reuse ordering, recovery write classification reporting, public close transaction step/report/schema terminology, close-basis vs final-source hash naming, current-state projection cleanup, focused tests and evidence. |
| Out | Broad release publish/recycle, unrelated lifecycle redesign, broad MCP/provider work, and private evidence encryption. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract from the reviewer P1/P2 gap list and route required source/spec/security documents. | Done |
| 2 | Implement proof append actual-state revalidation and marker `writeSetHash === hash(expectedWrites)` invariants. | Done |
| 3 | Harden missing-target path confinement against symlink ancestors. | Done |
| 4 | Align proof-pending reuse/reporting and recovery write classification output. | Done |
| 5 | Remove public legacy bookkeeping-domain terminology from the close transaction contract and split close-basis/final-source hashes. | Done |
| 6 | Clean stale current-state continuation projection data. | Done |
| 7 | Run focused validation, record evidence, update docs, and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `executeTaskCloseEvidence()` refuses to append close proof if, immediately before append, persisted task-local expected writes are not all `after` or the actual close source hash differs from the report source hash. | Met | ev:T-0733:35bf996e3957464f91377f9c, ev:T-0733:9de550d0a6c64867916f7fb8 | Reviewer P1-1 |
| AC-2 | Runtime marker validation and fast reuse require `hashObject(operation.expectedWrites) === operation.writeSetHash`; corrupted markers fail closed without lifecycle/evidence writes. | Met | ev:T-0733:35bf996e3957464f91377f9c, ev:T-0733:9de550d0a6c64867916f7fb8 | Reviewer P1-2 |
| AC-3 | Missing-target task-local writes cannot pass confinement through a symlink ancestor; nearest-existing ancestor or parent resolution blocks project-root escapes. | Met | ev:T-0733:35bf996e3957464f91377f9c, ev:T-0733:9de550d0a6c64867916f7fb8 | Reviewer P1-3 |
| AC-4 | Proof-pending markers resume through proof-stage semantics before generic fast reuse and do not re-enable readiness evidence or regress to applying. | Met | ev:T-0733:35bf996e3957464f91377f9c, ev:T-0733:9de550d0a6c64867916f7fb8 | Reviewer P2 |
| AC-5 | Recovery reports use actual classification when an operation marker is available, and do not report the same write as both completed and pending when classification is unavailable. | Met | ev:T-0733:35bf996e3957464f91377f9c, ev:T-0733:9de550d0a6c64867916f7fb8 | Reviewer P2 |
| AC-6 | Public close v3 report/schema/spec no longer expose a separate `bookkeeping` domain/schema/report/step; close uses close-plan guarded write-set terminology while preserving guarded writes. | Met | ev:T-0733:738e502c25ba4c33a4ef4e30, ev:T-0733:240f7aaa5fab4571a59e1ef6 | Reviewer P2 / spec AC-4 |
| AC-7 | Close transaction reports and persisted markers distinguish close-basis hash from final-source hash instead of aliasing a single source hash through both meanings. | Met | ev:T-0733:35bf996e3957464f91377f9c, ev:T-0733:9de550d0a6c64867916f7fb8 | Reviewer P2 |
| AC-8 | `.hadara/state/current.json` no longer contains Markdown-backtick paths or stale T-0728 deterministic partial-write continuation guidance after this task is active/current. | Met | ev:T-0733:35bf996e3957464f91377f9c, ev:T-0733:9de550d0a6c64867916f7fb8 | Reviewer P2 |
| AC-9 | Focused tests and schema/runtime validation covering these changes are recorded as canonical evidence. | Met | ev:T-0733:9de550d0a6c64867916f7fb8, ev:T-0733:240f7aaa5fab4571a59e1ef6 | HADARA workflow |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused task-close/path/schema tests | Yes | Passed | `npx vitest run tests/unit/task-close.test.ts tests/unit/paths.test.ts tests/unit/schema-runtime.test.ts tests/unit/schema-fixtures.test.ts` passed 4 files / 78 tests after final guarded-write report identity cleanup. | ev:T-0733:d9d7fa8cafa84e31a1110027 |
| TypeScript no-emit | Yes | Passed | `./node_modules/.bin/tsc -p tsconfig.json --noEmit` passed before final full build; final `npm run check` rebuilt source. | ev:T-0733:dd339eadc345431e831d52c9 |
| Public unit suite and HADARA-dev suite | Yes | Passed | `npm run check` passed build, tools typecheck, 136 public test files / 1088 tests, and 16 HADARA-dev files / 134 tests. | ev:T-0733:6b46a4abf4c14c9baa88f963 |
| Built command registry surface | Yes | Passed | Built CLI registry exposes `task-status-sync` and no legacy task-status bookkeeping write boundary. | ev:T-0733:738e502c25ba4c33a4ef4e30 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer P1/P2 gap list | constraint | active | Defines required correctness and contract outcomes. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Task close command semantics, proof-last workflow, evidence rules. |
| `docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md` | reference | active | Close transaction write/proof/recovery contract and AC-4 terminology requirement. |
| `docs/SECURITY_MODEL.md` | constraint | active | Project-root write confinement and symlink boundary requirements. |
| `docs/ARCHITECTURE.md` | constraint | active | Task close/current-state projection boundaries. |
| `docs/CLI_JSON_CONTRACT.md` | constraint | active | Public close v3 JSON contract behavior. |
| `src/task/close/execute.ts`, `src/task/close/proof.ts`, `src/task/close/plan.ts`, `src/task/close/bookkeeping.ts` | implementation-source | active | Current close transaction, proof append, plan execution, and write synchronization implementation. |
| `src/core/paths.ts` | implementation-source | active | Shared project-boundary path confinement helper. |
| `tests/unit/task-close.test.ts`, `tests/unit/paths.test.ts`, `tests/unit/schema-runtime.test.ts`, `tests/unit/schema-fixtures.test.ts` | implementation-source | active | Existing focused regression coverage. |

## Changes

| Area | Summary |
|---|---|
| Proof append | `executeTaskCloseEvidence()` now revalidates actual close source hash and persisted task-local expected-write state immediately before close proof append; source drift or non-`after` writes fail closed with explicit close-plan issues. |
| Operation marker | Persisted marker validation and fast reuse now enforce `writeSetHash === hashObject(expectedWrites)`, preserve `closeBasisHash`, retain `closeSourceHash` only as a deprecated compatibility alias, and keep `finalSourceHash` for proof-stage state. |
| Recovery | Proof-pending resume is handled before generic reuse, recovery reports avoid fabricated completed/pending classifications when unavailable, and marker-backed classifications remain explicit. |
| Path confinement | `isInside()` now resolves the nearest existing ancestor for missing child paths, blocking symlink-ancestor escapes for new close targets. |
| Public contract | Close-plan public step/schema/spec wording uses `sync` and guarded write-set terminology instead of a legacy bookkeeping step/report/domain; command registry write boundary now reports `task-status-sync`. |
| Current-state projection | Current-state continuation projection strips inline-code fences from paths and the compatibility checkpoint no longer carries stale T-0728/T-0731 continuation data. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Some internal helper/module names still include `CloseBookkeeping` for compatibility and risk containment, but they are no longer barrel-exported and public close v3 steps/source reports use close-plan guarded write-set terminology. | Closed | Reviewer P2 |
| RF-2 | Risk | The reviewer-requested abrupt-kill behavior is covered by internal deterministic fault-hook regressions rather than a real installed-package kill harness in this capsule. | Accepted | ev:T-0733:9de550d0a6c64867916f7fb8 |

## Close Summary

T-0733 closes the remaining reviewer P1/P2 task-close correctness gaps: proof append now performs actual-state revalidation, marker hash consistency is mandatory, missing-target symlink confinement is hardened, proof-pending recovery stays phase-accurate, recovery detail no longer fabricates conflicting classifications, close-basis/final-source hashes are separated, stale current-state projection is cleaned up, and public close-plan terminology no longer exposes the legacy bookkeeping step/domain.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-29 | Draft | Initial task scaffold. |
| 2026-07-29 | In Progress | Accepted reviewer P1/P2 remaining close transaction gap list and authored task contract. |
| 2026-07-29 | Done | Implemented close proof/marker/path/recovery/public-contract hardening and validated with focused and full checks. |
