# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/dashboard-projection-store.test.ts` | Run focused projection store tests. | Yes | Blocked: host `vitest` not installed (`sh: 1: vitest: not found`). | Command output observed 2026-06-02. |
| `npm run dev:docker-sync-build` | Run Docker build/test/smoke and refresh `dist`. | Yes | Blocked: Docker socket denied in sandbox; escalated retry rejected by usage limit. | Command output observed 2026-06-02. |
| `git diff --check` | Check patch whitespace and apply cleanliness. | No | Passed. | Command output observed 2026-06-02. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Projection boundary smoke | Yes | This slice changes local cache write boundaries. | Covered by focused test file; execution pending Docker availability. | `tests/unit/dashboard-projection-store.test.ts`. |
| Context export exclusion | Yes | Projection files must not enter external-agent context. | Covered by focused test file; execution pending Docker availability. | `tests/unit/dashboard-projection-store.test.ts`. |
