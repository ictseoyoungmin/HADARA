# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| npm registry verification for `hadara@0.4.2-rc.0` | `ev:T-0540:7332a4b680584955b8bdad4a` |
| GitHub Release `v0.4.2-rc.0` public prerelease verification from operator output | `ev:T-0540:9b8f98569d7f4c13acb08bb0` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open installed-package recycle for `hadara@next` expected `0.4.2-rc.0`. | npm/GitHub publication is complete; the remaining RC check is consumer-path verification from the published package. | `docs/RELEASE_READINESS.md`; `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Publish-helper evidence `ev:T-0539:818caf27a85f4c9299830988` was created in the clean publish clone and reported by the operator, not appended in this workspace's T-0539 after close. | Avoid editing T-0539 close-source docs after close just to copy publish evidence. | T-0540 records the post-publish outcome and cites the operator-provided helper output. |
| Installed-package recycle has not yet run for `0.4.2-rc.0`. | RC publication is visible, but consumer install behavior is not yet rechecked from npm. | Use a follow-up capsule and `hadara package recycle --execute --package hadara@next --expected-version 0.4.2-rc.0 --attach-evidence --json`. |
