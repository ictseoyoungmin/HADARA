# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Compact project-local context and read routing. | Read |
| docs/PROJECT_STATE.md | Current project state and 0.3.3 implementation history. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next cleanup sequence. | Read |
| docs/TASK_BOARD.md | Task queue and T-0381 row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and context-routing spec registry. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close ownership and evidence rules. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Worker plan status language for all context-routing phases. | Read |
| docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md | Detailed C6 implementation status drift. | Read |
| docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md | Speed-first C6 implementation sequence status drift. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| A docs-only audit capsule is sufficient for T-0381. | User requested hardening/cleanup capsules after implementation work; this capsule only reconciles spec status. | If runtime drift is found, split into a later implementation capsule rather than hiding it in docs. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not treat cache as truth. | Context-routing specs and C6 design. | Audit must preserve rebuildable/local cache boundaries. |
| Do not hand-edit `evidence.jsonl`. | AGENTS and workflow docs. | Evidence must be appended through `hadara evidence add-command`. |
| Close-source docs must be finalized before close. | docs/TASK_WORKFLOW_COMMANDS.md. | Update task docs and shared state before ready/close. |
