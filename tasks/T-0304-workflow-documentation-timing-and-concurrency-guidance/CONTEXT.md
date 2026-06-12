# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current context now names incremental docs and write serialization as operating rules. | Read |
| `AGENTS.md` | Root agent rules that need timing/concurrency guidance. | Read |
| `docs/PROJECT_STATE.md` | Current project state after T-0303. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and next T-0304 recommendation. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0304 capsule row. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Root workflow rules to update. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Authoritative task command workflow doc to update. | Read |
| `docs/specs/0.3.0/rc2/HADARA_0.3.0-rc.2_Workflow_UX_Hardening_Plan.md` | T-0304 source design and acceptance criteria. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0304 should not change CLI runtime behavior. | rc.2 plan. | Behavior changes would expand validation needs and risk. |
| The same guidance must appear in generated init docs. | rc.2 plan. | Fresh projects would keep the old waterfall ambiguity. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep guidance compact and operational. | Existing docs style. | Avoid duplicating large rule blocks across every doc. |
| Use Docker validation baseline for generated docs tests. | AGENT_HANDOFF. | Host `vitest` is unavailable. |
