# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `hadara@0.4.6-rc.1` source/readiness prepared. | `ev:T-0620:ac6df15e331f481a81fb1e43` |
| npm exact-version check confirmed `0.4.6-rc.1` was unpublished before operator publish. | `ev:T-0620:a5a1acda3d994e5ca744e219` |
| Package smoke and strict release gate passed for the rc.1 candidate. | `ev:T-0620:f37bb4127a4d4ff9a26e7cd7`, `ev:T-0620:f4077b5fbc514fceb9c19596` |
| Docker fast sync-build path passed and refreshed built CLI smoke to `0.4.6-rc.1`. | `ev:T-0620:40bc0c052d2a49d0a5a9fef8` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run the clean publish helper for `T-0620` when ready, then publish/create the GitHub prerelease. | This capsule intentionally stops before npm/GitHub mutation. | `scripts/release/manual-publish-rc.sh`, `tasks/T-0620-0-4-6-rc-1-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` |
| After publication, run installed-package recycle against `hadara@next` and expect `0.4.6-rc.1`. | rc.1 includes installed-package dogfood follow-up fixes and should be verified from npm. | `tasks/T-0615-0-4-6-rc-0-installed-package-multi-scenario-delegated-dogfood/DOGFOOD_REPORT.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Package smoke reported known empty-stdout fallback warnings for installed doctor, command-surface capture, and core feature smoke. | Evidence is weaker than direct stdout capture, but routing parity and strict release gate passed. | Treat as non-blocking residual; continue tracking the capture environment separately. |
| Initial stale operator habit used `package smoke`, which now prints help; canonical command is `smoke package`. | Wrong command form can waste a validation attempt. | Use `node dist/cli/main.js smoke package --execute --timeout 300 --json` and the release helper's canonical command. |
