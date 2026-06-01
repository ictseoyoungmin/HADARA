# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA protocol and required reading. | Read |
| docs/PROJECT_STATE.md | Current Phase 4 evidence state. | Read |
| docs/AGENT_HANDOFF.md | Validation and handoff constraints. | Read |
| docs/TASK_BOARD.md | Task queue and current capsule path. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit command loop. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 4 slice order. | Read |
| docs/TEST_STRATEGY.md | Evidence proof semantics validation matrix. | Read |
| docs/SCHEMAS.md | JSON schema registration expectations. | Read |
| docs/specs/evidence/EVIDENCE_PHASE4_REFACTOR_PLAN.md | Ignored local planning detail for Phase 4 semantics. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Evidence lint should stay `hadara.evidence.lint.v1` and add fields only additively. | Phase 4 plan and docs/SCHEMAS.md | Consumers could drift if the schema version changes prematurely. |
| Semantic blockers apply only when the task is Done or effectively Done. | T-0186 semantic analyzer contract | Draft tasks could become noisy if semantic issues are emitted too early. |
| Free-text `resolved`/`fixed`/`rerun passed`/`superseded` must not resolve failed evidence. | Reviewer feedback and docs/TEST_STRATEGY.md | Unsafe Done states could be hidden by vague summaries. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not change persisted evidence writers or `EVIDENCE.md` format. | Phase 4 scope | T-0190 handles writer/migration planning. |
| Do not expose private artifact paths in new lint output. | Security model and T-0186 normalizer design | T-0187 should avoid adding normalized records to public lint output. |
| Docker validation is source of truth. | docs/AGENT_HANDOFF.md | Host `npm` environment is not authoritative. |
