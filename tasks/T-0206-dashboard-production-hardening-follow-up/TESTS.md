# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed via Docker sync-build | `npm run dev:docker-sync-build` passed with 84 files and 563 tests. |
| npm run check | Run the full repository check when available. | Yes | Passed via Docker sync-build | `npm run dev:docker-sync-build` passed with build, test, and built CLI version smoke. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Local dashboard API smoke | No | Confirm served aggregate metadata shape after project fingerprint/source changes. | Passed with caveat | Escalated `dashboard serve --port 4174` returned bootstrap JSON with `source.project.fingerprint` and scoped cache key; direct `/mnt/f` first read was slow and remains a known performance caveat. |
| Security smoke | No | Only if security boundary changes. | Covered by unit/static tests | Static dashboard tests continue to forbid write/execution/browser-storage tokens. |
| Integration smoke | No | Only if integration surface changes. | Covered by Docker sync-build | Shared dashboard API route tests passed. |
