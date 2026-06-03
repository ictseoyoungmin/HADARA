# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement migration preview as read-only first. | Accepted | Evidence rewrites need operator review, before-hash checks, and stable planned transforms before execute mode exists. | `createEvidenceMigrationPreviewReport()`. |
| D-2 | Generate deterministic planned ids from task id, line number, and legacy fingerprint. | Accepted | Preview output should be stable across repeated dry-runs before execute support. | Evidence migration tests compare repeated output. |
| D-3 | Include planned v2 records in the report. | Accepted | Operators and future execute code need to inspect the exact target shape. | `transforms[].plannedRecord`. |
| D-4 | Reject execute mode explicitly. | Accepted | Silent no-op execute would be misleading; actual writes belong in the next capsule. | `EVIDENCE_MIGRATION_EXECUTE_UNIMPLEMENTED` test. |
