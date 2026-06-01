# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/evidence/normalizer.ts` | Modified | Add identity stability metadata, content fingerprint, explicit source-line array helper, and in-memory-order helper. | Done |
| `src/services/evidence-lint.ts` | Modified | Preserve actual JSONL line numbers for semantic normalization through the explicit source-line helper. | Done |
| `src/services/release-evidence.ts` | Modified | Preserve release evidence source lines. | Done |
| `src/services/release-dry-run.ts` | Modified | Use strict release proof helper for candidate selection before freshness checks. | Done |
| `tests/unit/evidence-normalizer.test.ts` | Modified | Cover identity metadata and fingerprints. | Done |
| `tests/unit/evidence-lint.test.ts` | Modified | Cover actual source line preservation. | Done |
| `tests/unit/release-dry-run.test.ts` | Modified | Cover artifact-driven selection independent of summary wording. | Done |
| `docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md` | Modified | Document identity metadata and v1 transitional fallback. | Done |
| `docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md` | Modified | Clarify private-only warning semantics. | Done |
| `docs/DASHBOARD_READ_MODEL_CONTRACT.md` | Modified | Clarify private-only warning semantics. | Done |
| `docs/TEST_STRATEGY.md` | Modified | Mark same-category fallback as v1 compatibility-only. | Done |
| `docs/RELEASE_READINESS.md` | Modified | Distinguish release gate strictness from dry-run freshness. | Done |
