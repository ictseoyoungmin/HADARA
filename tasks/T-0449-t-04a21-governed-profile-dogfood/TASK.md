# T-0449 T-04A21 Governed Profile Dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0449 |
| Title | T-04A21 Governed Profile Dogfood |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md | implementation-source | normative | approved | sha256:41106f8178c44bdd21f79b94c61e86ac3849ca0d4cd543539c7026ef3cbbc4f6 | Defines governed profile scaffold files and product defaults. |
| docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md | implementation-source | normative | approved | sha256:79c5b525a1ccfa68d018d90a1a2b42be4b2a148dd8b26a1d4650355e601a17c0 | Defines dogfood flow and acceptance. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | implementation-source | normative | approved | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Assigns T-04A21 to governed profile dogfood. |

## Goal

| Goal | Notes |
|---|---|
| Validate a fresh governed 0.4 project from init through closed-valid task audit. | Confirm governed-only docs, registry routing, handoff, and lifecycle behavior using the built HADARA CLI in a disposable project. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract. | Done | TASK.md |
| 2 | Execute fresh governed profile dogfood. | Done | `ev:T-0449:a81f3af0c4ab408eba907092` |
| 3 | Validate, record evidence, and close the capsule. | Done | `ev:T-0449:a81f3af0c4ab408eba907092` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | A disposable `hadara init --profile governed` project contains governed scaffold docs including `AGENT_HANDOFF.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `DECISIONS.md`, and `SECURITY_MODEL.md` while omitting default `docs/IMPLEMENTATION_SOP.md` and `docs/TASK_WORKFLOW_COMMANDS.md`. | Yes | Met | `ev:T-0449:a81f3af0c4ab408eba907092` | Required | docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md |
| AC-2 | Governed docs registry/read-map routing identifies current-state, workflow, governed conditional docs, and active task docs without appending registry rows to AGENTS/context/workflow docs. | Yes | Met | `ev:T-0449:a81f3af0c4ab408eba907092` | Required | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |
| AC-3 | In the disposable governed project, task create, TASK authoring, evidence append/projection/summary, context pack, lifecycle, finalize dry-run review, guarded finalize execute, and audit-close complete through `closed-valid`. | Yes | Met | `ev:T-0449:a81f3af0c4ab408eba907092` | Required | docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md |
| AC-4 | Governed dogfood finds no HADARA-dev-specific generated defaults, duplicate workflow/Required Reading ownership, close proof in `TASK.md`/`HANDOFF.md`, task-local `Decision` kind, or same-capsule lifecycle chores in `HANDOFF.md`. | Yes | Met | `ev:T-0449:a81f3af0c4ab408eba907092` | Required | docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md |
| AC-5 | Validation evidence is recorded in this capsule. | Yes | Met | `ev:T-0449:a81f3af0c4ab408eba907092` | Required | HADARA workflow |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Built CLI governed dogfood | Fresh `/tmp` governed project init through closed-valid task audit | Yes | Passed | `ev:T-0449:a81f3af0c4ab408eba907092` |
| Governed scaffold and read-map assertions | File presence/absence, generated-doc ownership/product-default checks, docs registry/read-map checks, and docs register non-mutation checks | Yes | Passed | `ev:T-0449:a81f3af0c4ab408eba907092` |
| Capsule checks | `harness validate --task T-0449 --level done`, `evidence lint --task T-0449`, and `git diff --check` | Yes | Passed | `ev:T-0449:a625c2c21b854ee0ae785bbb` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| tasks/T-0449-t-04a21-governed-profile-dogfood/TASK.md | L1-L65 | Defined the governed profile dogfood contract. | Establish lifecycle entry gate and acceptance before running dogfood validation. | TASK.md |
| tasks/T-0449-t-04a21-governed-profile-dogfood/EVIDENCE.md | L1-L20 | Recorded governed dogfood validation and close-prep evidence. | Preserve proof that the disposable governed project and capsule checks passed. | `ev:T-0449:a81f3af0c4ab408eba907092`, `ev:T-0449:a625c2c21b854ee0ae785bbb` |
| tasks/T-0449-t-04a21-governed-profile-dogfood/HANDOFF.md | L1-L17 | Recorded continuation guidance for T-04A22. | Hand off the next global work unit after governed dogfood. | `ev:T-0449:a81f3af0c4ab408eba907092` |
| docs/TASK_BOARD.md | L452-L452 | Marked T-0449 governed dogfood done. | Keep shared task queue current. | `ev:T-0449:a81f3af0c4ab408eba907092` |
| docs/DEVELOPMENT_SLICES.md | L435-L435 | Added T-04A21 governed dogfood completion row. | Keep implementation slice ledger current. | `ev:T-0449:a81f3af0c4ab408eba907092` |
| docs/PROJECT_STATE.md | L12-L96 | Advanced current 0.4 state to T-04A22 after governed dogfood. | Keep compact project state current. | `ev:T-0449:a81f3af0c4ab408eba907092` |
| docs/AGENT_HANDOFF.md | L7-L105 | Advanced current handoff to T-04A22. | Route the next session to self-review hardening. | `ev:T-0449:a81f3af0c4ab408eba907092` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Governed dogfood did not expose a product-code defect; stale pre-finish done-level status blockers were expected before finish/finalize, and the HANDOFF wording repair path passed with fresh close proof. | Closed | `ev:T-0449:a81f3af0c4ab408eba907092` |
