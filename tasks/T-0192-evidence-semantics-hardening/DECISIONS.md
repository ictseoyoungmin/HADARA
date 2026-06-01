# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Generated v1 semantic ids should expose stability metadata. | Accepted | Consumers need to distinguish persisted future ids from line-fallback compatibility ids. | `src/evidence/normalizer.ts` |
| D-2 | Release dry-run should reuse strict release proof candidate selection. | Accepted | Avoids a second summary/path heuristic after T-0191 hardened release gate semantics. | `src/services/release-dry-run.ts` |
| D-3 | `private-only` is a warning status, not a Done blocker. | Accepted | Normal task evidence may be private while still needing auditability visibility. | Dashboard/workbench contract docs. |
