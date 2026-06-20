# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Compact read-routing and operating rules. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close sequencing and close-source rules. | Read |
| docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md | C3 context pack contract. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Dogfooding should exercise the public C3 -> C4 path directly. | User request to try another implemented scenario. | Missing narrow defects in command composition. |
| A single graph source line is not a meaningful raw slice range by itself. | `context slice --task --candidate` returned only `# AGENT_HANDOFF`. | Over-broad fallback windows could pull too much source, so keep it bounded. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read commands must not write cache or source state. | 0.3.3 context-routing contract. | This change only alters report metadata and tests. |
| Raw slices remain bounded and source-addressed. | C4 context slice contract. | Candidate ranges use a bounded 80-line window when no true range exists. |
| Real metadata ranges must be preserved. | Context graph/source fidelity. | The helper only falls back when end line is absent or not greater than start. |
