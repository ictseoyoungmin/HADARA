# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed | Covered through `/tmp` `npm run check`: 117 files / 749 tests passed. |
| npm run check | Run the full repository check when available. | Yes | Passed | `T-0301:npm-run-check-tmp-copy`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `bash -n scripts/release/manual-publish-rc.sh` | Yes | Release helper changed. | Passed | `T-0301:manual-publish-bash-n`. |
| `manual-publish-rc.sh T-0297` guard smoke | Yes | Prevent rc.1 publish evidence from being attached to the old rc.0 capsule. | Passed | `T-0301:manual-publish-task-version-guard`. |
| Dry-run cleanup smoke | Yes | Prove generated release outputs are cleaned before npm auth/execute reuse. | Passed | `T-0301:manual-publish-dry-run-cleanup`. |
| Security smoke | No | No secret storage, permission, MCP, or execution boundary changed beyond release helper guardrails. | Not Run | N/A |
| Manual publish execute | Yes | Operator executed external npm publish after dry-run/readiness checks. | Passed | Published `hadara@0.3.0-rc.1`; npm view verified `0.3.0-rc.1`; GitHub draft false. |
