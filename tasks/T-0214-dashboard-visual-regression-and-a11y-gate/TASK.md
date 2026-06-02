# T-0214 Dashboard Visual Regression and A11y Gate

## Metadata

| Field | Value |
|---|---|
| ID | T-0214 |
| Title | Dashboard Visual Regression and A11y Gate |
| Status | Partial |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Lock the rebuilt surface with Playwright screenshot baselines and axe-core accessibility checks in Docker, and rewrite the static test to encode the new-design invariants while keeping the governance scans. | Phase 5.6 UI/UX reset; consumes existing read models, adds no backend authority. |

## Scope

| In Scope | Reason |
|---|---|
| Playwright visual + axe-core a11y harness with deterministic API stubs. | home/detail/empty/degraded. |
| Docker runner script. | scripts/dashboard-visual-check.sh. |
| Rewrite dashboard-static.test.ts for the new design. | Keep governance/boundary scans; drop old-design specifics. |
| Committed visual fixtures. | dashboard/visual-fixtures/*.json. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Wall-clock performance gates. | Timing stays advisory (T-0205). |
| Backend changes. | UI layer only. |

## Status

Partial

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-06-02 | Partial | Implementation and Docker validation complete; finish/close deferred pending reviewer sign-off. | npm ci && build && vitest passed (84 files / 562 tests); dashboard visual/a11y gate passed. |
