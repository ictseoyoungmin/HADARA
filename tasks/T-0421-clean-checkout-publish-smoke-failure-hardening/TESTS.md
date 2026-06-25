# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `docker exec hadara-dev bash -lc 'cd /tmp/hadara && npm run build && npm test -- --run tests/unit/dashboard-static.test.ts tests/unit/dashboard-heavy-projection.test.ts'` | Build and run focused dashboard API/projection tests in the Docker ext4 dev copy. | Yes | Passed: 2 files / 19 tests; dashboard API route test 2535 ms. | `ev:T-0421:98e0dd670b3c489484bdebfb` |
| Preserved clean-checkout workspace `npm run check` after patch. | Confirm the publish-blocking dashboard route timeout no longer fails full check in clean-checkout validation. | Yes | Passed: 144 files / 947 tests in 29.59 s. | `ev:T-0421:88bc742a31814e089efcdb66` |
| `node /workspace/dist/cli/main.js version --json --project /workspace` and `git diff --check` | Verify workspace `dist` was refreshed after the Docker build and whitespace is clean. | Yes | Passed: `packageVersion:"0.3.4-rc.0"`, `distLooksStale:false`; `git diff --check` passed. | `ev:T-0421:6a8478700dd842a0b73a4fa4` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | Yes | Release helper clean-checkout path is the integration surface. | Partial: `npm run check` passed; `/tmp/hadara` synthetic clean checkout doctor failed due missing `.hadara/context` in the dev-copy source, not due the route fix. | `ev:T-0421:88bc742a31814e089efcdb66` |
