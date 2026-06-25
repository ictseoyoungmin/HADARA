# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Compact current-state entry point. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/RELEASE_READINESS.md | Release target/readiness source. | Read |
| docs/RELEASE_NOTES.md | Package-facing changelog source. | Read |
| README.md | npm package-facing install/status source. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `0.3.4-rc.0` should remain source/readiness only in this capsule. | Release workflow policy and T-0401/T-0405 pattern. | Accidental publish mutation would violate HADARA release boundaries. |
| Stable install guidance must remain `hadara@0.3.3` until publish completes. | npm README package-facing behavior. | Users may try to install an unpublished candidate. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Publish, GitHub Release, Docker/PyPI publish, installer execution, and token loading are out of scope. | Release readiness boundary. | Use dry-run/readiness commands only. |
| Prefer Docker validation for HADARA-dev CLI development and refresh `dist` after code/package metadata changes. | AGENTS.md. | Built CLI/package smokes must use current dist. |
