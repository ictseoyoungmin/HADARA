# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Re-read `evidence.jsonl` immediately before close evidence append instead of adding a global lock. | Accepted | T-0264 scope asks for race recheck and keeps lock services out of scope. | `src/task/task-close.ts` |
| D-2 | Reuse the existing close evidence write-plan helper during execute recheck. | Accepted | This keeps duplicate and supersedes behavior consistent between dry-run and execute. | `src/task/task-close.ts`, `tests/unit/task-close.test.ts` |
| D-3 | Expose optional `closeEvidenceWrite.executeRecheck` metadata. | Accepted | Operators and future agents can see whether execute rechecked and whether it appended or no-oped. | `src/schemas/task-close.schema.json` |
