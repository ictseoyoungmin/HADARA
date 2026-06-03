# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Execute mode requires a caller-supplied `--before-hash`. | Accepted | Operators must preview first and concurrent evidence drift must fail closed. | Focused tests. |
| D-2 | Keep the T-0235 schema id and add execute metadata additively. | Accepted | The command remains a migration preview/report surface with optional execute application details. | Schema fixture test. |
| D-3 | Refuse execute when skipped records require review. | Accepted | Invalid JSON, unsupported schemas, invalid v1, and task mismatch should not be lost or guessed during migration. | Focused tests. |
| D-4 | Preserve existing v2 JSONL lines exactly. | Accepted | Existing durable v2 records should not be reformatted by a v1 migration pass. | Focused tests. |
| D-5 | Leave `EVIDENCE.md` unchanged. | Accepted | Markdown id/frame rewrite is a separate non-goal. | Focused tests. |
