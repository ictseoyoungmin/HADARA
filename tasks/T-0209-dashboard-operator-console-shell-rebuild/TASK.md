# T-0209 Dashboard Operator Console Shell Rebuild

## Metadata

| Field | Value |
|---|---|
| ID | T-0209 |
| Title | Dashboard Operator Console Shell Rebuild |
| Status | Partial |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Rebuild the console shell: one health verdict + one ambient provenance badge, an in-page sidebar, a responsive grid, and instant skeleton paint — replacing the two stacked diagnostic chip strips. | Phase 5.6 UI/UX reset; consumes existing read models, adds no backend authority. |

## Scope

| In Scope | Reason |
|---|---|
| Header with a single HealthVerdict and a single ProvenanceBadge. | Replaces both source-chip strips (P1/P4). |
| Sidebar in-page view switching and responsive grid. | No navigation/reload, no browser persistence. |
| Instant shell paint with skeletons; bootstrap-first data layer with fallback chain. | Preserves Phase 5.5 progressive loading. |
| Read-only data layer normalizing bootstrap/status/fixture/inline. | dashboard/src/model.ts. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Focal/active-next, feed, proof, metrics specifics. | T-0210–T-0213. |
| Backend changes. | UI layer only. |

## Status

Partial

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-06-02 | Partial | Implementation and Docker validation complete; finish/close deferred pending reviewer sign-off. | npm ci && build && vitest passed (84 files / 562 tests); dashboard visual/a11y gate passed. |
