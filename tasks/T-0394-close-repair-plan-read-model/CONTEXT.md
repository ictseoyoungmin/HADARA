# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current-state routing anchor required by AGENTS. | Read |
| `docs/PROJECT_STATE.md` | Current lifecycle/context-routing state and latest completed task. | Read |
| `docs/AGENT_HANDOFF.md` | Active T-0394 handoff and validation baseline. | Read |
| `docs/TASK_BOARD.md` | Task queue/status source updated by lifecycle commands. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Evidence, Docker validation, finish/ready/close rules. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Canonical lifecycle command semantics and read/write boundaries. | Read |
| `docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md` | Defines T-0394 close repair plan surface and non-goals. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Close repair plan should compose existing close/audit read models rather than implement a separate proof parser. | Lifecycle spec and existing command boundaries. | Divergent parsing could classify stale/invalid evidence differently from `task close` and `task audit-close`. |
| The command is read-only and may report exact commands but must not run them. | Lifecycle spec non-goals. | Hidden writes would weaken HADARA's proof model. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve finish/ready/close/audit as canonical proof boundaries. | Lifecycle spec, task workflow docs. | `close-repair-plan` only classifies and suggests next actions. |
| Validation must use Docker and refreshed `dist`. | AGENTS/HADARA-dev workflow. | Full sync-build passed and refreshed `dist`. |
| Do not edit close-source docs after close without rerunning ready/close/audit. | Task workflow docs. | Shared/capsule docs are updated before close. |
