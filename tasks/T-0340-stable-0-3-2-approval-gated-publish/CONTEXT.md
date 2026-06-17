# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle command rules for finish/ready/close. | Read |
| docs/RELEASE_READINESS.md | Stable source/readiness state and publish boundary. | Read |
| docs/RELEASE_NOTES.md | Release note target for stable `0.3.2`. | Read |
| scripts/release/manual-publish-rc.sh | Approval-gated helper behavior and default npm tag selection. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The existing manual publish helper can be reused for stable `0.3.2` because it defaults to `latest` for non-rc package versions. | `scripts/release/manual-publish-rc.sh` `default_npm_tag_for_version` | Stable publish could be tagged incorrectly if `--npm-tag` or package version is wrong; verify helper output and npm dist-tags before/after execute. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Publish mutation requires explicit operator approval/authentication. | T-0340 TASK and release readiness policy. | Run dry-runs first; do not execute npm publish from generic "continue" instructions. |
| GitHub Release, Docker, PyPI, installer, and MCP release mutations are out of scope. | T-0340 TASK. | Keep helper invocation npm-only unless separately requested. |
