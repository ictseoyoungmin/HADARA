# T-0210 Dashboard Active Next and Command Affordance

## Metadata

| Field | Value |
|---|---|
| ID | T-0210 |
| Title | Dashboard Active Next and Command Affordance |
| Status | Done |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Make "what is active / what to do next" the dominant focal block, with copy-only command guidance and a designed empty state. | Phase 5.6 UI/UX reset; consumes existing read models, adds no backend authority. |

## Scope

| In Scope | Reason |
|---|---|
| Focal Active/Next card driven by bootstrap (active run or latest work). | The operator's actual job, foregrounded (P2). |
| Copy-only command affordance. | Clipboard copy; the dashboard never executes. |
| Designed empty/idle state. | Calm prompt rather than a flag. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Command execution of any kind. | Forbidden; copy-only. |
| New read models. | Consumes bootstrap only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-06-02 | Partial | Implementation and Docker validation complete; finish/close deferred pending reviewer sign-off. | npm ci && build && vitest passed (84 files / 562 tests); dashboard visual/a11y gate passed. |
