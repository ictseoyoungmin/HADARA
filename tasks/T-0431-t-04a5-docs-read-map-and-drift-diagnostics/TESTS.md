# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run build` in Docker temp checkout | Compile TypeScript after applying current diff. | Yes | Passed | `ev:T-0431:a81383c6d7894693a45a95ed` |
| `npm run test:focused -- tests/unit/docs-registry.test.ts tests/unit/command-registry.test.ts tests/unit/schema-fixtures.test.ts tests/unit/init.test.ts` in Docker temp checkout | Validate docs read-map/inbox behavior, command registry, schema fixtures, and init compatibility. | Yes | Passed, 4 files / 25 tests | `ev:T-0431:a81383c6d7894693a45a95ed` |
| Built CLI `docs read-map --task T-0431 --json` | Verify refreshed `dist` read-map surface on current repo. | Yes | Passed | `ev:T-0431:a81383c6d7894693a45a95ed` |
| Built CLI `docs inbox --json` | Verify refreshed `dist` inbox surface on current repo. | Yes | Passed | `ev:T-0431:a81383c6d7894693a45a95ed` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `git diff --check` | Yes | Catch whitespace errors. | Passed | Local command output had no findings. |
| Full `npm run check` | No | Narrow docs registry/schema/CLI surface; focused Docker coverage is sufficient for this capsule. | Not Run | Explicitly scoped out. |
