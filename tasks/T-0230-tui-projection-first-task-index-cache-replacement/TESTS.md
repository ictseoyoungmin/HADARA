# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/tui-read-model.test.ts tests/unit/tui-cache.test.ts tests/unit/tui-snapshot.test.ts tests/unit/tui-terminal.test.ts tests/unit/tui-cli.test.ts tests/unit/feature-smoke.test.ts` | Validate TUI read model/cache/snapshot/CLI smoke behavior. | Yes | Passed: 6 files / 60 tests. | Docker focused Vitest |
| `npm run dev:docker-sync-build` | Build, test, refresh `dist`, and run built CLI smoke. | Yes | Passed: 91 files / 595 tests, built CLI smoke `ok:true`, `distLooksStale:false`. | Docker sync-build |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built `/mnt/f` TUI snapshot timing | Yes | Primary acceptance smoke for projection-first performance. | Passed: 4.05s built CLI snapshot; direct fast read-model/render measured about 160 ms. | `/usr/bin/time ... hadara tui --snapshot`; local timing script |
| Security smoke | No | No new write or secret boundary. | Not Run | TBD |
| Integration smoke | No | No external integration surface changes. | Not Run | TBD |
