# Files

| Path | Action | Reason |
|---|---|---|
| `src/tui/cache.ts` | Added | Internal local cache service for TUI read-model records, task index invalidation, and refresh modes. |
| `src/tui/terminal.ts` | Modified | Loads cached read models only when terminal options explicitly enable cache. |
| `src/cli/tui.ts` | Modified | Adds opt-in `--cache` / `--no-cache` handling for interactive TUI sessions while preserving cache-free snapshot mode. |
| `tests/unit/tui-cache.test.ts` | Added | Covers cache write boundary, invalidation, detail refresh, and context-export exclusion. |
| `tests/unit/tui-cli.test.ts` | Modified | Covers interactive CLI cache opt-in, snapshot cache-free behavior, and `--no-cache` override. |
| `tasks/T-0109-tui-local-cache-and-incremental-refresh/*` | Modified | Records scope, acceptance, files, tests, risks, evidence, and handoff. |
| `docs/TASK_BOARD.md` | Modified | Marks T-0109 completion. |
| `docs/PROJECT_STATE.md` | Modified | Records implemented TUI local cache capability. |
| `docs/DEVELOPMENT_SLICES.md` | Modified | Adds completed T-0109 TUI cache slice. |
| `docs/V1_0_CAPSULE_BACKLOG.md` | Modified | Marks the TUI local cache follow-up as completed by T-0109. |
| `docs/SCHEMAS.md` | Modified | Updates TUI cache schema posture as internal local cache, not a public release-gated schema. |
| `docs/AGENT_HANDOFF.md` | Modified | Refreshes compact handoff for T-0109 completion and next steps. |
