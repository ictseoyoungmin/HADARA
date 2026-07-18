# T-0652 0.5.0 task close transaction route

## Identity

| Field | Value |
|---|---|
| ID | T-0652 |
| Title | 0.5.0 task close transaction route |
| Status | Done |
| Created | 2026-07-18T20:05 |
| Updated | 2026-07-18T21:12 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0652 --json`.

## Goal

| Goal | Notes |
|---|---|
| Add the 0.5.0 public `task close` transaction route. | `task close --task T-XXXX --json` should be the primary one-call close path while preserving the existing guarded finalize engine and close proof semantics. |

## Scope

| Boundary | Items |
|---|---|
| In | Public `task close` CLI route, v2 close transaction JSON report, schema registration, command registry/help routing, focused tests for clean close/block/idempotent retry. |
| Out | Full documentation migration away from `task finalize`, removal of `task finalize`, and broader state-first task database work. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task close transaction route contract. | Done |
| 2 | Implement v2 adapter over the guarded finalize engine. | Done |
| 3 | Add CLI/schema/registry/help coverage. | Done |
| 4 | Validate focused close/finalize/help tests and build. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara task close --task T-XXXX --json` is routed as the public primary close command and returns `hadara.task.close.v2`. | Met | `ev:T-0652:beaeb111205a471689c2c4bc` | `docs/specs/0.5/0.5.1/HADARA_0_5_1_Task_Close_Transaction_Development_Plan.md` |
| AC-2 | Clean capsules close in one command without an exposed dry-run/plan-hash ceremony and produce a valid close proof. | Met | `ev:T-0652:87b7e888c7c14107a1cd687b` | Task close plan |
| AC-3 | Blocked capsules return a structured recovery action without lifecycle-owned writes. | Met | `ev:T-0652:87b7e888c7c14107a1cd687b` | Task close plan |
| AC-4 | Idempotent close retry is a no-op/existing result and does not duplicate close proof evidence. | Met | `ev:T-0652:87b7e888c7c14107a1cd687b` | Task close plan |
| AC-5 | Validation evidence is recorded. | Met | `ev:T-0652:87b7e888c7c14107a1cd687b`, `ev:T-0652:338222bd03d44c79a012a18d`, `ev:T-0652:beaeb111205a471689c2c4bc` | HADARA workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- tests/unit/task-close.test.ts tests/unit/task-finalize.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/init.test.ts tests/unit/package-smoke-dry-run.test.ts tests/unit/package-recycle.test.ts tests/unit/workbench-next-actions.test.ts tests/unit/task-finish.test.ts tests/unit/task-ready.test.ts tests/unit/task-workbench.test.ts tests/unit/help.test.ts tests/unit/lifecycle-guide.test.ts tests/unit/command-registry.test.ts tests/unit/primary-workflow-budget.test.ts tests/unit/schema-fixtures.test.ts tests/unit/command-portfolio-audit.test.ts tests/harness/harness-validate.test.ts` | Yes | Passed | `ev:T-0652:87b7e888c7c14107a1cd687b` |
| `npm test -- tests/unit/task-close.test.ts tests/unit/help.test.ts tests/unit/command-registry.test.ts tests/unit/schema-fixtures.test.ts` | Yes | Passed | `ev:T-0652:87b7e888c7c14107a1cd687b` |
| `npm run build` | Yes | Passed | `ev:T-0652:338222bd03d44c79a012a18d` |
| `npm run dev:docker-sync-build` and built CLI `task close --dry-run` smoke | Yes | Passed | `ev:T-0652:beaeb111205a471689c2c4bc` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/0.5.1/HADARA_0_5_1_Task_Close_Transaction_Development_Plan.md` | reference | active | Folded into 0.5.0 stable scope; defines close transaction requirements. |
| `src/task/task-finalize.ts` | implementation target | active | Existing guarded engine for finish/ready/close/audit. |
| `src/task/task-close.ts` | implementation target | active | Existing v1 close proof internals and close-source hashing. |

## Changes

| Area | Summary |
|---|---|
| CLI | Added public `task close` routing over the guarded close transaction and kept `task finalize` as compatibility/debug. |
| Task services | Added `hadara.task.close.v2` adapter over the finalize engine with close state, transaction strategy, write summary, recovery action, and embedded finalize-source metadata. |
| Schemas / registry | Registered `task-close-v2` schema and made `task.close` the primary capsule-lifecycle close command in help/registry surfaces. |
| Docs / init templates | Updated generated and repo workflow docs to close-first guidance while preserving finalize compatibility notes. |
| Package smoke / recycle | Updated installed-package checks to verify the public `task close --dry-run` v2 route. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Compatibility `task finalize` remains for existing automation and debug flows; removal is intentionally out of scope for 0.5.0 stable. | Open | docs/TASK_WORKFLOW_COMMANDS.md |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | In Progress | Scoped public `task close` transaction route over existing finalize engine. |
| 2026-07-18 | Done | Implemented close-first public transaction route, refreshed dist, and validated focused tests/build/smoke. |
