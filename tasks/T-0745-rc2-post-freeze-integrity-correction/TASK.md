# T-0745 RC2 Post-Freeze Integrity Correction

## Identity

| Field | Value |
|---|---|
| ID | T-0745 |
| Title | RC2 Post-Freeze Integrity Correction |
| Status | In Progress |
| Created | 2026-08-01T22:25 |
| Updated | 2026-08-01T22:30 |

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
| 2 | Implement selection guard, close model ownership, close-source quality diagnostics, and RC2 readiness wording correction. | In Progress |
| 3 | Run focused/full/package/clean-checkout/installed lifecycle validation, re-freeze RC2, and close with proof-last evidence. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A latest Done task HANDOFF that requests its own close/finalize, or requests close/review for a task already marked Done, is consumed and cannot become a new task-selection recommendation. | Pending | Not yet recorded | `src/task/task-selection.ts`; `src/task/handoff-continuation.ts` |
| AC-2 | Installed RC2 acceptance executes init plan/apply, task creation/status, substantive validation/evidence, acceptance completion, reviewed close execute, audit-close `closed-valid`, idempotent close retry, and fresh-session task status without stale close recommendation. | Pending | Not yet recorded | Installed tarball lifecycle validation; `docs/TASK_WORKFLOW_COMMANDS.md` |
| AC-3 | RC2 release-readiness wording states the source is locally frozen after T-0744 gates while publication/remote CI remain operator-controlled and separate. | Pending | Not yet recorded | `docs/RELEASE_READINESS.md`; `docs/RC2_CONTRACT_FREEZE.md` |
| AC-4 | Close transaction model types are owned by a dependency-neutral `close/model.ts`; lower modules no longer import types from `execute.ts`. | Pending | Not yet recorded | `src/task/close/model.ts`; close module tests/build |
| AC-5 | Close-source diagnostics report empty/misplaced close summary and duplicate validation rows without mutating closed capsules; existing valid capsules remain close-compatible. | Pending | Not yet recorded | Close readiness/diagnostic tests |
| AC-6 | Full source/built/package/clean-checkout/installed validation passes, RC2 is re-frozen, and no publish/provider/schema/public command mutation occurs. | Pending | Not yet recorded | Full check, release artifact/gate/dry-run, package and clean-checkout evidence |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Task-selection continuation regression | Yes | Planned | Verify stale self-close and already-Done target close/review guidance is consumed. | Pending |
| Close model dependency audit | Yes | Planned | Build and inspect close module imports; lower modules must not import `execute.ts` types. | Pending |
| Close-source quality diagnostics | Yes | Planned | Exercise empty/misplaced Close Summary and duplicate validation rows through readiness diagnostics. | Pending |
| Installed RC2 full lifecycle | Yes | Planned | Run the installed tarball through validation/evidence, reviewed close, audit-close, retry idempotency, and fresh-session status. | Pending |
| Full source/package/release validation | Yes | Planned | Run `npm run check`, package/consumer smoke, clean-checkout smoke, release artifact, strict gate, and release dry-run. | Pending |
| Focused selection and close-source tests | Yes | Passed | exit 0 in 2544ms | ev:T-0745:7d9e9c79f31c45db838f065d |
| Source typecheck and close import audit | Yes | Passed | exit 0 in 38ms | ev:T-0745:18c8451c3eac4a9fab68750f |
| Full npm check and built RC2 version | Yes | Passed | Host npm run check passed: build, tools typecheck, public 129 files/1045 tests, HADARA-dev 16 files/135 tests. | ev:T-0745:f3c6bc253834417ca770650d |
| Close-source quality and lifecycle guidance | Yes | Passed | exit 0 in 2151ms | ev:T-0745:fd9e384ea52641eaa75d1cd9 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RC2_CONTRACT_FREEZE.md` | constraint | active | RC2 remains frozen after repaired local gates; publication and remote CI are separate. |
| `docs/RELEASE_READINESS.md` | reference | active | Current source/readiness wording and package gate contract. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Validation/evidence/reviewed close/audit lifecycle. |
| `tasks/T-0744-freeze-rc2-contract-and-complete-init-v1-release-acceptance/HANDOFF.md` | background | historical | Reproduce and consume stale post-close continuation; do not edit closed T-0744 source docs. |

## Changes

| Area | Summary |
|---|---|
| Task selection | Pending | Consume post-close self/Done-target close guidance and add regression coverage. |
| Close architecture | Pending | Move shared transaction model types into `src/task/close/model.ts` and retarget imports. |
| Release readiness | Pending | Replace conditional RC2 source-candidate wording with locally frozen status. |
| Capsule diagnostics | Pending | Add non-mutating warnings for empty/misplaced Close Summary and duplicate validation rows. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Installed acceptance may expose environment-only package or close behavior differences. | Open | Record the real result through `validation run`; use host-approved execution for package install if sandbox launch is unavailable. |
| RF-2 | Follow-up | Close-source diagnostics may classify legacy completed capsules with warnings. | Open | Keep diagnostics non-blocking for valid close, and test current T-0743/T-0744 projections before deciding severity. |

## Close Summary

Not started. T-0745 must not re-freeze RC2 or close until the stale continuation, installed closed-valid lifecycle, and full release gates are evidenced.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-01 | Draft | Initial task scaffold. |
| 2026-08-01 | In Progress | Reproduced T-0744 stale continuation recommendation and began the post-freeze integrity correction capsule. |
