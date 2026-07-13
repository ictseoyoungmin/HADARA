# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Stable `0.4.4` package metadata, README, Getting Started, release notes/readiness, helper examples, and GitHub Release note artifact were prepared. | `ev:T-0583:5518f956424c431a96f9206a` |
| Docker full suite/dist refresh, package smoke, clean-checkout smoke, docs doctor, and strict release gate passed. | `ev:T-0583:7124c5762ff64ec5b166cb69` |
| Docs registry profile semantics were hotfixed so document entry `profiles` uses only `basic`, `standard`, and `governed`; `hadara-dev` remains only as local project/owner metadata. | `ev:T-0583:5723e0f57f404a2cab627cef` |
| Package smoke passed after the registry hotfix; the sandbox npm-pack failure was resolved by an approved external rerun. | `ev:T-0583:f0ed9b5cb09f429198437689`, `ev:T-0583:308d82caa20f47a59cbc9415` |
| Final stable `0.4.4` readiness passed on commit `4db58a4a`: package smoke, clean-checkout smoke, release artifact, release dry-run, publish dry-run, strict release gate, and docs doctor are green. | `ev:T-0583:7b86c5b10f054f9d9a8be71d` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run the operator-controlled stable publish flow, then verify installed-package recycle. | T-0583 prepared and validated source readiness only; npm/GitHub mutation stays outside the capsule. | `GITHUB_RELEASE_NOTE.md`, `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh` |

## Operator Commands

| Step | Command |
|---|---|
| Prepare clean publish clone | `bash scripts/release/prepare-publish-env.sh T-0583` |
| Publish npm package from the clean clone | `bash scripts/release/manual-publish-rc.sh T-0583 --execute` |
| Create GitHub Release draft manually if not using helper draft mode | `gh release create v0.4.4 --repo ictseoyoungmin/HADARA --target $(git rev-parse HEAD) --title "HADARA 0.4.4" --notes-file tasks/T-0583-v0-4-4-stable-source-and-release-preparation/GITHUB_RELEASE_NOTE.md --draft` |
| Publish reviewed GitHub Release | `gh release edit v0.4.4 --repo ictseoyoungmin/HADARA --draft=false` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Host focused release test hit `spawnSync bash EPERM`. | Host shell-launch restriction affects the test wrapper, not the release source. | Docker full suite passed and remains authoritative. |
| First package-smoke run hit npm cache `EROFS` in sandbox. | Sandbox npm cache was read-only, so `npm pack` produced no tarball. | Approved external rerun passed package smoke; resolved by `ev:T-0583:308d82caa20f47a59cbc9415`. |
| Release artifact failed before source-prep commit. | This is expected because artifact metadata requires a clean git worktree. | Clean-commit artifact passed at `ev:T-0583:6ef3051d7e7948d4a614c11e`. |
| Do not add `hadara-dev` back to document entry `profiles`. | It reads as a product init profile and leaks internal HADARA-dev identity to downstream projects. | Use `projectProfile`, `owner`, `scope`, `readTier`, and `status` for local/internal/historical routing. |
