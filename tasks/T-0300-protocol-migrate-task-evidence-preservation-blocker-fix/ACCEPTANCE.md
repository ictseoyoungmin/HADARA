# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Task-scoped migration creates `evidence.jsonl` only when it is missing. | Done | Missing-file path remains covered by existing selected-task migration test. |
| AC-2 | Task-scoped migration never overwrites an existing `evidence.jsonl`. | Done | New regression asserts existing evidence content is unchanged after dry-run and execute. |
| AC-3 | `task finish` appends Done Status History rows inside the managed table. | Done | Regression asserts generated Done row is before the managed end marker; T-0299/T-0300 rows repaired. |
| AC-4 | T-0299 task-local handoff drift is corrected after close-source edit. | Done | T-0299 handoff now says Done / closed-valid and points to later final readiness/publish capsule. |
| AC-5 | Focused validation and close evidence are recorded. | Done | Combined focused tests/build and built CLI managed-table smoke passed; close/audit refreshed after close-source edits. |
