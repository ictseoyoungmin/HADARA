# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/write-preflight.ts` | Add | Shared write-boundary preflight report builder. |
| `src/cli/write-preflight.ts` | Add | CLI handler for `hadara write preflight ...`. |
| `src/cli/main.ts` | Update | Route the new write preflight CLI command and help text. |
| `src/core/schema.ts` | Update | Register the write-preflight schema fixture. |
| `src/schemas/schema-index.json` | Update | Add schema index entry for `hadara.write.preflight.v1`. |
| `src/schemas/write-preflight.schema.json` | Add | Fixture schema for the new report. |
| `tests/unit/write-preflight.test.ts` | Add | Cover report builder and CLI output behavior. |
| `docs/DEVELOPMENT_SLICES.md` | Update | Mark the slice capsule once started/done. |
| `docs/TASK_BOARD.md` | Update | Track T-0098 status. |
| `docs/PROJECT_STATE.md` | Update | Record the new read-only preflight capability. |
| `docs/AGENT_HANDOFF.md` | Update | Refresh compact current handoff before stopping. |
| `tasks/T-0098-cli-write-boundary-preflight/*` | Update | Keep capsule plan, evidence, acceptance, and handoff current. |
