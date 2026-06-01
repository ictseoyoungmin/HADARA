# T-0205 Dashboard Playwright Performance Measurement

## Metadata

| Field | Value |
|---|---|
| ID | T-0205 |
| Title | Dashboard Playwright Performance Measurement |
| Status | Done |
| Created | 2026-06-01 |
| Updated | 2026-06-01 |

## Goal

| Goal | Notes |
|---|---|
| Measure dashboard loading and aggregate route timings in the Playwright Docker environment. | Produce a repeatable script and a committed advisory measurement report for shell, bootstrap, task-detail, and timeline reads across bypass/cache paths. |

## Scope

| In Scope | Reason |
|---|---|
| Playwright Docker measurement script. | Allows future operators to rerun route timing observations without adding brittle unit thresholds. |
| Advisory measurement report. | Answers how long dashboard loading and aggregate reads took in a controlled Docker filesystem copy. |
| Evidence and handoff updates. | Records the observation without treating it as a release gate. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Browser paint, visual screenshot, or Playwright assertion suite. | This capsule measures advisory route/load timings only. |
| Changing dashboard cache or read-model implementation. | Measurement only; no performance tuning in this slice. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01 | Draft | Initial task scaffold. | TBD |
| 2026-06-01 | Done | Playwright Docker measurement completed and documented. | `docs/DASHBOARD_PERFORMANCE_MEASUREMENT.md`; Docker measurement command returned `ok:true` JSON. |
