# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Stable `0.4.0` npm publish | Source metadata, release docs, release artifact, package smoke, clean-checkout smoke, and npm publish evidence are recorded. npm registry verifies `latest=0.4.0` and `next=0.4.0-rc.0`. Evidence: `ev:T-0490:9bff847b4185492cb51c4345`, `ev:T-0490:80adc8e2a1a74c78a0d08deb`, `ev:T-0490:cd3e8afff47a4fba8f8bb117`, `ev:T-0490:40deeacaa24640d499a498c4`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open stable installed-package recycle. | Stable package consumer proof is intentionally post-publish and has not run yet. | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md`, `docs/RELEASE_READINESS.md` |
| Optionally create or publish a stable GitHub Release. | T-0490 npm publish skipped GitHub Release draft creation. | `GITHUB_RELEASE_NOTE.md`, `scripts/release/manual-publish-rc.sh` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Stable installed-package recycle is still pending. | Source/readiness does not prove installed consumer paths after npm `latest` moves. | Open the stable recycle capsule after registry verification returns `latest=0.4.0`. |
| GitHub stable release draft was skipped. | npm stable is published, but GitHub stable release metadata is not created. | Use the prepared release note artifact if a later capsule creates the GitHub Release. |
