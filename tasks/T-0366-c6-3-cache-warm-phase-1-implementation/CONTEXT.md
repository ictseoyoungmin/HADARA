# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Project-local current-state routing and workflow rules. | Read |
| docs/PROJECT_STATE.md | Shows T-0365 complete and T-0366 as the next C6.3 implementation line. | Read |
| docs/AGENT_HANDOFF.md | Names cache warm phase 1 as the next implementation step. | Read |
| docs/TASK_BOARD.md | Task queue and active capsule state. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, Docker validation, and documentation timing rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/evidence semantics. | Read |
| docs/specs/0.3.3/context-routing/05_Indexing_Cache_Invalidation_and_Performance_Spec.md | Compact cache location/invalidation/degraded contract. | Read |
| docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md | Detailed cache warm phase 1 requirement. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Phase 1 should write only `.hadara/local/cache/context/source-manifest.json`. | T-0365 C6 spec warm phase table. | Broader shard writes would expand scope and schema surface prematurely. |
| Warm dry-run must not create `.hadara/local/cache/context/`. | C6 read/write boundary and existing status command tests. | Dry-run mutation would violate HADARA explicit write boundaries. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Cache remains local, ignored, optional, and rebuildable. | C6 specs. | Writes stay under `.hadara/local/cache/context/`. |
| Read commands remain non-mutating. | C6 specs and architecture overview. | Only `context cache warm --execute` writes. |
| Public JSON command needs schema/registry/docs/tests. | HADARA command surface rules. | Add `hadara.context.cacheWarm.v1`. |
