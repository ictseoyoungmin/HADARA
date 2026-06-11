# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/protocol-migration.test.ts tests/unit/task-finish.test.ts` | Validate migration evidence preservation and managed Status History finish regressions. | Yes | Passed: 2 files / 15 tests. | `ev:T-0300:3f6820...` |
| `npm run build` | Type-check changed TypeScript. | Yes | Passed; workspace `dist` refreshed from Docker build output. | `ev:T-0300:3f6820...` |
| `npm run check` | Run the full repository check when available. | No | Not Run | This is a narrow blocker fix; focused regression plus build is the done gate unless broader changes appear. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Data preservation regression | Yes | Prevents protocol migration from erasing task evidence history. | Passed in combined focused suite; built CLI preservation smoke passed earlier. | `ev:T-0300:3f6820...`; `ev:T-0300:695aa1...` |
| Managed table rendering regression | Yes | Prevents `task finish` from breaking Status History Markdown. | Passed: unit regression and built CLI smoke confirmed Done row before managed end marker. | `ev:T-0300:7acb4e...` |
| Release publish smoke | No | Publish is explicitly out of scope. | Not Run | Later final readiness/publish capsule. |
