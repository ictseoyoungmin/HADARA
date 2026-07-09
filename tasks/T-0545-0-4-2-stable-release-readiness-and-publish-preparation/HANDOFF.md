# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Prepared stable `hadara@0.4.2` source/readiness: metadata, README, release notes, readiness docs, helper examples, and GitHub Release note artifact now target stable `0.4.2`. | `ev:T-0545:c0615e6dadba492ba83a0610` |
| Docker sync-build passed `npm ci`, build, full Vitest 148 files / 1014 tests, refreshed `dist`, and built/local version smokes report `packageVersion=0.4.2` with `distLooksStale:false`. | `ev:T-0545:c0615e6dadba492ba83a0610` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run `bash scripts/release/prepare-publish-env.sh T-0545` from the host workspace, then run `bash scripts/release/manual-publish-rc.sh T-0545 --execute` inside the prepared ext4 clone. | Release dry-run correctly blocks until current-version release artifact evidence is regenerated from committed source; the clean publish clone is the intended release artifact/package smoke/npm publish boundary. | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh`, `tasks/T-0545-0-4-2-stable-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` |
| After npm publish, create or publish the stable GitHub Release `v0.4.2`, then open a post-publish evidence sync capsule and installed-package recycle capsule. | npm/GitHub mutation and installed package proof are intentionally out of this source-prep capsule. | `docs/RELEASE_READINESS.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `release dry-run` remains blocked before clean-clone release artifact regeneration. | This workspace source-prep commit is not the final release artifact/package smoke evidence boundary. | Use `prepare-publish-env.sh T-0545` after commit, then `manual-publish-rc.sh T-0545 --execute` from `/root/hadara-publish`. |
| Stable installed-package proof is pending until npm/GitHub publication completes. | `hadara@latest` still resolves to the previous stable until operator publish. | Run a separate recycle capsule with `hadara package recycle --execute --package hadara@latest --expected-version 0.4.2 --task <task-id> --attach-evidence --json`. |
