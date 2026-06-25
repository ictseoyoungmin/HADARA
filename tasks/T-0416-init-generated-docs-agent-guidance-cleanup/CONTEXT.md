# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Compact project-local context routing. | Read |
| `docs/PROJECT_STATE.md` | Current 0.3.4 state and active T-0416 pointer. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and next task guidance. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0416 capsule path. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow rules. | Read via AGENTS/session constraints |
| `docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md` | Workstream H acceptance. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Generated docs should guide fresh projects before they have rich task history. | Workstream H | If too much broad protocol appears before the command loop, agents may start with low-level commands or broad reads. |
| Existing finalize-first lifecycle remains valid. | T-0398/T-0400/T-0414 | The cleanup should insert `session start`, not replace lifecycle/finalize semantics. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No runtime lifecycle behavior changes. | Scope | Only generated docs and tests should change. |
| Low-level proof-boundary commands remain documented. | Workstream H | They are needed for debugging/recovery and command implementation work. |
| Optional integrations remain out of default init docs. | Existing init tests | Do not add Hermes/MCP/provider assumptions to generated docs. |
