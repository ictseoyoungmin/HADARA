# Dashboard Performance Budget

This document records advisory performance expectations for the local HADARA Dashboard. These targets guide observation and cleanup work; they are not brittle unit-test thresholds.

## Scope

The dashboard remains a read-only local operator console. Performance work may improve aggregate reads, perceived loading, cache metadata, and degraded refresh behavior. It must not add shell execution, provider calls, MCP writes, task mutation, evidence writes, browser project-state storage, database requirements, file watchers, or default streaming.

## Advisory Targets

| Path | Target | Notes |
|---|---:|---|
| Static shell paint | immediate | The HTML shell should render before live data is available. |
| Uncached bootstrap read | under 500 ms | Observed as evidence, not enforced in unit tests. |
| Cached bootstrap read | under 50 ms | Depends on process-memory TTL cache. |
| Uncached selected task detail | under 800 ms | Includes workbench, evidence lint/list, and timeline aggregation. |
| Cached selected task detail | under 80 ms | Depends on process-memory TTL cache. |
| Refresh failure | no blank screen | Previous successful in-memory view should remain visible when available. |

## Evidence Guidance

Performance evidence should be recorded as public command-log observations when a capsule intentionally measures timings. Prefer container or controlled local runs, include whether the read was cached or bypassed, and record route, task id, cache status, and approximate elapsed time.

Do not commit raw private logs, browser storage snapshots, local cache files, or machine-local traces.

Latest advisory measurement: `docs/DASHBOARD_PERFORMANCE_MEASUREMENT.md`.

## Debug Surface

Dashboard debug helpers must be read-only. They may expose current source/cache/load metadata for inspection, but must not execute commands, mutate task capsules, write evidence, write handoff files, call providers, or persist project state in browser storage.

## Filesystem note (Phase 5.6, 2026-06-02)

The uncached bootstrap read cost is dominated by per-file I/O across all task capsules, so it is highly filesystem-dependent:

| Filesystem | Uncached bootstrap read |
|---|---|
| Native Linux ext4 (Docker `/tmp`) | ~175 ms (T-0205) |
| NTFS via WSL2 (`/mnt/f/...`) | ~17 s after the Phase 5.6 timeline dedup (was ~26 s) |

Guidance:
- For fast first loads, serve the dashboard from a WSL-native (ext4) checkout, not `/mnt/f`.
- The dashboard frontend shows an instant inline offline preview and upgrades to live when the read completes; the client read timeout is generous (30 s) so slow first reads complete rather than aborting into offline.
- After the first read, the process-memory TTL cache keeps navigation/refresh warm; manual Refresh forces a fresh read via `cache=bypass`.
- A read remains read-only; refresh re-reads and never runs checks, and a failed refresh keeps the previous view with no blank screen.
