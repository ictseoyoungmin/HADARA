# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and T-0297 publish metadata follow-up. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and known rc.0 metadata problem. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation guidance. | Read |
| docs/DEVELOPMENT_SLICES.md | Release/slice state changes. | Read |
| docs/TEST_STRATEGY.md | Docker-first validation and release checks. | Read |
| docs/ROADMAP.md | Release/packaging boundaries and no publish automation. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The rc.0 metadata gap came from the publish helper using a stale global `hadara` command for artifact staging. | T-0297 post-publish registry/tarball inspection and script order. | If wrong, the new tarball metadata check still blocks publish before mutation. |
| `0.3.0-rc.0` cannot be corrected in-place. | npm immutable package version behavior. | Must publish a new rc.1 to correct metadata. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Publish must remain manual/operator-confirmed. | AGENTS.md and release readiness docs. | This capsule may prepare and dry-run only. |
| Host `/mnt/f` npm install is unreliable; prefer Docker. | `docs/TEST_STRATEGY.md` and handoff known problems. | Use Docker sync-build for validation. |
