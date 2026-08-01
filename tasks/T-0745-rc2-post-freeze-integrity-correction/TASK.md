# T-0745 RC2 Post-Freeze Integrity Correction

## Identity

| Field | Value |
|---|---|
| ID | T-0745 |
| Title | RC2 Post-Freeze Integrity Correction |
| Status | Done |
| Created | 2026-08-01T22:25 |
| Updated | 2026-08-01T23:02 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Repair RC2 post-freeze lifecycle integrity without adding public capability. | Done-task continuation is consumed, installed acceptance reaches closed-valid and idempotent retry, release wording matches the frozen state, and close module ownership is acyclic. |

## Scope

| Boundary | Items |
|---|---|
| In | Consume self-close and already-Done target continuations in task selection; add regression coverage for stale latest-Done HANDOFF routing. |
| In | Expand installed tarball acceptance through validation/evidence, reviewed close execute, audit-close, idempotent retry, and fresh-session task status. |
| In | Align RC2 release-readiness wording, extract close transaction model types from `execute.ts`, and add close-source documentation quality diagnostics. |
| Out | New public schemas, providers, MCP writes, publication, remote CI execution, broad status redesign, and unrelated close behavior changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reproduce stale T-0744 continuation selection and define consumed/terminal rules for self-close and already-Done target close guidance. | Done |
| 2 | Implement selection guard, close model ownership, close-source quality diagnostics, and RC2 readiness wording correction. | Done |
| 3 | Run focused/full/package/clean-checkout/installed lifecycle validation, re-freeze RC2, and close with proof-last evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A latest Done task HANDOFF that requests its own close/finalize, or requests close/review for a task already marked Done, is consumed and cannot become a new task-selection recommendation. | Done | ev:T-0745:7d9e9c79f31c45db838f065d | `src/task/task-selection.ts`; `src/task/handoff-continuation.ts` |
| AC-2 | Installed RC2 acceptance executes init plan/apply, task creation/status, substantive validation/evidence, acceptance completion, reviewed close execute, audit-close `closed-valid`, idempotent close retry, and fresh-session task status without stale close recommendation. | Done | ev:T-0745:dce8dff5a29b4903b95a4618 | Installed RC2 lifecycle validation; `docs/TASK_WORKFLOW_COMMANDS.md` |
| AC-3 | RC2 release-readiness wording states the source is locally frozen after T-0744/T-0745 gates while publication/remote CI remain operator-controlled and separate. | Done | ev:T-0745:877465afaf7449929b1fd750; ev:T-0745:f9b87782a8c847f9bd76547f | `docs/RELEASE_READINESS.md`; `docs/RC2_CONTRACT_FREEZE.md` |
| AC-4 | Close transaction model types are owned by a dependency-neutral `close/model.ts`; lower modules no longer import types from `execute.ts`. | Done | ev:T-0745:18c8451c3eac4a9fab68750f; ev:T-0745:f905cecfd107461da2ad607c | `src/task/close/model.ts`; close module tests/build |
| AC-5 | Close-source diagnostics report empty/misplaced close summary, duplicate validation rows, and stale Done HANDOFF close guidance without mutating closed capsules; existing valid capsules remain close-compatible. | Done | ev:T-0745:fd9e384ea52641eaa75d1cd9 | Close readiness/diagnostic tests |
| AC-6 | Full source/built/package/clean-checkout/installed validation passes, RC2 is re-frozen, and no publish/provider/schema/public command mutation occurs. | Done | ev:T-0745:f3c6bc253834417ca770650d; ev:T-0745:35fc64876ccc4fdc9ea6b4ce; ev:T-0745:bd787c74aee94195958716d9; ev:T-0745:a9fb3f02086040adac0f36df; ev:T-0745:dce8dff5a29b4903b95a4618; ev:T-0745:877465afaf7449929b1fd750; ev:T-0745:f9b87782a8c847f9bd76547f | Full check, release artifact/gate/dry-run, package/clean-checkout/installed evidence |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Task-selection continuation regression | Yes | Passed | Stale self-close and already-Done target close/review guidance is consumed. | ev:T-0745:7d9e9c79f31c45db838f065d |
| Close model dependency audit | Yes | Passed | Source typecheck and lower-module import audit passed; lower modules do not import `execute.ts`. | ev:T-0745:18c8451c3eac4a9fab68750f |
| Close-source quality diagnostics | Yes | Passed | Empty/misplaced Close Summary, duplicate Validation rows, and stale Done HANDOFF guidance are diagnosed. | ev:T-0745:fd9e384ea52641eaa75d1cd9 |
| Installed RC2 full lifecycle | Yes | Passed | exit 0 in 3121ms | ev:T-0745:dce8dff5a29b4903b95a4618 |
| Full source/package/release validation | Yes | Passed | npm check, release artifact, package smoke, clean-checkout smoke, strict gate, and release dry-run passed without publish mutation. | ev:T-0745:f3c6bc253834417ca770650d; ev:T-0745:35fc64876ccc4fdc9ea6b4ce; ev:T-0745:bd787c74aee94195958716d9; ev:T-0745:a9fb3f02086040adac0f36df; ev:T-0745:877465afaf7449929b1fd750; ev:T-0745:f9b87782a8c847f9bd76547f |
| Focused selection and close-source tests | Yes | Passed | exit 0 in 2544ms | ev:T-0745:7d9e9c79f31c45db838f065d |
| Source typecheck and close import audit | Yes | Passed | exit 0 in 38ms | ev:T-0745:18c8451c3eac4a9fab68750f |
| Full npm check and built RC2 version | Yes | Passed | Host npm run check passed: build, tools typecheck, public 129 files/1045 tests, HADARA-dev 16 files/135 tests. | ev:T-0745:f3c6bc253834417ca770650d |
| Close-source quality and lifecycle guidance | Yes | Passed | exit 0 in 2151ms | ev:T-0745:fd9e384ea52641eaa75d1cd9 |
| Strict RC2 release gate | Yes | Passed | exit 0 in 2113ms | ev:T-0745:877465afaf7449929b1fd750 |
| RC2 release dry-run | Yes | Passed | exit 0 in 896ms | ev:T-0745:f9b87782a8c847f9bd76547f |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RC2_CONTRACT_FREEZE.md` | constraint | active | RC2 is locally frozen after T-0745 repaired gates; publication and remote CI are separate. |
| `docs/RELEASE_READINESS.md` | reference | active | Current source/readiness wording and package gate contract. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Validation/evidence/reviewed close/audit lifecycle. |
| `tasks/T-0744-freeze-rc2-contract-and-complete-init-v1-release-acceptance/HANDOFF.md` | background | archived | Reproduce and consume stale post-close continuation; do not edit closed T-0744 source docs. |

## Changes

| Area | Summary |
|---|---|
| Task selection | Done | Consume post-close self/Done-target close guidance and add regression coverage. |
| Close architecture | Done | Move shared transaction model types into `src/task/close/model.ts` and retarget imports. |
| Release readiness | Done | Replace conditional RC2 source-candidate wording with locally frozen status. |
| Capsule diagnostics | Done | Add non-mutating warnings for empty/misplaced Close Summary, duplicate validation rows, and stale Done HANDOFF guidance. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Installed acceptance may expose environment-only package or close behavior differences. | Closed | ev:T-0745:dce8dff5a29b4903b95a4618 |
| RF-2 | Follow-up | Close-source diagnostics may classify legacy completed capsules with warnings. | Closed | Diagnostics are warning-only and current valid capsules remain close-compatible; ev:T-0745:fd9e384ea52641eaa75d1cd9 |

## Close Summary

T-0745 repaired stale Done-task continuation routing, moved close transaction model types out of `execute.ts`, added non-mutating close-source diagnostics, and aligned the RC2 readiness contract. Focused/full checks, release artifact, package and clean-checkout smokes, installed full lifecycle, strict gate, and release dry-run all passed. RC2 is locally Frozen; publication, remote CI, and external release mutation remain operator-controlled and were not executed. Close is ready for reviewed proof-last execution.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-01 | Draft | Initial task scaffold. |
| 2026-08-01 | In Progress | Reproduced T-0744 stale continuation recommendation and began the post-freeze integrity correction capsule. |
| 2026-08-01 | Done | Completed T-0745 correction, re-froze RC2 locally, and recorded all required validation and release evidence. |
