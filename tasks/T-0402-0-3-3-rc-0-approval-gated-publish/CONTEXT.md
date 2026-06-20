# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current-state read routing. | Read |
| docs/PROJECT_STATE.md | Current project state and T-0401 readiness status. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and T-0402 capsule row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and release mutation boundaries. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finalize-first lifecycle and close timing. | Read |
| docs/RELEASE_READINESS.md | Release target/publish boundary source. | Read |
| docs/RELEASE_NOTES.md | Current `0.3.3-rc.0` release notes. | Read |
| tasks/T-0401-0-3-3-rc-0-release-readiness-preparation/* | Immediate readiness evidence and no-publish handoff. | Read |
| tasks/T-0337-0-3-2-rc-0-approval-gated-publish/* | Prior rc publish capsule pattern. | Read |
| tasks/T-0340-stable-0-3-2-approval-gated-publish/* | Stable publish capsule pattern and helper reuse. | Read |
| scripts/release/manual-publish-rc.sh | Approval-gated npm helper behavior. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0401 readiness is sufficient to proceed to an approval-gated rc publish decision. | T-0401 release dry-run ready/blockers 0/warnings 0. | If source changed after T-0401, rerun helper dry-run before publish. |
| Operator will run publish from an npm-authenticated environment. | User stated they will npm login and run the deploy script. | Helper fails at `npm whoami` or should not proceed. |
| Release candidate publish should use npm tag `next`. | `manual-publish-rc.sh` default tag resolver and release readiness policy. | Wrong tag could replace stable `latest`; verify helper output before confirmation. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not run npm publish without explicit operator confirmation. | HADARA release policy and helper prompt. | Helper requires `--execute` plus typing `publish`. |
| Keep GitHub Release draft out of scope unless requested. | T-0402 scope. | Do not pass `--github-draft` by default. |
| Worktree must be clean before helper publish flow. | `manual-publish-rc.sh` preflight. | Commit T-0402 docs before operator executes helper. |
| The helper refreshes release validation before mutation. | `manual-publish-rc.sh`. | It runs `npm run check`, release artifact, package smoke, clean-checkout smoke, release gate, release dry-run, publish dry-run, npm view, and npm publish dry-run. |
