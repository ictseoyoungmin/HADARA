# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit loop. | Read |
| docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md | Migration requirements and non-goals. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Per-task preview is the right first migration surface. | Evidence v2 plan. | Repository-wide migration could hide expensive scans and broad write risk. |
| Preview output should be deterministic. | Operator review and future hash-guarded execute. | Non-deterministic planned ids would make dry-run/execute parity hard to review. |
| Execute mode should be unavailable until hash guards exist. | Evidence v2 plan. | A write path without drift checks could corrupt active capsules. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No writes to existing evidence files. | User scope and migration plan. | `evidence.jsonl` content is unchanged by preview. |
| No `EVIDENCE.md` rewrite. | Migration plan. | Human frame work remains separate. |
| Docker is the validation baseline. | Implementation SOP. | Host dependency state is ignored. |
