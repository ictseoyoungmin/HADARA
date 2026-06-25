# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `AGENTS.md` | Repository protocol and lifecycle rules. | Read |
| `.hadara/context/HADARA_CONTEXT.md` | Current-state routing guide. | Read |
| `docs/AGENT_HANDOFF.md` | Active state, validation constraints, known problems. | Read |
| `docs/PROJECT_STATE.md` | Current project state and 0.3.4 line. | Read |
| `docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md` | T-0409 workstream scope. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Stale known-problem detection must be advisory only. | 0.3.4 spec Workstream A. | Automatic deletion would violate handoff review boundaries. |
| Conservative candidate detection is better than broad noisy matching. | Built smoke on current repo. | Overly broad candidates reduce agent trust. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read-only report only. | 0.3.4 spec. | No handoff edits, evidence append, or Task Board mutation from the command. |
| Existing full-suite timeout behavior is recorded honestly. | AGENTS.md evidence rules. | Focused validation and built smoke cover T-0409 feature behavior. |

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Pending |
| docs/AGENT_HANDOFF.md | Current handoff. | Pending |
| docs/TASK_BOARD.md | Task queue and status. | Pending |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Pending |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| TBD | TBD | TBD |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| TBD | TBD | TBD |
