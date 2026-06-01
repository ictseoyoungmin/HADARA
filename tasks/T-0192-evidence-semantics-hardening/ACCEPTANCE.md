# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Normalized evidence records expose identity stability metadata. | Done | Normalizer tests cover `sourceLine`, `fingerprint`, `idSource`, and `idStability`. |
| AC-2 | Evidence lint preserves actual JSONL line numbers for generated semantic ids. | Done | Evidence lint regression proves invalid line 1 still yields failed evidence id with line 2, and lint now uses `normalizeEvidenceRecordsWithSourceLines`. |
| AC-3 | Release dry-run selects candidates through strict release proof helpers, then applies freshness checks. | Done | Release dry-run tests pass with arbitrary summaries and schema-valid artifacts. |
| AC-4 | Docs mark same-category failed resolution as v1 compatibility-only transitional fallback. | Done | Test strategy and v2 writer/migration plan updated. |
| AC-5 | Dashboard/TUI contracts mark private-only as auditability warning, not Done blocker. | Done | Contract docs test updated. |
| AC-6 | Release readiness docs distinguish gate strictness from dry-run freshness. | Done | `docs/RELEASE_READINESS.md` updated. |
| AC-7 | The array normalizer API makes source-line preservation explicit. | Done | `normalizeEvidenceRecordsWithSourceLines` is the JSONL-safe helper; `normalizeEvidenceRecordsInMemoryOrder` is reserved for synthetic/in-memory records; `normalizeEvidenceRecords` remains a deprecated alias only. |
