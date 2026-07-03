# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Stable `0.4.0` publish preparation | Source metadata, package-facing docs, helper notes, built dist, and stable GitHub release note artifact now target `0.4.0`; package smoke and clean-checkout smoke passed without publish mutation. Evidence: `ev:T-0490:612ac562b8564f12b3881032`, `ev:T-0490:767408285ae34a27b334aa5d`, `ev:T-0490:5bc67bef93e744289490bfb6`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run the approval-gated stable publish helper from a clean ext4 clone after this commit. | `release dry-run` still requires current release-artifact evidence from a clean commit; the helper generates it before publish. | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh`, `docs/RELEASE_READINESS.md` |
| After npm publish succeeds, verify registry metadata and open stable installed-package recycle. | Stable package consumer proof is intentionally post-publish. | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `hadara@0.4.0` is intentionally unpublished at T-0490 close time. | npm install examples are staged for the publish commit and will work only after operator publish. | Run `bash scripts/release/prepare-publish-env.sh T-0490`, then publish from the prepared clone with `manual-publish-rc.sh T-0490 --execute`. |
| Release artifact evidence is not generated in the dirty development worktree. | `release dry-run` remains blocked until the helper regenerates release artifact evidence from a clean commit. | The manual helper runs `release artifact --execute --attach-evidence` before publish dry-run and publish. |
| Stable installed-package recycle is still pending. | Source/readiness does not prove installed consumer paths after npm `latest` moves. | Open the stable recycle capsule after registry verification returns `latest=0.4.0`. |
