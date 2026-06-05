# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use `handoff suggest` as a separate subcommand instead of extending `handoff update`. | Accepted | Keeps the existing write command stable and makes the new surface explicitly read-only. | CLI route and tests. |
| D-2 | Use section fragments instead of auto-applying a unified patch. | Accepted | The Phase 6 requirement is coordinator-reviewed shared-doc suggestions, not hidden document mutation. | Schema and docs. |
| D-3 | Reject `--execute` through the normal schema. | Accepted | External agents get a stable machine-readable failure rather than a parse-only fallback. | Unit test and built smoke. |
