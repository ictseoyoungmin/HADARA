# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/task-workflow-docs.test.ts tests/unit/init.test.ts tests/unit/docs-doctor.test.ts tests/unit/docs-required-reading.test.ts tests/unit/protocol-consistency.test.ts` | Validate governed init/docs doctor/required-reading/profile behavior and workflow docs adjacency. | Yes | Passed: focused Docker validation passed 5 files / 55 tests and refreshed `dist`; runtime version smoke reported `distLooksStale:false`. | `command:T-0321:docker-focused-docs-init-profile` |
| `npm run dev:docker-sync-build` | Run full Docker-backed check and refresh workspace `dist`. | Yes | Passed: full Docker sync-build passed 118 files / 772 tests and refreshed workspace `dist`; runtime version smoke reported `distLooksStale:false`. | `command:T-0321:docker-full-sync-build` |
| `git diff --check` | Check patch hygiene. | Yes | Passed. | `command:T-0321:repo-docs-harness-smokes` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Optional installed-package network smoke | No | Network is restricted/unreliable and not required close proof. | Not Run; README/TEST_STRATEGY now document temp-prefix installed-bin proof as the canonical network-installed package proof when available. | `command:T-0321:repo-docs-harness-smokes` |
| Docs doctor / required-reading smokes | Yes | This capsule changes docs governance behavior. | Passed: current repo docs doctor remained `ok:true` with pre-existing warnings only, required-reading no longer reports the historical `REFACTOR_LOG.md` warning, and fresh governed required-reading doctor returned `issues: []`. | `command:T-0321:repo-docs-harness-smokes` |
