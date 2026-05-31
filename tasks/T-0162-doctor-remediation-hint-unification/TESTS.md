# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused vitest | Validate doctor hints and remediation behavior. | Yes | Passed | `npx vitest run tests/unit/protocol-consistency.test.ts tests/unit/protocol-cli.test.ts tests/unit/protocol-remediation.test.ts` passed with 3 files / 38 tests. |
| Docker npm run check | Run full repository build and tests. | Yes | Passed | `npm run check` passed with 62 files / 467 tests in `/tmp/hadara`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI docs-scope smoke | Yes | Verify report exposes safe-auto hints without writes. | Passed | Built CLI `protocol doctor --scope docs --json --project /workspace` returned `ok: true` with safe-auto remediations for known warning issues. |
| Built dist refresh | Yes | Source changes affect built CLI reports. | Passed | `/workspace/dist` refreshed from `/tmp/hadara/dist`. |
| Built CLI done-level harness | Yes | Prove capsule completion state. | Passed | `harness validate --task T-0162 --level done --json --project /workspace` returned `ok: true`. |
| Security smoke | No | No security boundary changed. | Not Run | Not applicable. |
| Integration smoke | No | No integration surface changed. | Not Run | Not applicable. |
