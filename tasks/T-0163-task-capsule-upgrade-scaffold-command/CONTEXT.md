# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | T-0163 planned slice. | Read |
| docs/TEST_STRATEGY.md | Protocol hardening validation expectations. | Read |
| docs/V1_0_IMPLEMENTATION_SCHEMAS.md | Detailed T-0163 implementation target. | Read |
| docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md | Original upgrade-scaffold mitigation context. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| A dedicated schema is acceptable for the new public JSON surface. | T-0163 adds a new task command report shape. | Without registration, external agents cannot validate the new surface. |
| Append-only frame insertion is safer than semantic rewrites. | Phase 2 remediation policy. | Some legacy files may remain partially upgraded if ambiguous. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Dry-run by default. | HADARA write boundary. | Execute only with `--execute`. |
| No deletion or status/acceptance mutation. | T-0163 non-goals. | Command only creates missing standard files or appends missing v2 frame blocks. |
