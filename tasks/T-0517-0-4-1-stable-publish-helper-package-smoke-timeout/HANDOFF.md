# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `manual-publish-rc.sh` now defaults package smoke timeout to 300 seconds. | ev:T-0517:37f7154855e14156aed06c4c |
| Helper help output documents `PACKAGE_SMOKE_TIMEOUT` override. | ev:T-0517:ea5ed0e4f19c447f9ae3e0c2 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Re-run `bash scripts/release/prepare-publish-env.sh T-0516`, then run `bash scripts/release/manual-publish-rc.sh T-0516 --execute` from the fresh clone. | The existing publish clone was created before this helper fix; a fresh clone is the safest way to pick up the committed 300s timeout. | `scripts/release/prepare-publish-env.sh`; `scripts/release/manual-publish-rc.sh` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| T-0516 operator evidence files are currently modified by the failed publish attempt. | They were not part of T-0517 and should not be accidentally committed with this helper fix. | Stage only T-0517/helper/shared-state paths for the T-0517 commit. |
