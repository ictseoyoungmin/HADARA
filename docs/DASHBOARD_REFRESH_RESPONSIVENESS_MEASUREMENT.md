# Dashboard Refresh Responsiveness Measurement

Use this check when dashboard manual refresh feels slow or when a projection refresh change touches task-signals, timeline, debt, or core rebuild paths.

## Command

Build the workspace CLI first, then run:

```bash
node scripts/dashboard-refresh-responsiveness.mjs --project /workspace --samples 20 --compare-tmp --json
```

For the local Windows-mounted workspace, use the mounted project path:

```bash
node scripts/dashboard-refresh-responsiveness.mjs --project /mnt/f/NowWorking/HADARA-dev --samples 20 --compare-tmp --json
```

The script calls the built dashboard route handler directly, triggers `/api/dashboard/refresh`, repeatedly reads `/api/dashboard/core` while refresh is active, and then reports:

| Field | Meaning |
|---|---|
| `coreDuringRefresh.p50Ms` / `p95Ms` | Core route responsiveness while refresh is still active. |
| `taskSignals.samples` | Observed task-signals batch progress during refresh. |
| `taskSignals.processedIncreased` | Whether batch progress moved forward across samples when enough samples were captured. |
| `stages.durations` | Completed refresh stages with `startedAt`, `finishedAt`, `durationMs`, `processed`, `total`, and `lastYieldAt`. |
| `stages.slowStageWarnings` | Stages exceeding the in-code slow-stage warning threshold. |
| `observationGapsMs` | Gaps between measurement loop observations; large gaps can indicate event-loop blocking. |
| `tmp-ext4` measurement | Optional comparison after copying `docs/` and `tasks/` to `/tmp`. |

## Interpretation

| Observation | Likely Cause | Next Action |
|---|---|---|
| `coreDuringRefresh.p95Ms` is high and no single refresh stage is high. | Core route/projection read path is heavy. | Inspect `/api/dashboard/core` projection read/write path. |
| `coreDuringRefresh.p95Ms` is low but UI still feels blocked. | Served HTML may be stale, frontend may be awaiting refresh completion, or browser rendering is the bottleneck. | Restart dashboard server and run visual/performance checks. |
| `taskSignals.processedIncreased` is false with multiple task-signals samples. | Task projection batching regressed or progress is not emitted per batch. | Inspect `refreshDashboardTaskProjectionIndexAsync`. |
| `stages.durations` shows high `task-signals`. | Task projection scan/read cost dominates. | Consider T-0228 streaming directory scan with `fsp.opendir()`. |
| `stages.durations` shows high `timeline`, `debt`, or `core-final`. | Heavy projection stage has internal synchronous work. | Split that stage or add stage-local batching/yield. |
| `/tmp` is much faster than `/mnt/f`. | Windows-mounted filesystem overhead dominates. | Tune batch sizes and avoid repeated metadata scans on `/mnt/f`. |

This is an operational measurement, not a hard release gate. Record the JSON summary in the active Task Capsule evidence when it informs a dashboard performance decision.
