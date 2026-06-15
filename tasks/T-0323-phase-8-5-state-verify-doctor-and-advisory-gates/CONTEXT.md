# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA protocol rules and required reading. | Read |
| .hadara/context/HADARA_CONTEXT.md | Current-state routing anchor. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit workflow. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 8 ordering. | Read |
| docs/specs/0.3.1/rc1/05_State_Verify_Doctor_and_CI_Integration.md | Primary implementation spec. | Read |
| docs/specs/0.3.1/rc1/04_State_Consistency_Projection_Read_Model.md | Projection source contract from T-0322. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| State projection drift should be visible but not promoted to strict blockers in rc1. | Phase 8.5 spec. | Strict CI semantics could become too noisy during rollout. |
| `hadara.stateProjection.v1` can be reused for `state verify` instead of inventing a second report schema. | T-0322 implementation. | If consumers need separate verify metadata later, add an additive wrapper in a future capsule. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| All new surfaces must be read-only. | Phase 8.5 spec. | No hidden writes or automatic repair. |
| CI integration must remain advisory for state drift. | Phase 8.5 spec. | `ci gate --mode strict` does not block on state projection warnings. |
| CLI code changes require Docker build/full validation and workspace `dist` refresh. | AGENTS.md. | Use `npm run dev:docker-sync-build`. |
