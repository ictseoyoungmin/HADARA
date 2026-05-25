# Files

| Path | Action | Reason |
|---|---|---|
| `src/evidence/private-manifest.ts` | Modify | Enforce project-boundary source artifact policy for private evidence raw copies. |
| `src/cli/evidence.ts` | Modify | Accept `--visibility public|private` as a CLI alias for evidence visibility. |
| `src/cli/main.ts` | Modify | Document the `--visibility` evidence collect option in CLI help. |
| `src/cli/errors.ts` | Modify | Return a stable CLI error code for unsupported evidence visibility values. |
| `src/services/active-run-state.ts` | Modify | Separate manifest read errors from report schema assertion errors. |
| `src/core/schema.ts` | Modify | Register new private evidence and release gate schema fixtures. |
| `src/schemas/private-evidence.schema.json` | Add | Document private evidence manifest records without raw content or source paths. |
| `src/schemas/release-gate.schema.json` | Add | Document release gate reports. |
| `src/schemas/schema-index.json` | Modify | Register new schema fixtures. |
| `tests/unit/evidence-json.test.ts` | Modify | Cover project-boundary private evidence source behavior. |
| `tests/unit/cli-errors.test.ts` | Modify | Cover unsupported evidence visibility CLI error mapping. |
| `tests/unit/active-run-state.test.ts` | Modify | Cover manifest invalid vs report schema invalid warning codes. |
| `tests/unit/schema-fixtures.test.ts` | Modify | Include new fixtures and support non-report manifest schemas. |
| `tasks/T-0094-security-schema-follow-up-cleanup/*` | Modify | Record scope, evidence, and handoff. |
