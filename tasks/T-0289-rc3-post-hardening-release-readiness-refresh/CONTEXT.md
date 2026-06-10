# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Protocol entry point and rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle and release command semantics. | Read |
| scripts/release/manual-publish-rc.sh | Exact publish flow, gates, and preconditions. | Read |
| docs/AGENT_HANDOFF.md | Post-T-0288 state and the rc3 review's release-readiness blocker. | Read |
| tasks/T-0287-.../ | Prior rc3 readiness approach for parity. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The Docker `hadara-dev` container reproduces the operator's working npm/build environment. | dev-docker-sync-build workflow | If the operator's environment differs, `npm run check` in the publish helper could behave differently. |
| package smoke / clean-checkout in Docker are representative of the helper's runtime smokes. | manual-publish-rc.sh runs the same commands | If host vs container differ, the helper re-runs them anyway and will surface any difference before publish. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No registry mutation in this capsule. | Operator-gated publish | Publish is the operator running the helper with `--execute`. |
| Host `/mnt/f` build is unreliable; use Docker. | AGENT_HANDOFF known problems | Smokes were run in the `hadara-dev` container, not on the host. |
| `release artifact --execute` needs a clean worktree. | release artifact dirty-worktree guard | Not run here; the helper runs it after the operator commits. |
