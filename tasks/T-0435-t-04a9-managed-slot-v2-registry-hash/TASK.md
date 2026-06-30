# T-0435 T-04A9 Managed Slot v2 Registry Hash

## Identity

| Field | Value |
|---|---|
| ID | T-0435 |
| Title | T-04A9 Managed Slot v2 Registry Hash |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/06_Managed_Slot_v2_and_Schema_Registry.md | constraint | approved | implementing | sha256:129a7afe7f6b4499a073d5aebf2255dc20aa15a39c8f21c95015ed4dbe794395 | Defines managed slot registry metadata and registry hash recording. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | reference | approved | implementing | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Places T-04A9 in the 0.4 implementation sequence. |

## Goal

| Goal | Notes |
|---|---|
| Close records include the managed slot registry identity used to interpret close-source Markdown. | Add default slot/table schema metadata and thread slot registry version/hash through close and audit reports. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract. | Done | Source Documents table. |
| 2 | Add default slot/table registry metadata. | Done | ev:T-0435:31e917471a95404882ef0bdb |
| 3 | Add close/audit slot registry hash reporting. | Done | ev:T-0435:31e917471a95404882ef0bdb |
| 4 | Validate and record evidence. | Done | ev:T-0435:31e917471a95404882ef0bdb |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | New 0.4 scaffold slot registry includes task identity and TASK.md table schema metadata. | Yes | Met | ev:T-0435:31e917471a95404882ef0bdb | Required | docs/specs/0.4.0/productization-redesign/06_Managed_Slot_v2_and_Schema_Registry.md |
| AC-2 | Task close evidence records slot registry version/hash and the close audit report compares the recorded hash to the current registry. | Yes | Met | ev:T-0435:31e917471a95404882ef0bdb | Required | docs/specs/0.4.0/productization-redesign/06_Managed_Slot_v2_and_Schema_Registry.md |
| AC-3 | Focused validation evidence is recorded before finalize. | Yes | Met | ev:T-0435:31e917471a95404882ef0bdb | Required | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Build | `npm run build` in Docker temp copy | Yes | Passed | ev:T-0435:31e917471a95404882ef0bdb |
| Focused tests | `npm run test:focused -- tests/unit/init.test.ts tests/unit/task-close.test.ts tests/unit/task-finalize.test.ts tests/unit/task-lifecycle.test.ts` in Docker temp copy | Yes | Passed | ev:T-0435:31e917471a95404882ef0bdb |
| Built CLI smoke | `dist/cli/main.js task close --task T-0435 --json` after dist refresh | Yes | Passed | ev:T-0435:31e917471a95404882ef0bdb |
| Done validation | `dist/cli/main.js harness validate --task T-0435 --level done --json` | Yes | Passed | ev:T-0435:46de3b6174eb44d9b217ae9f |
| Diff hygiene | `git diff --check` | Yes | Passed | ev:T-0435:46de3b6174eb44d9b217ae9f |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| .hadara/slot-registry.json | L1-L121 | Added project-local managed slot registry seed with task identity and acceptance table metadata. | Let current project close records include a concrete registry hash. | ev:T-0435:31e917471a95404882ef0bdb |
| src/cli/init.ts | L931-L969 | Seed new 0.4 projects with slot registry schema, task identity slot, and acceptance table schema metadata. | Product scaffold should not create an empty registry once close records depend on it. | ev:T-0435:31e917471a95404882ef0bdb |
| src/task/task-close.ts | L122-L185, L463-L483, L610-L871 | Thread slot registry version/hash through close report summaries, close evidence, audit reports, and drift diagnostics. | Close records must preserve the registry semantics used to interpret close-source Markdown. | ev:T-0435:31e917471a95404882ef0bdb |
| src/schemas/task-close.schema.json | L43-L66 | Added slot registry fields to the close JSON schema. | Keep public structured output aligned with implementation. | ev:T-0435:31e917471a95404882ef0bdb |
| src/schemas/close-audit JSON schema | L34-L56 | Added current/recorded slot registry hash fields to the close audit JSON schema. | Keep audit structured output aligned with implementation. | ev:T-0435:31e917471a95404882ef0bdb |
| tests/unit/init.test.ts | L120-L126 | Assert scaffold registry seed includes managed slot and table schema metadata. | Cover product scaffold behavior. | ev:T-0435:31e917471a95404882ef0bdb |
| tests/unit/task-close.test.ts | L12-L20, L63-L70, L322-L382 | Assert close/audit slot registry hash reporting and registry drift warning. | Cover close record registry hash behavior. | ev:T-0435:31e917471a95404882ef0bdb |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Full registry-driven TASK.md validation remains out of this capsule; current validation stays in harness code while registry metadata is introduced for close proof identity. | Open | T-04A12 |
