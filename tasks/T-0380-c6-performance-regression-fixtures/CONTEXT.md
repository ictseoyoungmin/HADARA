# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/CONTEXT_ROUTING_PERFORMANCE_BASELINE.md | Existing mounted/ext4 observations and benchmark usage. | Read |
| docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md | C6 speed-first validation expectations. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Performance thresholds should be advisory by default. | T-0373 baseline notes and mounted/ext4 variability. | A strict default gate could fail on normal local IO variance. |
| Session Start must be measured as a first-class workload after T-0379. | T-0379 implementation and project state. | Performance regressions in the main C5 entrypoint could be missed. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not run expensive mounted/ext4 measurements in unit tests. | T-0373 timing and Docker baseline cost. | Use a fake CLI fixture to test script behavior. |
| Keep benchmark output JSON additive. | Existing script consumers may parse current report fields. | Add `regression` metadata without removing existing workload fields. |
