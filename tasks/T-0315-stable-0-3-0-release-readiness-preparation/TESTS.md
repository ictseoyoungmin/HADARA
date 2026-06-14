# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker full validation | `npm run dev:docker-sync-build`. | Yes | Passed | Final run passed 118 files / 765 tests, refreshed `dist`, and reported `distLooksStale:false`; an immediately prior run hit a timeout in `evidence-parallel-append` and was rerun successfully. |
| Focused release/docs tests | Focused tests for README/release helper/version/docs-adjacent changes. | Yes | Passed | Initial focused set passed 5 files / 66 tests; publish/gate focused set passed 3 files / 43 tests. |
| Stable surface smokes | Built CLI help, lifecycle help, commands, docs list/doctor/required-reading/explain, managed list. | Yes | Passed | Evidence `command:T-0315:stable-surfaces`. |
| Fresh init profile smokes | Basic/standard/governed init doctor/docs checks. | Yes | Passed | Evidence `command:T-0315:workflow-smokes`. |
| Managed patch smoke | Disposable project dry-run plus execute with reviewed `targetBeforeHash`. | Yes | Passed | Evidence `command:T-0315:workflow-smokes`. |
| Protocol migration smoke | Disposable legacy fixture dry-run plus execute with reviewed `beforeHash`. | Yes | Passed | Evidence `command:T-0315:workflow-smokes`. |
| Lifecycle dogfood | Disposable project task finish/ready loop. | Yes | Passed | Evidence `command:T-0315:workflow-smokes`. |
| Release readiness checks | Release artifact, package smoke, clean-checkout smoke, strict gate, release dry-run, publish dry-run. | Yes | Passed | Final release artifact/package/clean-checkout artifacts plus `command:T-0315:final-release-dry-runs`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| npm publish | No | Out of scope; T-0316 only after approval. | Not Run | T-0315 boundary |
| GitHub Release / Docker / PyPI mutation | No | Deferred or approval-gated targets. | Not Run | T-0315 boundary |
