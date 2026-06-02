# T-0212 Dashboard Proof Verdict and Evidence Lens Redesign

## Metadata

| Field | Value |
|---|---|
| ID | T-0212 |
| Title | Dashboard Proof Verdict and Evidence Lens Redesign |
| Status | Done |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Replace the parser-row property tree with a verdict-first proof card and a compact evidence list, consuming the task-detail proof summary without raw evidence parsing. | Phase 5.6 UI/UX reset; consumes existing read models, adds no backend authority. |

## Scope

| In Scope | Reason |
|---|---|
| ProofVerdict card: single tone-colored verdict word + supporting counts + drill. | Replaces key/value parser rows (P1/P3). |
| Compact EvidenceList from sanitized records. | Strength/visibility tags; no raw paths. |
| Private-only remains an auditability warning, not a blocker. | From task_detail proof summary. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Proof derivation logic. | Backend-derived in task_detail; UI displays only. |
| Raw evidence parsing in the frontend. | Forbidden; uses semantic summary. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-06-02 | Partial | Implementation and Docker validation complete; finish/close deferred pending reviewer sign-off. | npm ci && build && vitest passed (84 files / 562 tests); dashboard visual/a11y gate passed. |
