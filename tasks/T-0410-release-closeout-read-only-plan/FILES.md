# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/release-closeout.ts` | Added | Implement read-only closeout planning report. | Done |
| `src/cli/release-closeout.ts` | Added | Route `release closeout`. | Done |
| `src/cli/main.ts` | Updated | Dispatch release closeout before other release subcommands. | Done |
| `src/core/schema.ts` | Updated | Register runtime schema validation. | Done |
| `src/schemas/release-closeout.schema.json` | Added | Define `hadara.releaseCloseout.v1`. | Done |
| `src/schemas/schema-index.json` | Updated | Register schema fixture. | Done |
| `src/services/capability-registry.ts` | Updated | Register command discovery metadata. | Done |
| `tests/unit/release-closeout.test.ts` | Added | Cover service, CLI route, schema, and read-only behavior. | Done |
| `tests/unit/schema-fixtures.test.ts` | Updated | Include release closeout schema id. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Updated | Document JSON report contract. | Done |
| `docs/SCHEMAS.md` | Updated | Document schema fixture. | Done |
| `docs/TASK_BOARD.md` | Updated | Mark T-0410 Done. | Done |
| `docs/PROJECT_STATE.md` | Updated | Record T-0410 completion and route next work. | Done |
| `docs/AGENT_HANDOFF.md` | Updated | Route next capsule to T-0411. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Updated | Record T-0410 slice completion. | Done |
| `dist/**` | Updated | Refresh built CLI output from Docker build. | Done |
| `tasks/T-0410-release-closeout-read-only-plan/*` | Updated | Complete capsule docs and evidence. | Done |
