# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and Phase 6.1 next work. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation requirements. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle command semantics and close/audit loop. | Read |
| docs/specs/agent-ux/HADARA_Phase6_1_Reviewer_Feedback_Hardening_Spec.md | T-0264 scope and acceptance. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Same-hash duplicate prevention can be handled by re-reading `evidence.jsonl` immediately before append. | Existing close evidence idempotency model from T-0256. | If append itself is not atomic enough on a filesystem, an advisory lock may still be needed later. |
| Existing changed-proof supersedes behavior should remain plan-derived but refreshed during execute. | Phase 6.1 T-0264 scope. | If supersedes is not recomputed at execute time, stale plans could supersede the wrong latest proof. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No global lock service. | T-0264 out of scope. | Keep this as local execute recheck only. |
| No hidden lifecycle command execution. | Task workflow command semantics. | `task close --execute` may append close evidence only. |
| Preserve close/audit schema compatibility additively. | CLI JSON contract. | New execute recheck metadata is optional and additive. |
