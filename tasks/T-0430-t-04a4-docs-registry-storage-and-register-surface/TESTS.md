# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run build` in Docker temp checkout | Compile TypeScript after applying current diff. | Yes | Passed | `ev:T-0430:1933b10f80184f8abb9540cb` |
| `npm run test:focused -- tests/unit/docs-registry.test.ts tests/unit/command-registry.test.ts tests/unit/schema-fixtures.test.ts tests/unit/init.test.ts` in Docker temp checkout | Validate docs-register behavior, command registry, schema fixtures, and init scaffold compatibility. | Yes | Passed, 4 files / 23 tests | `ev:T-0430:1933b10f80184f8abb9540cb` |
| Built CLI `docs register --execute --json` smoke | Verify refreshed `dist` command can register a spec in an initialized registry. | Yes | Passed | `ev:T-0430:1933b10f80184f8abb9540cb` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `git diff --check` | Yes | Catch whitespace errors before close. | Passed | Local command output had no findings. |
| Full `npm run check` | No | Focused command/schema/docs-registry tests cover this small surface; full suite is expensive on mounted workspace. | Not Run | Focused Docker validation used instead. |
