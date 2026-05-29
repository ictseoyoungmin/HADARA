# Acceptance Criteria

- [x] `hadara release publish --mode dry-run|execute --json` is implemented as a schema-backed report.
- [x] Reports include release dry-run readiness, package metadata, approval metadata, token presence by name only, target status, privacy flags, and issues.
- [x] Execute-mode requests require approval metadata and are privately audited while remaining blocked before publish/deploy mutation.
- [x] Capability discovery and schema docs include `hadara.releasePublish.v1`.
- [x] Tests or explicit constraints are recorded.
- [x] Evidence is attached.
- [x] Handoff is updated.
