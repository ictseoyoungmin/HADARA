# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Roadmap slice ordering and status. | Read |
| docs/specs/HADARA_TUI_Mockup_Parity_HADARA_Native_Runtime_Design.md | Existing TUI runtime/design baseline. | Read indirectly through current TUI code/tests and existing required-reading context. |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Dashboard work should pause after Phase 5.7 hardening. | Operator review feedback and T-0226 measurement outcome. | Project docs would keep steering agents toward more dashboard optimization instead of TUI/product workflow value. |
| TUI can use dashboard-named services as operator read models for now. | Existing shared service surface names. | A neutral rename may be cleaner later, but renaming now would increase blast radius. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| TUI must not call Dashboard HTTP for local reads. | Operator read-model architecture. | Use shared services directly. |
| TUI must not wait for refresh completion to render core state. | T-0225/T-0226 dashboard projection semantics. | Display stale/pending instead. |
| TUI remains read-only. | HADARA TUI boundary. | No project document mutation, shell execution, provider calls, or MCP calls. |
