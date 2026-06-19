# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close and evidence flow. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and T-0377 placement. | Read |
| docs/ARCHITECTURE.md | Cache/local-state and component boundaries. | Read |
| docs/TEST_STRATEGY.md | Docker/ext4 validation baseline. | Read |
| docs/SECURITY_MODEL.md | Local cache and no-secret boundaries. | Read |
| docs/specs/0.3.3/context-routing/05_Indexing_Cache_Invalidation_and_Performance_Spec.md | Cache contract and invalidation rules. | Read |
| docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md | Detailed C6 performance/cache requirements. | Read |
| docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md | Execution-focused code-index warm path requirements. | Read |
| docs/CONTEXT_ROUTING_PERFORMANCE_BASELINE.md | Mounted/ext4 observed bottleneck. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| First code-index warm is still full rebuild after T-0375. | `docs/AGENT_HANDOFF.md`; T-0375 follow-up | C5 defaults remain too slow on mounted workspaces. |
| Per-file reuse is the smallest useful next C6 slice. | C6 speed-first spec | If implementation touches broader C5/session-start behavior, scope may sprawl. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Cache remains optional/local/rebuildable and not truth. | C6 specs | Corrupt/missing cache must recompute or degrade explicitly. |
| Read commands do not write. | C6 specs / HADARA protocol | Per-file cache writes must stay behind explicit warm execute. |
| Use Docker/ext4 validation baseline. | `docs/TEST_STRATEGY.md` | Host `/mnt/f` npm symlink behavior is unreliable. |
