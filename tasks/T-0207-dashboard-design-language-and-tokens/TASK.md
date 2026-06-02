# T-0207 Dashboard Design Language and Tokens

## Metadata

| Field | Value |
|---|---|
| ID | T-0207 |
| Title | Dashboard Design Language and Tokens |
| Status | Partial |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Establish the Phase 5.6 dashboard design language (color roles, type/spacing scales, component inventory, designed states) as a committed artifact before the rebuild. | Phase 5.6 UI/UX reset; consumes existing read models, adds no backend authority. |

## Scope

| In Scope | Reason |
|---|---|
| Color role tokens with AA contrast targets. | Disciplined teal/gold identity; status colors reserved for status. |
| Type and spacing scales. | Replace the monospace-everywhere "log file" feel with a real hierarchy. |
| Component inventory and layout/state designs. | Define components that replace the inspector widgets, plus loading/empty/degraded states. |
| Monospace-usage rule. | Monospace only for ids/commands/paths. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implementation of the components. | Built in T-0209–T-0213. |
| Any backend/read-model change. | UI layer only. |

## Status

Partial

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-06-02 | Partial | Implementation and Docker validation complete; finish/close deferred pending reviewer sign-off. | npm ci && build && vitest passed (84 files / 562 tests); dashboard visual/a11y gate passed. |
