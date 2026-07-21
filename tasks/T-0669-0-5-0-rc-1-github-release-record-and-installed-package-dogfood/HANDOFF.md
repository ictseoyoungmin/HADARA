# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0669 |
| Title | 0.5.0-rc.1 GitHub release record and installed-package dogfood |
| Status | Done |
| Created | 2026-07-21T21:33 |
| Updated | 2026-07-21T21:41 |
## Last Completed

| Item | Evidence |
|---|---|
| Operator-completed npm publish and GitHub Release publication for `0.5.0-rc.1` were recorded. | ev:T-0669:9d08f787f7d64d85ad72c1b3 |
| Public npm/GitHub state was verified from the workspace: npm `next=0.5.0-rc.1`, `latest=0.4.6`, and GitHub Release `v0.5.0-rc.1` returned HTTP 200. | ev:T-0669:374d423870f14757ada477b2 |
| Docker installed-package dogfood passed after installing public `hadara@next`: basic/standard/governed fresh profile smokes and package recycle passed. | ev:T-0669:39c8691d556943e68141f1fa |
| The first dogfood harness failure was recorded and resolved by correcting cwd/task assumptions in the script. | ev:T-0669:92db1f03c50a4c369243c453 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Proceed to the release-workflow design-fix capsule before further Phase D work. | `prepare-publish-env.sh` and the manual publish flow must generate or require public GitHub Release notes by construction. | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh`, `tasks/T-0669-0-5-0-rc-1-github-release-record-and-installed-package-dogfood/DOGFOOD_REPORT.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Full delegated toy application dogfood was not rerun in this capsule. | This proves installed package availability and core fresh-profile surfaces, not end-to-end app-building ergonomics. | Run a separate delegated dogfood capsule only if Phase D requires that signal. |
| The initial dogfood script assumed `--root` support and taskless context pack. | Invalid harness assumptions can look like package failures. | Keep installed-package dogfood cwd-based and create/select a task before context-pack checks. |
