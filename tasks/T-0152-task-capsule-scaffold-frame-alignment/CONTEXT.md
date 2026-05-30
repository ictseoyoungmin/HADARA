# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Repository protocol rules. | Read |
| docs/PROJECT_STATE.md | Current capability and boundary state. | Read |
| docs/AGENT_HANDOFF.md | Latest validation and next-step context. | Read |
| docs/TASK_BOARD.md | Work queue and capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Required HADARA session workflow. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and prerequisite constraints. | Read |
| tasks/T-0151-init-follow-up-hardening/TASK.md | Previous capsule boundary. | Read |
| docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md | Source design for Phase 2 and T-0152. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Phase 2 should begin with Task Capsule scaffold v2 before protocol doctor services. | Phase 2 recommended implementation order. | Later consistency checks would need to support a weaker future default scaffold. |
| Existing capsules should remain valid under draft/done harness checks. | Phase 2 migration rule and HADARA compatibility needs. | Current completed task history could become noisy or invalid. |
| `hadara protocol ...` surfaces remain future work. | Phase 2 task breakdown. | T-0152 could grow too large if doctor/remediation work is included. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No auto-migration of existing capsules. | Phase 2 non-goal. | Only generated scaffold templates change now. |
| Preserve evidence and private/public boundaries. | PROJECT_STATE and SECURITY_MODEL. | Evidence Markdown gains visibility/JSONL columns without exposing private paths. |
| Use Docker validation when host dependencies are missing. | SOP and handoff. | Host `node_modules` is absent in this workspace. |
