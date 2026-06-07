# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/RELEASE_READINESS.md | npm release metadata and approval boundaries. | Read |
| docs/RELEASE_NOTES.md | User-facing release history. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara@0.2.0-rc.1` is already published on npm. | T-0275 evidence and current docs. | rc.2 must use a new immutable npm version. |
| Python bridge publish state remains `hadara==0.2.0rc1`. | T-0278/PyPI current-state docs. | Updating Python in this npm-only capsule could imply an unrequested PyPI publish. |
| The final manual publish helper requires a clean git worktree. | `scripts/release/manual-publish-rc.sh` and release artifact dirty-worktree guard. | The operator must commit this readiness state before running `--execute`. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not publish to npm from this preparation session. | User asked to prepare for their npm login and helper execute. | Final publish remains operator-confirmed. |
| Do not create GitHub Release, push tags, build/publish Docker images, or publish PyPI packages. | Release boundary docs. | Only prepare optional note and docs. |
| Use Docker as validation/build baseline. | AGENTS and handoff note host Node dependencies are absent. | Host `npm run check` is not the reliable baseline. |
