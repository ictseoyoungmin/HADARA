# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `task finish` dry-run-first and bounded. | Accepted | It reduces repeated bookkeeping without broad document rewrites. | `src/task/task-finish.ts`; `docs/CLI_JSON_CONTRACT.md`. |
| D-2 | Treat `DEVELOPMENT_SLICES`, `PROJECT_STATE`, and `AGENT_HANDOFF` as advisory-only for this MVP. | Accepted | These files contain operator-authored prose and should not be broad-written by the first finish command. | Task finish report advisories. |
| D-3 | Block duplicate Task Board rows. | Accepted | Ambiguous state should be surfaced, not guessed. | `tests/unit/task-finish.test.ts`. |
