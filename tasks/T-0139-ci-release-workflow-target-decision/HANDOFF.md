# Handoff

## Last Completed

T-0139 is complete. Release target decisions are documented: npm package is primary, GitHub Release with tarball/checksum/manifest is secondary, and Docker image publishing is deferred unless the product/server runtime surface changes.

Token names are documented without values: `NPM_TOKEN` for npm publish and `GITHUB_TOKEN` or `HADARA_GITHUB_RELEASE_TOKEN` for GitHub Release creation. T-0139 performs no publish, no GitHub Release creation, no Docker image build, no registry mutation, no GitHub API call, and no token loading.

`hadara release gate --mode strict --json` now checks `CI_RELEASE_WORKFLOW_TARGET_DECISION` from tracked readiness docs while remaining read-only.

## Next Recommended Step

Proceed to T-0140 Final Deployment Script Dry Run. Carry forward the P1 hardening notes: evidence freshness should compare commit/version/manifest hash and release candidate window; evidence records should cross-check linked artifacts, schemas, `sourceReport.ok`, category, mode, and result; release artifact evidence creation must have an explicit command path before final dry-run readiness is considered satisfied.
