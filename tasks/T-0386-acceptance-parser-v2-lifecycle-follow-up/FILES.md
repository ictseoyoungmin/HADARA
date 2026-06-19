# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/task/acceptance.ts` | Add | Shared acceptance row parser and readiness analyzer for legacy/v2 tables. | Added |
| `src/harness/validate.ts` | Update | Use shared acceptance readiness analysis and accept v2 table format marker. | Modified |
| `src/services/protocol-consistency.ts` | Update | Use shared acceptance readiness analysis for Done-task acceptance drift. | Modified |
| `tests/unit/acceptance-parser.test.ts` | Add | Cover legacy strict defaults and v2 deferrable/follow-up/risk semantics. | Added |
| `tests/harness/harness-validate.test.ts` | Update | Cover v2 acceptance table validation at done level. | Modified |
| `dist/` | Update | Refreshed by Docker sync-build after source changes. | Modified |
| `tasks/T-0386-acceptance-parser-v2-lifecycle-follow-up/*` | Update | Capsule docs and evidence. | Modified |
| `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/TASK_BOARD.md` | Update | Shared state/handoff for T-0386 completion and T-0387 routing. | Modified |
| `docs/specs/0.3.3/context-routing/09_Context_Routing_Implementation_Completion_Audit.md` | Update | Mark T-0386 complete and T-0387 as the remaining cleanup item. | Modified |
