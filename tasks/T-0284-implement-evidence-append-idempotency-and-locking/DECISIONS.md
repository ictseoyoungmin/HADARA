# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Deduplicate evidence records only when an explicit `idempotencyKey` is supplied. | Accepted | Keyless manual evidence must remain append-only, while automation can opt into stable same-check identity. | Focused tests and built CLI idempotency smoke passed. |
| D-2 | Use a task-scoped local directory lock under `.hadara/local/locks/evidence/`. | Accepted | `mkdirSync` lock acquisition is atomic on the local filesystem and keeps the guard inside ignored local HADARA state. | `/tmp` build passed. |
| D-3 | Return append metadata from the writer and JSON envelope instead of reading the last JSONL row. | Accepted | This removes the append-then-read-last race where a parallel writer could become the reported record. | Focused evidence JSON tests passed. |
