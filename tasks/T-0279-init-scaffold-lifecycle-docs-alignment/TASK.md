# T-0279 Init Scaffold Lifecycle Docs Alignment

## Metadata

| Field | Value |
|---|---|
| ID | T-0279 |
| Title | Init Scaffold Lifecycle Docs Alignment |
| Status | Done |
| Created | 2026-06-07 |
| Updated | 2026-06-07 |

## Goal

| Goal | Notes |
|---|---|
| Align `hadara init` generated Markdown docs with the current task lifecycle. | New projects should receive lifecycle guidance for evidence, ready, finish, close, and audit-close without relying on HADARA-dev-only docs. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara init` generated Markdown docs. | The mismatch is in the default scaffold guidance, not command behavior. |
| Init doctor/upgrade expectations. | Missing lifecycle guidance should be visible as scaffold drift and recoverable through init upgrade. |
| Regression tests for generated docs. | External agents need stable generated command semantics. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| No lifecycle command behavior changes | This task updates scaffold docs and tests only. |
| No hidden task completion execution | Generated guidance must preserve explicit operator steps. |
| No publish, release, PyPI, or registry mutation | This is unrelated to release execution. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-07 | Draft | Initial task scaffold from template. | Template defaults. |
| 2026-06-07 | In Progress | Scope narrowed to init scaffold lifecycle-doc alignment. | Implementation started. |
| 2026-06-07 | Done | Finished task capsule. | `hadara task finish --execute` |
