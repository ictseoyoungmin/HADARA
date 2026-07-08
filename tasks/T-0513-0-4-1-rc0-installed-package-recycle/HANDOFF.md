# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `hadara@next` installed as `0.4.1-rc.0` and passed installed-package recycle from an isolated consumer workspace. | `ev:T-0513:55abd88e46ce40d88a5942fb`, `ev:T-0513:43a25a83247d4823aad8475a` |
| Stable npm `latest` remains `0.4.0` while `next` points to `0.4.1-rc.0`. | `ev:T-0513:ae53bafd8e564ba597b38975` |
| Package recycle helper no longer calls removed `task lifecycle`; it uses `task status --task <task-id> --json`. | `ev:T-0513:5ee5be16ef224c38a0baa6ca`, `ev:T-0513:e885ae3e849243a2bb065fa9` |
| Earlier failed recycle attempts are resolved: first was npm DNS `EAI_AGAIN`, second exposed the stale helper command. | `ev:T-0513:7a391266ff654f32a823d2b7` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Decide whether to run broader external dogfood or begin stable `0.4.1` planning. | npm publish, GitHub prerelease, and installed-package recycle are complete for `0.4.1-rc.0`. | `docs/AGENT_HANDOFF.md`, `docs/RELEASE_READINESS.md`, T-0513 `TASK.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The published `0.4.1-rc.0` package's own package-recycle helper still contains the old helper behavior. | Running package recycle from the installed `0.4.1-rc.0` CLI itself may still call removed `task lifecycle`; T-0513 fixes source for the next package. | Use the source helper for this post-publish recycle evidence, and include the fix in the next published package. |
