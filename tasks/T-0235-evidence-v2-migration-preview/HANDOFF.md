# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0235 |
| Status | Done |
| Last Updated | 2026-06-03 |

## Last Completed

| Item | Evidence |
|---|---|
| Dry-run Evidence v2 migration preview exists. | `hadara evidence migrate --task <id> --to v2 --json` returns `hadara.evidence.migration_preview.v1` without writing files. |
| Preview reports planned transforms. | Reports include beforeHash, per-line planned v2 records, deterministic planned ids/fingerprints, skipped records, and issues. |
| Validation passed. | Focused suite passed 7 files / 64 tests; Docker sync-build passed 92 files / 603 tests; built CLI smoke on T-0015 returned plannedTransforms 5; ready/close/audit-close passed. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Implement hash-guarded Evidence v2 migration execute mode. | Preview now exists; next capsule can safely add bounded writes guarded by beforeHash and dry-run parity. | `docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md`, `src/services/evidence-migration.ts`, T-0235 tests. |
| Keep Markdown frame rewrite separate. | `EVIDENCE.md` id display remains deferred and should not be bundled into execute migration by default. | T-0235 RISKS. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| No evidence files are migrated yet. | Historical records remain v1 until execute mode is implemented and run. | Use preview report before adding execute. |
| Execute mode must be hash-guarded. | Evidence files can change between preview and execute. | Require matching `beforeHash` and refuse drift in the next capsule. |
| Planned ids are stable preview values. | They are not persisted until execute mode writes them. | Keep report language and CLI output dry-run-first. |
