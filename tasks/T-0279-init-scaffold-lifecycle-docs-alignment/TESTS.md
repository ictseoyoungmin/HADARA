# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/init.test.ts tests/unit/task-workflow-docs.test.ts` | Focused generated init/workflow docs regression tests. | Yes | Passed | Docker `/tmp/hadara-t0279`: 2 files / 24 tests passed. |
| `npm run build` | TypeScript build after CLI template changes. | Yes | Passed | Docker `/tmp/hadara-t0279` build passed. |
| `npm run check` | Full repository check and build. | Yes | Passed | Docker `/tmp/hadara`: 100 files / 681 tests passed; workspace `dist` refreshed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built init smoke | Yes | Proves generated docs exist through refreshed built CLI. | Passed | `node /workspace/dist/cli/main.js init --profile basic --project /tmp/hadara-t0279-init-smoke --json`; `init doctor --json`; file/grep checks for workflow doc and AGENTS registration passed. |
| Host focused tests/build | No | Host `node_modules` is absent in this workspace. | Failed as environment check | `vitest` and `tsc` were not found on host, so validation used Docker per project baseline. |
