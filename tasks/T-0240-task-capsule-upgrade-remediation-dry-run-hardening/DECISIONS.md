# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use report-level `summary.beforeHash` for reviewed dry-run execution. | Accepted | Operators need one stable token representing the planned write set, while existing per-action hashes still protect individual files at apply time. | Focused tests and built CLI guard smoke. |
| D-2 | Require `--before-hash` only when planned writes exist. | Accepted | Idempotent/no-op execute reports should still be able to report skipped state without a meaningless hash requirement. | Task upgrade idempotence test. |
| D-3 | Keep hash guards additive in JSON schemas. | Accepted | Existing consumers can keep parsing reports, while write-capable consumers can opt into the stronger contract. | Schema fixture tests. |
