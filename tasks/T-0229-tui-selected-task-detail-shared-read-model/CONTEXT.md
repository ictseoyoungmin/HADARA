# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Roadmap ordering. | Read |
| docs/specs/tui/HADARA_TUI_Shared_Operator_Read_Model_Spec.md | TUI shared read-model rules after dashboard pause. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Dashboard task-detail aggregate can be reused by TUI without HTTP. | T-0228 spec and existing service boundary. | If the aggregate lacks document files, TUI viewer compatibility still needs bounded file reads until a follow-up slice. |
| Selected proof/evidence drift is more important than document body elimination in this slice. | User-requested capsule sequence. | Performance may improve only modestly until T-0230 replaces task index/cache scans. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| TUI must call shared services directly. | TUI spec. | No Dashboard HTTP route use. |
| TUI remains read-only. | HADARA TUI boundary. | No writes, shell execution, provider calls, or MCP calls. |
| Commit after this capsule before T-0230. | User instruction. | Close and commit T-0229 before creating/working T-0230. |
