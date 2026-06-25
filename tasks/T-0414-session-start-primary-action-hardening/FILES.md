# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/context/session-start.ts` | Updated | Adds structured `primaryAction`, `whyThisNow`, `avoidForNow`, and `nextCommandArgs`; prioritizes task lifecycle. | Done |
| `src/schemas/session-start.schema.json` | Updated | Validates additive primary action guidance fields. | Done |
| `tests/unit/session-start.test.ts` | Updated | Covers task-scoped lifecycle primary action and no-task task-next primary action. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Updated | Documents new preferred Session Start guidance fields. | Done |
| `docs/SCHEMAS.md` | Updated | Documents additive `hadara.sessionStart.v1` guidance evolution. | Done |
| `dist/` | Updated | Refreshed from Docker build output. | Done |
