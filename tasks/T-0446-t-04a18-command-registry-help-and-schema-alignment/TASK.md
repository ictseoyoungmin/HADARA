# T-0446 T-04A18 Command Registry, Help, and Schema Alignment

## Identity

| Field | Value |
|---|---|
| ID | T-0446 |
| Title | T-04A18 Command Registry, Help, and Schema Alignment |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/12_CLI_JSON_Contracts_and_Diagnostics.md | implementation-source | normative | approved | sha256:b808404e76c86bab9370dd2d6c6b76c4324a7e07e5c62c5962f6d4dbfa1659a8 | Defines current baseline commands, proposed 0.4 commands, and schema/report alignment expectations. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | implementation-source | normative | approved | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Assigns T-04A18 to command registry, help, and schema alignment. |
| docs/specs/0.4.0/productization-redesign/15_Current_CLI_Surface_Audit.md | implementation-source | normative | approved | sha256:77740ddada2e437b93dac1a384243ec45f1942a5dc4d65bf12d24bc781969f3e | Distinguishes current baseline, proposed 0.4, and removed CLI surfaces. |

## Goal

| Goal | Notes |
|---|---|
| Align command registry, help text, schema docs, and tests with current 0.4 CLI surfaces and planned proposed surfaces. | Keep this to metadata/help/test alignment; do not implement new docs mutation commands in this capsule. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract. | Done | TASK.md |
| 2 | Implement the smallest useful slice. | Done | ev:T-0446:1fc3397609c84c049282d0e2 |
| 3 | Validate and record evidence. | Done | ev:T-0446:1fc3397609c84c049282d0e2 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Command registry covers implemented 0.4/current surfaces including `task.close-source`, `evidence.summary`, `evidence.project`, and `state.verify`. | Yes | Met | ev:T-0446:1fc3397609c84c049282d0e2 | Required | docs/specs/0.4.0/productization-redesign/12_CLI_JSON_Contracts_and_Diagnostics.md |
| AC-2 | Proposed but unimplemented 0.4 docs commands are visible as planned/disabled, not current executable surfaces. | Yes | Met | ev:T-0446:1fc3397609c84c049282d0e2 | Required | docs/specs/0.4.0/productization-redesign/15_Current_CLI_Surface_Audit.md |
| AC-3 | Registry-backed help and docs use 0.4 lifecycle wording and expose status/schema metadata consistently. | Yes | Met | ev:T-0446:1fc3397609c84c049282d0e2 | Required | docs/specs/0.4.0/productization-redesign/12_CLI_JSON_Contracts_and_Diagnostics.md |
| AC-4 | Focused command registry/help/schema tests pass. | Yes | Met | ev:T-0446:1fc3397609c84c049282d0e2 | Required | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |
| AC-5 | Validation evidence is recorded. | Yes | Met | ev:T-0446:1fc3397609c84c049282d0e2 | Required | HADARA workflow |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Build | `npm run build` in Docker temp copy | Yes | Passed | ev:T-0446:1fc3397609c84c049282d0e2 |
| Focused tests | `npm run test:focused -- tests/unit/command-registry.test.ts tests/unit/help.test.ts tests/unit/schema-fixtures.test.ts tests/unit/schema-runtime.test.ts` in Docker temp copy | Yes | Passed | ev:T-0446:1fc3397609c84c049282d0e2 |
| Built CLI smokes | `commands --family docs-governance --json`, `help lifecycle`, and `help command docs.complete-spec` after `dist` refresh | Yes | Passed | ev:T-0446:1fc3397609c84c049282d0e2 |
| Diff hygiene | `git diff --check` | Yes | Passed | ev:T-0446:1fc3397609c84c049282d0e2 |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/services/capability-registry.ts | L1354-L1397 | Added planned/disabled registry metadata for proposed `docs.complete-spec` and `docs.mark-drift`. | Make proposed but unimplemented 0.4 docs surfaces visible without presenting them as executable current commands. | ev:T-0446:1fc3397609c84c049282d0e2 |
| src/cli/help.ts | L88-L127 | Updated lifecycle help to 0.4 wording and added command status output. | Align registry-backed help with 0.4 and make planned/current status inspectable. | ev:T-0446:1fc3397609c84c049282d0e2 |
| tests/unit/command-registry.test.ts | L20-L168 | Expanded required command coverage and added current/planned 0.4 surface assertions. | Catch registry drift for implemented and proposed 0.4 surfaces. | ev:T-0446:1fc3397609c84c049282d0e2 |
| tests/unit/help.test.ts | L24-L76 | Updated 0.4 lifecycle assertion and planned command help coverage. | Prove help output exposes status and planned-command caveat. | ev:T-0446:1fc3397609c84c049282d0e2 |
| docs/COMMAND_SURFACE.md | L68-L90 | Aligned primary lifecycle wording and documented planned 0.4 surfaces. | Keep command surface docs honest about current vs planned commands. | ev:T-0446:1fc3397609c84c049282d0e2 |
| docs/SCHEMAS.md | L19-L19 | Clarified planned docs commands intentionally have no schema fixture yet. | Prevent schema registry confusion for unimplemented proposed commands. | ev:T-0446:1fc3397609c84c049282d0e2 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | `docs complete-spec` and `docs mark-drift` remain planned/disabled metadata until a future capsule implements their registry mutation semantics. | Open | docs/specs/0.4.0/productization-redesign/15_Current_CLI_Surface_Audit.md |
