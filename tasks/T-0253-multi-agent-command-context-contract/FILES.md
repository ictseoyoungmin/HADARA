# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/core/actor-context.ts` | Add | Actor/run role model, default resolver, and Phase 6 issue-code vocabulary. | Done |
| `src/core/plan-context.ts` | Add | Unreviewed dry-run plan metadata helper with affected files and optional idempotency key. | Done |
| `src/core/next-action.ts` | Add | Shared next-action/write-boundary/stale-plan vocabulary. | Done |
| `src/schemas/actor-context.schema.json` | Add | Fixture schema for common actor context. | Done |
| `src/schemas/plan-context.schema.json` | Add | Fixture schema for common plan context. | Done |
| `src/schemas/next-action.schema.json` | Add | Fixture schema for common next-action metadata. | Done |
| `src/core/schema.ts` | Update | Register common Phase 6 schemas for runtime loader validation. | Done |
| `src/schemas/schema-index.json` | Update | Add schema registry entries. | Done |
| `tests/unit/actor-context.test.ts` | Add | Cover defaults, explicit actor context, vocabularies, plan helper, and next-action type. | Done |
| `tests/unit/schema-fixtures.test.ts` | Update | Include common schemas and narrow command-report assumption. | Done |
| `tests/unit/schema-runtime.test.ts` | Update | Validate Phase 6 common schema samples. | Done |
| `docs/SCHEMAS.md` | Update | Document registered common context fixtures. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Update | Document Phase 6 common metadata and future actor CLI option names. | Done |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Update | Document Phase 6 metadata vocabulary for workflow-compression commands. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Update | Add T-0253 Phase 6 slice row. | In Progress |
