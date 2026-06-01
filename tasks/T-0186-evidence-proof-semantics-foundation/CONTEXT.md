# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and Phase 4 evidence planning boundary. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation path. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 4 capsule order T-0186 through T-0191. | Read |
| docs/TEST_STRATEGY.md | Evidence proof semantics validation scenarios. | Read |
| docs/SCHEMAS.md | Evidence semantics schema posture. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit workflow semantics. | Read |
| docs/specs/evidence/EVIDENCE_PHASE4_REFACTOR_PLAN.md | Local ignored support spec for detailed evidence semantics design. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Existing persisted evidence remains `hadara.evidence.v1` in this slice. | docs/PROJECT_STATE.md, docs/SCHEMAS.md | Avoid adding writer or migration behavior. |
| Phase 4 starts with semantic read-model foundations before Dashboard/TUI binding. | docs/ROADMAP.md, docs/DEVELOPMENT_SLICES.md | Downstream consumers would otherwise parse raw evidence inconsistently. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No evidence writer migration. | docs/SCHEMAS.md | `hadara.evidence.v2` is a future task. |
| No broad historical semantic scan. | docs/AGENT_HANDOFF.md | Avoid breaking legacy completed capsules. |
| Docker validation is authoritative. | docs/IMPLEMENTATION_SOP.md, docs/AGENT_HANDOFF.md | Host dependencies are unreliable. |
