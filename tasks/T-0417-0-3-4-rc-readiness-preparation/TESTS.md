# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused build/tests | Validate package/readme/init/release-doc changes and refresh dist. | Yes | Passed | `ev:T-0417:ecda3bba2ad74bbb8e236f3d` |
| Built CLI version smoke | Confirm built CLI reports `packageVersion=0.3.4-rc.0`. | Yes | Passed | `ev:T-0417:85ad10f4377f4bbd970e5756` |
| Release artifact execute | Generate 0.3.4-rc.0 tarball/checksum/manifest metadata from a clean checkpoint without publish mutation. | Yes | Passed after expected dirty-worktree failure | failed `ev:T-0417:c238c70a24b34dbc9db55f7f`; passed `ev:T-0417:08b2899cd422471ab020fab8`, resolved by `ev:T-0417:b91dada7c6af4e83a874bea2` |
| Release dry-run/readiness smoke | Confirm source readiness without publish mutation. | Yes | Passed on ext4 copy; mounted workspace exceeded 30s and was interrupted | `ev:T-0417:12f0252b75924831872e82b0` |
| Release publish dry-run | Confirm publish remains approval/token gated and no mutation executes. | Yes | Passed | `ev:T-0417:8dac1b2a716949d29310c171` |
| Package smoke dry-run | Confirm package metadata/read-only smoke plan. | Yes | Passed | `ev:T-0417:7759e003e45f47fa87c689e8` |
| git diff --check | Catch whitespace errors. | Yes | Passed | `ev:T-0417:8aa3da465aea45688f1d43cd` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| npm publish | No | Approval-gated follow-up capsule only. | Not Run | Out of scope |
| GitHub Release draft | No | Secondary target; approval-gated follow-up only. | Not Run | Out of scope |
