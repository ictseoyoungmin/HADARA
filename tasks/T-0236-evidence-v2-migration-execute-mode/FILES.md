# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/evidence-migration.ts` | Modify | Add guarded execute behavior to the T-0235 preview service. | Done |
| `src/cli/evidence.ts` | Modify | Pass `--before-hash` into migration execute and report applied status. | Done |
| `src/cli/main.ts` | Modify | Update CLI help for guarded execute usage. | Done |
| `src/schemas/evidence-migration-preview.schema.json` | Modify | Allow execute metadata and supported execute flag. | Done |
| `tests/unit/evidence-migration.test.ts` | Modify | Cover execute success, hash mismatch, skipped-record refusal, and CLI execute path. | Done |
| `docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md` | Modify | Align execute example with required `--before-hash`. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Modify | Document migration preview/execute JSON and write boundaries. | Done |
| `docs/PROJECT_STATE.md` | Modify | Record T-0236 completion and next roadmap direction. | Done |
| `docs/AGENT_HANDOFF.md` | Modify | Update next-session state after completion. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Modify | Add completed T-0236 slice evidence. | Done |
| `docs/TASK_BOARD.md` | Modify | Mark T-0236 done through task finish/state update. | Done |
