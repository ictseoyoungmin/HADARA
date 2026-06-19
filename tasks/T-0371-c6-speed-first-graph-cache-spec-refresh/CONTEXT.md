# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and C6/T-0368 status. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next C6/C4 routing. | Read |
| docs/TASK_BOARD.md | Task queue and C6 completed capsule history. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and docs registry surfaces. | Read |
| docs/specs/0.3.3/context-routing/05_Indexing_Cache_Invalidation_and_Performance_Spec.md | Compact C6 cache contract. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | C6 capsule sequence and required reading. | Read |
| docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md | Existing detailed C6 implementation spec. | Read |
| https://github.com/safishamsi/graphify | Referenced comparison project for graph/update/query-first patterns. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| C6 has already implemented source manifest, cache status/warm phase 1, extractor shards, and fast git fingerprint reuse through T-0368. | Project State / Agent Handoff. | A new spec might duplicate already completed implementation notes instead of focusing future work. |
| The remaining performance risk is code-heavy graph/pack usage. | C6/T-0368 handoff and user request. | If code-index shards are not prioritized, C4/C5 code-aware flows may still feel slow. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| This task is docs-only. | User asked for a spec Markdown file. | Do not change runtime behavior in this capsule. |
| Cache remains optional/local/rebuildable. | C6 specs and HADARA protocol. | The spec must not recommend committed generated graph truth. |
| Read commands stay non-mutating. | Context-routing specs. | Warm/write behavior belongs behind explicit execute mode. |
