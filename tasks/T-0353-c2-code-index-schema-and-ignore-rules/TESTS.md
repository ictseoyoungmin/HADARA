# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/code-index.test.ts tests/unit/schema-fixtures.test.ts` | Validate C2 code index schema/ignore/discovery plus schema fixture alignment. | Yes | Passed: 2 files / 6 tests in Docker `/tmp/hadara`. | `ev:T-0353:b72d5284ef1d42afa39232a0` |
| `npm run build` | Compile TypeScript before full suite and dist refresh. | Yes | Passed in Docker `/tmp/hadara`. | `ev:T-0353:b72d5284ef1d42afa39232a0` |
| `npm run check` | Run the full repository check when available. | Yes | Passed: 130 files / 828 tests in Docker `/tmp/hadara`. | `ev:T-0353:b72d5284ef1d42afa39232a0` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Built CLI version smoke | Yes | Dist was refreshed after build. | Passed with `distLooksStale:false`. | `ev:T-0353:b72d5284ef1d42afa39232a0` |
| Built internal code-index schema smoke | Yes | No public CLI was added, so verify built helper and schema runtime load from `dist`. | Passed: schema-valid `hadara.codeIndex.v1`, 315 files, generated/local paths ignored, zero issues. | `ev:T-0353:b72d5284ef1d42afa39232a0` |
| `git diff --check` | Yes | Verify whitespace before evidence/close. | Passed. | `ev:T-0353:b72d5284ef1d42afa39232a0` |
