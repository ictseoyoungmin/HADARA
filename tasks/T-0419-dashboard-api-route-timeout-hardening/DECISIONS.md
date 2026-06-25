# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `/api/status` independent from operational debt scans. | Accepted | Status is a first-paint route and debt already has explicit API routes. | `src/cli/dashboard.ts`, `ev:T-0419:e37deeb8c81f4c19a6bea6e2` |
| D-2 | Default dashboard bootstrap to `core`; require `tier=full` for the heavier aggregate. | Accepted | The publish-blocking test calls bootstrap as part of a broad API smoke; the default path should not eagerly compute slow optional data. | `src/cli/dashboard.ts`, `tests/unit/dashboard-static.test.ts` |
