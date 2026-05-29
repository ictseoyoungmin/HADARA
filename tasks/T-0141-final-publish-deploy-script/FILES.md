# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/release-publish.ts` | Added | Build schema-backed publish/deploy readiness reports, token presence checks, and blocked execute audit. |
| `src/cli/release-publish.ts` | Added | Add CLI handler for `hadara release publish`. |
| `src/cli/main.ts` | Updated | Wire the new release subcommand and help text. |
| `src/schemas/release-publish.schema.json` | Added | Define `hadara.releasePublish.v1`. |
| `src/schemas/schema-index.json` | Updated | Register the new schema fixture. |
| `src/core/schema.ts` | Updated | Load and validate `hadara.releasePublish.v1`. |
| `src/services/capability-registry.ts` | Updated | Advertise the new approval-gated release CLI surface and keep MCP release execution deferred. |
| `tests/unit/release-publish.test.ts` | Added | Cover token redaction, blocked execute audit, and CLI JSON output. |
| `tests/unit/schema-runtime.test.ts` | Updated | Validate a representative `hadara.releasePublish.v1` payload. |
| `tests/unit/schema-fixtures.test.ts` | Updated | Keep schema fixture index expectations aligned. |
| `tests/unit/tools-list.test.ts` | Updated | Cover capability discovery for the new release surface. |
| `docs/SCHEMAS.md` | Updated | Document the new release publish schema fixture. |
| `docs/RELEASE_READINESS.md` | Updated | Document the publish/deploy command boundary. |
| `docs/PROJECT_STATE.md` | Updated | Record the new capability and boundaries. |
| `docs/DEVELOPMENT_SLICES.md` | Updated | Mark T-0141 done. |
| `docs/TASK_BOARD.md` | Updated | Mark T-0141 done. |
| `docs/AGENT_HANDOFF.md` | Updated | Prepare next-session handoff. |
