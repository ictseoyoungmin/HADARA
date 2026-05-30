# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused Vitest | Run protocol profile/unit and CLI regressions. | Yes | Passed: 2 files / 18 tests. | `docker exec hadara-dev ... npx vitest run tests/unit/protocol-consistency.test.ts tests/unit/protocol-cli.test.ts` |
| Docker `npm run check` | Run the full repository check. | Yes | Passed: 60 files / 440 tests. | `docker exec hadara-dev ... npm run check` after syncing changed files into `/tmp/hadara`. |
| Built CLI smoke | Verify `/workspace/dist` supports profile scope after refresh. | Yes | Passed. | Profile scope ok with `summary.profile` and 0 issues; task scope ok for T-0156; docs scope ok with two historical warnings; conflict returns `CLI_OPTION_INVALID_VALUE`. |
| Done-level harness | Verify completed capsule gate. | Yes | Passed. | `node /workspace/dist/cli/main.js harness validate --task T-0156 --level done --json --project /workspace` returned `ok: true` with no issues. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changes. | Not Run | N/A |
| Integration smoke | No | No external integration surface changes. | Not Run | N/A |
