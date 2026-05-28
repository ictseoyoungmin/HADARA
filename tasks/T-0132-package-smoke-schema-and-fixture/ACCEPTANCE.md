# Acceptance Criteria

- [x] `hadara.packageSmoke.v1` schema fixture is registered in `src/schemas/schema-index.json`.
- [x] Runtime schema validation can load and validate deterministic package-smoke fixtures.
- [x] Fixtures cover success, step failure, redacted path, private/raw artifact omitted, and public reduced evidence cases.
- [x] Tests prove package-smoke reports exclude raw package content, raw npm logs, environment secrets, private paths, and private store paths.
- [x] Tests prove release gate still does not emit or execute package-smoke reports.
- [x] Evidence is attached.
- [x] Handoff is updated.
