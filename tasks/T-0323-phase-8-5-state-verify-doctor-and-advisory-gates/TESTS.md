# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused `npm run test:focused -- tests/unit/state-projection.test.ts tests/unit/status-json.test.ts tests/unit/protocol-consistency.test.ts tests/unit/protocol-cli.test.ts tests/unit/ci-gate.test.ts` | Validate state verify/status/protocol/CI integrations. | Yes | Passed: 5 files / 50 tests after TypeScript build. | `ev:T-0323:6228b5ce5ef34716a09f6ca3` |
| `npm run dev:docker-sync-build` | Run full Docker validation and refresh workspace `dist`. | Yes | Passed: 119 files / 776 tests, `distLooksStale:false`. Initial run failed on missing `state.verify` lifecycle doc alignment; second run hit a transient TUI snapshot timeout that passed focused and passed on final full retry. | `ev:T-0323:ff9256e91d3d4c9f808599b0` |
| Built CLI smokes | Verify public read-only surfaces from refreshed `dist`. | Yes | Passed: `state verify`, `status`, `protocol doctor --scope all`, and `ci gate --mode advisory --task T-0323` returned exit 0 and exposed advisory state consistency data. | `ev:T-0323:47236a4ba7234e7d836ccb47` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `git diff --check` | Required final whitespace check. | Yes | Passed after capsule and shared-state document synchronization. | `ev:T-0323:a624ebc1d48e419ab7dd6210` |
| Security smoke | No | No permissions, secrets, storage, MCP, or execution boundary changed. | Not Run | Not applicable. |
| Release gate/publish smoke | No | Release publish gate changes are out of scope. | Not Run | Not applicable. |
