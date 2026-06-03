# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/tui-cli.test.ts tests/unit/feature-smoke.test.ts tests/unit/runtime-version.test.ts tests/unit/task-json.test.ts tests/unit/evidence-json.test.ts tests/unit/status-json.test.ts tests/unit/policy-json.test.ts tests/unit/cli-errors.test.ts` | Validate representative CLI dispatch and TUI snapshot command behavior after lazy imports. | Yes | Passed: 8 files / 53 tests. | Docker focused Vitest |
| `npm run dev:docker-sync-build` | Build, test, refresh `dist`, and run built CLI smoke. | Yes | Passed: 91 files / 595 tests, built CLI smoke `ok:true`, `distLooksStale:false`. | Docker sync-build |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built `/mnt/f` TUI snapshot timing | Yes | Primary acceptance smoke. | Passed: 1.37s. | `/usr/bin/time ... hadara tui --snapshot` |
| Security smoke | No | No write/security boundary change. | Not Run | TBD |
| Integration smoke | No | No external integration surface change. | Not Run | TBD |
