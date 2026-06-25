# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Compact current-state routing. | Read |
| docs/PROJECT_STATE.md | Current project/release state. | Read |
| docs/AGENT_HANDOFF.md | Current active publish task and known dashboard validation notes. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow and validation rules. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0418 should stay open while this hotfix is handled separately. | Active publish capsule state. | Accidentally closing or rewriting publish evidence would blur release proof boundaries. |
| Dashboard clients can fetch debt explicitly. | Existing `/api/debt` and `/api/dashboard/debt` routes. | If false, status output could lose visible debt data; tests still cover debt routes separately. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read-only dashboard routes must remain read-only. | Dashboard architecture. | No cache writes, shell execution, provider calls, or release mutation added. |
| Release path needs fast focused validation before operator publish retry. | T-0418 failure report. | Keep validation narrow and publish-clone-ready. |
