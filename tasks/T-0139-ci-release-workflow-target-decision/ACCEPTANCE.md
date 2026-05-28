# Acceptance Criteria

- [x] Release target decision is documented: npm package primary, GitHub Release secondary, Docker deferred.
- [x] Required token/secret names are documented without values and publish/deploy remains explicit approval only.
- [x] T-0140 follow-up requirements cover evidence freshness, evidencePath/artifact schema cross-checking, and release-artifact evidence creation flow.
- [x] `hadara release gate --mode strict --json` checks the target decision markers without publishing, calling GitHub, building Docker images, or reading token values.
- [x] Focused tests, full check, strict release-gate smoke, and done-level harness validation are recorded.
