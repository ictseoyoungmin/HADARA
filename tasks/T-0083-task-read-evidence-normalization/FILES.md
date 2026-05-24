# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/evidence-list.ts` | Update | Export the shared evidence JSONL parser for read-model reuse. |
| `src/services/task-read-model.ts` | Update | Use normalized evidence records for `evidenceIndex` and sanitized `files["evidence.jsonl"]`. |
| `tests/unit/task-json.test.ts` | Update | Cover task read evidence normalization, mismatch warnings, malformed warnings, private path stripping, and redaction. |
| `tests/unit/mcp-tools.test.ts` | Update | Use canonical evidence records in MCP task read fixture. |
| `tasks/T-0083-task-read-evidence-normalization/*` | Update | Track scope, validation, evidence, and handoff for this capsule. |
