# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Source metadata and release-facing docs were retargeted to stable `0.4.6`. | `package.json`, `README.md`, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md` |
| Stable GitHub Release note artifact was prepared. | `tasks/T-0629-0-4-6-stable-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| After T-0629 is committed, run `bash scripts/release/prepare-publish-env.sh T-0629`, then publish from `/root/hadara-publish` with `bash scripts/release/manual-publish-rc.sh T-0629 --execute`. | The publish helper owns release artifact regeneration, package smoke, npm dry-run, and npm publish; it must run from the clean ext4 clone. | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh` |
| After npm publish, create or publish GitHub Release `v0.4.6` with this capsule's release note. | GitHub Release publication remains operator-controlled. | `GITHUB_RELEASE_NOTE.md` |
| After public publication, run installed-package recycle from `hadara@latest` expected `0.4.6`. | Stable readiness is complete only after consumer-path verification. | future recycle capsule |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| npm/GitHub publication is not part of source prep. | T-0629 can only make the workspace publish-ready. | Use the release helper commands after this commit. |
| Installed-package recycle remains separate. | Public package behavior is not verified until after registry/GitHub publication. | Create a follow-up operator publish/recycle capsule. |
