# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `hadara@0.4.2-rc.0` source/readiness prepared for operator publish. | `ev:T-0539:707dc09b46744269b33f47b9` |
| Dirty-worktree release artifact execute was refused and resolved as the expected pre-commit safety boundary. | `ev:T-0539:327561d3464641b7b8322685` resolved by `ev:T-0539:707dc09b46744269b33f47b9` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run publish preparation in a clean ext4 clone: `bash scripts/release/prepare-publish-env.sh T-0539`, then from `/root/hadara-publish` run `bash scripts/release/manual-publish-rc.sh T-0539 --execute`. | T-0539 retargeted source/docs to `0.4.2-rc.0`; clean clone must regenerate release artifact/package smoke/clean-checkout evidence before npm publish. | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh`, `tasks/T-0539-0-4-2-rc0-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` |
| After npm/GitHub publication, open a post-publish evidence sync capsule and then installed-package recycle for `hadara@next` expected `0.4.2-rc.0`. | Publish and recycle are intentionally outside this source-preparation capsule. | `docs/RELEASE_READINESS.md`, `docs/RELEASE_NOTES.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `release dry-run` is blocked until current-version release artifact evidence exists. | Expected in this dirty source-preparation worktree after version bump; not a publish blocker once the clean publish clone regenerates artifacts. | Use the manual publish helper from the committed clean clone; it runs release artifact, package smoke, clean-checkout smoke, strict gate, dry-run, and publish dry-run before npm publish. |
| Stable `latest` remains `hadara@0.4.1` until the operator publishes the RC to `next`. | Users should continue installing `hadara@0.4.1` unless intentionally testing the RC after publish. | Keep README stable install examples on `0.4.1`; publish RC with `next`. |
