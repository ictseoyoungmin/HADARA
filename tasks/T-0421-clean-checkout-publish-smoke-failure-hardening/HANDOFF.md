# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0421 |
| TaskStatus | In Progress |
| Last Updated | 2026-06-25 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Legacy dashboard `/api/debt` now uses the fast dashboard debt projection instead of full operational-debt scan. | `ev:T-0421:98e0dd670b3c489484bdebfb` |
| Clean-checkout `npm run check` passed after the route fix in the preserved ext4 validation workspace. | `ev:T-0421:88bc742a31814e089efcdb66` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Finalize T-0421, commit it, refresh `/root/hadara-publish` to that commit, then rerun `bash scripts/release/manual-publish-rc.sh T-0418 --execute`. | T-0418 remains the release capsule; this task only unblocks its validation path. | `docs/TASK_WORKFLOW_COMMANDS.md`, `tasks/T-0418-0-3-4-rc-approval-gated-publish/PUBLISH_OPERATOR_STEPS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not run the publish helper with T-0421. | Helper preflight will reject it because T-0421 is not the package-version release capsule. | Use `T-0418` after refreshing the publish clone. |
| `/tmp/hadara` clean-checkout source omits `.hadara/context`, so its built doctor step can fail after `npm run check` passes. | This can look like a release failure but is a dev-copy artifact. | Use the git-backed publish clone for final clean-checkout/release proof. |
