# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/capability-registry.ts` | Not Changed | Existing T-0291 metadata was sufficient. | Done |
| `src/services/lifecycle-guide.ts` | Add | Registry-backed lifecycle guide and portfolio audit projections. | Done |
| `src/cli/help.ts` | Change | Add `help lifecycle --json` and revised lifecycle text. | Done |
| `docs/LIFECYCLE_GUIDE.md` | Add | Human lifecycle guide. | Done |
| `docs/COMMAND_PORTFOLIO_AUDIT.md` | Add | Confusable-command portfolio decisions. | Done |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Change | Reference lifecycle guide without duplicating registry. | Done |
| `docs/SCHEMAS.md` | Change | Document new Phase 7.2 schemas. | Done |
| `src/schemas/lifecycle-guide.schema.json` | Add | JSON contract for lifecycle guide. | Done |
| `src/schemas/command-portfolio-audit.schema.json` | Add | JSON/document fixture contract for portfolio audit. | Done |
| `src/schemas/schema-index.json` | Change | Register new schemas. | Done |
| `tests/unit/lifecycle-guide.test.ts` | Add | Focused lifecycle guide tests. | Done |
| `tests/unit/command-portfolio-audit.test.ts` | Add | Confusable command and docs tests. | Done |
| `tests/unit/help.test.ts` | Change | Extend lifecycle/default help expectations. | Done |
| `tests/unit/schema-fixtures.test.ts` | Change | Include new schema ids. | Done |
