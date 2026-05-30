# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused Vitest | Run protocol remediation and CLI regressions. | Yes | Passed: 2 files / 13 tests. | `npx vitest run tests/unit/protocol-remediation.test.ts tests/unit/protocol-cli.test.ts`. |
| Docker `npm run check` | Run the full repository check. | Yes | Passed: 61 files / 450 tests. | Docker `/tmp/hadara` full check. |
| Built CLI smoke | Verify `/workspace/dist` remediation dry-run and execute behavior. | Yes | Passed. | Temp fixture verified dry-run no-write and execute for all four fixes. |
| Done-level harness | Verify completed capsule gate. | Yes | Passed. | Built CLI `harness validate --task T-0157 --level done --json --project /workspace` returned `ok: true`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Bounded local project-file writes only; no secrets or permission boundary change. | Not Run | N/A |
| Integration smoke | No | No external integration surface changes. | Not Run | N/A |
