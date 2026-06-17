# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | 0.3.2 does not implement evidence rebuild preview or execute. | Accepted | Rebuild needs a drift model before `wouldChange` can be meaningful. | T-0334 capsule spec |
| D-2 | `evidence.jsonl` remains canonical and `EVIDENCE.md` remains a non-canonical human summary. | Accepted | JSONL carries writer-owned structured records; Markdown can lag, summarize, or omit details. | T-0334 capsule spec |
| D-3 | Any future rebuild command must be dry-run-first and before-hash guarded before execute. | Accepted | Rebuild would write close-source evidence summaries, so it must follow existing HADARA guarded-write policy. | T-0334 capsule spec |
