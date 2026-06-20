# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `bash scripts/release/manual-publish-rc.sh T-0402` | Final helper dry-run: validation/artifacts/smokes/gates/npm publish dry-run without mutation. | Yes before execute | Passed before operator execute | Helper output from operator run |
| `bash scripts/release/manual-publish-rc.sh T-0402 --execute` | Approval-gated npm publish after npm login and typing `publish`. | Yes for publish completion | Passed; npm publish completed and npm view observed `0.3.3-rc.0` | ev:T-0402:400a8a3c43b248cc8d4fcb0f |
| `npm view hadara@0.3.3-rc.0 version --registry=https://registry.npmjs.org` | Verify exact registry version after publish. | Yes | Passed; returned `0.3.3-rc.0` | ev:T-0402:4addcdd15a8149afb69c2e40 |
| `npm view hadara dist-tags --json --registry=https://registry.npmjs.org` | Verify `next` points to `0.3.3-rc.0` and `latest` remains stable. | Yes | Passed; returned `next=0.3.3-rc.0`, `latest=0.3.2` | ev:T-0402:4addcdd15a8149afb69c2e40 |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Installed-package smoke | Yes | Verify published package executes from consumer install path. | Passed; temp-prefix install ran `hadara version --json` and `hadara help` from the installed package | ev:T-0402:708f2b933fff46a3917b01dc |
| GitHub Release draft | No | Out of scope unless explicitly requested. | Not Run; helper skipped GitHub Release draft | ev:T-0402:400a8a3c43b248cc8d4fcb0f |
| Docker/PyPI/installer/MCP release execution | No | Deferred/out of scope for npm publish capsule. | Not Run | ev:T-0402:400a8a3c43b248cc8d4fcb0f |
