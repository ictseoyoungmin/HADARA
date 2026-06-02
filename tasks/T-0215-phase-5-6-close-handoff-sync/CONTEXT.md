# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Pending |
| docs/AGENT_HANDOFF.md | Current handoff. | Pending |
| docs/TASK_BOARD.md | Task queue and status. | Pending |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Pending |
| docs/DEVELOPMENT_SLICES.md | Roadmap ordering and phase evidence. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | finish/close/audit command semantics. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Phase5_6_UX_Diagnosis.md | Phase 5.6 fix status and loading diagnosis. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Read_Model_Performance_Redesign.md | Phase 5.7 projection sequence. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Phase 5.6 runtime changes are already implemented and validated by prior evidence. | T-0207 through T-0214 evidence. | T-0215 would need runtime validation instead of status sync only. |
| Phase 5.7 should start with contract work, not projection storage or frontend changes. | Projection redesign spec. | Later capsules could invent incompatible route/storage semantics. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not implement projection runtime in T-0215. | Task scope. | T-0216 starts the implementation track. |
| Do not hand-edit `evidence.jsonl`. | SOP. | Use `hadara evidence add-command`. |
| Keep dashboard read-only and browser-storage-free. | Dashboard contracts. | Projection cache is local server state, not browser storage. |
