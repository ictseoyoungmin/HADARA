# T-0723 Enforce Close Proof Last

## Identity

| Field | Value |
|---|---|
| ID | T-0723 |
| Title | Enforce Close Proof Last |
| Status | Done |
| Created | 2026-07-28T18:39 |
| Updated | 2026-07-28T18:46 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Enforce physical proof-last task close ordering. | Align `task close` execution with the rc2 transaction spec: lifecycle-owned writes must complete and the actual final state must be rechecked before close proof evidence is appended. |

## Scope

| Boundary | Items |
|---|---|
| In | `task close` required-bookkeeping execution order, operation journal/write summary semantics, focused regression tests. |
| Out | Broad close engine rewrite, command-surface changes, release promotion, unrelated measurement-script EPERM work. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Move close proof append after lifecycle bookkeeping for required-bookkeeping closes. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Required-bookkeeping `task close` executes lifecycle writes before close proof append. | Met | ev:T-0723:f4f9e6187cd04a8ead32f7e7 | rc2 spec AC-9, AC-10 |
| AC-2 | A failure after bookkeeping but before proof leaves no valid close proof. | Met | ev:T-0723:f4f9e6187cd04a8ead32f7e7 | rc2 spec AC-10 |
| AC-3 | Existing idempotent retry and close transaction schema tests remain valid. | Met | ev:T-0723:f4f9e6187cd04a8ead32f7e7 | `tests/unit/task-close.test.ts` |
| AC-4 | Validation evidence is recorded. | Met | ev:T-0723:53025d43248648a08cb0b808 | HADARA protocol |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused task close tests | Yes | Passed | exit 0 in 6697ms | ev:T-0723:f4f9e6187cd04a8ead32f7e7 |
| TypeScript build | Yes | Passed | npm run build passed directly after proof-last changes | ev:T-0723:55b82b8c861849afac6bd477 |
| Full check | Yes | Passed | npm run check passed after allowing current rc2 specs: public 136 files/1067 tests, HADARA-dev 16 files/134 tests | ev:T-0723:53025d43248648a08cb0b808 |
| Diff hygiene | Yes | Passed | git diff --check passed | ev:T-0723:06d0d75452a244599979ee0a |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| AGENTS.md | constraint | active | HADARA protocol and commit convention. |
| docs/TASK_WORKFLOW_COMMANDS.md | constraint | active | Task close command semantics and close-source write timing. |
| docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md | constraint | active | Normative proof-last transaction contract. |
| src/task/close/plan.ts | implementation-source | active | Current close execution order. |
| tests/unit/task-close.test.ts | implementation-source | active | Existing transaction and recovery coverage. |

## Changes

| Area | Summary |
|---|---|
| Close execution | Removed the virtual close-proof append from the required-bookkeeping path; after bookkeeping, close plan state is refreshed and close proof is appended only through the normal post-bookkeeping close step. |
| Tests | Updated transaction recovery expectations so post-bookkeeping source mutation blocks proof append, recovery appends one proof after repair, and post-proof recovery is explicitly after bookkeeping succeeded. |
| Archive boundary | Allowed the current `docs/specs/0.5.0-rc2` spec directory in the archive-boundary test. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Broader rc2 requirements such as durable marker fsync counts and full installed fault dogfood may need separate capsules if not already covered. | Open | docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md |

## Close Summary

T-0723 enforced the rc2 physical proof-last ordering for required-bookkeeping closes. `task close` no longer appends close proof against a virtual post-bookkeeping snapshot before writing lifecycle-owned status; it now applies bookkeeping, refreshes actual close state, then appends proof only if the real final source still passes. Focused close tests, TypeScript build, and full check passed.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | In Progress | Scoped proof-last enforcement against the rc2 close transaction spec. |
| 2026-07-28 | Done | Implemented proof-last ordering and completed validation. |
