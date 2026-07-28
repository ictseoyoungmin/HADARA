# T-0721 Harden Close Journal And Measurement Continuations

## Identity

| Field | Value |
|---|---|
| ID | T-0721 |
| Title | Harden Close Journal And Measurement Continuations |
| Status | Done |
| Created | 2026-07-28T16:06 |
| Updated | 2026-07-28T17:36 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Refactor `task close` internals around the reviewer-recommended close structure and remove legacy finish/finalize/ready tests and schema/content. | Keep `task close` as the single public lifecycle close surface. |

## Scope

| Boundary | Items |
|---|---|
| In | `src/task/close/` structure, close facade imports, close v3 transaction schema, removal of legacy finish/finalize/ready source adapters/tests/schemas, and focused/full unit validation. |
| Out | New public lifecycle commands, release promotion, historical Task Capsule rewrites, or broad provider/runtime work. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Update task contract and identify the requested task-close refactor target. | Done |
| 2 | Move task-close internals into the reviewer-recommended `src/task/close/` structure with an `index.ts` facade. | Done |
| 3 | Remove legacy finish/finalize/ready adapter files, schemas, and tests, including `docs/TEST_STRATEGY.md` dependent tests. | Done |
| 4 | Validate with typecheck, build, focused close tests, and full unit tests; record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task close` internals follow the requested `src/task/close/{index,types,plan,execute,journal,bookkeeping,proof,audit,source}.ts` structure. | Met | ev:T-0721:cbf2edab71f84e3eb1c5eecc | Reviewer recommended final structure. |
| AC-2 | Legacy finish/finalize/ready source files, schemas, and dedicated tests are removed from the current source/test surface. | Met | ev:T-0721:9c7439c220534cc8b3d9bd57 | User request. |
| AC-3 | Current close transaction schema is v3 and exposes close-plan source metadata through the new close contract. | Met | ev:T-0721:9c7439c220534cc8b3d9bd57 | Reviewer schema migration note. |
| AC-4 | Validation passes for the refactor scope. | Met | ev:T-0721:c7cbe72605c847c4a2a0ec33; ev:T-0721:cbf2edab71f84e3eb1c5eecc; ev:T-0721:de81c37132e94994b3b16322; ev:T-0721:dc0098e82de7428ea9f00fc1 | Typecheck, build, full unit, focused close suite after final bookkeeping idempotency fix. |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Source typecheck | Yes | Passed | `npm run typecheck:src` passed. | ev:T-0721:c7cbe72605c847c4a2a0ec33 |
| Source build | Yes | Passed | `npm run build` passed. | ev:T-0721:cbf2edab71f84e3eb1c5eecc |
| Full unit tests | Yes | Passed | `npm test` passed: 136 files / 1067 tests, 1 file / 8 tests skipped. | ev:T-0721:de81c37132e94994b3b16322 |
| Focused close suite | Yes | Passed | 4 files / 78 tests passed after bookkeeping idempotency fix. | ev:T-0721:dc0098e82de7428ea9f00fc1 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| docs/TASK_WORKFLOW_COMMANDS.md | reference | active | `task close` remains the only public close surface. |
| src/task/close/index.ts | implementation | active | Public close facade. |
| src/task/close/plan.ts | implementation | active | Reviewed close plan orchestration. |
| src/task/close/execute.ts | implementation | active | Close transaction execution and journaling state. |
| src/task/close/bookkeeping.ts | implementation | active | Bounded close bookkeeping writes. |
| src/task/close/proof.ts | implementation | active | Close proof, audit, and source implementation reused behind facades. |
| /home/ymin/.codex/attachments/0ed1ecff-0b33-4e95-a49c-23e07945033a/pasted-text.txt | reference | active | Requested final close structure and legacy surface removal. |

## Changes

| Area | Summary |
|---|---|
| Close structure | Added `src/task/close/` with `index.ts`, `types.ts`, `plan.ts`, `execute.ts`, `journal.ts`, `bookkeeping.ts`, `proof.ts`, `audit.ts`, and `source.ts`. |
| Legacy removal | Deleted the old lifecycle step adapter source files, schemas, and dedicated tests; removed `docs/TEST_STRATEGY.md` and its current source/test references. |
| Contract | Migrated public close transaction detail schema to `hadara.task.close.v3` with `source.closePlan`. |
| Bookkeeping | Made terminal task handoff continuations idempotent so close bookkeeping does not keep re-planning `.hadara/state/current.json` after completion. |
| Imports/docs | Routed current CLI/service imports through `src/task/close` and updated current workflow/contract guidance. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `proof.ts` still owns proof, audit, and source implementation while `audit.ts` and `source.ts` expose the requested module boundaries as facades; split internals further only when those files change materially. | Open | Ponytail/YAGNI scope control. |

## Close Summary

Task close internals now live under `src/task/close/` with the requested facade and boundary files. The current public close detail schema is `hadara.task.close.v3`, legacy finish/finalize/ready files/schemas/tests are removed, `docs/TEST_STRATEGY.md` current references are gone, close bookkeeping is idempotent for terminal task handoff continuations, and validation passed with source typecheck, build, full unit, and focused close tests.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | In Progress | Scoped remaining reviewer findings into close journal persistence, continuation backlog, and Docker validation. |
| 2026-07-28 | In Progress | Refactored task close into the requested `src/task/close/` structure and removed legacy finish/finalize/ready tests and schemas. |
| 2026-07-28 | In Progress | Removed current `docs/TEST_STRATEGY.md` source/test references and reran final typecheck, build, focused, and full unit validation. |
| 2026-07-28 | Done | Acceptance is met and final validation evidence is recorded. |
| 2026-07-28 | Done | Fixed repeated terminal close bookkeeping by not re-promoting the completed task's terminal handoff continuation. |
