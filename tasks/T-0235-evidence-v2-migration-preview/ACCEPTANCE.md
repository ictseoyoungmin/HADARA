# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara evidence migrate --task <id> --to v2 --json` returns a dry-run preview report. | Done | `hadara.evidence.migration_preview.v1` service and CLI route added. |
| AC-2 | Preview includes before hash, counts, planned transforms, skipped records, and deterministic planned v2 ids/fingerprints. | Done | `tests/unit/evidence-migration.test.ts` covers transform shape and deterministic output. |
| AC-3 | Preview does not rewrite `evidence.jsonl`, and execute mode is explicitly unsupported. | Done | Tests compare file contents before/after and assert `EVIDENCE_MIGRATION_EXECUTE_UNIMPLEMENTED`. |
| AC-4 | Schema fixture is registered. | Done | `hadara.evidence.migration_preview.v1` schema fixture and schema-index coverage added. |
| AC-5 | Focused and full validation pass. | Done | Focused suite passed 7 files / 64 tests; Docker sync-build passed 92 files / 603 tests. |
| AC-6 | Built CLI smoke proves the command on historical v1 evidence. | Done | T-0015 preview returned totalLines 5, v1Records 5, plannedTransforms 5, skippedRecords 0. |
| AC-7 | Project handoff and task docs are updated. | Done | T-0235 capsule and project docs updated. |
