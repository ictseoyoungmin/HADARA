# Handoff

## Last Completed

- Exported `parseEvidenceIndexFile()` from `src/services/evidence-list.ts` for shared read-model reuse.
- Updated `src/services/task-read-model.ts` so `task.read` embedded `evidenceIndex` uses evidence-list normalization.
- Updated `task.read` `files["evidence.jsonl"]` to return normalized JSONL instead of raw file content, preventing private paths, unknown fields, mismatched records, malformed lines, and unredacted summaries from leaking through that read-model field.
- Added regression coverage in `tests/unit/task-json.test.ts`.
- Updated MCP task read fixture to use canonical evidence records.
- Validation passed in Docker:
  - `npx vitest run tests/unit/task-json.test.ts tests/unit/evidence-list.test.ts tests/unit/mcp-tools.test.ts tests/contract/cli-mcp-service-parity.test.ts`
  - `npm run check`
  - `node dist/cli/main.js harness validate --task T-0083 --level done --json --project /workspace`

## Next Recommended Step

Continue service parity with a focused harness validate service capsule, or tackle redaction policy observability tests before adding security/evidence inspection surfaces.
