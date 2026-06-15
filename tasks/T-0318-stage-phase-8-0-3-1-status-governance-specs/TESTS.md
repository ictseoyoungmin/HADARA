# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git diff --check` | Check Markdown/JSON whitespace and patch cleanliness. | Yes | Passed | `ev:T-0318:14b660145b5140a2bdda7d3e` |
| `node dist/cli/main.js docs list --json` | Verify committed docs registry reads successfully and includes Phase 8 registrations. | Yes | Passed | `ev:T-0318:14b660145b5140a2bdda7d3e` |
| `node dist/cli/main.js docs required-reading --json` | Verify default required-reading stays compact/current-state-first. | Yes | Passed | `ev:T-0318:14b660145b5140a2bdda7d3e` |
| `node dist/cli/main.js docs doctor --json` | Verify docs doctor remains non-blocking after registration changes. | Yes | Passed with pre-existing warnings | `ev:T-0318:14b660145b5140a2bdda7d3e` |
| `node dist/cli/main.js docs explain --path <phase8-doc> --json` | Verify the new Phase 8 program and rc1 plan are registry-known. | Yes | Passed | `ev:T-0318:14b660145b5140a2bdda7d3e` |
| `node dist/cli/main.js harness validate --task T-0318 --level draft --json` | Verify draft-level capsule structure before lifecycle finish. | Yes | Passed | `ev:T-0318:14b660145b5140a2bdda7d3e` |
| `node dist/cli/main.js evidence lint --task T-0318 --json` | Verify evidence index state before appending validation evidence. | Yes | Passed | `ev:T-0318:14b660145b5140a2bdda7d3e` |
| `node dist/cli/main.js task ready --task T-0318 --level done --json` | Verify done-level readiness before close. | Yes | Passed | `ev:T-0318:f138796488eb4ff5930668f7` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Source runtime tests | No | This capsule adds specs and state-doc registration only; no CLI runtime source changed. | Not Run | N/A |
| Full Docker validation | No | T-0318 is docs/spec staging; latest stable source full-Docker baseline remains T-0315. | Not Run | N/A |
