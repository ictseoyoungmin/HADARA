# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Session read routing and compact project-local context. | Read |
| docs/PROJECT_STATE.md | Current project state and latest completed cache warm slice. | Read |
| docs/AGENT_HANDOFF.md | Current handoff naming C6.4/C6.5 as the next recommended work. | Read |
| docs/TASK_BOARD.md | Task queue and capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Validation and Docker workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle, close, and evidence rules. | Read |
| docs/ARCHITECTURE.md | Runtime surface and local cache boundary. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering across C3/C4/C6. | Read |
| docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md | C6 cache shard architecture and acceptance expectations. | Read |
| docs/specs/0.3.3/context-routing/04_Deterministic_Context_Slice_Raw_Adapter_Spec.md | C4 depends on fast graph/pack context inputs. | Referenced |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Source manifest subset hashes are sufficient to validate individual extractor shard freshness. | C6 spec and `context-cache-store.ts` implementation. | Shards may be reused too broadly if extractor-to-source mapping is wrong. |
| `context graph` may read ignored local cache records but must not write them. | C6 spec read-only command rule. | Graph/pack could become surprising mutators. |
| Additive cache metadata is acceptable for JSON consumers. | Existing schema style and C6 requirements. | Strict consumers may need updates if new fields are not schema-compatible. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve read-only behavior for `context graph` and `context pack`. | AGENTS.md / C6 spec | Cache writes only happen through `context cache warm --execute`. |
| Keep shard scope narrow. | C6.4 staged implementation | Start with task board, docs registry, command registry. |
| Use Docker validation for CLI/source changes. | AGENTS.md / IMPLEMENTATION_SOP.md | Build in Docker and refresh `dist` before built-CLI smokes. |
