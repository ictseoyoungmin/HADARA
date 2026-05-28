# Context

- `docs/DEVELOPMENT_SLICES.md` lists T-0139 after T-0138 and before T-0140 dry-run release scripts.
- `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md` recommends npm package as primary, GitHub Release as secondary, and Docker image as deferred.
- `docs/RELEASE_READINESS.md` already records earlier package metadata and release target notes; T-0139 should make them explicit enough for release-gate checks and later dry-run scripts.
- T-0138 follow-up notes from operator feedback: future evidence gates need freshness criteria, artifact path/schema/source cross-checks, and clearer release-artifact evidence creation guidance.
- Release target decisions must document token names only, never secret values.
- Current package remains `private: true`; this capsule must not publish, create releases, build Docker images, or call remote services.
