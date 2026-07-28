# T-0728 Deterministic Close Recovery Contract

## Identity

| Field | Value |
|---|---|
| ID | T-0728 |
| Title | Deterministic Close Recovery Contract |
| Status | Done |
| Created | 2026-07-28T19:58 |
| Updated | 2026-07-28T20:09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make task-close operation recovery deterministic enough to satisfy the core rc2 write-set contract. | Promote guarded close writes into persisted operation intent, fail closed on malformed recovery markers, persist proof-pending intent, and report actual target file writes. |

## Scope

| Boundary | Items |
|---|---|
| In | Operation marker fields for `closeSourceHash`, `writeSetHash`, `expectedWrites`, `intendedFinalState`, and proof intent; persisted `planned`/`applying`/`verifying`/`proof-pending` phases; malformed marker fail-closed behavior; actual `executedFileWrites`; focused schema/tests. |
| Out | Broad public command renames, complete `bookkeeping.ts` deletion, installed-package dogfood for every synthetic fault, release promotion, background recovery daemon, and non-close lifecycle refactors. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task close` operation markers persist close source hash, write set hash, expected writes, intended final state, and proof intent without exposing machine-local absolute paths. | Met | ev:T-0728:a9679622095d4e91b4832742 | rc2 spec sections 13-15, 22 |
| AC-2 | Malformed operation markers fail closed with one recovery action and zero lifecycle/evidence writes. | Met | ev:T-0728:a9679622095d4e91b4832742 | rc2 spec sections 11, 20, 22 |
| AC-3 | The transaction reaches durable `proof-pending` before close proof append and resumes/retries without duplicate proof. | Met | ev:T-0728:a9679622095d4e91b4832742 | rc2 spec sections 10-15 |
| AC-4 | `executedFileWrites` counts actual target file writes, not mutating transaction steps. | Met | ev:T-0728:a9679622095d4e91b4832742 | rc2 spec section 21 |
| AC-5 | Validation evidence is recorded. | Met | ev:T-0728:f8980b9bf7c7456eaeee86ab | HADARA workflow |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| TypeScript build | Yes | Passed | npm run build passed with tsc -p tsconfig.json. | ev:T-0728:b7823fbfebdc41b5909dbbeb |
| Focused close/schema tests | Yes | Passed | npm test -- --run tests/unit/schema-command.test.ts tests/unit/task-close.test.ts passed: 2 files / 42 tests. | ev:T-0728:a9679622095d4e91b4832742 |
| Full check | Yes | Passed | npm run check passed: build, tools typecheck, public tests 136 passed / 1 skipped with 1078 tests passed / 8 skipped, HADARA-dev tests 16 passed with 134 passed | ev:T-0728:f8980b9bf7c7456eaeee86ab |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| AGENTS.md | constraint | active | HADARA protocol and task capsule workflow. |
| docs/TASK_WORKFLOW_COMMANDS.md | constraint | active | Public task close transaction semantics and evidence rules. |
| docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md | constraint | active | Normative close transaction write-set, journal, phase, schema, and recovery contract. |
| P1 review attachment | reference | active | Reviewer gap list for T-0727 follow-up. |
| src/task/close/execute.ts | implementation-source | active | Public v3 transaction orchestration and operation marker reporting. |
| src/task/close/plan.ts | implementation-source | active | Close plan execution and proof sequencing. |
| src/task/close/bookkeeping.ts | implementation-source | active | Existing guarded close write planner/executor to reuse. |

## Changes

| Area | Summary |
|---|---|
| Close transaction marker | Added persisted operation intent fields for intended final state, close source hash, write set hash, expected guarded writes, final source hash, and proof intent. |
| Close transaction phases | Added persisted `planned`, `verifying`, and `proof-pending` phases and moved readiness evidence append after durable proof intent. |
| Recovery fail-closed | Malformed or invalid operation markers now block write-capable close with one read-only recovery action and zero lifecycle/evidence writes. |
| Write summary | `executedFileWrites` now counts actual task-local target writes instead of mutating close steps; evidence appends remain separately counted. |
| Schema/tests | Tightened task-close v3 operation schema and added focused tests for write intent, malformed marker recovery, durable proof-pending, and file-write counts. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Complete physical removal/rename of the legacy `bookkeeping` report/domain after deterministic operation intent is in place. | Open | docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md |
| RF-2 | Follow-up | Installed-package abrupt-interruption dogfood remains separate from focused source tests. | Open | P1 review attachment |
| RF-3 | Follow-up | Prefix/non-prefix partial-write reconciliation still needs a dedicated write descriptor reconciliation pass. | Open | docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md |

## Close Summary

T-0728 strengthens the task-close transaction journal without broad lifecycle renames: close operation markers now carry guarded write intent and hashes, malformed recovery markers fail closed, proof-pending is durable before close proof append, and file-write counts reflect actual task-local target writes. Focused close/schema tests, TypeScript build, and full check passed.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | In Progress | Implemented deterministic close marker intent, proof-pending persistence, malformed marker fail-closed handling, and file-write count separation. |
| 2026-07-28 | Done | Validation evidence recorded and capsule prepared for guarded task close. |
