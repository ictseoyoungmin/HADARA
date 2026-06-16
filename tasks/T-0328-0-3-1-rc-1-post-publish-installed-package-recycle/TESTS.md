# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm view hadara@0.3.1-rc.1 version --registry=https://registry.npmjs.org` | Verify exact published package version. | Yes | Not Run | Pending. |
| `npx hadara@0.3.1-rc.1 version --json` | Convenience exact npx smoke. | Yes | Not Run | Pending. |
| temp-prefix install and `hadara version --json` | Canonical installed-bin consumer proof. | Yes | Not Run | Pending. |
| fresh init/docs/migration/task-finish/lifecycle smokes | Consumer recycle behavior. | Yes | Not Run | Pending. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Publish helper execute | No | Completed in T-0327 before recycle. | Not Run | Out of scope. |
