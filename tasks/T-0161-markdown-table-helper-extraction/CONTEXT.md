# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Planned T-0161 slice and ordering. | Read |
| docs/TEST_STRATEGY.md | Protocol hardening validation expectations. | Read |
| docs/V1_0_IMPLEMENTATION_SCHEMAS.md | Detailed T-0161 implementation target. | Read |
| docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md | Original Phase 2 strict-plan source. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Local parser behavior must remain stable. | T-0161 is a helper extraction, not a semantic doctor change. | Existing protocol/harness tests could regress if parsing is tightened too much. |
| Docker is the validation baseline. | `docs/AGENT_HANDOFF.md` records missing host dependencies. | Host `npx` can fail due missing `node_modules`. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No writes from helper extraction. | Phase 2 read-first boundary. | Only source/tests/docs changed. |
| Preserve fixture-level additive schema posture. | T-0159/T-0160 handoff. | No schema id or release-gate strictness change. |
