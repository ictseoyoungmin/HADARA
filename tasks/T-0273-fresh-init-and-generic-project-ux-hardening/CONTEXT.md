# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Pending |
| docs/AGENT_HANDOFF.md | Current handoff. | Pending |
| docs/TASK_BOARD.md | Task queue and status. | Pending |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Pending |
| docs/TASK_WORKFLOW_COMMANDS.md | Capsule lifecycle and close order. | Read |
| tasks/T-0271-npm-installed-toy-project-interface-recycle/FINDINGS.md | Source findings for this hardening group. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Fresh scaffold should be warning-clean for generated docs. | T-0271 installed-package recycle. | New users may distrust the scaffold if doctor warns immediately. |
| `handoff update` is an existing write command, not a dry-run suggestion. | `src/handoff/handoff.ts`. | JSON output must not imply review-only semantics. |
| Table-first docs are the current scaffold format. | Generated `docs/PROJECT_STATE.md`. | Read models must parse tables before prose fallback. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve existing text output compatibility. | README and current CLI usage. | JSON mode is additive. |
| Avoid project-specific HADARA-dev roadmap assumptions in generic generated reports. | T-0271 finding. | Suggestions should use Task Board and handoff wording. |
