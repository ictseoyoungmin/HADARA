# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run dev:docker-check | Run Docker build plus full test suite against the HADARA-dev baseline. | Yes | Passed: 136 files / 894 tests after bounded no-live fix. | `ev:T-0378:b3e1cc3b1b6d44b4a68c9bf0` |
| npm run dev:docker-sync-build | Run Docker build/tests and refresh workspace `dist`. | Yes | Passed: 136 files / 894 tests; version smoke reported `build.distLooksStale:false`. | `ev:T-0378:2c321128b97c4efda50ee1ba` |
| timeout 10s node dist/cli/main.js session start --task T-0378 --max-read-first 3 --max-items 8 --json | Built CLI smoke for bounded default session start. | Yes | Passed in about 1.6s with `ok:true`, degraded no-live metadata, and no live graph scan. | `ev:T-0378:dd42b8f8ded34d988a2090a1` |
| node dist/cli/main.js evidence lint --task T-0378 --json | Verify evidence index/Markdown consistency and failed-smoke resolution. | Yes | Passed with 0 issues. | `ev:T-0378:59772865b91049d6b79fa3ce` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Host focused test | No | Host `node_modules` is not the HADARA-dev validation baseline on this workspace. | Failed environment-only: `vitest` was not found; Docker validation is authoritative. | Not recorded |
| Initial built CLI live default smoke | Yes | Proved the first design was too slow on the mounted workspace and forced the bounded no-live default. | Failed with timeout after 45s; resolved by later built smoke pass. | Failed `ev:T-0378:b530c04adb3e4d50ac3ef0b4`, resolved by `ev:T-0378:dd42b8f8ded34d988a2090a1` |
