# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `docs/PROJECT_STATE.md` | Current project state. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff. | Read |
| `docs/TASK_BOARD.md` | Task queue and status. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow rules. | Read |
| `docs/specs/rc3-proof-reliability/03_CI_Gate_MVP.md` | Source design for CI gate MVP. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Proof status is the task-readiness proof source for the gate. | T-0285 | If proof semantics change, CI gate behavior follows. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| CI gate is read-only and must not append evidence. | rc3 CI gate spec | Validation evidence is recorded separately through task evidence commands. |
| Release aggregation is deferred unless release work is explicitly requested. | rc3 CI gate spec | MVP includes a deferred release check row only. |
