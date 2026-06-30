# T-0432 T-04A6 Task Capsule Create Path

## Identity

| Field | Value |
|---|---|
| ID | T-0432 |
| Title | T-04A6 Task Capsule Create Path |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Purpose | Status |
|---|---|---|
| `docs/specs/0.4.0/productization-redesign/04_Task_Capsule_Schema.md` | Defines the accepted 0.4 Task Capsule file set and section contract. | Read |
| `docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md` | Places T-04A6 in the 24-capsule implementation sequence. | Read |

## Goal

| Goal | Notes |
|---|---|
| Make `hadara task create "title" --json` generate the accepted 0.4 Task Capsule file set and document shape. | New projects get the productized compact capsule by default, without legacy sidecar docs or task layout flags. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read T-04A6 specs and current task create/scaffold implementation. | Done | `docs/specs/0.4.0/productization-redesign/04_Task_Capsule_Schema.md` |
| 2 | Change default `task create` scaffold to the 0.4 four-file Task Capsule. | Done | `src/task/task-capsule.ts` |
| 3 | Update focused tests for generated files, section contracts, and template boundaries. | Done | `ev:T-0432:6e7934c04498493ba76eac8f` |
| 4 | Validate in Docker and refresh built `dist`. | Done | `ev:T-0432:6e7934c04498493ba76eac8f` |
| 5 | Update capsule/shared state docs and finalize. | Done | `ev:T-0432:6e7934c04498493ba76eac8f` |

## Acceptance

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Default `task create` creates only `TASK.md`, `HANDOFF.md`, `EVIDENCE.md`, and `evidence.jsonl`. | Done | `ev:T-0432:6e7934c04498493ba76eac8f` |
| AC-2 | Fresh `TASK.md`, `HANDOFF.md`, and `EVIDENCE.md` match the 0.4 section contract and omit forbidden close/status duplication. | Done | `ev:T-0432:6e7934c04498493ba76eac8f` |
| AC-3 | Focused tests and built CLI smoke cover the new create path. | Done | `ev:T-0432:6e7934c04498493ba76eac8f` |
| AC-4 | Shared state and handoff route next work to T-04A7. | Done | `ev:T-0432:6e7934c04498493ba76eac8f` |

## Validation

| Check | Result | Evidence |
|---|---|---|
| Docker build in `/tmp/hadara` | Passed | `ev:T-0432:6e7934c04498493ba76eac8f` |
| Focused task create/lifecycle/read-model tests | Passed, 12 files / 77 tests | `ev:T-0432:6e7934c04498493ba76eac8f` |
| Built CLI `task create` smoke in `/tmp/hadara-t0432-smoke` | Passed; generated exactly four capsule files | `ev:T-0432:6e7934c04498493ba76eac8f` |

## Change Summary

| Path | Change | Evidence |
|---|---|---|
| `src/task/task-capsule.ts` | Reduced default generated Task Capsule files to `TASK.md`, `HANDOFF.md`, `EVIDENCE.md`, and `evidence.jsonl`; filtered template writes to those files. | `ev:T-0432:6e7934c04498493ba76eac8f` |
| `src/task/task-finish.ts`, `src/harness/validate.ts`, `src/services/task-read-model.ts`, `src/services/state-projection.ts`, `src/services/protocol-consistency.ts` | Added 0.4 Identity-status compatibility and reduced required file/read surfaces while preserving legacy sidecar completion compatibility. | `ev:T-0432:6e7934c04498493ba76eac8f` |
| `src/task/task-templates.ts`, `src/cli/init.ts`, tests | Aligned template TASK.md content, generated reading text, and focused tests with the 0.4 create path. | `ev:T-0432:6e7934c04498493ba76eac8f` |

## Risks / Follow-ups

| Item | Status | Notes |
|---|---|---|
| Legacy sidecar close-source hashing remains broader than the final 0.4 default. | Follow-up | T-04A11/T-04A12 are the accepted close-proof/source-contract slices. |
| `task upgrade-scaffold` still reflects legacy sidecar upgrade behavior. | Follow-up | Legacy boundary/remediation behavior belongs in later 0.4 slices, not this create-path capsule. |
