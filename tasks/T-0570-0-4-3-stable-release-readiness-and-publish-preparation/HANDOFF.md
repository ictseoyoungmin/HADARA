# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Prepared stable `hadara@0.4.3` release notes, readiness docs, helper examples, and GitHub Release note artifact without running npm/GitHub mutation. | `ev:T-0570:d90a468d16094acca7740b00` |
| Verified exact `hadara@0.4.3` was not yet published before the operator publish step. | `npm view hadara@0.4.3 version` returned expected E404; `ev:T-0570:d90a468d16094acca7740b00` |
| Validated docs/helper changes and current dist through Docker focused tests plus full Docker sync-build. | `ev:T-0570:d90a468d16094acca7740b00` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit T-0570, then run `bash scripts/release/prepare-publish-env.sh T-0570` from the host and `bash scripts/release/manual-publish-rc.sh T-0570 --execute` from the prepared ext4 clone. | npm/GitHub publish is intentionally operator-controlled and not part of this source-preparation commit. | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh`, `tasks/T-0570-0-4-3-stable-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` |
| After npm/GitHub publication, create a separate installed-package recycle capsule for `hadara@latest` expected `0.4.3`. | Consumer-path verification belongs after publication. | `docs/RELEASE_READINESS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Host focused test attempt hit `spawnSync bash EPERM`. | Host tool runner cannot be the only validation path for shell-spawning tests. | Docker focused tests passed 13 tests and Docker sync-build passed the full 153-file / 1058-test line. |
| Published stable is still `0.4.2` until the operator publishes. | README install snippets target the prepared `0.4.3` package content before registry publication. | Use the prepared publish helper path immediately after this commit, then run post-publish recycle. |
