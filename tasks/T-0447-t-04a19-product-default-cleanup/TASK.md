# T-0447 T-04A19 Product Default Cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0447 |
| Title | T-04A19 Product Default Cleanup |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md | implementation-source | normative | approved | sha256:41106f8178c44bdd21f79b94c61e86ac3849ca0d4cd543539c7026ef3cbbc4f6 | Defines product default rule and init scaffold behavior. |
| docs/specs/0.4.0/productization-redesign/00_Decision_and_Productization_Principles.md | implementation-source | normative | approved | sha256:347eab6b78acec8d0465bb1f88f36594514bbcdb2cac01b9e5c7a61c5b31e311 | Defines product generalization boundary. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | implementation-source | normative | approved | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Assigns T-04A19 to product default cleanup and static leakage tests. |

## Goal

| Goal | Notes |
|---|---|
| Keep fresh 0.4 generated docs generic and guarded against HADARA-dev-specific defaults. | Add static tests over generated docs and extend doctor leakage detection for concrete release/package commands without banning generic safety wording. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract. | Done | TASK.md |
| 2 | Implement the smallest useful slice. | Done | `ev:T-0447:b19bfcb789b64223bb4f4f45` |
| 3 | Validate and record evidence. | Done | `ev:T-0447:b19bfcb789b64223bb4f4f45` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Fresh basic, standard, and governed generated docs reject HADARA-dev, Node/npm, Docker, machine-local path, package-version, and concrete release/package command leakage. | Yes | Met | `ev:T-0447:b19bfcb789b64223bb4f4f45` | Required | docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md |
| AC-2 | `init doctor --json` reports `INIT_PRODUCT_DEFAULT_LEAK` for concrete release/package command leakage in generated scaffold docs. | Yes | Met | `ev:T-0447:b19bfcb789b64223bb4f4f45` | Required | docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md |
| AC-3 | Fresh governed scaffold remains doctor-clean. | Yes | Met | `ev:T-0447:b19bfcb789b64223bb4f4f45` | Required | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |
| AC-4 | Validation evidence is recorded. | Yes | Met | `ev:T-0447:b19bfcb789b64223bb4f4f45` | Required | HADARA workflow |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Build | `npm run build` in Docker temp copy | Yes | Passed | `ev:T-0447:b19bfcb789b64223bb4f4f45` |
| Focused tests | `npm run test:focused -- tests/unit/init.test.ts tests/unit/docs-registry.test.ts tests/unit/command-registry.test.ts` in Docker temp copy | Yes | Passed | `ev:T-0447:b19bfcb789b64223bb4f4f45` |
| Built CLI smokes | Fresh governed init doctor and product-default leakage diagnostics after `dist` refresh | Yes | Passed | `ev:T-0447:b19bfcb789b64223bb4f4f45` |
| Diff hygiene | `git diff --check` | Yes | Passed | `ev:T-0447:b19bfcb789b64223bb4f4f45` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/cli/init.ts | L442-L452 | Extended product-default leakage detection to flag concrete release/package command guidance in generated scaffold docs. | Prevent HADARA product defaults from carrying HADARA-dev release/package workflow commands. | `ev:T-0447:b19bfcb789b64223bb4f4f45` |
| tests/unit/init.test.ts | L212-L220, L332-L390 | Added generated-doc leakage regression coverage across init profiles plus doctor coverage for concrete release command leakage. | Lock fresh scaffold defaults to generic project guidance while preserving doctor diagnostics. | `ev:T-0447:b19bfcb789b64223bb4f4f45` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Generic release/package safety wording is allowed; concrete project-specific release/package commands remain disallowed in generated defaults. | Open | docs/specs/0.4.0/productization-redesign/00_Decision_and_Productization_Principles.md |
