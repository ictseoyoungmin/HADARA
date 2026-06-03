# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/tui-markdown.test.ts tests/unit/tui-snapshot.test.ts tests/unit/tui-read-model.test.ts tests/unit/status-json.test.ts` | Validate Markdown preview, Overview snapshot, fast TUI read-model, and existing table-aware status behavior. | Yes | Passed: 4 files / 34 tests. | Docker focused Vitest |
| `npm run dev:docker-sync-build` | Build, full test, refresh `dist`, and run built CLI smoke. | Yes | Passed: 91 files / 597 tests; built CLI smoke `ok:true`, `distLooksStale:false`. | Docker sync-build |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built TUI snapshot smoke | Yes | Confirms real `dist` output no longer shows the reported table headers. | Passed: 1.46s; no `| Goal | Notes |`, `| Step | Reason |`, or `| Time | Kind | Summary |` strings. | `/tmp/hadara-t0232-snapshot.txt` grep |
| Security smoke | No | No security boundary change. | Not Run | TBD |
| Integration smoke | No | No external integration surface change. | Not Run | TBD |
