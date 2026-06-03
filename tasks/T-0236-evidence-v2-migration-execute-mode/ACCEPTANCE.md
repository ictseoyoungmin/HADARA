# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Dry-run migration preview remains read-only and schema-compatible. | Done | Focused tests passed. |
| AC-2 | Execute mode requires `--before-hash` matching the current `evidence.jsonl` hash. | Done | Focused tests and built mismatch smoke passed. |
| AC-3 | Execute mode rewrites only the selected task `evidence.jsonl`, converting v1 lines to v2 and preserving existing v2 records. | Done | Focused tests and built CLI execute smoke passed. |
| AC-4 | Execute mode refuses skipped invalid/mismatched/unsupported records without writing. | Done | Focused tests passed. |
| AC-5 | `EVIDENCE.md` and unrelated files are not rewritten by migration execute. | Done | Focused tests passed. |
| AC-6 | Validation and evidence are recorded. | Done | T-0236 evidence records. |
| AC-7 | Project state and handoff docs identify the next follow-up. | Done | Docs updated to point back to task lifecycle hardening and selected migration only on request. |
