# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current routing anchor. | Read |
| `docs/PROJECT_STATE.md` | Current project state. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and next task. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0432 capsule row. | Read |
| `docs/specs/0.4.0/productization-redesign/04_Task_Capsule_Schema.md` | Primary T-04A6 Task Capsule source. | Read |
| `docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md` | Implementation sequence and boundaries. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Existing lifecycle commands should keep working with the new smaller scaffold. | Current close/finish tests and 0.4 spec. | Done validation may reveal missing compatibility fields. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| New Task Capsules contain only four generated files by default. | T-04A6 spec. | No legacy sidecar docs or layout options. |
| No migration of existing capsules. | Worker plan. | Historical and current active capsules remain as-is. |
