# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current-state read routing. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next recommended step. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close lifecycle. | Read |
| docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md | C3/C5 contract. | Read |
| docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md | C6 cache contract and status drift. | Read |
| docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md | Speed-first warm path requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| A cached source manifest fast freshness hit is acceptable proof for default Session Start to consume cache. | Existing C6 fast-path design and implementation. | If the proof is too weak, Session Start could serve stale context. |
| If freshness cannot be proven without broad scanning, Session Start must fall back to bounded no-live output. | T-0378 timeout evidence and C6 mounted baseline. | Mounted workspaces can hang if we call live context pack by default. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read commands do not write cache. | C6 specs and AGENTS rules. | Session Start may read cache only. |
| Cache is not truth. | C6 specs. | Warm output must report cache metadata and fall back/degrade explicitly. |
| Keep the slice small. | User request to continue existing plan. | Full C6.10 performance gates remain separate. |
