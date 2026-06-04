# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `task upgrade-scaffold --json` reports a before-hash when planned writes exist, and `--execute` refuses to write without a matching `--before-hash`. | Met | Focused tests and built CLI guard smoke. |
| AC-2 | `protocol remediate --json` reports the same guard metadata and rejects missing/mismatched execute hashes before writes. | Met | Focused tests and built CLI guard smoke. |
| AC-3 | Schema/docs/workbench guidance are updated so consumers know the dry-run/execute contract. | Met | Schema fixture tests and docs updates. |
| AC-4 | Relevant focused tests and Docker validation pass or a documented blocker is recorded. | Met | Focused suite passed 5 files / 36 tests; Docker sync-build passed 92 files / 610 tests. |
| AC-5 | Capsule evidence and handoff are complete before the final finish/close/audit command loop. | Met | Evidence records and handoff are current; close audit will record the final workflow proof. |
