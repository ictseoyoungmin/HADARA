# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and T-04A1 boundary. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next recommended step. | Read |
| docs/TASK_BOARD.md | Task queue and new capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and current Required Reading registry. | Read |
| `.hadara/docs-registry.json` | Canonical docs registry metadata. | Read |
| `docs/DOC_REGISTRY.md` | Human projection of docs registry metadata. | Read |
| `docs/specs/0.4.0/productization-redesign/manifest.json` | Canonical 0.4 document list. | Read |
| `docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md` | T-04A1 scope and next implementation sequence. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-04A1 should be represented by actual capsule T-0427 because current `task create` only supports numeric `T-XXXX` ids. | Current CLI implementation. | Trying to force a nonnumeric id would bypass established task lifecycle tooling. |
| The new 0.4 `docs register` surface is not implemented yet. | 0.4 plan assigns it to T-04A4. | Registration must use current 0.3 registry files for this capsule. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep 0.4 specs conditional, not every-session default reading. | T-0424/T-0426 design. | Register all manifest docs, but route default work through README and worker plan only. |
| Do not include release-line work in this capsule. | Accepted 24-capsule budget. | Release readiness/publish/recycle remain outside the implementation line. |
