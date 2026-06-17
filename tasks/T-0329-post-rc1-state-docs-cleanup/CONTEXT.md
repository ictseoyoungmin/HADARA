# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Current-state read routing and HADARA-dev operating constraints. | Read |
| docs/PROJECT_STATE.md | Current project state and completed rc1 publish/recycle line. | Read |
| docs/AGENT_HANDOFF.md | Current handoff, stale Last 3 target, and next-task state. | Read |
| docs/TASK_BOARD.md | Task queue and T-0329 capsule registration. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules, capsule requirement, and documentation timing. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit command semantics and write boundaries. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and need to append the cleanup slice on completion. | Read |
| docs/RELEASE_READINESS.md | Confirms T-0328 release readiness state is already current. | Read |
| docs/RELEASE_NOTES.md | Contains the pre-completion `0.3.1-rc.1` boundary wording to update. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0328 post-publish recycle is complete and release readiness already reflects it. | `docs/RELEASE_READINESS.md` current release-candidate line status. | If wrong, release notes could overstate completion. |
| This cleanup should not change runtime behavior or release artifacts. | Reviewer request targets state-doc wording only. | Runtime validation would be unnecessarily broad for the change. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep work inside T-0329. | HADARA SOP. | No unrelated source/runtime edits. |
| Do not hand-edit `evidence.jsonl`. | AGENTS/HADARA protocol. | Use `hadara evidence add-command`. |
| Update shared state docs before close. | Task workflow commands. | Close-source edits after close would require rerun. |
