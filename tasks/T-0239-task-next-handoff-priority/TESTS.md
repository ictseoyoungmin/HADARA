# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/task-next.test.ts tests/unit/schema-fixtures.test.ts tests/unit/task-workflow-docs.test.ts | Validate task-next policy, schema fixture compatibility, and workflow docs. | Yes | Passed: 3 files / 9 tests. | T-0239 evidence `ev:T-0239:35f7a9dbf3634bab8afeaf7a`. |
| npm run dev:docker-sync-build | Run full Docker check, refresh `/workspace/dist`, and smoke built CLI version. | Yes | Passed: 92 files / 608 tests; built version smoke ok:true. | T-0239 evidence `ev:T-0239:465a82120fa94e5baec69fc6`. |
| node dist/cli/main.js task next --json | Built CLI smoke for current HADARA-dev workspace. | Yes | Passed: primary source `docs/AGENT_HANDOFF.md`, policy `handoff-first`, T-0006 only in `backlog`. | T-0239 evidence `ev:T-0239:26beb59436354f9f9d4a1e94`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Read-only boundary review | Yes | `task next` must not create tasks or mutate docs. | Passed | Implementation only reads docs and task capsule metadata; output provides `createCommand` but does not execute it. |
| Security smoke | No | No secret, permission, storage, or execution boundary change. | Not Run | Not applicable. |
| Integration smoke | No | No MCP/provider/dashboard/TUI runtime change. | Not Run | Not applicable. |
