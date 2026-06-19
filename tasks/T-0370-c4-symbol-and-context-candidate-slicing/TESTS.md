# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-check` | Full Docker build/test check without dist sync. | Yes | Failed once on unrelated dashboard-static 5s timeout after C4 tests passed; resolved by standalone dashboard test and full sync-build pass. | `ev:T-0370:31843ba400314e019d1eae82`, `ev:T-0370:a247c6412f2b49c6ad49efbd` |
| Docker focused C4/schema/registry tests | Validate context slice service/CLI/schema/registry behavior. | Yes | Passed: 5 files / 53 tests. | `ev:T-0370:70db496bc8f5489c8a6cb5b1` |
| Docker standalone dashboard-static test | Resolve initial full-check timeout. | Yes | Passed: 1 file / 15 tests. | `ev:T-0370:70db496bc8f5489c8a6cb5b1`, `ev:T-0370:a247c6412f2b49c6ad49efbd` |
| `npm run dev:docker-sync-build` | Full Docker build/test, refresh workspace `dist`, and built version smoke. | Yes | Passed: 134 files / 876 tests; `distLooksStale:false`. | `ev:T-0370:70db496bc8f5489c8a6cb5b1` |
| Final post-doc Docker sync-build retry | Recheck after shared docs/schema-index updates. | Yes | Failed once on release-dry-run 5s timeout after rebuild; resolved by standalone release-dry-run and build-only dist refresh. | `ev:T-0370:4afe08a8ea30466c8b43f34e`, `ev:T-0370:1e6a0f08e520489f9d6f3100` |
| Docker build-only dist refresh | Ensure `dist` reflects final source/schema-index updates after timeout retry. | Yes | Passed: built version smoke returned `distLooksStale:false`. | `ev:T-0370:1e6a0f08e520489f9d6f3100` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI symbol smoke | Yes | Public CLI surface changed. | Passed: `context slice --path src/cli/context.ts --symbol handleContextCommand --window 2 --json` returned `ok:true`, `strategy:"symbol-neighborhood"`. | `ev:T-0370:70db496bc8f5489c8a6cb5b1` |
| Built CLI candidate smoke | Yes | Public CLI surface changed. | Passed: context pack produced 8 candidates; `context slice --task T-0370 --candidate slice-candidate:1:doc:.hadara/context/HADARA_CONTEXT.md --json` returned `ok:true`, `strategy:"context-candidate"`. | `ev:T-0370:70db496bc8f5489c8a6cb5b1` |
| Security smoke | No | No new permission, secret, MCP, or execution boundary changed; command remains read-only. | Not Run | N/A |
| Integration smoke | No | Covered by built CLI smokes for new public options. | Passed | `ev:T-0370:70db496bc8f5489c8a6cb5b1` |
