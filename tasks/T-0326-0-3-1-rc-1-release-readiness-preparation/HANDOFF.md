# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0326 |
| TaskStatus | In Progress |
| Last Updated | 2026-06-16 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0326 release-readiness scope is defined. | Capsule docs record version bump, release docs, release evidence, and no-publish boundaries. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Align package/release docs to `0.3.1-rc.1`, then run required readiness validation. | T-0326 is in progress and publish remains out of scope. | `docs/RELEASE_READINESS.md`, `docs/RELEASE_NOTES.md`, `scripts/release/manual-publish-rc.sh`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Release artifact requires a clean worktree. | Source/readiness prep may need an intermediate commit before evidence refresh. | Commit the source candidate checkpoint before running release artifact. |
| Actual publish is not part of T-0326. | Operators should not run `--execute` publish from this capsule. | Use T-0327 after T-0326 closes; T-0328 handles installed-package recycle. |
