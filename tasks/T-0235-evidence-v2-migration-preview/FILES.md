# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/evidence-migration.ts` | Added | Implements dry-run-only per-task Evidence v2 migration preview report. | Done |
| `src/cli/evidence.ts` | Modified | Adds `evidence migrate` command routing. | Done |
| `src/cli/main.ts` | Modified | Documents migration preview command in CLI help. | Done |
| `src/schemas/evidence-migration-preview.schema.json` | Added | Defines `hadara.evidence.migration_preview.v1` fixture schema. | Done |
| `src/schemas/schema-index.json` | Modified | Registers migration preview schema. | Done |
| `src/core/schema.ts` | Modified | Registers migration preview schema for runtime validation tests. | Done |
| `tests/unit/evidence-migration.test.ts` | Added | Covers dry-run transforms, execute rejection, no-write behavior, deterministic ids, and CLI JSON. | Done |
| `tests/unit/schema-fixtures.test.ts` | Modified | Adds migration preview schema id to fixture alignment. | Done |
| `tasks/T-0235-evidence-v2-migration-preview/*` | Added/Modified | Active capsule docs and v2 evidence records. | Done |
| `docs/PROJECT_STATE.md` | Modified | Records T-0235 completion and remaining execute migration boundary. | Done |
| `docs/AGENT_HANDOFF.md` | Modified | Updates current handoff, validation baseline, and next recommended step. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Modified | Adds T-0235 completion row. | Done |
| `docs/TASK_BOARD.md` | Modified | Marks T-0235 Done through task finish. | Done |
