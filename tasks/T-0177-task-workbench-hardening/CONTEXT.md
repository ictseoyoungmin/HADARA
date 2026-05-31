# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current Phase 3/operator-console state and source-of-truth boundaries. | Read |
| docs/AGENT_HANDOFF.md | Latest validation baseline and Docker/build caveats. | Read |
| docs/TASK_BOARD.md | Task queue and active capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Required HADARA workflow, Docker validation, evidence, and handoff rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 3 slice ordering and completion evidence. | Read |
| docs/TEST_STRATEGY.md | Docker-first validation baseline. | Read |
| docs/specs/HADARA_Phase3_Task_Operator_Console_Development_Plan.md | Workbench projection scope and source design. | Read |
| docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md | Consumer contract for the workbench projection. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `task.status` top-level `ok` should mean report generation success, not readiness. | Operator feedback and Phase 3 read-model posture. | Consumers could misuse `ok` as a close gate if contract text is unclear. |
| Additive `hadara.task.workbench.v1` fields are acceptable within the fixture-level schema posture. | `docs/SCHEMAS.md` and workbench contract. | Strict consumers outside the fixture contract might need a compatibility note. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No commit for this task. | Operator request. | Leave changes in working tree after validation. |
| `task status` remains read-only. | Phase 3 plan. | No automatic Task Board, evidence, handoff, shell, provider, or MCP writes. |
| Evidence records must be appended through HADARA commands. | SOP. | Do not hand-edit `evidence.jsonl`. |
