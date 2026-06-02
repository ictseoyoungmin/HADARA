# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA protocol and required reading. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit workflow. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 5.7 ordering. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard task projection contract. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Read_Model_Performance_Redesign.md | Source signal and incremental projection plan. | Read |
| src/services/dashboard-refresh.ts | Background refresh integration. | Read |
| src/services/dashboard-core.ts | Core summary integration. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Directory discovery still scans `tasks/`, but unchanged task bodies should not be reread. | T-0220 goal and Phase 5.7 source-signal plan. | Refresh cost remains too high if thousands of metadata stats are also slow; further batching/warm indexes may be needed. |
| File mtime/size signals are acceptable for this slice. | Spec allows mtime/size with optional content hash. | Very rare timestamp/size collision could miss a changed body until a later stronger hash strategy. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not implement timeline/debt projections. | T-0220 out of scope. | Deferred to T-0221. |
| Keep projections redacted/rebuildable. | T-0220 scope. | Store writer rejects raw project-root paths. |
| Do not change evidence writer. | T-0220 out of scope. | Evidence v2 remains separate. |
