# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/docs-required-reading.test.ts tests/unit/schema-fixtures.test.ts` in Docker | Verify tier output and schema fixture compatibility. | Yes | Passed | `ev:T-0308:dc2e7cb2cc574dc8964e51be` |
| `npm run build` in Docker with workspace `dist` refresh | Rebuild CLI after source/schema changes. | Yes | Passed | `ev:T-0308:dc2e7cb2cc574dc8964e51be` |
| Built CLI required-reading smoke | Verify real CLI JSON includes tier metadata. | Yes | Passed | `ev:T-0308:dc2e7cb2cc574dc8964e51be` |
| `git diff --check` | Check whitespace before close. | Yes | Passed | `ev:T-0308:dc2e7cb2cc574dc8964e51be` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changes. | Not Run | TBD |
| Integration smoke | No | No integration surface changes. | Not Run | TBD |
