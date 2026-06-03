# T-0228 TUI Projection-First Operator Read Model

## Metadata

| Field | Value |
|---|---|
| ID | T-0228 |
| Title | TUI Projection-First Operator Read Model |
| Status | Done |
| Created | 2026-06-03 |
| Updated | 2026-06-03 |

## Goal

| Goal | Notes |
|---|---|
| Align TUI with shared operator read models after dashboard freeze. | Record the TUI shared-service/projection-first spec, update project docs, and add dashboard core/projection status directly to the TUI read model without HTTP calls or project-document writes. |

## Scope

| In Scope | Reason |
|---|---|
| TUI shared operator read-model spec. | Freeze dashboard follow-up scope and define TUI rules before more implementation drift accumulates. |
| TUI read model additive operator status. | Exposes dashboard core/projection status through shared services in terminal consumers. |
| TUI snapshot projection status display. | Operators must see source, refresh progress, pending, and stale sections without waiting for refresh completion. |
| Project docs and active handoff updates. | Future agents need the new TUI direction in required reading and roadmap state. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Full TUI detail/cache rewrite. | Follow-up slices should replace selected detail and TUI cache scans incrementally. |
| Further dashboard optimization. | Dashboard work is paused after Phase 5.7 hardening; refresh stage budget/streaming scan remains deferred. |
| New write, shell, provider, or MCP behavior. | TUI remains read-only over existing services. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-03 | Draft | Initial task scaffold. | hadara task create |
| 2026-06-03 | In Progress | Scope fixed to dashboard freeze documentation plus TUI shared operator read-model alignment. | Task capsule update |
| 2026-06-03 | Done | Finished task capsule. | `hadara task finish --execute` |

