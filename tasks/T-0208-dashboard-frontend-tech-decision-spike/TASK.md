# T-0208 Dashboard Frontend Tech Decision Spike

## Metadata

| Field | Value |
|---|---|
| ID | T-0208 |
| Title | Dashboard Frontend Tech Decision Spike |
| Status | Partial |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Resolve approach A (hand-refactored vanilla) vs B (Preact single self-contained bundle), record the decision, and prove the chosen path serves under the existing CSP with no external resources. | Phase 5.6 UI/UX reset; consumes existing read models, adds no backend authority. |

## Scope

| In Scope | Reason |
|---|---|
| Evaluate A vs B against the commercial-grade bar and the governance boundaries. | B was selected by the owner. |
| Set up the esbuild + Preact build to a single inlined index.html. | dashboard/build.mjs + template. |
| CSP / self-only / no-CDN guard. | Build fails on any external resource reference. |
| Record the decision. | docs/DECISIONS.md D-0011. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Full component rebuild. | T-0209–T-0213. |
| Backend/read-model changes. | UI layer only. |

## Status

Partial

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-06-02 | Partial | Implementation and Docker validation complete; finish/close deferred pending reviewer sign-off. | npm ci && build && vitest passed (84 files / 562 tests); dashboard visual/a11y gate passed. |
