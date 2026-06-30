# T-0433 T-04A7 TASK.md Table Schema and Controlled Values

## Identity

| Field | Value |
|---|---|
| ID | T-0433 |
| Title | T-04A7 TASK.md Table Schema and Controlled Values |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/05_TASK_MD_Table_Schema_and_Controlled_Values.md | implementation-source | approved | implementing | sha256:6267cb01ed5f0fb9c08c7bfac78fdb2972e9dd91c7e57b5b20b8aebbf3572c4b | Defines TASK.md table schema, controlled values, and diagnostics. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | implementation-source | approved | implementing | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Places T-04A7 in the 0.4 implementation sequence. |

## Goal

| Goal | Notes |
|---|---|
| Make generated 0.4 TASK.md tables use the accepted schema and make harness validation reject invalid controlled values. | Keep the implementation in the existing create and harness paths. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Update default and template TASK.md tables to the 0.4 schema. | Done | Focused tests passed. |
| 2 | Add draft-level harness validation for TASK.md table headers and controlled tokens. | Done | Focused tests passed. |
| 3 | Update tests and fixtures to cover 0.4 controlled values. | Done | Focused tests passed. |
| 4 | Run Docker build/focused validation, refresh dist, and record evidence. | Done | ev:T-0433:80ed05687f3945c2acdde03e |
| 5 | Prepare final capsule docs and shared-state handoff for close. | Done | ev:T-0433:80ed05687f3945c2acdde03e |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Fresh task-create TASK.md output uses Source Documents, Acceptance, Validation, Change Summary, and Risks / Follow-ups table headers from spec 05. | Yes | Met | Focused tests passed. | Required | tests/unit/task-capsule.test.ts |
| AC-2 | Harness draft validation rejects invalid TaskStatus, plan status, acceptance required/status/disposition, validation required/result, and risk kind/state tokens. | Yes | Met | Focused tests passed. | Required | tests/harness/harness-validate.test.ts |
| AC-3 | Done-level harness fixtures remain compatible with the 0.4 four-file default capsule while preserving legacy sidecar compatibility where tests explicitly create sidecars. | Yes | Met | Focused tests passed. | Required | tests/harness/harness-validate.test.ts |
| AC-4 | Docker build and focused validation pass, workspace dist is refreshed, and evidence is recorded. | Yes | Met | ev:T-0433:80ed05687f3945c2acdde03e | Required | ev:T-0433:80ed05687f3945c2acdde03e |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused tests | `npm run test:focused -- tests/unit/task-capsule.test.ts tests/unit/task-create.test.ts tests/harness/harness-validate.test.ts tests/unit/task-ready.test.ts tests/unit/task-close.test.ts tests/unit/task-finalize.test.ts tests/unit/task-lifecycle.test.ts tests/unit/mcp-tools.test.ts` in Docker `/tmp/hadara` | Yes | Passed | ev:T-0433:80ed05687f3945c2acdde03e |
| Build | `npm run build` in Docker `/tmp/hadara` | Yes | Passed | ev:T-0433:80ed05687f3945c2acdde03e |
| Built CLI smoke | `task create "Smoke 0.4 Table Schema"` and `harness validate --task T-0433 --level draft --json` using workspace `dist` | Yes | Passed | ev:T-0433:80ed05687f3945c2acdde03e |
| Harness done validation | `harness validate --task T-0433 --level done --json` | Yes | Passed | ev:T-0433:baf9ea445cd64058a1470cd4 |
| Diff hygiene | `git diff --check` | Yes | Passed | ev:T-0433:baf9ea445cd64058a1470cd4 |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/task/task-capsule.ts | L15-L18 | Updated fresh TASK.md scaffold table headers and default rows to spec 05. | New capsules should start valid under 0.4 table schema. | ev:T-0433:80ed05687f3945c2acdde03e |
| src/task/task-templates.ts | L106-L107 | Updated template TASK.md override output to the same 0.4 table schema. | Template-created capsules must not reintroduce old table headers. | ev:T-0433:80ed05687f3945c2acdde03e |
| src/harness/validate.ts | L54-L285 | Added TASK.md controlled token sets, table schema validation, close-state boundary checks, and line-range validation. | Make Markdown tables deterministic without adding a new parser layer. | ev:T-0433:80ed05687f3945c2acdde03e |
| tests/unit/task-capsule.test.ts | L26-L38 | Added scaffold header assertions for 0.4 TASK.md tables. | Lock fresh task-create output shape. | ev:T-0433:80ed05687f3945c2acdde03e |
| tests/harness/harness-validate.test.ts | L115-L147, L762-L805 | Added invalid controlled-token regression and updated 0.4 done-level fixtures. | Prove harness catches token drift while fixtures use the four-file default capsule. | ev:T-0433:80ed05687f3945c2acdde03e |
| tasks/T-0433-t-04a7-task-md-table-schema-and-controlled-values/TASK.md | whole-file | Authored this capsule in the new table schema. | Dogfood the schema being implemented. | This file. |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | T-04A8 will strengthen source document hash drift checks beyond the current token/format validation. | Deferred | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |
| RF-2 | Risk | Template sidecar files still exist internally for legacy template metadata, but `task create` filters them out of new 0.4 capsules. | Accepted | src/task/task-capsule.ts |
