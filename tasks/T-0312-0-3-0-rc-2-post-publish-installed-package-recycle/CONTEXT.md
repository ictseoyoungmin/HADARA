# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Current-state entry point and read-routing guide. | Read |
| docs/PROJECT_STATE.md | Current rc.2 project state and publish history. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and T-0312 next-step direction. | Read |
| docs/TASK_BOARD.md | Task queue and newly created T-0312 row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, evidence, and Docker/npm validation guidance. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close loop and command semantics. | Read |
| docs/RELEASE_READINESS.md | Release and package-smoke readiness source. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara@0.3.0-rc.2` is visible on npm and should be validated from the registry package. | T-0310 publish evidence and T-0312 `npm view` check. | Low; registry check confirmed the version. |
| Temp-prefix install is a safer consumer smoke than mutating the operator's global npm prefix. | HADARA release validation practice. | Low; temp-prefix bin executed rc.2. |
| Missing HADARA-dev docs registry artifacts should not be fixed through a broad self-migration execute inside this capsule. | T-0312 self-migration dry-run planned multiple project-wide writes. | Medium; carry forward as a focused follow-up. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| npm registry checks require network access. | T-0312 recycle scope. | Sandbox network failed with `EAI_AGAIN`; approved network execution was used for registry checks. |
| Evidence must not include private npm logs or machine-local debug logs. | AGENTS and SOP rules. | Only reduced command outcomes are recorded. |
| Published-package smokes must call the installed package, not stale global `hadara`. | T-0312 post-publish scope and prior local stale-global finding. | Used `npx hadara@0.3.0-rc.2` and `/tmp/hadara-t0312-install/node_modules/.bin/hadara`. |
