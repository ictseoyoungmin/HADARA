# T-0448 T-04A20 Basic Profile Dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0448 |
| Title | T-04A20 Basic Profile Dogfood |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md | implementation-source | normative | approved | sha256:41106f8178c44bdd21f79b94c61e86ac3849ca0d4cd543539c7026ef3cbbc4f6 | Defines the basic profile scaffold and product default rule. |
| docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md | implementation-source | normative | approved | sha256:79c5b525a1ccfa68d018d90a1a2b42be4b2a148dd8b26a1d4650355e601a17c0 | Defines the disposable 0.4 dogfood flow and acceptance. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | implementation-source | normative | approved | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Assigns T-04A20 to basic profile dogfood. |

## Goal

| Goal | Notes |
|---|---|
| Validate a fresh basic 0.4 project from init through finalized task close. | The disposable basic project reached closed-valid audit with no product code change required. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract. | Done | TASK.md |
| 2 | Execute fresh basic profile dogfood. | Done | `ev:T-0448:9a048c17494b4a9fa625d603` |
| 3 | Validate, record evidence, and close the capsule. | Done | `ev:T-0448:9a048c17494b4a9fa625d603` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | A disposable `hadara init --profile basic` project contains only the 0.4 basic scaffold files and omits default `docs/IMPLEMENTATION_SOP.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, and governed-only docs. | Yes | Met | `ev:T-0448:9a048c17494b4a9fa625d603` | Required | docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md |
| AC-2 | In that disposable basic project, `init doctor`, `task create`, task-local evidence append/projection, `task finalize` dry-run review, guarded finalize execute, and `task audit-close` all complete through `closed-valid`. | Yes | Met | `ev:T-0448:9a048c17494b4a9fa625d603` | Required | docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md |
| AC-3 | Basic profile dogfood finds no HADARA-dev-specific generated defaults, duplicate workflow/Required Reading ownership, close proof in `TASK.md`/`HANDOFF.md`, `Scope`/`Out of Scope`, task-local `Decision` kind, or same-capsule lifecycle chores in `HANDOFF.md`. | Yes | Met | `ev:T-0448:9a048c17494b4a9fa625d603` | Required | docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md |
| AC-4 | Validation evidence is recorded in this capsule. | Yes | Met | `ev:T-0448:9a048c17494b4a9fa625d603` | Required | HADARA workflow |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Built CLI dogfood | Fresh `/tmp` basic project init through finalized task and audit close | Yes | Passed | `ev:T-0448:9a048c17494b4a9fa625d603` |
| Basic scaffold assertions | File presence/absence and generated-doc ownership/product-default checks in the disposable project | Yes | Passed | `ev:T-0448:9a048c17494b4a9fa625d603` |
| Capsule checks | `harness validate --task T-0448 --level done`, `evidence lint --task T-0448`, and `git diff --check` | Yes | Passed | `ev:T-0448:9a048c17494b4a9fa625d603` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| tasks/T-0448-t-04a20-basic-profile-dogfood/TASK.md | L1-L62 | Defined and completed the basic profile dogfood contract. | Establish lifecycle entry gate, acceptance, validation, and residual findings for dogfood. | `ev:T-0448:9a048c17494b4a9fa625d603` |
| .hadara/context/MEMORY.md | L17-L19 | Recorded close-source repair-path dogfood learning. | Preserve a practical HADARA development habit discovered while dogfooding. | `ev:T-0448:9a048c17494b4a9fa625d603` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Drift after post-close HANDOFF wording required `close-repair-plan` plus fresh `task close --execute`; consider whether T-04A22 should make this recovery path clearer for dogfood users. | Open | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |
