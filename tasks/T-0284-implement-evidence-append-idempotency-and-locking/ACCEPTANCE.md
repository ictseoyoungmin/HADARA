# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | JSON evidence append reports the exact record returned by the writer instead of reading the last JSONL line after append. | Met | `/tmp` build passed; focused evidence JSON tests passed. |
| AC-2 | `--idempotency-key` is accepted by evidence write commands and same-key replays return the existing record without appending Markdown or JSONL. | Met | Focused evidence JSON tests passed; built CLI replay returned `existing:true`, `markdownAppended:false`, and `jsonlAppended:false`. |
| AC-3 | Keyless evidence writes remain append-only. | Met | Focused evidence JSON tests passed. |
| AC-4 | Evidence append is guarded by a task-scoped local lock and exposes `EVIDENCE_APPEND_LOCK_TIMEOUT`. | Met | `/tmp` build passed; focused evidence JSON tests passed. |
| AC-5 | Relevant docs/templates mention the new idempotency option. | Met | README, SOP, task workflow docs, CLI JSON contract, init templates, and docs tests updated. |
| AC-6 | Evidence and handoff/state docs are updated before close. | Met | T-0284 evidence records appended; state docs updated before close. |
