# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `evidence.jsonl` canonical and `EVIDENCE.md` as a human summary table for this slice. | Accepted | Work Item B and the migration plan both defer Markdown rebuild/frame work. | `docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md` |
| D-2 | Implement explicit resolution tags through additive CLI flags instead of inferring from human prose. | Accepted | Durable v2 ids need exact machine markers for reliable failed-evidence resolution. | Work Item B resolution semantics |
| D-3 | Treat same-category passed evidence as a legacy v1 compatibility fallback only. | Accepted | New v2 records have durable ids, so failed v2 records should be resolved by exact `resolves:`/`supersedes:` markers. | Docker focused evidence semantics tests |
