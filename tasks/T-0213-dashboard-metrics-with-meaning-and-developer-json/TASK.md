# T-0213 Dashboard Metrics With Meaning and Developer JSON

## Metadata

| Field | Value |
|---|---|
| ID | T-0213 |
| Title | Dashboard Metrics With Meaning and Developer JSON |
| Status | Done |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Demote bare counts into context-carrying metrics, move raw JSON behind a read-only disclosure, and remove inspector vocabulary from the primary surface. | Phase 5.6 UI/UX reset; consumes existing read models, adds no backend authority. |

## Scope

| In Scope | Reason |
|---|---|
| MetricStat/MetricsRow with tone and context per number. | Numbers always carry meaning (P3). |
| Read-only DeveloperJSON disclosure (collapsed). | Replaces "Bottom Inspector"/"Inspect JSON". |
| Remove inspector vocabulary from the primary surface. | No parser-row/Bottom Inspector/Inspect JSON. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New metrics data. | Derived from bootstrap counts/debt. |
| Any write/execution affordance. | Copy-only/read-only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-06-02 | Partial | Implementation and Docker validation complete; finish/close deferred pending reviewer sign-off. | npm ci && build && vitest passed (84 files / 562 tests); dashboard visual/a11y gate passed. |
