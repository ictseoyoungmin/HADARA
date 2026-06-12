# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/init.test.ts tests/unit/task-workflow-docs.test.ts` in Docker | Verify generated scaffold docs and root workflow docs include tier guidance. | Yes | Passed | `ev:T-0307:e734ee5805dd4a63a0fb1e73` |
| `npm run build` in Docker with workspace `dist` refresh | Rebuild the CLI after generated-doc source changes. | Yes | Passed | `ev:T-0307:e734ee5805dd4a63a0fb1e73` |
| Built CLI init smoke | Verify generated project docs include tier guidance from refreshed `dist`. | Yes | Passed | `ev:T-0307:e734ee5805dd4a63a0fb1e73` |
| `git diff --check` | Check whitespace before close. | Yes | Passed | `ev:T-0307:e734ee5805dd4a63a0fb1e73` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changes. | Not Run | TBD |
| Integration smoke | No | No integration surface changes. | Not Run | TBD |
