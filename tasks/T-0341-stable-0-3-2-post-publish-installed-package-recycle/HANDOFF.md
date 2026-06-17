# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0341 |
| TaskStatus | Done |
| Last Updated | 2026-06-17 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0341 capsule created and scoped to stable `0.3.2` installed-package recycle. | TASK / PLAN |
| Stable `hadara@0.3.2` installed-package recycle passed from temp-prefix installed bin. | `ev:T-0341:3208efa9002b47cc8ea68363` |
| Registry/dist-tags, governed init, Evidence v2 exact resolution, minimal lifecycle, and temp cleanup all passed. | `ev:T-0341:3208efa9002b47cc8ea68363` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Select the next roadmap/handoff item after stable `0.3.2` line closure. | Stable publish and post-publish installed-package recycle are complete. | `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/DEVELOPMENT_SLICES.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Exact `npx` can resolve stale local/global shims in this workspace. | Do not use it as primary package proof. | Use temp-prefix installed bin. |
| Installed `version --json` exposes dist freshness as `build.distLooksStale:false`, not root `distLooksStale`. | Consumers expecting the shorthand root field should read the current schema path. | Treat current `hadara.runtime.version.v1` shape as authoritative unless a future compatibility capsule changes it. |
