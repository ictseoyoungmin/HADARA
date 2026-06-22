# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm view hadara@0.3.3 version --registry=https://registry.npmjs.org` | Verify exact stable registry version. | Yes | Passed: `0.3.3` | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| `npm view hadara dist-tags --json --registry=https://registry.npmjs.org` | Verify `latest` and `next` dist-tags. | Yes | Passed: `latest=0.3.3`, `next=0.3.3-rc.0` | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| Temporary-prefix `npm install hadara@latest` | Install from the actual npm package path. | Yes | Passed | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| Installed-bin `hadara version --json` | Verify package version and bin execution. | Yes | Passed: `packageVersion=0.3.3` | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| Installed-bin `hadara help lifecycle --json` | Verify lifecycle help surface in published package. | Yes | Passed | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| Disposable project `hadara init` smoke | Verify generated project scaffolding from installed package. | Yes | Passed | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| Disposable project lifecycle/finalize smoke | Verify task create/status/lifecycle/finalize path from installed package. | Yes | Passed | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| Disposable project context smoke | Verify graph/pack/slice/cache/session-start from installed package. | Yes | Passed | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |
| Temporary path cleanup check | Verify temp consumer prefix/project are removed. | Yes | Passed | `ev:T-0407:339f60f3bccd4aa09b5fcfaa` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| GitHub Release draft | No | Secondary approval-gated release target, not part of package recycle. | Not Run | Not applicable. |
| Source repo full test suite | No | T-0407 validates published package behavior, not source implementation. | Not Run | Not applicable. |
