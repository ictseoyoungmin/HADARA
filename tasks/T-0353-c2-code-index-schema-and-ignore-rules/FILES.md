# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/context/code-index.ts` | Add | Define C2 code index types, ignore rules, file classification, discovery helper, and internal report builder. | Complete |
| `src/schemas/code-index.schema.json` | Add | Register fixture-level JSON contract for `hadara.codeIndex.v1`. | Complete |
| `src/schemas/schema-index.json` | Update | Include the new code index schema fixture. | Complete |
| `src/core/schema.ts` | Update | Make runtime schema validation load `hadara.codeIndex.v1`. | Complete |
| `tests/unit/code-index.test.ts` | Add | Cover ignore rules, classification, discovery, report building, and report schema validation. | Complete |
| `tests/unit/schema-fixtures.test.ts` | Update | Keep schema fixture id list aligned. | Complete |
| `docs/CLI_JSON_CONTRACT.md` | Update | Document the schema as internal/read-model contract without adding a public command. | Complete |
| `docs/SCHEMAS.md` | Update | Document the new code index schema fixture. | Complete |
| `docs/DEVELOPMENT_SLICES.md` | Update | Record T-0353 completion state. | Complete |
| `docs/PROJECT_STATE.md` | Update | Advance current project status to C2 schema/ignore foundation. | Complete |
| `docs/AGENT_HANDOFF.md` | Update | Point next session to C2 import/export extraction. | Complete |
