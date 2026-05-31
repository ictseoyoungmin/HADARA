# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Repository-level HADARA protocol rules. | Read |
| docs/PROJECT_STATE.md | Current protocol consistency implementation state. | Read |
| docs/AGENT_HANDOFF.md | Latest completed task and validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and new T-0160 capsule registration. | Read |
| docs/IMPLEMENTATION_SOP.md | Required workflow and Docker validation path. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 2 slice order. | Read |
| docs/CLI_JSON_CONTRACT.md | CLI JSON schema contract expectations. | Read |
| docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md | Defines `docs|tasks|profile|all` protocol doctor shape. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `scope: all` should aggregate existing docs, profile, and per-task diagnostics without introducing new checks. | Phase 2 spec and T-0159 schema. | If users expect a different semantic, report shape could be surprising. |
| All-scope output may include existing warning-only historical drift. | Current docs-scope known problems. | Built CLI smoke should assert `ok: true` can still include warnings. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep schemas fixture-level and additive. | T-0159 handoff. | No new schema id or release-gate strictness. |
| Use Docker for Node/npm validation. | `docs/AGENT_HANDOFF.md` and SOP. | Host dependencies are unreliable. |
| No writes from protocol doctor. | Phase 2 spec. | The new all-scope path must remain read-only. |
