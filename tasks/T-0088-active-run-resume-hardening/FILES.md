# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/active-run-state.ts` | Update | Canonicalize active-run capsule paths and warn on manifest/canonical mismatch. |
| `src/cli/main.ts` | Update | Clarify `run-state resume` help text as read-only guidance. |
| `docs/CLI_JSON_CONTRACT.md` | Update | Clarify read-only resume semantics. |
| `docs/MCP_BRIDGE_CONTRACT.md` | Update | Document canonical path warning and read-only semantics. |
| `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` | Update | Record implemented schema fixtures and capsule mismatch behavior. |
| `src/schemas/active-run-projection.schema.json` | Add | Fixture schema for active-run projection. |
| `src/schemas/active-run-resume.schema.json` | Add | Fixture schema for active-run resume guidance. |
| `src/schemas/schema-index.json` | Update | Register active-run schema fixtures. |
| `tests/unit/active-run-state.test.ts` | Update | Cover capsule mismatch warning and canonical mustRead paths. |
| `tests/unit/schema-fixtures.test.ts` | Update | Expect active-run schema fixtures in the index. |
