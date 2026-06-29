# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current-state entry point. | Read |
| `docs/PROJECT_STATE.md` | Current project state and active T-0424 note. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and T-0424 readiness note. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0424 capsule creation. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow rules and docs-registration timing. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Evidence/finalize workflow boundary. | Read |
| `docs/specs/0.4.0/productization-redesign/*.md` | Canonicalized 0.4 design sources. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Required Reading/docs-registry registration is intentionally deferred. | User instruction. | Registering now would violate the requested spec-only stage. |
| 0.4 product defaults must stay generic and exclude HADARA-dev-specific commands. | User instruction and product review. | Generated scaffold would overfit to this repository. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No CLI implementation changes in this capsule. | T-0424 scope. | Spec docs and canonical file layout only. |
| No 0.3-to-0.4 migration design in 0.4.0. | Existing 0.4 spec boundary. | Legacy mutation remains fail-closed. |
