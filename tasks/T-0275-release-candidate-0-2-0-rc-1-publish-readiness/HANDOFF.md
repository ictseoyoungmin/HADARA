# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0275 |
| Status | Closed valid |
| Last Updated | 2026-06-06 |

## Last Completed

| Item | Evidence |
|---|---|
| Created T-0275 publish-readiness capsule. | `hadara task create --from release-read-model` returned T-0275. |
| Prepared `hadara@0.2.0-rc.1`. | `package.json`/lock version aligned, accidental self-dependency removed, README/release docs/manual helper updated. |
| Refreshed rc.1 evidence. | Focused Docker tests, full Docker check, release artifact, package smoke, clean-checkout smoke, release gate, release dry-run, publish dry-run, and npm registry exact-version check passed. |
| Closed T-0275. | `task finish --execute`, `task ready`, `task close --execute`, and `task audit-close` passed with `closed-valid`. |
| Verified README image URL. | Git tracked asset exists and the GitHub raw URL returned HTTP 200. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit the final source/evidence state if not already committed, then run `npm login --registry=https://registry.npmjs.org`, then `scripts/release/manual-publish-rc.sh T-0275 --execute`. | This helper reruns checks, performs npm publish dry-run, prompts for `publish`, then executes the npm publish mutation as the operator. | `scripts/release/manual-publish-rc.sh`, `docs/RELEASE_READINESS.md`. |
| Optional: add `--github-draft --github-release-note tasks/T-0275-release-candidate-0-2-0-rc-1-publish-readiness/GITHUB_RELEASE_NOTE.md` only if a GitHub draft release should also be prepared. | GitHub Release is secondary and token-gated. | `tasks/T-0275-release-candidate-0-2-0-rc-1-publish-readiness/GITHUB_RELEASE_NOTE.md`. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| This capsule did not run npm publish. | Publish is operator-only. | Operator runs the helper after npm login and final commit review. |
| README image uses a GitHub raw URL. | npm README rendering depends on the referenced branch asset staying available remotely. | Raw URL returned HTTP 200 during T-0275; keep the asset on the referenced branch. |
