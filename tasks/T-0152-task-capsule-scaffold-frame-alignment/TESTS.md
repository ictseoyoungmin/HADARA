# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npx vitest run tests/harness/task-capsule.test.ts tests/harness/harness-validate.test.ts` | Verify scaffold generation, evidence Markdown shape, and harness compatibility. | Yes | Passed | Docker focused run passed with 2 files and 24 tests. |
| `npm run check` | Full repository validation. | Yes | Passed | Docker temp-copy full check passed with 57 files and 421 tests. |
| `node dist/cli/main.js harness validate --task T-0152 --level done --json --project /workspace` | Done-level capsule validation. | Yes | Passed | Docker built CLI returned `ok: true` with no issues. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Protocol doctor smoke | No | Protocol doctor is future T-0153/T-0154 work. | Not Run | Not applicable. |
| Schema contract validation | No | Protocol schema fixtures are future T-0157 work. | Not Run | Not applicable. |
