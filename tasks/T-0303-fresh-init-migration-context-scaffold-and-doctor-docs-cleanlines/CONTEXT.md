# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current compact project-local context anchor being refreshed. | Read |
| `AGENTS.md` | Repository-level HADARA protocol rules. | Read |
| `docs/PROJECT_STATE.md` | Current project state and T-0302 follow-up. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and fresh-init doctor context friction. | Read |
| `docs/TASK_BOARD.md` | Task queue and new T-0303 capsule row. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow rules and required reading registry. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Finish/ready/close/audit loop semantics. | Read |
| `docs/DEVELOPMENT_SLICES.md` | Slice ordering and T-0303 through T-0308 planning rows. | Read |
| `docs/specs/0.3.0/rc2/HADARA_0.3.0-rc.2_Workflow_UX_Hardening_Plan.md` | Source design and acceptance criteria for T-0303. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Existing project context must be preserved by migration. | rc.2 plan. | Overwriting user context would violate migration safety; covered by tests. |
| Current HADARA-dev context can be refreshed manually in this capsule. | It is the active repository context and not a migration target. | If stale, future sessions keep Hermes-first routing; refreshed as close-source doc. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| `task finish`, `ready`, `close`, and `audit-close` remain separate. | `docs/TASK_WORKFLOW_COMMANDS.md`. | Close-source docs must be finalized before close. |
| CLI code changes require Docker build and workspace `dist` refresh. | `AGENTS.md`, `docs/IMPLEMENTATION_SOP.md`. | Build/dist sync completed before built smoke. |
| Do not publish or mutate registries in this capsule. | rc.2 plan release strategy. | Release work is T-0309/T-0310. |
