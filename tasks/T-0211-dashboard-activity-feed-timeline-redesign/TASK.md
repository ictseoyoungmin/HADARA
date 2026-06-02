# T-0211 Dashboard Activity Feed Timeline Redesign

## Metadata

| Field | Value |
|---|---|
| ID | T-0211 |
| Title | Dashboard Activity Feed Timeline Redesign |
| Status | Done |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Turn the deterministic timeline read model into a scannable narrative activity feed with severity color, relative time, and semantic evidence identity where available. | Phase 5.6 UI/UX reset; consumes existing read models, adds no backend authority. |

## Scope

| In Scope | Reason |
|---|---|
| ActivityFeed renders timeline events as a narrative list. | Icon + title + relative time + severity (P2). |
| Surface semantic evidence identity when available. | Falls back to display id only when absent. |
| Read-only; no private raw paths. | Consumes hadara.dashboard.timeline.v1. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Timeline read-model/schema changes. | Hardened already in T-0200; this is presentation only. |
| Streaming/polling for the feed. | Out of scope; optional polling stays memory-only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-06-02 | Partial | Implementation and Docker validation complete; finish/close deferred pending reviewer sign-off. | npm ci && build && vitest passed (84 files / 562 tests); dashboard visual/a11y gate passed. |
