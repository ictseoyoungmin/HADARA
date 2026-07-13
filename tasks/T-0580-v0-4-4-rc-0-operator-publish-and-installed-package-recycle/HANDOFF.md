# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| npm `hadara@0.4.4-rc.0` is published on `next`; `latest` remains `0.4.3`. | `ev:T-0580:27a8f81a98ab49b28f8c87d2` |
| GitHub Release `v0.4.4-rc.0` is public prerelease after correcting the initial `isPrerelease=false` metadata. | `ev:T-0580:82f354a6e17a4fe08b737138` |
| Installed-package recycle for `hadara@next` expected `0.4.4-rc.0` passed from consumer paths. | `ev:T-0580:aab1eee8f7b449148907312c` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Observe RC or proceed to a stable `0.4.4` decision capsule when ready. | RC publication and installed-package recycle are complete; stable promotion should be a separate decision/prep capsule. | `docs/RELEASE_READINESS.md`, `docs/RELEASE_NOTES.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The GitHub Release was initially published as a normal release, not a prerelease. | RC could be misread as stable on GitHub if left unchanged. | Corrected with `gh release edit v0.4.4-rc.0 --prerelease=true`; verification now returns `isPrerelease=true`. |
| Stable npm `latest` remains `0.4.3`. | Users installing the stable path will not receive `0.4.4-rc.0`. | This is intentional for RC; use `hadara@next` for candidate recycle or dogfood. |
