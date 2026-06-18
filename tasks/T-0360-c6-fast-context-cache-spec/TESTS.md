# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| git diff --check | Verify Markdown/JSON diff whitespace hygiene. | Yes | Passed | `ev:T-0360:4b9fb9a2f39c4361a4f65eab` |
| node dist/cli/main.js docs required-reading --json | Verify Required Reading registry output remains valid. | Yes | Passed | `ev:T-0360:4b9fb9a2f39c4361a4f65eab` |
| node dist/cli/main.js docs list --json | Verify docs registry parses and includes the new C6 spec. | Yes | Passed | `ev:T-0360:4b9fb9a2f39c4361a4f65eab` |
| rg new C6 spec/link terms | Verify new spec and routing references are present. | Yes | Passed | `ev:T-0360:4b9fb9a2f39c4361a4f65eab` |
| npm test | Run the default project test suite. | No | Not Run | Docs-only task; no runtime/source code changed. |
| npm run check | Run the full repository check when available. | No | Not Run | Docs-only task; no runtime/source code changed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changed. | Not Run | Not applicable. |
| Integration smoke | No | No runtime integration surface changed. | Not Run | Not applicable. |
