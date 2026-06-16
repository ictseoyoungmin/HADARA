# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0326 |
| TaskStatus | Done |
| Last Updated | 2026-06-16 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0326 release-readiness preparation is complete. | Package metadata is `0.3.1-rc.1`; Docker sync-build, release artifact, package smoke, clean-checkout smoke, strict gate, release dry-run, publish dry-run, and `git diff --check` passed with T-0326 evidence. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start T-0327 approval-gated publish after T-0326 close/audit. | T-0326 deliberately performed no publish mutation; the operator can authenticate npm and run the T-0327 helper path. | `tasks/T-0327-0-3-1-rc-1-approval-gated-publish/TASK.md`, `scripts/release/manual-publish-rc.sh`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Package smoke first failed inside the sandbox. | npm attempted to write cache under the read-only home directory and returned `EROFS`. | The same command passed on approved escalated rerun; keep npm package tooling outside read-only sandbox when needed. |
| Actual publish is not part of T-0326. | Operators should not run `--execute` publish from this capsule. | Use T-0327 after T-0326 closes; T-0328 handles installed-package recycle. |
