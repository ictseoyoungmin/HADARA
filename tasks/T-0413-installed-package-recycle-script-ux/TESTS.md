# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `/tmp/hadara` `npm run build` | Type-check and build changed CLI/service/schema files with dev dependencies. | Yes | Passed | ev:T-0413:db037677d84640d39722a7c7 |
| Docker `/tmp/hadara` focused unit tests | `package-recycle`, command registry, tools projection, and schema fixture tests. | Yes | Passed: 5 files / 19 tests | ev:T-0413:db037677d84640d39722a7c7 |
| Built CLI dry-run smoke | `node dist/cli/main.js package recycle --package hadara@latest --expected-version 0.3.3 --json`. | Yes | Passed: `hadara.packageRecycle.v1`, `ok:true`, no registry/install execution. | ev:T-0413:db037677d84640d39722a7c7 |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Live npm registry execute recycle | No | Requires network/registry availability and is intended as release-operator post-publish validation. | Not Run in this capsule; execute path covered by fake runner unit test. | ev:T-0413:db037677d84640d39722a7c7 |
