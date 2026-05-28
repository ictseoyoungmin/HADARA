# Handoff

## Last Completed

T-0138 is complete. `hadara release gate --mode advisory|strict --json` now keeps the release-gate boundary read-only while checking existing Task Capsule evidence for package-smoke, clean-checkout smoke, and release-artifact readiness. Missing evidence produces stable `PACKAGE_SMOKE_EVIDENCE_MISSING`, `CLEAN_CHECKOUT_SMOKE_EVIDENCE_MISSING`, or `RELEASE_ARTIFACT_EVIDENCE_MISSING` issues; install-matrix evidence remains deferred until execution exists.

`hadara.smokeEvidenceSummary.v1` and `hadara.releaseArtifact.manifest.v1` are registered schema fixtures and runtime-loadable. Optional linked smoke summary artifacts are validated when present, but `evidence.jsonl` remains the primary release-gate evidence index.

## Next Recommended Step

Proceed to T-0139 CI/Release Workflow Target Decision. Keep it decision/documentation-only: choose npm package as primary, GitHub Release as secondary, Docker deferred unless scope changes, and document required token names without storing secrets or publishing.
