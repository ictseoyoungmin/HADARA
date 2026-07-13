# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Prepared `hadara@0.4.4-rc.0` source metadata, release notes/readiness docs, README release status, release helper examples, and GitHub prerelease note artifact. | `ev:T-0579:99e9627ede96433f97a13ab1` |
| Verified exact npm version is unpublished before operator publish. | `ev:T-0579:ec780f1860244bdcac80bc0b` |
| Verified built CLI reports `0.4.4-rc.0`, docs doctor currentness is clean, strict release gate passes, and Docker full check passes 153 files / 1068 tests. | `ev:T-0579:1e85fffe14f2401b88aa8211`, `ev:T-0579:370b652d038c4ec6a01c42cb`, `ev:T-0579:e57bc1d6ce8f429d98d5eda8`, `ev:T-0579:99e9627ede96433f97a13ab1` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit T-0579, then run the approval-gated publish helper for `hadara@0.4.4-rc.0` with npm dist-tag `next`. | Source/readiness is prepared; npm and GitHub mutations remain intentionally out of this capsule. | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh`, `tasks/T-0579-v0-4-4-rc-0-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` |
| After publish, create a separate installed-package recycle capsule against `hadara@next` expected `0.4.4-rc.0`. | Consumer-path verification belongs after the registry and GitHub Release are public. | `docs/RELEASE_READINESS.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `npm run dev:docker-sync-build` stalled during mounted workspace tar copy in this session. | The standard sync-build wrapper may be too opaque/slow on the WSL mount for large workspaces. | Use the clean ext4 publish clone for release artifact generation; direct `docker exec hadara-dev ... /workspace` build/check passed and refreshed `dist`; local feedback recorded at `.hadara/local/feedback/T-0579-dev-docker-sync-build-tar-stall.md`. |
| npm/GitHub publication has not been performed by this capsule. | `0.4.4-rc.0` source is ready but not externally available until the operator publish flow runs. | Run `bash scripts/release/prepare-publish-env.sh T-0579`, then `bash scripts/release/manual-publish-rc.sh T-0579 --execute`; create/publish GitHub prerelease with the capsule note. |
