# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Required context anchor. | Read via session context. |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next-step routing. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation guidance. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle ready/close boundaries. | Read |
| docs/specs/tmp_dir_hadara_work_items_architecture_specs/work_items/00_HADARA_Lifecycle_Close_Contract_Redesign_Spec.md | Acceptance parser v2 semantics and lazy defer prevention. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Legacy `ACCEPTANCE.md` tables remain strict by default. | Lifecycle close contract defaulting rules. | If wrong, old capsules could close with unresolved work. |
| Public ready/close report schemas should remain compatible in this slice. | T-0386 scope and existing tests. | Breaking schemas would widen the capsule beyond a hardening follow-up. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve existing `ACCEPTANCE_INCOMPLETE` and `TASK_DONE_ACCEPTANCE_PENDING` issue codes. | Existing task ready/close/protocol tests. | Downstream consumers may rely on these issue codes. |
| Do not switch Task Capsule templates to v2 by default. | Backward compatibility. | Existing legacy table docs and tests should continue to pass. |
| Use Docker validation for source changes. | AGENTS.md and SOP. | Host `vitest` is unavailable in this workspace. |
