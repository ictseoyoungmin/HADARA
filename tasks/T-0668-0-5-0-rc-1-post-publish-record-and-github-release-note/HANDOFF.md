# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0668 |
| Title | 0.5.0-rc.1 post-publish record and GitHub release note |
| Status | Done |
| Created | 2026-07-21T21:08 |
| Updated | 2026-07-21T21:15 |
## Last Completed

| Item | Evidence |
|---|---|
| npm publish for `hadara@0.5.0-rc.1` was recorded in the workspace; registry verification returned `version=0.5.0-rc.1`, `next=0.5.0-rc.1`, and `latest=0.4.6`. | ev:T-0668:f04d19ba0b5f47e3bf51276e |
| `GITHUB_RELEASE_NOTE.md` was created for `v0.5.0-rc.1`; GitHub Release mutation was not executed. | ev:T-0668:1ec8ae46a0f04aa3830ff767 |
| Installed-package recycle passed from `hadara@next` expected `0.5.0-rc.1`, with reduced public evidence. | ev:T-0668:a16978bfab134da9abadc752 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| No follow-up task is queued from this capsule. | npm publish and installed-package recycle are complete; GitHub Release remains an external mutation that requires explicit operator approval/auth if wanted. | `tasks/T-0668-0-5-0-rc-1-post-publish-record-and-github-release-note/GITHUB_RELEASE_NOTE.md`, `scripts/release/manual-publish-rc.sh` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `prepare-publish-env.sh` previously printed a `GITHUB_RELEASE_NOTE.md` path even when the file did not exist. | Operators could reach the GitHub Release step with a broken notes-file path. | T-0668 creates the release-note artifact for this release; fix the script contract in the planned release-workflow design capsule. |
| GitHub Release is not yet created/published for `v0.5.0-rc.1`. | npm `next` is published and recycled, but GitHub prerelease assets remain pending. | Run the GitHub release flow only with explicit operator approval and auth. |
