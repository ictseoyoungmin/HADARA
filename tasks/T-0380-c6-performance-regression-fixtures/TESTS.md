# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/context-routing-performance-baseline-script.test.ts` | Host focused attempt. | No | Failed: host `vitest` unavailable in this workspace. | Not recorded |
| `node -e "JSON.parse(...)"` | Parse docs registry and threshold fixture JSON. | Yes | Passed. | Local smoke |
| `npm run dev:docker-check` | Build and run full Docker validation. | Yes | Passed: 136 files / 898 tests. | `ev:T-0380:ff1d277e8bbb467e9f9f20af` |
| `npm run dev:docker-sync-build` | Build, run full Docker validation, and refresh workspace `dist`. | Yes | Passed: 136 files / 898 tests; `dist` refreshed and version smoke reported `build.distLooksStale:false`. | `ev:T-0380:e9559e47ff9940999f1171cf` |
| `node dist/cli/main.js evidence lint --task T-0380 --json` | Verify task evidence JSONL/Markdown consistency. | Yes | Passed: 3 records, 3 Markdown rows, 0 errors, 0 warnings before lint evidence was appended. | `ev:T-0380:2663ca3fd8d84a35b62486b0` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built performance regression smoke | Yes | Prove script can run selected Session Start workloads against threshold fixture. | Passed: report `ok:true`, `regression.ok:true`, `checkedBudgetCount:2`, and selected workloads were `session_start`/`session_start_include_code`. | `ev:T-0380:4bf9cfb9548c411b9a94cc20` |
| Security smoke | No | No security boundary changed. | Not Run | N/A |
| Integration smoke | No | Covered by built performance regression smoke. | Passed | `ev:T-0380:4bf9cfb9548c411b9a94cc20` |
