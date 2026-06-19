# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/evidence command boundaries. | Read |
| docs/DEVELOPMENT_SLICES.md | 0.3.3 context-routing ordering and completion history. | Read |
| docs/ARCHITECTURE.md | Store and read/write boundary context. | Read |
| docs/TEST_STRATEGY.md | Docker validation baseline. | Read |
| docs/SECURITY_MODEL.md | Local cache and private-state boundaries. | Read |
| docs/specs/0.3.3/context-routing/02_Code_Link_Layer_Spec.md | C2 code-index contract and ignore rules. | Read |
| docs/specs/0.3.3/context-routing/05_Indexing_Cache_Invalidation_and_Performance_Spec.md | Cache location, invalidation, degraded output. | Read |
| docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md | Detailed C6 cache implementation constraints. | Read |
| docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md | C6.6 code-index shard sequence and speed target. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Whole-report code-index shard is an acceptable first C6.6 step. | C6 speed-first spec allows staged shards and T-0374 used whole graph-core first. | Per-file incremental recompute remains follow-up, so this task must not claim changed-file-only parsing. |
| Source manifest subset hash can validate the code-index shard for this slice. | Existing cache store uses extractor-key subset hashes. | If source manifest source-kind mapping misses code files, stale detection could be weak. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read commands do not write. | C6 specs | `context graph --include-code` may read code-index shard but must not create/update it. |
| Cache is not truth. | C6 specs | Missing/stale/corrupt code-index cache must fall back to live extraction with explicit metadata. |
| Cache files stay under `.hadara/local/cache/context/`. | Security/cache specs | Code-index shard path must remain local and ignored. |
| Docker is validation baseline. | TEST_STRATEGY | Host npm/node_modules are not authoritative. |
