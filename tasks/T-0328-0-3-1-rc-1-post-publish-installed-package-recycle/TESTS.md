# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm view hadara@0.3.1-rc.1 version --registry=https://registry.npmjs.org` | Verify exact published package version. | Yes | Passed | `command:T-0328:published-cli-surface-recycle` |
| `npx hadara@0.3.1-rc.1 version --json` | Convenience exact npx smoke. | Yes | Passed | `command:T-0328:published-cli-surface-recycle` |
| temp-prefix install and `hadara version --json` | Canonical installed-bin consumer proof. | Yes | Passed | `command:T-0328:published-cli-surface-recycle` |
| installed command registry and broad CLI command-family matrix | Exercise installed package CLI surface from container consumer paths. | Yes | Passed | `command:T-0328:published-cli-surface-recycle`; 71 registry entries observed. |
| fresh init/docs/migration/task-finish/lifecycle smokes | Consumer recycle behavior. | Yes | Passed | `command:T-0328:published-cli-surface-recycle` |
| temp-folder cleanup check | Verify disposable recycle directories were removed. | Yes | Passed | `command:T-0328:published-cli-surface-recycle` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | Not needed; no security boundary changed. |
| Publish helper execute | No | Completed in T-0327 before recycle. | Not Run | Out of scope. |
