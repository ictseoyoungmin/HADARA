# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/task-workflow-docs.test.ts tests/unit/command-registry.test.ts tests/unit/init.test.ts | Validate generated docs and command metadata coverage. | Yes | Passed as part of Docker full sync-build. | `ev:T-0335:363d4fdc4ea24608a3778916` |
| npm run dev:docker-sync-build | Run full Docker validation and refresh `dist` after generated-doc source changes. | Yes | Passed: 119 files / 791 tests; `distLooksStale:false`. | `ev:T-0335:363d4fdc4ea24608a3778916` |
| git diff --check | Verify whitespace correctness. | Yes | Passed: exit 0. | `ev:T-0335:a282bbe43c954a80be25afbb` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
| Runtime command smoke | No | T-0335 is docs consolidation only. | Not Run | Out of scope by design. |
