# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused vitest | Validate helper and protocol callers. | Yes | Passed | `npx vitest run tests/unit/markdown-table.test.ts tests/unit/protocol-consistency.test.ts tests/unit/protocol-cli.test.ts` passed with 3 files / 34 tests. |
| Docker npm run check | Run full repository build and tests. | Yes | Passed | `npm run check` passed with 62 files / 466 tests in `/tmp/hadara`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built dist refresh | Yes | Source helper is used by built CLI reports. | Passed | `/workspace/dist` refreshed from `/tmp/hadara/dist`. |
| Built CLI done-level harness | Yes | Prove capsule completion state. | Passed | `harness validate --task T-0161 --level done --json --project /workspace` returned `ok: true`. |
| Security smoke | No | No security boundary changed. | Not Run | Not applicable. |
| Integration smoke | No | No integration surface changed. | Not Run | Not applicable. |
