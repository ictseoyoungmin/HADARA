# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Current-state routing and operating rules. | Done |
| docs/PROJECT_STATE.md | Current project state and C2 completion baseline. | Done |
| docs/AGENT_HANDOFF.md | Current handoff and next recommended C2 hardening step. | Done |
| docs/TASK_BOARD.md | Task queue and status. | Done |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and context-routing required reading. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit command boundaries. | Done |
| docs/DEVELOPMENT_SLICES.md | C1/C2 slice ordering and latest evidence rows. | Done |
| docs/specs/0.3.3/context-routing/02_Code_Link_Layer_Spec.md | Active C2 code-link spec including budget hardening item. | Done |
| docs/specs/0.3.3/context-routing/05_Indexing_Cache_Invalidation_and_Performance_Spec.md | Budget/degraded-mode defaults and cache boundary. | Done |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Context-routing phase order and done criteria. | Done |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Budget enforcement can be implemented without adding public CLI flags. | C6 spec says potential flags should not all be added immediately. | If operators need tunable budgets now, this capsule would be too narrow; current need is default hardening plus internal test hooks. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Caches remain optional, local, ignored, and non-authoritative. | C6 spec. | Do not add persistent cache behavior in this capsule. |
| Context/code commands remain read-only. | C2/C6 worker plan. | No project writes from graph/index execution. |
| Partial output must be explicitly degraded. | C6 degraded mode rule. | Budget truncation must emit warning issues and set summary.degraded. |
