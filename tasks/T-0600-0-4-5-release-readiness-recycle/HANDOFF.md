# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| T-0598 closed the 0.4.5 brownfield adoption safety gaps. | `tasks/T-0598-0-4-5-brownfield-adoption-safety-gap-closure/HANDOFF.md` |
| T-0599 verified the current installed candidate across TypeScript, Python/data, and governed web monorepo brownfield fixtures. | `ev:T-0599:84e1144bdfb34d60a5e78132` |
| T-0600 recycled release readiness from current source after T-0598/T-0599, including build, Docker build, docs/init doctor, installed-candidate dogfood recycle, package-smoke regression, package smoke, and strict release gate. | `ev:T-0600:91d4e74557ff4b69b7148f37`; `ev:T-0600:e54a559333a9420fb59138f7`; `ev:T-0600:3323520f01584e5695dcf521`; `ev:T-0600:76d390dc31cb49d097da4169`; `ev:T-0600:f50d17a72417459a85bf697b`; `ev:T-0600:16464638954d4ed0b7e80a06`; `ev:T-0600:5ce736f726224041853a063e` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit T-0600, then run the operator-controlled 0.4.5 publish flow from a clean ext4 publish clone. | Source readiness is current; npm/GitHub publication and post-publish recycle are intentionally out of scope for T-0600. | `scripts/release/prepare-publish-env.sh`; `scripts/release/manual-publish-rc.sh`; `tasks/T-0600-0-4-5-release-readiness-recycle/GITHUB_RELEASE_NOTE.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not publish from stale T-0597 evidence. | T-0597 predates T-0598 runtime safety fixes and T-0599/T-0600 recycle evidence. | Use T-0600 release note/evidence and a clean publish clone. |
| Publish remains operator-controlled. | npm login, npm publish, and GitHub Release publication require human authentication. | Run `bash scripts/release/prepare-publish-env.sh T-0600`, then `bash scripts/release/manual-publish-rc.sh T-0600 --execute` in the clean clone. |
| Post-publish installed-package recycle is still required. | Source package smoke is not the same as verifying `hadara@latest` from npm after publication. | After npm/GitHub publish, install `hadara@0.4.5` in a fresh environment and run the recycle helper/dogfood evidence. |
