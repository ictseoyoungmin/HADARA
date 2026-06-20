# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Required current-state routing anchor. | Read |
| `docs/PROJECT_STATE.md` | Current lifecycle line state. | Read |
| `docs/AGENT_HANDOFF.md` | T-0395 next-work guidance and validation baseline. | Read |
| `docs/TASK_BOARD.md` | Task status source updated by finish. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Docker/evidence/lifecycle workflow rules. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Canonical finish/ready/close/audit semantics. | Read |
| `docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md` | Defines T-0395 guidance dedup acceptance. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Close dry-run already embeds current done validation, evidence lint, and protocol doctor results. | `createTaskCloseReport()` implementation. | If false, removing validation/lint next actions would hide needed checks. |
| Agents benefit more from one primary command than from repeated validation commands after checks pass. | Lifecycle convenience spec and dogfooding. | If wrong, users may prefer explicit repeated diagnostics. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not remove or skip close preconditions. | HADARA proof model. | This only changes guidance after checks are already evaluated. |
| Preserve blocked-task guidance. | Task workflow command semantics. | `run-done-validation`, `run-evidence-lint`, and `resolve-close-blockers` remain for failed close plans. |
| Validate through Docker and refreshed `dist`. | HADARA-dev workflow. | Full sync-build passed. |
