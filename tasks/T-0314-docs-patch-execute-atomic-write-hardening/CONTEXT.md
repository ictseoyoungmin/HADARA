# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Routes current-state and docs registry context. | Read |
| docs/PROJECT_STATE.md | Current rc.2 publish/recycle/dogfooding state. | Read |
| docs/AGENT_HANDOFF.md | Identifies `docs patch --execute` atomic hardening as the next focused follow-up. | Read |
| docs/TASK_BOARD.md | Task queue and capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, Docker validation, and close-source update rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit semantics and write coordination. | Read |
| tasks/T-0314-docs-patch-execute-atomic-write-hardening/TASK.md | Active capsule scope. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `docs patch --execute` should remain dry-run-first and hash-guarded. | Existing `docs patch` implementation and Phase 7.4 spec. | Changing the review model would broaden scope and risk consumer breakage. |
| The shared atomic text helper is the right write primitive. | T-0309/T-0311 atomic helper hardening. | A custom write path would duplicate safety logic and miss containment guarantees. |
| README test drift is safe to correct in this capsule. | Full Docker validation failed on stale rc.1 expectations. | Leaving it stale would keep full validation red for unrelated future changes. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No broad migration execute. | T-0313 handoff and reviewer guidance. | This capsule changes managed patch behavior only. |
| Preserve JSON compatibility. | `hadara.docs.patchPlan.v1` fixture contract. | Add only an issue code on write failure; no schema id change. |
| Refresh `dist` after CLI source changes. | AGENTS/SOP. | Docker sync-build passed and refreshed workspace `dist`. |
