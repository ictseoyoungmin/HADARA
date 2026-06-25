# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Compact current-state entry point. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/RELEASE_READINESS.md | Release target and publish boundary source. | Read |
| docs/RELEASE_NOTES.md | Current release notes. | Read |
| tasks/T-0417-0-3-4-rc-readiness-preparation/HANDOFF.md | Immediate predecessor readiness result. | Read |
| scripts/release/manual-publish-rc.sh | Approval-gated publish helper. | Read |
| scripts/release/prepare-publish-env.sh | Ext4 publish environment preparation helper. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0417 readiness remains the source proof for `0.3.4-rc.0`. | T-0417 close audit. | Publish should not proceed if readiness becomes stale. |
| The agent should not run interactive npm publish without operator authentication and confirmation. | Release boundary policy. | Accidental registry mutation would violate approval-gated release rules. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| npm publish requires operator authentication and interactive confirmation. | Release helper and npm registry model. | Prepare commands/evidence, then wait for operator if credentials are absent. |
| GitHub Release draft is not requested for this RC. | User/release plan. | Do not pass `--github-draft`. |
