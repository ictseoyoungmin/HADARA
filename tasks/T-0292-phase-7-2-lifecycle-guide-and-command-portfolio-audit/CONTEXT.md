# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next Phase 7.2 pointer. | Read |
| docs/TASK_BOARD.md | Task queue and T-0292 capsule row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Primary lifecycle source to align. | Read |
| docs/COMMAND_SURFACE.md | T-0291 command registry vocabulary. | Read |
| docs/specs/0.3.0/03_Phase_7_2_Lifecycle_Guide_and_Command_Portfolio_Audit.md | Phase-specific requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Phase 7.2 should use `src/services/capability-registry.ts` as the registry source. | T-0291 implementation; Phase 7.2 spec input name is stale. | Low: T-0291 explicitly made this file authoritative. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not remove, rename, or warn on compatibility commands in this slice. | Phase 7.2 Non-Goals | Keep decisions documentary/projection-only. |
| Keep release/dev/UI/integration commands hidden from primary lifecycle help. | Phase 7.2 AC-7.2-5 | They remain discoverable through family help and commands JSON. |
