# Acceptance Criteria

- [x] Root package metadata is `version: 0.1.0-rc.0`, `private: false`, with a `files` whitelist.
- [x] Release readiness docs describe this as release-candidate metadata, not an actual publish event.
- [x] Fresh package-smoke, release-artifact, and clean-checkout public evidence exists under this Task Capsule.
- [x] `hadara release dry-run --json` passes for the release-candidate metadata and fresh evidence.
- [x] `hadara release publish --mode dry-run --json` passes readiness checks while still reporting no publish/GitHub/Docker mutation.
- [x] Focused tests, full check, and done-level harness validation are recorded.
- [x] Handoff and tracked project state documents are updated.
