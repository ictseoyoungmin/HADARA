# T-0233 Evidence v2 Persisted ID Writer MVP

## Metadata

| Field | Value |
|---|---|
| ID | T-0233 |
| Title | Evidence v2 Persisted ID Writer MVP |
| Status | Done |
| Created | 2026-06-03 |
| Updated | 2026-06-03 |

## Goal

| Goal | Notes |
|---|---|
| New evidence writes persist durable v2 ids while existing v1 evidence remains readable. | Start with writer MVP only: no mass migration, no EVIDENCE.md rewrite, no MCP write expansion, no UI work. |

## Scope

| In Scope | Reason |
|---|---|
| Default evidence writer output. | `appendEvidence()` and `appendEvidenceTextArtifact()` should append `hadara.evidence.v2` JSONL records with persisted ids for new evidence. |
| Durable id and fingerprint generation. | v2 records need stable write-time ids, content fingerprints, id metadata, and exact tags such as `resolves:<id>`. |
| v1/v2 mixed read compatibility. | Evidence list, lint, normalizer, semantic gates, harness validation, task read, dashboard/TUI consumers must tolerate mixed persisted evidence. |
| Self-hardening. | The new writer must not break this capsule's own `task ready`, `task close`, or `task audit-close` loop. |
| Focused and full validation. | Add regression tests for writer shape, mixed reads, harness/lint behavior, and existing v1 compatibility. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Existing evidence migration. | Migration preview/execute is a later capsule. |
| Automatic `EVIDENCE.md` rewrite. | Human Markdown table remains compatible and append-only. |
| Init scaffold changes. | New projects can continue with current evidence frame until v2 behavior is proven. |
| MCP write expansion. | Evidence attach behavior is not broadened in this capsule. |
| Dashboard/TUI UI changes. | UI work is paused unless a concrete blocker appears. |
| Release-gate strictness expansion. | Release evidence semantics should keep existing behavior over normalized records. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-03 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-03 | In Progress | Scope fixed to persisted v2 writer MVP plus self-hardening. | Task capsule update |
| 2026-06-03 | Done | Canonical evidence writer now persists v2 records by default and lifecycle gates accept mixed v1/v2 evidence. | Focused Docker tests, Docker sync-build, task ready/finish/close/audit |
