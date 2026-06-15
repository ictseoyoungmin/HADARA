# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Repository protocol rules. | Read |
| .hadara/context/HADARA_CONTEXT.md | Compact current-state routing. | Read |
| docs/PROJECT_STATE.md | Current project state and Phase 8 routing. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next task. | Read |
| docs/TASK_BOARD.md | Task queue and T-0319 row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and generated guidance expectations. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle/status command semantics. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 8.1 slice ordering. | Read |
| docs/specs/0.3.1/00_HADARA_0_3_1_Phase_8_State_Governance_Program.md | Phase 8 program boundary. | Read |
| docs/specs/0.3.1/rc1/00_HADARA_0_3_1_rc1_Status_Governance_Implementation_Plan.md | rc1 capsule sequence. | Read |
| docs/specs/0.3.1/rc1/01_Status_Token_Policy_and_Document_Ownership.md | Primary T-0319 scope. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Phase 8.1 should publish vocabulary and ownership guidance before validators consume it. | Phase 8.1 spec | Later capsules depend on ambiguous tokens if this is incomplete. |
| Runtime validators should remain compatibility-tolerant in this capsule. | rc1 plan | Premature enforcement could break legacy capsules before Phase 8.2/8.4 migration and projection work. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Persistent TaskStatus and derived CloseState must remain separate. | Phase 8 program | `Closed`, `closed-valid`, and pending-close phrases are not persistent TaskStatus values. |
| Do not hand-edit `evidence.jsonl`. | AGENTS | Use canonical evidence writer. |
| Keep generated init guidance aligned when root workflow guidance changes. | Phase 8.1 spec | Update `src/cli/init.ts` and focused init tests if generated docs change. |
