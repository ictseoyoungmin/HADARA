# T-0445 T-04A17 Init Doctor and Profile Diagnostics

## Identity

| Field | Value |
|---|---|
| ID | T-0445 |
| Title | T-04A17 Init Doctor and Profile Diagnostics |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md | implementation-source | implementation-source | approved | sha256:41106f8178c44bdd21f79b94c61e86ac3849ca0d4cd543539c7026ef3cbbc4f6 | Defines 0.4 scaffold and init doctor codes. |
| docs/specs/0.4.0/productization-redesign/00_Decision_and_Productization_Principles.md | constraint | approved | approved | sha256:347eab6b78acec8d0465bb1f88f36594514bbcdb2cac01b9e5c7a61c5b31e311 | Defines product-generalization boundary. |
| docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md | reference | approved | approved | sha256:79c5b525a1ccfa68d018d90a1a2b42be4b2a148dd8b26a1d4650355e601a17c0 | Defines product-default and duplicate-doc tests. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | implementation-source | implementation-source | approved | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Places T-04A17 in the implementation sequence. |

## Goal

| Goal | Notes |
|---|---|
| Harden 0.4 `init doctor` scaffold/profile diagnostics. | Add bounded diagnostics for duplicated workflow guidance, over-broad default reading, and HADARA-dev-specific generated defaults without introducing new command surfaces. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract. | Done | TASK.md |
| 2 | Implement the smallest useful slice. | Done | ev:T-0445:c894a34281b648be844445e2 |
| 3 | Validate and record evidence. | Done | ev:T-0445:c894a34281b648be844445e2 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `init doctor --json` reports `INIT_AGENTS_COMMAND_COOKBOOK` when `AGENTS.md` duplicates lifecycle/context command recipes. | Yes | Met | ev:T-0445:c894a34281b648be844445e2 | Required | docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md |
| AC-2 | `init doctor --json` reports `INIT_CONTEXT_DUPLICATES_WORKFLOW` when `HADARA_CONTEXT.md` duplicates Required Reading or lifecycle command recipes instead of routing to owners. | Yes | Met | ev:T-0445:c894a34281b648be844445e2 | Required | docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md |
| AC-3 | `init doctor --json` reports `INIT_REQUIRED_READING_TOO_BROAD` when the docs registry default read path includes historical, excluded, superseded, or drift-review documents. | Yes | Met | ev:T-0445:c894a34281b648be844445e2 | Required | docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md |
| AC-4 | `init doctor --json` reports product-default leakage in generated scaffold docs when HADARA-dev-specific Node/npm/Docker/release/repository defaults appear. | Yes | Met | ev:T-0445:c894a34281b648be844445e2 | Required | docs/specs/0.4.0/productization-redesign/00_Decision_and_Productization_Principles.md |
| AC-5 | Fresh basic/standard/governed scaffolds remain doctor-clean. | Yes | Met | ev:T-0445:c894a34281b648be844445e2 | Required | docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md |
| AC-6 | Validation evidence is recorded. | Yes | Met | ev:T-0445:c894a34281b648be844445e2 | Required | HADARA workflow |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Build | `npm run build` in Docker temp copy | Yes | Passed | ev:T-0445:c894a34281b648be844445e2 |
| Focused tests | `npm run test:focused -- tests/unit/init.test.ts tests/unit/docs-registry.test.ts tests/unit/command-registry.test.ts` in Docker temp copy | Yes | Passed | ev:T-0445:c894a34281b648be844445e2 |
| Built CLI smokes | Fresh init doctor, duplicate-doc diagnostics, and product-default leakage diagnostics after `dist` refresh. | Yes | Passed | ev:T-0445:c894a34281b648be844445e2 |
| Diff hygiene | `git diff --check` | Yes | Passed | ev:T-0445:c894a34281b648be844445e2 |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/cli/init.ts | N/A | Added init doctor checks for entry-doc command cookbook duplication, context Required Reading/workflow duplication, over-broad default registry reads, and product-specific generated defaults. | Add 0.4 init doctor diagnostics. | ev:T-0445:c894a34281b648be844445e2 |
| tests/unit/init.test.ts | N/A | Added focused coverage for duplicate entry docs, broad default reads, product-default leakage, and fresh governed doctor cleanliness. | Cover new doctor diagnostics and fresh scaffold cleanliness. | ev:T-0445:c894a34281b648be844445e2 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Keep T-04A17 scoped to diagnostics; broader generated-doc cleanup and static product-default tests remain T-04A19 unless a bug blocks fresh scaffold cleanliness. | Open | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |
