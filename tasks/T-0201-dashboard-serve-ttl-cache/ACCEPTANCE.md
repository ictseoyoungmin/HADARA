# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Bootstrap, task-detail, and timeline API reads use process-memory TTL cache by default. | Done | Route tests assert `miss` then `hit` behavior; cache service tests cover defaults. |
| AC-2 | `?cache=bypass` recomputes read models without writing the bypass result into cache. | Done | `dashboard-cache.test.ts` covers bypass status and cached entry preservation. |
| AC-3 | Cache metadata is explicit and schema-compatible. | Done | Dashboard schemas allow `hit`, `miss`, `stale`, `bypass`, and `disabled` metadata. |
| AC-4 | Cache stays read-only and process-memory only. | Done | No `.hadara/local`, browser storage, database, file watcher, shell/provider/MCP write, or evidence write behavior added. |
| AC-5 | Validation evidence is attached. | Done | Docker sync-build evidence appended with 83 files / 560 tests and built CLI smoke `ok:true`. |
