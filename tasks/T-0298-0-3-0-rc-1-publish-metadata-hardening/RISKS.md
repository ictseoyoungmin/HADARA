# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Stale global `hadara` is used again during publish. | Tarball package metadata can omit discovery fields even when source is correct. | Medium | Prefer `node dist/cli/main.js`; validate tarball package metadata before dry-run/publish. | Mitigated |
| rc.1 version bump drifts between package, README, readiness docs, and tests. | Operators may publish or install the wrong version. | Medium | Search for stale rc.0 current-candidate wording and run focused tests. | Mitigated |
| Real npm publish is run from this capsule. | External registry mutation without explicit operator action. | Low | Keep publish helper approval-gated; run dry-run only and provide operator instructions. | Mitigated |
