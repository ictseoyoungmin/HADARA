# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Source/readiness retargeted to `hadara@0.4.5`. | `package.json`; `docs/RELEASE_NOTES.md`; `tasks/T-0597-0-4-5-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` |
| Docker package smoke passed and attached T-0597 package-smoke evidence. | `tasks/T-0597-0-4-5-release-readiness-and-publish-preparation/artifacts/package-smoke/` |
| Strict release gate passed after T-0597 package-smoke evidence. | `EVIDENCE.md` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit T-0597, then run `bash scripts/release/prepare-publish-env.sh T-0597` from the host. | The release artifact builder requires a clean committed worktree; the publish helper owns fresh artifact, clean-checkout, npm dry-run, and approval-gated publish. | `scripts/release/prepare-publish-env.sh`; `scripts/release/manual-publish-rc.sh`; `GITHUB_RELEASE_NOTE.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Host package-smoke can still fail to spawn npm in this tool environment. | Direct host `smoke package --execute` can report infrastructure failure even though Docker/package behavior is healthy. | Use Docker `/workspace` or the clean ext4 publish clone for release smoke; T-0597 also hardens npm cache handling for pack/install. |
| `release artifact --execute` refuses dirty worktrees. | It cannot be run before the source-preparation commit. | Run the publish helper from the clean clone after this commit; do not hand-build artifacts from a dirty workspace. |
