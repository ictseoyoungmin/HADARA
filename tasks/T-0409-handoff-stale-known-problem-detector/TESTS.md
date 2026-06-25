# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-sync-build` | Run full Docker build/test/sync path. | Yes | Failed, classified non-blocking for this capsule | `ev:T-0409:50fc016e8af6435ba6fa7838`, `ev:T-0409:cce069b5a6de448298d354de` |
| Docker `/tmp/hadara` `npm run build` plus focused tests | Verify TypeScript build and focused handoff/schema tests. | Yes | Passed | `ev:T-0409:733b5dd43ab7400ab1e77e87` |
| `node dist/cli/main.js handoff stale-problems --json` | Verify refreshed built CLI smoke on current repo. | Yes | Passed | `ev:T-0409:733b5dd43ab7400ab1e77e87` |
| `git diff --check` | Verify whitespace. | Yes | Passed | `ev:T-0409:733b5dd43ab7400ab1e77e87` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full-suite timeout follow-up | No | The failed full Docker run timed out in pre-existing dashboard/evidence tests after the new focused tests had already passed; not a T-0409 feature blocker. | Recorded | `ev:T-0409:50fc016e8af6435ba6fa7838`, `ev:T-0409:cce069b5a6de448298d354de` |
| Security smoke | No | T-0409 is read-only and does not expand write boundaries. | Not Run | Not applicable. |
| Integration smoke | No | No external integration surface changed. | Not Run | Not applicable. |
