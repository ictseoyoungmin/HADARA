# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep T-0190 design-only. | Accepted | Writer/migration implementation needs review after semantic surfaces stabilize. | docs/DEVELOPMENT_SLICES.md |
| D-2 | `hadara.evidence.v2` should persist semantic category/outcome but not derived strength. | Accepted | Strength remains analyzer-owned so rules can evolve. | docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md |
| D-3 | Migration must be per-task, dry-run-first, and hash-guarded before any broad migration. | Accepted | Matches HADARA write safety and protects evidence history. | docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md |
