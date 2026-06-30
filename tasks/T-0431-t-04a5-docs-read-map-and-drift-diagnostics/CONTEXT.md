# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Compact project-local context anchor. | Read |
| `docs/PROJECT_STATE.md` | Current project state and 0.4 progress. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and next-task guidance. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0431 capsule row. | Read |
| `docs/specs/0.4.0/productization-redesign/03_Design_Source_Documents_Read_Map_and_Drift.md` | Primary T-04A5 read-map/drift source. | Read |
| `docs/specs/0.4.0/productization-redesign/12_CLI_JSON_Contracts_and_Diagnostics.md` | JSON command/schema contract source. | Read |
| `docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md` | Defines T-04A5 purpose and budget boundary. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Read-map can derive metadata axes before registry migration. | Current registry entries do not yet store all 0.4 axes. | Later metadata write commands may need to persist explicit axes. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read-map and inbox are read-only. | T-04A5 scope. | No registry mutation, context integration, or source-hash task schema change in this capsule. |
| Do not broaden default spec reading. | 0.4 design source policy. | Unregistered specs and historical docs are routed to do-not-read/drift warnings. |
