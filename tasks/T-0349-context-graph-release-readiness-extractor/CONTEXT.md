# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Current-state entry point and read-routing. | Read |
| docs/PROJECT_STATE.md | Current project state and latest completed task. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next recommended C1 step. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation expectations. | Read |
| docs/DEVELOPMENT_SLICES.md | Development slice ordering and status tracking. | Read |
| docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md | C1 graph schema and extractor requirements. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | C1 capsule sequencing guidance. | Read |
| docs/RELEASE_READINESS.md | Canonical release-readiness source for this extractor. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Release readiness can be represented section-by-section from Markdown headings until a structured fixture exists. | `docs/RELEASE_READINESS.md` currently uses heading and bullet structure. | Overly broad parsing could create noisy graph nodes; tests will constrain heading-level extraction. |
| Explicit backtick command mentions are sufficient for first-pass `CHECKS_COMMAND` edges. | Release readiness document names canonical `hadara ...` commands inline. | Free-text command heuristics could mis-link aliases, so matching remains conservative. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read-only extractor only; no release command execution. | AGENTS.md and RELEASE_READINESS release boundary. | Parser reads local docs only. |
| Missing optional source must degrade to graph issues rather than throwing. | Context graph extractor pattern. | Tests cover missing file behavior. |
| Keep implementation aligned with existing context extractor helpers and node ids. | T-0344 through T-0348 context graph foundation. | Reuse `createReleaseCheckNodeId`, `createContextGraphEdgeId`, and source refs. |
