# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused wrapper | Run focused Phase 6.1 actor plumbing tests. | Yes | Passed | `node dist/cli/main.js dev docker-check --focused tests/unit/task-finish.test.ts tests/unit/task-ready.test.ts tests/unit/task-close.test.ts tests/unit/task-complete-flow.test.ts tests/unit/handoff-suggestion.test.ts tests/unit/dev-docker-check.test.ts --json` returned `ok:true`. |
| Docker sync-build | Run full repository check and refresh workspace `dist`. | Yes | Passed | `npm run dev:docker-sync-build` passed 100 files / 667 tests and refreshed workspace `dist`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| focused workflow tests | Yes | Template expected evidence. | Passed | Focused wrapper covered task lifecycle, handoff suggestion, and dev docker-check actor plumbing. |
| full Docker check | Yes | Template expected evidence. | Passed | Docker sync-build passed 100 files / 667 tests. |
| built CLI workflow smoke | Yes | Template expected evidence. | Passed | Built `task complete --task T-0262 --agent-id coord-0262 --run-id run-0262 --actor-role coordinator --parent-run-id root-run --json` returned actor `{agentId:"coord-0262", runId:"run-0262", role:"coordinator", parentRunId:"root-run"}`; exit 6 was expected while the task was still unfinished. |
