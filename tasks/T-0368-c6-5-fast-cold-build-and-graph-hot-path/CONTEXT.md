# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current-state read routing and HADARA-dev context anchor. | Read |
| `docs/PROJECT_STATE.md` | Current 0.3.3 context-routing state and latest C6/C3/C2 completion notes. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff, validation baseline, and next-step routing. | Read |
| `docs/TASK_BOARD.md` | Task queue and capsule status source of truth. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow, Docker validation, and dist refresh rules. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Finish/ready/close/audit lifecycle sequence. | Read |
| `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md` | C6 speed-first cache and fast freshness requirements. | Read |
| `docs/specs/0.3.3/context-routing/05_Indexing_Cache_Invalidation_and_Performance_Spec.md` | Cache invalidation and optional local cache boundary. | Read |
| `docs/specs/0.3.3/context-routing/04_Deterministic_Context_Slice_Raw_Adapter_Spec.md` | C4 downstream dependency on fast graph/pack reads. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Git worktree state is a safe fast freshness proof when combined with context-relevant dirty/untracked source metadata. | C6 spec and existing source-manifest metadata contract. | If too weak, stale cache could be reused; implementation falls back on mismatch/unavailable status and stats dirty context-source subsets. |
| Mtime-only changes in a clean git worktree do not need to invalidate context cache. | C6 performance goal and content-based routing semantics. | If a consumer expects mtime freshness, cache may look fresher than old metadata; tests pin this as intentional. |
| C4 should proceed only after graph/cache read paths avoid avoidable full manifest rebuilds. | C4/C6 specs and T-0367 handoff. | C4 raw slicing could be too slow on mounted workspaces without this hot-path fix. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| `context graph` and `context pack` read paths must remain read-only. | C6/C4 specs. | Fast reuse consumes existing cache only; warming remains explicit through `context cache warm --execute`. |
| Cache is optional local state and must never be the source of truth. | C6 cache spec. | All fast misses fall back to the deterministic full manifest comparison. |
| Docker validation and dist sync are required after CLI/source changes. | `docs/IMPLEMENTATION_SOP.md`. | Evidence recorded with `ev:T-0368:a2306de95f6b4741bf91c897`. |
