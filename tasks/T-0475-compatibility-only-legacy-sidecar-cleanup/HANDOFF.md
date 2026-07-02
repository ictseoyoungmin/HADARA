# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Compatibility-only sidecar defaults removed from current user-facing surfaces. | Expanded create/write-preflight/TUI/upgrade-scaffold tests passed in `ev:T-0475:0fec147f12bb41c0bd76a38d`; Docker build/dist refresh passed in `ev:T-0475:2f903acccdb647639c859021`; built CLI smoke passed in `ev:T-0475:e93357bbff7d4ea18e287b79`; close audit is current in `EVIDENCE.md`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start the final release-line code preflight hardening capsule. | T-0474 handled dashboard aggregate latency and T-0475 removed current-surface legacy sidecar defaults; the last requested capsule should review remaining release-risk code cleanup before explicit 0.4.0 release work. | `.hadara/context/HADARA_CONTEXT.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Legacy sidecar fixtures remain in tests and historical specs. | They are still needed to prove compatibility with old capsules and should not be mass-deleted. | Keep compatibility fixture cleanup narrow; remove only current generated/user-facing defaults unless a test proves a path is obsolete. |
