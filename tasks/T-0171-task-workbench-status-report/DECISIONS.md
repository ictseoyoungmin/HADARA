# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0171-1 | Build `task status` as a read-only service in `src/services/task-workbench.ts`. | Accepted | Keeps the operator console reusable by CLI and future read projections without adding writes. | Focused unit tests. |
| D-0171-2 | Use `task close` dry-run as the single done-level validation source. | Accepted | Matches the Phase 3 non-duplication rule and avoids calling harness validate twice. | Harness spy test. |
| D-0171-3 | Treat `task audit-close` as completed preflight from T-0170, not a new T-0172 implementation capsule. | Accepted | Current code, schema, and tests already include read-only close audit semantics. | Project handoff and T-0170 evidence. |
