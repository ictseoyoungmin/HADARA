# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker full validation | `npm run dev:docker-sync-build`. | Yes | Not Run | TBD |
| Focused release/docs tests | Focused tests for README/release helper/version/docs-adjacent changes. | Yes | Not Run | TBD |
| Stable surface smokes | Built CLI help, lifecycle help, commands, docs list/doctor/required-reading/explain, managed list. | Yes | Not Run | TBD |
| Fresh init profile smokes | Basic/standard/governed init doctor/docs checks. | Yes | Not Run | TBD |
| Managed patch smoke | Disposable project dry-run plus execute with reviewed `targetBeforeHash`. | Yes | Not Run | TBD |
| Protocol migration smoke | Disposable legacy fixture dry-run plus execute with reviewed `beforeHash`. | Yes | Not Run | TBD |
| Lifecycle dogfood | Disposable project task finish/ready/close/audit loop. | Yes | Not Run | TBD |
| Release readiness checks | Release artifact, package smoke, clean-checkout smoke, strict gate, release dry-run, publish dry-run. | Yes | Not Run | TBD |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| npm publish | No | Out of scope; T-0316 only after approval. | Not Run | T-0315 boundary |
| GitHub Release / Docker / PyPI mutation | No | Deferred or approval-gated targets. | Not Run | T-0315 boundary |
