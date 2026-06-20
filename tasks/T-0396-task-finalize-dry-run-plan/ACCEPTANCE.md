# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara task finalize --task <id> --json` returns a schema-valid read-only lifecycle plan over finish, ready, close, and audit-close. | Met | `ev:T-0396:874095dd00434f5195eb144a`, `ev:T-0396:d7b3975a5e4849f9ab74da22` |
| AC-2 | Finalize dry-runs include a stable plan hash, ordered step metadata, expected write paths, and one primary next action for incomplete tasks. | Met | `tests/unit/task-finalize.test.ts`, `ev:T-0396:874095dd00434f5195eb144a` |
| AC-3 | `task finalize --execute` performs no writes and returns an explicit refusal diagnostic in this capsule. | Met | `ev:T-0396:7d3e8d90a33149be8a8e2e94` |
| AC-4 | Schema registry, command registry, CLI JSON docs, workflow docs, and schema docs are updated. | Met | `ev:T-0396:1057e733697c467aa0fbc9cd`, `ev:T-0396:c1bb5501c5d8471f81406164` |
| AC-5 | Validation and evidence are recorded, and handoff/shared state route the next lifecycle capsule. | Met | `ev:T-0396:874095dd00434f5195eb144a`, `ev:T-0396:1057e733697c467aa0fbc9cd`, `ev:T-0396:c1bb5501c5d8471f81406164` |
