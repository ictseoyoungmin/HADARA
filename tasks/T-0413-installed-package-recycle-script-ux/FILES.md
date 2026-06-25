# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/package-recycle.ts` | Added | Implements dry-run and execute reports for installed-package recycle. | Done |
| `src/cli/package-smoke.ts` | Updated | Dispatches `hadara package recycle` alongside existing `package smoke`. | Done |
| `src/core/schema.ts` | Updated | Registers `hadara.packageRecycle.v1`. | Done |
| `src/schemas/package-recycle.schema.json` | Added | Defines installed-package recycle report contract. | Done |
| `src/schemas/schema-index.json` | Updated | Adds package recycle schema fixture entry. | Done |
| `src/schemas/smoke-evidence-summary.schema.json` | Updated | Allows reduced public `package-recycle` evidence summaries. | Done |
| `src/services/smoke-evidence.ts` | Updated | Allows `package-recycle` as a smoke evidence category. | Done |
| `src/services/capability-registry.ts` | Updated | Registers `package.recycle` command and tool capability variants. | Done |
| `tests/unit/package-recycle.test.ts` | Added | Covers dry-run, fake execute, mismatch failure, CLI JSON dispatch. | Done |
| `tests/unit/command-registry.test.ts` | Updated | Requires `package.recycle` registry coverage. | Done |
| `tests/unit/tools-list-command-registry.test.ts` | Updated | Covers command registry projection for package recycle capability variants. | Done |
| `tests/unit/tools-list.test.ts` | Updated | Covers tools-list package recycle surface. | Done |
| `tests/unit/schema-fixtures.test.ts` | Updated | Adds package recycle schema to expected fixture index. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Updated | Documents JSON contract and write boundary. | Done |
| `docs/SCHEMAS.md` | Updated | Documents new package recycle schema and evidence category. | Done |
| `docs/RELEASE_READINESS.md` | Updated | Documents standard post-publish recycle command. | Done |
| `dist/` | Updated | Refreshed from Docker build output. | Done |
