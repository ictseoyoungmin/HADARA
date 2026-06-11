# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Focused README/docs/release tests | Validate package README release text, package metadata staging, and lifecycle command semantics. | Yes | Passed | Initial run failed on old release artifact staging description; rerun passed 3 files / 31 tests. |
| Docker sync build | Rebuild and refresh `dist` from Docker. | Yes | Passed | Docker sync build passed 115 files / 741 tests; built CLI smoke `distLooksStale:false`. |
| Package smoke | Verify installable package behavior from current workspace. | Yes | Passed | `package smoke --execute --attach-evidence --task T-0297` passed and attached public summary. |
| Clean-checkout smoke | Verify clean checkout build/check/gate behavior. | Yes | Passed | Host clean-checkout failed at `npm ci`; Docker clean-checkout passed and attached public summary. |
| Release artifact | Build reduced release artifact report and attach evidence. | Yes | Passed | `release artifact --execute --attach-evidence --task T-0297` passed from checkpoint commit `34916db`. |
| Release dry-run / publish dry-run | Verify readiness without external mutation or token capture. | Yes | Passed | Strict release gate, release dry-run, and publish dry-run passed; publish dry-run reported token warnings only and mutation flags false. |
| npm registry verification | Confirm operator publish reached npm. | Yes | Passed | `npm view hadara@0.3.0-rc.0 version` returned `0.3.0-rc.0`; `latest` dist-tag points to `0.3.0-rc.0`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
