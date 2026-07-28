# T-0727 Complete Close Transaction Fault Matrix

## Identity

| Field | Value |
|---|---|
| ID | T-0727 |
| Title | Complete Close Transaction Fault Matrix |
| Status | Done |
| Created | 2026-07-28T19:10 |
| Updated | 2026-07-28T19:22 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Complete the remaining rc2 task-close transaction hardening in one capsule. | Add the residual risk token, broaden internal fault hooks, harden guarded write fsync boundaries, expand lock/write/proof-pending tests, and remove stale guidance that capped the rc2 work by capsule count. |

## Scope

| Boundary | Items |
|---|---|
| In | `Residual` risk-state token; task-close fault hook coverage; guarded bookkeeping temp-file fsync and directory fsync; lock timeout variants; before/after guarded-write interruption checks; proof-pending retry check; stale fixed-count capsule guidance cleanup. |
| Out | Public fault-injection CLI flags, distributed recovery daemons, unrelated lifecycle command restoration, and release promotion automation. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the rc2 residual fault-matrix scope and source constraints. | Done |
| 2 | Hotfix controlled vocabulary so `Residual` is a valid risk state. | Done |
| 3 | Extend non-public task-close fault hooks and guarded write durability boundaries. | Done |
| 4 | Add focused tests for residual token, lock variants, guarded-write interruption, and proof-pending recovery. | Done |
| 5 | Remove stale fixed-count capsule guidance and record validation evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task.risk.state` accepts `Residual` in schema lookup and harness validation. | Met | ev:T-0727:f4aa70c758294555b604f2ed | User request |
| AC-2 | Internal close fault hooks cover lock, plan, write, final verification, proof intent, readiness evidence, proof append, and terminal cleanup seams. | Met | ev:T-0727:f4aa70c758294555b604f2ed | rc2 spec section 25 |
| AC-3 | Guarded bookkeeping writes fsync temp files and parent directories around atomic rename. | Met | ev:T-0727:43d9a8cfb2e041f68b3c20b9 | rc2 spec sections 16 and 26 |
| AC-4 | Lock timeout, guarded-write interruption, proof-pending retry, and duplicate-proof recovery paths are tested. | Met | ev:T-0727:f4aa70c758294555b604f2ed | rc2 spec sections 26-29 |
| AC-5 | Current guidance no longer treats a fixed capsule count or prescribed capsule scale as a hard implementation limit. | Met | ev:T-0727:9afaf13d82eb4cea9ccb03ef | User request |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused close/vocabulary tests | Yes | Passed | `npm test -- --run tests/unit/task-close.test.ts tests/harness/harness-validate.test.ts tests/unit/controlled-vocabulary.test.ts tests/unit/schema-command.test.ts` passed 4 files / 90 tests. | ev:T-0727:f4aa70c758294555b604f2ed |
| TypeScript build | Yes | Passed | `npm run build` passed. | ev:T-0727:43d9a8cfb2e041f68b3c20b9 |
| Full check | Yes | Passed | `npm run check` passed: public 136 files / 1075 tests with one skipped file and eight skipped tests; HADARA-dev 16 files / 134 tests with one skipped. | ev:T-0727:052bdd94ac694187aa457e95 |
| Guidance cleanup search | Yes | Passed | No current docs or T-0726/T-0727 guidance uses fixed-count or capsule-size limit wording; historical release-note occurrence is release history. | ev:T-0727:9afaf13d82eb4cea9ccb03ef |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| AGENTS.md | constraint | active | HADARA protocol, close/commit workflow, and required reading. |
| docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md | constraint | active | Normative rc2 close transaction contract. |
| docs/TASK_WORKFLOW_COMMANDS.md | constraint | active | Public close workflow and token ownership rules. |
| src/task/close/execute.ts | implementation-source | active | Public v3 transaction orchestration and operation marker reporting. |
| src/task/close/plan.ts | implementation-source | active | Close plan execution, readiness evidence, and proof append sequencing. |
| src/task/close/bookkeeping.ts | implementation-source | active | Guarded lifecycle file write planning/execution. |
| src/services/controlled-vocabulary.ts | implementation-source | active | Shared token vocabulary for schema and harness validation. |

## Changes

| Area | Summary |
|---|---|
| Vocabulary | Added `Residual` to `task.risk.state` controlled tokens and schema/harness tests. |
| Close transaction | Added the remaining non-public fault hook seams and connected them through the transaction plan and guarded write executor. |
| Guarded writes | Added temp-file and parent-directory fsync around close bookkeeping atomic renames. |
| Tests | Expanded close fault coverage for lock variants, guarded write interruption/fail-closed behavior, proof-pending retry, and token acceptance. |
| Docs | Removed stale fixed-count capsule limit guidance from current handoff/state and converted T-0726 residual guidance into this follow-up context. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Installed-package dogfood for every single synthetic fault hook remains expensive; source-level tests now cover the remaining matrix and installed-package clean/blocked/retry dogfood remains from T-0726. | Residual | docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md |
| RF-2 | Risk | The operation journal still maps current close steps rather than exposing every spec object (`proof-pending`, write descriptors, fsync counters) as separate public schema objects. | Residual | src/task/close/execute.ts |

## Close Summary


## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | In Progress | Implemented residual token hotfix, fault hooks, guarded write fsync, focused fault tests, and stale guidance cleanup. |
| 2026-07-28 | Done | Validation evidence recorded and capsule prepared for guarded task close. |
