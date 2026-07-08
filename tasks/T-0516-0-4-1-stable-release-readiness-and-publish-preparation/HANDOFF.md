# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Source metadata retargeted from `0.4.1-rc.0` to stable `0.4.1`. | `package.json`; `package-lock.json`; ev:T-0516:c350db29604743c1909bc809 |
| Package-facing README and release docs updated for stable `0.4.1` preparation. | `README.md`; `docs/RELEASE_NOTES.md`; `docs/RELEASE_READINESS.md`; ev:T-0516:da163705394440369c51c82a |
| Stable GitHub release note artifact added for `v0.4.1`. | `GITHUB_RELEASE_NOTE.md` |
| Package-smoke spawn error reporting hardened after sandbox EPERM dogfood. | `src/services/package-smoke.ts`; ev:T-0516:d6c585f30bc54e9bbd5617e2 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit T-0516, then run `bash scripts/release/prepare-publish-env.sh T-0516`; inside the clean clone run `bash scripts/release/manual-publish-rc.sh T-0516 --execute`. | `release artifact` requires a clean committed worktree, and the helper owns end-to-end release artifact/package smoke/npm dry-run/npm publish evidence before stable npm mutation. | `scripts/release/prepare-publish-env.sh`; `scripts/release/manual-publish-rc.sh`; `docs/RELEASE_READINESS.md` |
| After npm publish verification, create or publish GitHub Release `v0.4.1`, then run a separate installed-package recycle capsule for `hadara@latest` expected `0.4.1`. | Stable release publication and post-publish consumer proof are intentionally outside T-0516. | `tasks/T-0516-0-4-1-stable-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md`; `docs/RELEASE_READINESS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Local `release artifact` failed before commit with `RELEASE_ARTIFACT_WORKTREE_DIRTY`. | Expected for a source-prep capsule with uncommitted release metadata changes. | Run the publish helper from the clean committed clone; it regenerates release artifact evidence before publish. |
| Local package smoke hit sandbox npm cache `EROFS`, then installed-command spawn `EPERM`. | Local package smoke cannot fully prove installed subprocess behavior in this restricted shell. | Use `/tmp` npm cache for local debugging; authoritative package smoke runs in the clean ext4 publish clone. T-0516 fixed misleading spawn error reporting. |
| npm/GitHub publish did not run in T-0516. | `hadara@0.4.1` remains unpublished until operator executes the helper. | Run the explicit operator commands after commit and login. |
