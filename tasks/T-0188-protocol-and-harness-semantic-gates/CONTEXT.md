# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA protocol and required reading. | Read |
| docs/PROJECT_STATE.md | Current Phase 4 evidence state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and capsule path. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit loop. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 4 slice order. | Read |
| docs/TEST_STRATEGY.md | Semantic evidence validation matrix. | Read |
| tasks/T-0187-evidence-lint-semantic-integration/HANDOFF.md | Previous slice handoff. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Protocol doctor can surface semantic issues through the existing evidence lint bridge. | T-0187 implementation | Duplicate protocol-only semantics would drift from lint. |
| Harness done-level validation should block weak/failed/blocked semantic errors but only warn on private-only proof. | docs/TEST_STRATEGY.md | Over-blocking private-only evidence could disrupt first rollout. |
| Docs-scope historical deep scan remains out of scope. | docs/DEVELOPMENT_SLICES.md | Broad historical warnings could block unrelated work. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Reuse the shared semantic analyzer path. | Phase 4 plan | Harness uses evidence lint semantic issues rather than reimplementing rules. |
| Do not change evidence writers or persisted formats. | Phase 4 scope | Writer/migration remains T-0190. |
| Docker validation is source of truth. | docs/AGENT_HANDOFF.md | Host dependencies are unavailable. |
