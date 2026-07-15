# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `npm run dev:docker-sync-build` now uses the minimal build copy path and completed in the mounted workspace with visible stage timings and `distLooksStale:false`. | `ev:T-0619:f8f71a4c21ac4bb889bd2185` |
| `dev:docker-check` remains the full validation path; broad copy cannot exclude archive/history/task artifacts without breaking existing tests. | `ev:T-0619:16c1b0ca801940cd9d22d185` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Use `npm run dev:docker-sync-build` before 0.4.6-rc.1 source/package smoke. | It now refreshes `dist` quickly enough for normal development and prints progress. | `docs/HADARA_WORKFLOW.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Full `npm run dev:docker-check` remains heavy on mounted workspaces. | It still copies the full repository because existing tests rely on archive/history/task artifact files. | Use it for release-grade validation when time permits; use sync-build for routine dist freshness. |
