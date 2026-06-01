# T-0192 Evidence Semantics Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0192 |
| Title | Evidence Semantics Hardening |
| Status | Done |
| Created | 2026-06-01T04:05:00Z |
| Updated | 2026-06-01T04:11:24Z |

## Goal

| Goal | Notes |
|---|---|
| Harden Phase 4 evidence semantics before Dashboard work. | Preserve source-line identity metadata, clarify compatibility fallbacks, align release dry-run strictness, and document UI warning semantics. |

## Scope

| In Scope | Reason |
|---|---|
| Add normalized evidence identity metadata. | Consumers need to know whether generated ids are durable or line-fallback read-model ids. |
| Preserve actual JSONL line numbers through evidence lint normalization. | Semantic issue ids should not drift merely because invalid lines were skipped before normalization. |
| Align release dry-run candidate selection with strict release proof helpers. | Release gate and dry-run should not diverge on summary/path heuristics. |
| Strengthen Dashboard/TUI and release docs. | UI and release consumers need clear blocker vs warning and gate vs freshness semantics. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Evidence v2 writer implementation or migration command. | Still deferred to a dedicated writer/migration capsule. |
| Dashboard UI implementation. | This capsule only hardens contracts before UI work. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01T04:05:00Z | Draft | Initial task scaffold. | Created by `hadara task create`. |
| 2026-06-01T04:11:24Z | Done | Evidence semantics hardening implemented and validated. | Docker sync-build passed with 79 files / 548 tests. |
| 2026-06-01T04:56:30Z | Done | Normalizer helper API clarified with explicit source-line and in-memory-order helpers. | Docker sync-build passed with 79 files / 549 tests. |
