# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused tests | Validate generated init docs and root workflow docs. | Yes | Passed | `npm run test:focused -- tests/unit/init.test.ts tests/unit/task-workflow-docs.test.ts` passed 2 files / 24 tests in Docker `/tmp/hadara`. |
| Docker build and dist refresh | Build changed init template code and refresh workspace `dist`. | Yes | Passed | `npm run build` in Docker `/tmp/hadara` passed and copied `dist` to `/workspace/dist`. |
| Built fresh-init smoke | Confirm built CLI generates timing/concurrency guidance. | Yes | Passed | Built standard init smoke found guidance in generated AGENTS, SOP, and TASK_WORKFLOW_COMMANDS. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changed. | Not Run | Not required. |
| Full Docker check | No | Narrow docs/template guidance capsule; focused tests and build cover touched surfaces. | Not Run | Deferred by scope. |
