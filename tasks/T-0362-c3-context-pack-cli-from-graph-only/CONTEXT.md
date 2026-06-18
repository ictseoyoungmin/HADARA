# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Compact current-state routing. | Read |
| `docs/PROJECT_STATE.md` | Current project state and T-0361/T-0362 routing. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and next recommended C3 slice. | Read |
| `docs/TASK_BOARD.md` | Task queue and status. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow rules and required-reading registry. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Finish/ready/close/audit rules. | Read |
| `docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md` | C3 context pack contract and CLI surface. | Read |
| `docs/specs/0.3.3/context-routing/04_Deterministic_Context_Slice_Raw_Adapter_Spec.md` | C4 boundary: slice candidates only in this task. | Read |
| `docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md` | C3 capsule order and done criteria. | Read |
| `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md` | C6 speed/read-only cache boundaries. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `context pack` can reuse T-0361's internal builder without creating a new schema id. | T-0361 implementation and C3 spec. | Public command would duplicate ranking logic if it bypasses the builder. |
| Code-aware context pack should be opt-in through `--include-code`. | C2 graph integration and C6 performance notes. | Default context pack could get slower or over-select code candidates. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Context commands are read-only and must not create cache files. | C3/C6 specs. | No cache warm/write behavior in this capsule. |
| C4 raw slices are not implemented. | C4 spec. | `sliceCandidates` remain metadata only. |
| Public command needs registry and CLI JSON contract docs. | Worker plan and command registry rules. | `context.pack` must be discoverable but hidden from default help like `context.graph`. |
