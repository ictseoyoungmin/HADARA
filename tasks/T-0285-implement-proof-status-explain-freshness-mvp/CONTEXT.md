# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `docs/PROJECT_STATE.md` | Current project state. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff. | Read |
| `docs/TASK_BOARD.md` | Task queue and status. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow rules. | Read |
| `docs/specs/rc3-proof-reliability/02_Proof_Status_Explain_Freshness_MVP.md` | Source design for proof MVP. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Existing evidence lint semantics and task close audit are sufficient for the MVP proof verdict. | rc3 proof MVP spec and existing services | If those read models drift, proof reports may need updates. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Proof commands are read-only. | rc3 proof MVP spec | They must not append evidence or mutate task docs. |
| Full proof graph and signatures are deferred. | rc3 proof MVP spec | MVP reports compact task-readiness proof only. |
