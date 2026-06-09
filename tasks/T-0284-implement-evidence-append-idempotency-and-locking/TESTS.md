# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run build` in `/tmp/hadara-t0284-validate` | Type-check source in a validation copy. | Yes | Passed | `/tmp` validation copy build passed after `npm ci --ignore-scripts`. |
| `npm run test:focused -- tests/unit/evidence-json.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/init.test.ts` in `/tmp/hadara-t0284-validate` | Run focused evidence and docs regression tests. | Yes | Passed | 3 files / 41 tests passed. |
| `node dist/cli/main.js evidence add-command ... --idempotency-key command:T-0284:diff-check --json` replay | Built CLI idempotency smoke. | Yes | Passed | Replay returned the existing evidence record with no Markdown/JSONL append. |
| `timeout 10 npm run dev:docker-check` | Docker baseline check when host dependencies are unavailable. | Yes | Blocked | Docker daemon command timed out with no output. |
| `git diff --check` | Whitespace sanity check. | Yes | Passed | Evidence recorded. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No secret, permission, or artifact policy boundary is changed beyond existing public artifact checks. | Not Run | TBD |
| Integration smoke | No | No provider, MCP, dashboard, or external integration surface is changed. | Not Run | TBD |
