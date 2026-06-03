# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0233 |
| Status | Done |
| Last Updated | 2026-06-03 |

## Last Completed

| Item | Evidence |
|---|---|
| Canonical writer now persists `hadara.evidence.v2` records by default. | New evidence includes durable ids, fingerprints, id metadata, category/outcome, artifacts, tags, and legacy v1 compatibility fields. |
| Core evidence consumers were hardened for mixed v1/v2 records. | Evidence list/lint/normalizer/harness/task close/task workbench/dashboard task detail/timeline and CLI evidence surfaces accept the persisted union. |
| Validation passed. | Focused suites passed 10 files / 81 tests and 9 files / 78 tests; Docker sync-build passed 91 files / 599 tests with built CLI smoke `ok:true`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open an Evidence v2 read-model/release compatibility follow-up before migration. | Release/package-specific evidence helpers and any custom v1 writer paths should be reviewed before broad migration. | `docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md`, release evidence services/tests, T-0233 RISKS. |
| Then design dry-run-first migration preview. | Existing historical evidence remains v1 and should not be rewritten without per-task hash guards. | `docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md`. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Historical `evidence.jsonl` files are not migrated. | Mixed repositories are expected after T-0233. | Keep all consumers version-tolerant; use a future dry-run migration capsule. |
| `EVIDENCE.md` does not show persisted v2 ids. | Operators need JSONL or list/read-model output for durable ids. | Defer Markdown frame work until the writer behavior is stable. |
| Release/smoke-specific evidence helpers may still write or parse legacy-shaped records. | Release readiness compatibility could lag the canonical writer. | Run a focused compatibility capsule before migration or release hardening. |
