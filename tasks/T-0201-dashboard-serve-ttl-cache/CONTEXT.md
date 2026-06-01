# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Phase5_5_Production_Development_Plan.md | T-0201 scope and cache boundaries. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Cache may be implemented at the served API boundary while pure read-model builders remain deterministic. | Existing service shape and Phase 5.5 target pattern. | If consumers expect direct service calls to be cached, direct service tests still expose `disabled` cache metadata. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Cache is process memory only. | Phase 5.5 non-negotiable boundaries. | No `.hadara/local`, database, file watcher, committed cache, browser storage, or evidence source behavior. |
| Bypass must recompute without mutation. | Phase 5.5 cache bypass rule. | `?cache=bypass` returns `bypass` metadata and does not overwrite the cached entry. |
