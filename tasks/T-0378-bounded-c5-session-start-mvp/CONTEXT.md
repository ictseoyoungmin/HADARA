# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Project-local context anchor and read routing. | Read |
| docs/PROJECT_STATE.md | Current project state and known context-routing status. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next recommended step. | Read |
| docs/TASK_BOARD.md | Task queue and new capsule registration. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow and validation rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and evidence-backed roadmap. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close and close-source rules. | Read |
| docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md | C3/C5 report contract and non-goals. | Read |
| docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md | Bounded mounted-workspace requirements and cache write boundaries. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Session Start should reuse `buildContextPackReport` rather than performing independent discovery. | C3/C5 spec and C6 one-discovery rule. | Duplicated graph/source walks would reintroduce mounted-workspace slowness. |
| MVP can default to the active task when present and otherwise return a clear error from context pack. | Current context pack behavior. | If active task derivation is wrong, users can pass `--task`. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read commands do not write cache or evidence. | C6 spec / AGENTS. | `session start` must be read-only. |
| Degraded beats hanging. | C6 spec. | Keep defaults small and surface issues. |
| Use Docker validation for CLI changes. | AGENTS / SOP. | Host npm is not the baseline. |
