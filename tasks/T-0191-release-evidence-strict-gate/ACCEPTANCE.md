# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Release gate evidence checks use shared release proof semantics plus artifact validation rather than summary/path-only heuristics. | Done | `src/services/operational-debt.ts` delegates to `isStrictReleaseEvidenceProof`. |
| AC-2 | Summary-only package smoke, clean-checkout smoke, and release artifact evidence records remain missing in strict release gate mode. | Done | `tests/unit/operational-debt.test.ts` summary-only regression. |
| AC-3 | Existing valid reduced package-smoke and clean-checkout smoke artifacts continue to satisfy strict release gate checks. | Done | Updated operational debt tests with schema-valid smoke artifact fixtures. |
| AC-4 | Reviewer-facing docs describe exact failed-evidence resolution signals, not conservative word matching. | Done | `docs/TEST_STRATEGY.md`, workbench contract, v2 migration plan, and ignored spec wording updated. |
| AC-5 | Docker sync-build passes. | Done | 79 files / 547 tests passed. |
