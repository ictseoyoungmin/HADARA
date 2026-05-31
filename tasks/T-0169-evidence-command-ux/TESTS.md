# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Focused Docker vitest | Validate evidence add-command, lint, and ready surfaces. | Yes | Passed | `npx vitest run tests/unit/evidence-json.test.ts tests/unit/evidence-lint.test.ts tests/unit/task-ready.test.ts` passed with 3 files / 19 tests. |
| npm run check | Run full repository check. | Yes | Passed | Docker temp-copy `npm run check` passed with 66 files / 481 tests. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI evidence add-command smoke | Yes | Verify executable command-log shortcut. | Passed | `evidence add-command --task T-0169 --summary ... --result passed --json --project /workspace` returned `ok:true` and appended `command-log` evidence. |
| Done-level harness | Yes | Verify completed capsule. | Passed | `harness validate --task T-0169 --level done --json --project /workspace` returned `ok:true`. |
| Security smoke | No | Uses existing evidence writer and no command execution. | Not Run | Not applicable. |
| Integration smoke | No | No external integration changed. | Not Run | Not applicable. |
