# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Shared Markdown table helper exists and replaces duplicated local parsers in protocol/profile/harness code. | Met | `src/services/markdown-table.ts` added and imported by `protocol-consistency`, `protocol-profile`, and harness validation. |
| AC-2 | Helper tests cover parsing, malformed divider handling, lookup, safe formatting, and wide text cells. | Met | `tests/unit/markdown-table.test.ts` passed. |
| AC-3 | Existing protocol and harness behavior remains stable. | Met | Focused protocol tests passed; full Docker check passed. |
| AC-4 | Evidence is attached. | Met | `EVIDENCE.md` and `evidence.jsonl` updated. |
| AC-5 | Handoff is updated. | Met | Task and project handoff updated. |
