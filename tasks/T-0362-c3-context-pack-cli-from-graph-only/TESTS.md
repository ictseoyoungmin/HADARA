# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed via Docker wrapper | `ev:T-0362:80274e2e6d864599ad68a161`, `ev:T-0362:7532361940774df48a734813` |
| npm run check | Run the full repository check when available. | Yes | Passed via Docker wrapper | `ev:T-0362:80274e2e6d864599ad68a161`, `ev:T-0362:7532361940774df48a734813` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Initial Docker dev check | Yes | Preserve failed validation before corrected test assertion. | Failed, then resolved | `ev:T-0362:aed570d4fdc3459ea8ddc876` resolved by `ev:T-0362:80274e2e6d864599ad68a161` |
| Docker dev check | Yes | Full source validation after CLI/test correction. | Passed: 131 files / 842 tests | `ev:T-0362:80274e2e6d864599ad68a161` |
| Docker sync-build | Yes | Refresh workspace `dist` after CLI code changes. | Passed: 131 files / 842 tests, `distLooksStale:false` | `ev:T-0362:7532361940774df48a734813` |
| Built CLI context pack smoke | Yes | Verify refreshed `dist` exposes graph-only and include-code context pack commands. | Passed; include-code live path was slow and cache-free | `ev:T-0362:b9c56d667eb144f08d44ab03` |
| Security smoke | No | Only if security boundary changes. | Not Run | Not applicable |
| Integration smoke | No | Only if integration surface changes. | Not Run | Not applicable |
