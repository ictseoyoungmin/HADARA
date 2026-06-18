# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Host `npm run test:focused -- tests/unit/schema-fixtures.test.ts tests/unit/context-graph-schema.test.ts` | Initial focused schema validation attempt. | No | Failed because host dependencies were absent (`vitest` not found); Docker validation was used as the baseline. | Recorded as environment fallback; not used as pass/fail baseline. |
| Host `npm run build` | Initial TypeScript build attempt. | No | Failed because host dependencies were absent (`tsc` not found); Docker validation was used as the baseline. | Recorded as environment fallback; not used as pass/fail baseline. |
| Docker `npm run test:focused -- tests/unit/schema-fixtures.test.ts tests/unit/context-graph-schema.test.ts` | Focused schema fixture and context graph contract tests. | Yes | Passed: 2 files / 4 tests. | `ev:T-0343:52220ea996ec416ab6d508fc`. |
| Docker `npm run build` | TypeScript build and `dist` generation in the reusable container copy. | Yes | Passed; `/workspace/dist` refreshed from Docker build output. | `ev:T-0343:52220ea996ec416ab6d508fc`. |
| Docker `npm run check` | Full repository check. | Yes | Passed: 120 files / 794 tests. | `ev:T-0343:52220ea996ec416ab6d508fc`. |
| `node dist/cli/main.js version --json` | Built workspace CLI freshness smoke after dist refresh. | Yes | Passed with `build.distLooksStale:false`. | `ev:T-0343:52220ea996ec416ab6d508fc`. |
| `git diff --check` | Whitespace/diff hygiene. | Yes | Passed. | `ev:T-0343:52220ea996ec416ab6d508fc`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
| `dev docker-check --help` accidental helper attempt | No | The command dispatches the wrapper rather than a help-only path. | Failed at the known temp-workspace wrapper step; direct Docker validation above was used instead. | Non-blocking diagnostic only. |
