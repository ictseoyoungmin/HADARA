# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and Docker workflow reminder. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation workflow. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and T-0156 placement. | Read |
| docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md | T-0156 planned goal and acceptance. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0156 is read-only guidance, not write execution. | Phase 2 plan excludes automatic full profile merge. | Accidentally mutating docs in `protocol doctor` would violate doctor semantics. |
| Basic-to-governed drift means generated docs indicate a higher target profile than explicit metadata/Required Reading. | Phase 2 plan acceptance. | Remediation hints would be too generic to be useful. |
| Docker built CLI must be refreshed after code changes. | Project handoff and SOP. | Local source may pass while `/workspace/dist` smokes run stale code. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Use `hadara-dev` Docker workflow for validation. | AGENTS/SOP | Host dependencies are not the source of truth. |
| Keep remediation mode manual in this capsule. | Phase 2 plan | Safe-auto command is T-0157. |
| Preserve the existing protocol JSON schema version. | Existing CLI contract | Additive fields only through existing `remediations` array. |
