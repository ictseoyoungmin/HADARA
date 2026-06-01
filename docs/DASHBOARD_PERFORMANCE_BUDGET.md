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

## Debug Surface

Dashboard debug helpers must be read-only. They may expose current source/cache/load metadata for inspection, but must not execute commands, mutate task capsules, write evidence, write handoff files, call providers, or persist project state in browser storage.
