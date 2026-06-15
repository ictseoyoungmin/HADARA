# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git diff --check` | Check whitespace/diff hygiene. | Yes | Passed | `command:T-0319:status-token-policy-validation` |
| `docker exec hadara-dev ... npm run test:focused -- tests/unit/init.test.ts` | Verify generated init SOP/workflow guidance and README entry-surface assertions. | Yes | Passed: 21 tests. | `command:T-0319:status-token-policy-validation` |
| `docker exec hadara-dev ... cp -R dist/. /workspace/dist/ && node /workspace/dist/cli/main.js version --verbose --json --project /workspace` | Refresh workspace `dist` from Docker build output and smoke the built CLI. | Yes | Passed: `distLooksStale:false`. | `command:T-0319:status-token-policy-validation` |
| `node dist/cli/main.js docs doctor --json` | Confirm docs doctor remains non-blocking after workflow/SOP changes. | Yes | Passed with existing warnings. | `command:T-0319:status-token-policy-validation` |
| `node dist/cli/main.js docs required-reading --json` | Confirm effective required-reading projection remains clean. | Yes | Passed with no issues. | `command:T-0319:status-token-policy-validation` |
| `node dist/cli/main.js harness validate --task T-0319 --level draft --json` | Validate the in-progress capsule before finish. | Yes | Passed. | `command:T-0319:status-token-policy-validation` |
| `npm run dev:docker-sync-build` | Standard full Docker build/test/dist-sync path. | Best effort for this docs/template capsule. | Failed: build ran and most tests passed, but the full suite timed out on existing `docs-archive` and `docs-required-reading` 5s tests before dist sync; non-blocking policy resolution evidence appended. | `command:T-0319:docker-sync-build-full-timeout`; `command:T-0319:policy-timeout-resolution` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
