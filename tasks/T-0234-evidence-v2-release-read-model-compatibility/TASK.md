# T-0234 Evidence v2 Release Read Model Compatibility

## Metadata

| Field | Value |
|---|---|
| ID | T-0234 |
| Title | Evidence v2 Release Read Model Compatibility |
| Status | Done |
| Created | 2026-06-03 |
| Updated | 2026-06-03 |

## Goal

| Goal | Notes |
|---|---|
| Release and smoke evidence paths accept canonical v2 writes and v1/v2 mixed reads. | Align custom release/smoke evidence helpers after T-0233 so release readiness gates do not regress when new evidence is v2. |

## Scope

| In Scope | Reason |
|---|---|
| Package smoke and clean-checkout smoke evidence attach helpers. | These helpers were manually writing v1 records instead of using the canonical writer. |
| Release artifact evidence attach helper. | Release artifact attachment also bypassed the canonical v2 writer. |
| Release evidence reader and strict proof predicate. | `readReleaseEvidenceRecords()` only accepted v1 records, and strict release proof used a v1-only predicate. |
| Focused release/evidence regression coverage. | The compatibility behavior must be pinned before migration preview work. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Historical evidence migration. | Still requires a separate dry-run-first migration capsule. |
| `EVIDENCE.md` frame redesign. | Human Markdown table remains append-only and compatible. |
| Dashboard/TUI UI changes. | UI work remains paused. |
| Release command execution semantics. | This capsule only changes evidence attachment/read compatibility, not release execution policy. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-03 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-03 | In Progress | Scope fixed to Evidence v2 release/smoke read/write compatibility. | Task capsule update |
| 2026-06-03 | Done | Release/smoke evidence helpers use canonical v2 writer and release gates read v1/v2 mixed evidence. | Focused release/evidence tests and Docker sync-build |
