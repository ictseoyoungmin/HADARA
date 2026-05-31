# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run build` | Type-check the updated service/report shape. | Yes | Passed | Docker `/tmp/hadara` build passed. |
| Docker `npx vitest run tests/unit/protocol-remediation.test.ts tests/unit/protocol-cli.test.ts` | Focused remediation and CLI regression coverage. | Yes | Passed | 2 files / 18 tests passed. |
| Docker `npm run check` | Full repository check. | Yes | Passed | 61 files / 455 tests passed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI remediation smoke | Yes | Verify refreshed workspace `dist` behavior for user-facing CLI. | Passed | Refreshed `/workspace/dist`; temp fixture verified Metadata row preservation and Task Board/Decisions guard warnings. |
| Done-level harness validation | Yes | Required before marking capsule Done. | Passed | Built CLI `harness validate --task T-0158 --level done --json --project /workspace` returned `ok: true`; task/docs protocol doctors also returned `ok: true`. |
