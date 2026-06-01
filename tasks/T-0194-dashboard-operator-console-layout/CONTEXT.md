# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 5 slice ordering and T-0194 planned scope. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Standard finish/close/evidence semantics. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard read-only and layout/refresh contract. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Phase5_Development_Plan.md | Source plan for operator console layout. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Static HTML remains sufficient for T-0194. | Phase 5 open decision recommends static first for T-0193/T-0194. | A larger framework migration would distract from operator-console UX. |
| T-0194 may derive placeholder workstream rows from `/api/status`. | Phase 5 spec permits placeholder rows before T-0196 timeline model. | Rows must be clearly source-derived and not pretend to be a live stream. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve T-0193 live/fallback binding. | T-0193 completed before this slice. | Layout must not regress source provenance or Refresh Status behavior. |
| Keep all dashboard actions read-only. | Dashboard contract and user feedback. | Use read-again and copy-command language only. |
| No selected-task evidence semantics yet. | Phase 5 sequence. | Evidence lens is a placeholder until T-0195. |
