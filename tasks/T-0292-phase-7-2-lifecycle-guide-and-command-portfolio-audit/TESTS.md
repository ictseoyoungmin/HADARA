# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker direct TypeScript build | Compile changed TypeScript in the supported Docker environment. | Yes | Passed | `node node_modules/typescript/bin/tsc -p tsconfig.json` in Docker |
| Focused lifecycle tests | Cover Phase 7.2 lifecycle/portfolio/help behavior. | Yes | Passed | Docker direct Vitest: 7 files, 27 tests |
| Built CLI smokes | Prove `help lifecycle`, `help lifecycle --json`, and command filters from `dist`. | Yes | Passed | Built CLI smokes and `git diff --check` passed |
| Broader validation | Run available full or focused regression checks. | Yes | Partial | init/MCP/feature-smoke regression passed 3 files, 38 tests; standard Docker wrapper timed out |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No permission/secrets/storage boundary change expected. | Not Run | TBD |
| Integration smoke | No | Integration commands stay discoverable only; no runtime integration change expected. | Not Run | TBD |
