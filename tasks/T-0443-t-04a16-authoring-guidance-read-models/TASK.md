# T-0443 T-04A16 Authoring Guidance Read Models

## Identity

| Field | Value |
|---|---|
| ID | T-0443 |
| Title | T-04A16 Authoring Guidance Read Models |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/02_Agent_Entry_and_Workflow_Document.md | reference | approved | approved | sha256:ca941c7f6551c1dd63d0e6cb10bb5b0cdb44b736a0afab0a40f0806f45325a96 | Defines read-only authoring support and surface expectations. |
| docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md | reference | approved | approved | sha256:79c5b525a1ccfa68d018d90a1a2b42be4b2a148dd8b26a1d4650355e601a17c0 | Defines authoring guidance tests. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | implementation-source | approved | approved | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Assigns T-04A16 scope. |

## Goal

| Goal | Notes |
|---|---|
| Add read-only authoring guidance to task status, lifecycle, and finalize reports. | Agents should see which task prose/table slots to update next, while the CLI still avoids silently writing agent-owned prose. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define authoring guidance shape and entry-gate expectations from the 0.4 specs. | Done | TASK.md Source Documents and Acceptance. |
| 2 | Add shared read-only authoring guidance to task status, lifecycle, and finalize reports. | Done | `ev:T-0443:5b1829f6efe44f15913e30b4` |
| 3 | Add focused tests for missing task prose guidance and no silent prose mutation. | Done | `ev:T-0443:5b1829f6efe44f15913e30b4` |
| 4 | Validate with focused Docker tests, built CLI smoke, harness, evidence lint, and diff hygiene. | Done | `ev:T-0443:5b1829f6efe44f15913e30b4`, `ev:T-0443:966731c29ab64153af2f79e8`, `ev:T-0443:f1932c38fcc44d91afa42283`, `ev:T-0443:9181a593dcae41afb0290699` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `task status --json` exposes read-only authoring guidance for missing or incomplete task-owned prose/table slots. | Yes | Met | `ev:T-0443:5b1829f6efe44f15913e30b4`, `ev:T-0443:966731c29ab64153af2f79e8` | Required | 02 Agent Entry and Workflow Document. |
| AC-2 | `task lifecycle --json` includes the same guidance without executing writes or replacing task prose. | Yes | Met | `ev:T-0443:5b1829f6efe44f15913e30b4`, `ev:T-0443:966731c29ab64153af2f79e8` | Required | 14 Worker Agent Capsule Plan. |
| AC-3 | `task finalize --json` includes the same guidance before lifecycle execution and does not silently mutate agent-owned prose. | Yes | Met | `ev:T-0443:5b1829f6efe44f15913e30b4`, `ev:T-0443:966731c29ab64153af2f79e8` | Required | 13 Test Dogfood and Release Plan. |
| AC-4 | Focused tests and a built CLI smoke prove the guidance appears and the reports remain schema-valid/read-only. | Yes | Met | `ev:T-0443:5b1829f6efe44f15913e30b4`, `ev:T-0443:966731c29ab64153af2f79e8` | Required | 13 Test Dogfood and Release Plan. |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused tests | Docker build plus focused unit tests for task status, lifecycle, finalize, and schemas. | Yes | Passed | `ev:T-0443:5b1829f6efe44f15913e30b4` |
| Built CLI smoke | Built `dist/cli/main.js` reports authoring guidance for T-0443 without mutating prose. | Yes | Passed | `ev:T-0443:966731c29ab64153af2f79e8` |
| Done-level harness | `hadara harness validate --task T-0443 --level done --json`. | Yes | Passed | `ev:T-0443:750c6d8da52c4ea1bf46274a`, `ev:T-0443:c8332c5291f8436299985792`, `ev:T-0443:9181a593dcae41afb0290699` |
| Evidence lint | `hadara evidence lint --task T-0443 --json`. | Yes | Passed | `ev:T-0443:f1932c38fcc44d91afa42283`, `ev:T-0443:9181a593dcae41afb0290699` |
| Diff hygiene | `git diff --check`. | Yes | Passed | `ev:T-0443:f1932c38fcc44d91afa42283`, `ev:T-0443:9181a593dcae41afb0290699` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/task/authoring-guidance.ts | L1-L89 | Add shared authoring guidance read model helpers over `TASK.md` sections. | Keep status/lifecycle/finalize guidance consistent with minimal duplication. | `ev:T-0443:5b1829f6efe44f15913e30b4` |
| src/services/task-workbench.ts | L10-L224 | Add authoring guidance to `task status` JSON/text reports. | Surface next agent-owned writing work. | `ev:T-0443:5b1829f6efe44f15913e30b4` |
| src/services/dashboard-task-detail.ts | L8-L190 | Carry authoring guidance through fast dashboard workbench projections. | Preserve `TaskWorkbenchReport` shape for dashboard consumers. | `ev:T-0443:5b1829f6efe44f15913e30b4` |
| src/task/task-lifecycle.ts | L7-L130 | Add authoring guidance to lifecycle report and text output. | Keep lifecycle phase guidance tied to document authoring. | `ev:T-0443:5b1829f6efe44f15913e30b4` |
| src/task/task-finalize.ts | L8-L289 | Add authoring guidance to finalize dry-run/execute reports. | Warn about prose/doc gaps before guarded lifecycle execution. | `ev:T-0443:5b1829f6efe44f15913e30b4` |
| src/schemas/task-workbench.schema.json | N/A | Mark `authoringGuidance` as an additive workbench field. | Keep schema projection aware of the new read-only field. | `ev:T-0443:5b1829f6efe44f15913e30b4` |
| tests/unit/task-workbench.test.ts | L31-L91 | Add task status guidance coverage and 0.4 status fixture fix. | Verify missing prose guidance. | `ev:T-0443:5b1829f6efe44f15913e30b4` |
| tests/unit/task-lifecycle.test.ts | L26-L94 | Add lifecycle guidance coverage and canonical close evidence fixture. | Verify read-only lifecycle guidance. | `ev:T-0443:5b1829f6efe44f15913e30b4` |
| tests/unit/task-finalize.test.ts | L25-L64 | Add finalize guidance coverage. | Verify finalize guidance remains read-only. | `ev:T-0443:5b1829f6efe44f15913e30b4` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Risk | Guidance must stay additive and must not become hidden prose generation or silent task-doc mutation. | Open | 02 Agent Entry and Workflow Document. |
