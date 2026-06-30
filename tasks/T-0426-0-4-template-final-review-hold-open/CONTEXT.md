# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Compact project-local context anchor. | Read |
| `docs/PROJECT_STATE.md` | Current state and pending 0.4 registration boundary. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and T-0425 baseline. | Read |
| `docs/TASK_BOARD.md` | Task queue and capsule path. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow rules. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Lifecycle/finalize semantics. | Read previously in this review line |
| `docs/specs/0.4.0/productization-redesign/` | Target 0.4 spec/template package. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The reviewer feedback is useful where it closes ambiguous agent behavior: read authority, lifecycle entry gates, evidence truthfulness, finalize dry-run review, and common failure modes. | Operator-provided review. | Leaving these implicit allows agents to over-read, under-author, or fabricate evidence. |
| `Scope`/`Out of Scope` can be removed from the compact 0.4 task template if Acceptance and Goal carry the task boundary. | Operator instruction. | Specs/workflow references must be updated consistently. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Operator accepted T-0426 closure on 2026-06-30. | Latest operator instruction. | Run reviewed `task finalize` flow and then move to T-04A1 registration. |
| Keep product defaults generic. | T-0424/T-0425 boundary. | No HADARA-dev-specific defaults. |
| Do not register specs yet. | T-04A1 boundary. | Registration remains deferred. |
