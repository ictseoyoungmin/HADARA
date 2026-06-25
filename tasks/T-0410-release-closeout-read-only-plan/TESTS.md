# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `/tmp/hadara` `npm run build` plus focused tests | Verify TypeScript build and release-closeout/schema tests. | Yes | Passed | `ev:T-0410:299ccfde6ed84a22bc1e6a2e` |
| `node dist/cli/main.js release closeout --version 0.3.4 --task T-0410 --json` | Verify refreshed built CLI smoke on current repo. | Yes | Passed | `ev:T-0410:299ccfde6ed84a22bc1e6a2e` |
| `git diff --check` | Verify whitespace. | Yes | Passed | `ev:T-0410:299ccfde6ed84a22bc1e6a2e` |
| Full Docker sync-build | Run full suite and dist sync. | No | Not Run | T-0409 just recorded pre-existing dashboard/evidence timeout behavior; T-0410 used focused build/tests plus built smoke. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | T-0410 is read-only and does not expand write or release mutation boundaries. | Not Run | Not applicable. |
| Integration smoke | No | No package registry, GitHub, Docker, or PyPI mutation. | Not Run | Not applicable. |
