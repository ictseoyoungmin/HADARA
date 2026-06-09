# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run build` in `/tmp/hadara-t0285-validate` | Type-check source. | Yes | Passed | Evidence recorded. |
| `npm run test:focused -- tests/unit/proof-status.test.ts tests/unit/evidence-lint.test.ts tests/unit/task-close.test.ts` in `/tmp/hadara-t0285-validate` | Run focused proof/evidence/close regressions. | Yes | Passed | 3 files / 22 tests. |
| `node dist/cli/main.js proof status --task T-0284 --json` | Built CLI proof smoke. | Yes | Passed | Returned proof status JSON and stale close freshness for T-0284. |
| `git diff --check` | Whitespace sanity check. | Yes | Passed | Evidence recorded. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Read-only proof reports do not change secrets, storage, or permission boundaries. | Not Run | Not applicable. |
| Integration smoke | No | No provider, MCP, dashboard, or release integration behavior changed. | Not Run | Not applicable. |
