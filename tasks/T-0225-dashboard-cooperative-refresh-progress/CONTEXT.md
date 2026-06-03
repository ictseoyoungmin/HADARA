# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current dashboard projection state and completed T-0224 baseline. | Read |
| docs/AGENT_HANDOFF.md | Known problems: refresh stage sync work, freshness unknown, stale server process. | Read |
| docs/TASK_BOARD.md | Task queue and new T-0225 capsule row. | Read |
| docs/IMPLEMENTATION_SOP.md | HADARA workflow, Docker validation, evidence and handoff rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 5.7 slice ordering and completed T-0224 context. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/evidence semantics. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Refresh_Refactor_Spec.md | T-0224 stage contract that T-0225 extends with progress and UI alignment. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `/api/dashboard/refresh` should be a trigger/status endpoint, not a blocking rebuild endpoint. | T-0219/T-0224 behavior and operator feedback. | UI or tests may incorrectly time trigger latency as rebuild completion. |
| Cached/stale core data is better than blocking first actionable state. | Dashboard projection redesign. | Operators could see stale data unless provenance/pending metadata is clear. |
| Full freshness proof must stay cheap or be deferred. | `/mnt/f` metadata scan risk. | A fresh/stale check that scans every capsule would reintroduce the original latency. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Core route must never await refresh completion. | T-0225 acceptance. | Return current projection with stale/pending metadata instead. |
| Browser dashboard remains read-only and memory-only. | Dashboard governance boundary. | Refresh can trigger server-side projection rebuild but must not mutate project docs/evidence. |
| Use Docker validation/build when host dependencies are unreliable. | Handoff/SOP. | Host has no guaranteed `node_modules`. |
