# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Pending |
| docs/AGENT_HANDOFF.md | Current handoff. | Pending |
| docs/TASK_BOARD.md | Task queue and status. | Pending |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Pending |
| docs/TASK_WORKFLOW_COMMANDS.md | Finalize-first lifecycle and close-source timing. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0418 remains the release capsule. | Release helper preflight requires the task capsule title/path to match the package version. | Running publish with a hotfix task id fails preflight. |
| The failing publish attempt was blocked before npm publish mutation. | Operator log showed clean-checkout smoke failed during validation. | Misclassifying this as npm auth/publish failure would send the fix to the wrong layer. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Hotfix must not change release mutation policy. | AGENTS.md / release workflow. | Only validation and dashboard read path hardening are in scope. |
| Dashboard request handlers should stay on fast projection paths. | T-0419/T-0420 release-validation findings. | Full operational-debt scans remain diagnostic CLI/MCP surfaces, not hot dashboard routes. |
