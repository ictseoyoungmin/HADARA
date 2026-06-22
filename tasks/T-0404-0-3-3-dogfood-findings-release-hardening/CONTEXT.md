# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Project-local read routing. | Read |
| docs/PROJECT_STATE.md | Current 0.3.3 state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and release state. | Read |
| docs/TASK_BOARD.md | Task queue and capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finalize-first lifecycle rules. | Read |
| `artifacts/patternforge/HADARA_DOGFOOD_FINDINGS.md` | Full dogfood finding table. | Read |
| `artifacts/patternforge/HADARA_IMPROVEMENT_FINDINGS.md` | Stable/follow-up classification. | Read |
| `artifacts/patternforge/STABLE_0_3_3_DECISION_INPUT.md` | Release decision input. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| PatternForge findings are representative enough for focused HADARA-dev hardening. | Dogfood decision input | If false, fixes may target the wrong surface. |
| PF-F-012 is in state projection classification, not task status. | Source/test inspection | If false, context pack may still warn after this fix. |
| PF-F-010 is next-action severity classification, not close proof validity. | Source/test inspection | If false, task status may still suggest required post-close edits. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep imported dogfood artifacts inside the Task Capsule. | User request | Do not register them as global required reading. |
| Do not publish stable 0.3.3 in this capsule. | User/requested sequence | Publish needs separate readiness and operator approval. |
