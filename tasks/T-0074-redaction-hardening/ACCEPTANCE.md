# Acceptance Criteria

- [x] Redaction patterns are represented as a registry with ids, descriptions, severities, replacements, and enabled flags.
- [x] `hadara.redaction.report.v1` reports findings with counts and byte sizes.
- [x] Existing `redactSecrets()` and `containsSecret()` callers continue to work.
- [x] Tests cover AWS, GitHub, JWT, private key, npm, capture-group preservation, and no-capture replacements.
- [x] Evidence is attached.
- [x] Handoff is updated.
