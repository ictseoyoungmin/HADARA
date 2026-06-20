# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Make `task finalize` read-only in this capsule and refuse `--execute`. | Accepted | The dry-run plan contract should be proven before adding a guarded multi-step writer. | `ev:T-0396:d7b3975a5e4849f9ab74da22`, `ev:T-0396:7d3e8d90a33149be8a8e2e94` |
| D-2 | Compose existing finish, ready, close, and audit-close reports instead of duplicating validation logic. | Accepted | Keeps lifecycle truth in the canonical commands and reduces drift risk. | `src/task/task-finalize.ts` |
| D-3 | Include a stable `planHash` in dry-run output. | Accepted | Future execute support needs a reviewed plan identity without relying on timestamps. | `tests/unit/task-finalize.test.ts` |
