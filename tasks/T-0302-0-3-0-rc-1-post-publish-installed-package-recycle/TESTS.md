# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm registry metadata checks | Verify published package version/time/dist-tags and metadata. | Yes | Passed | `artifacts/recycle/recycle-report.txt`. |
| npx/global install smoke | Verify installed package launches from clean temp workspace. | Yes | Passed | `artifacts/recycle/recycle-report.txt`. |
| installed CLI surface smoke | Verify help, lifecycle help, command registry, docs surfaces, protocol migration, and task lifecycle. | Yes | Passed with recorded friction | `artifacts/recycle/step-status.tsv`; immediate post-init doctor exits 7 due missing `.hadara/context/HADARA_CONTEXT.md`. |
| 10-capsule dogfooding recycle | Run a small HADARA workflow project through 10 capsules to expose bugs/friction. | Yes | Passed | `artifacts/recycle/dogfood-success-rerun-task-log.tsv`: 10/10 ready, close, close execute, and audit passed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No permission/MCP/secret boundary is changed; published-package validation only. | Not Run | N/A |
| Integration smoke | Yes | Installed package and npm registry are the integration under test. | Passed | `artifacts/recycle/recycle-key-artifacts.tgz`. |
