# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `bash scripts/release/manual-publish-rc.sh T-0402` | Final helper dry-run: validation/artifacts/smokes/gates/npm publish dry-run without mutation. | Yes before execute | Pending operator run | TBD |
| `bash scripts/release/manual-publish-rc.sh T-0402 --execute` | Approval-gated npm publish after npm login and typing `publish`. | Yes for publish completion | Pending operator run | TBD |
| `npm view hadara@0.3.3-rc.0 version --registry=https://registry.npmjs.org` | Verify exact registry version after publish. | Yes | Pending publish | TBD |
| `npm view hadara dist-tags --json --registry=https://registry.npmjs.org` | Verify `next` points to `0.3.3-rc.0` and `latest` remains stable. | Yes | Pending publish | TBD |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Installed-package smoke | Yes | Verify published package executes from consumer install path. | Pending publish | TBD |
| GitHub Release draft | No | Out of scope unless explicitly requested. | Not Run | n/a |
| Docker/PyPI/installer/MCP release execution | No | Deferred/out of scope for npm publish capsule. | Not Run | n/a |
