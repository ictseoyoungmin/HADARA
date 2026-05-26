# Acceptance Criteria

- [x] `src/tui/cache.ts` implements a local TUI cache record under `.hadara/local/tui/`.
- [x] Cache records include a task summary index with mtime, size, and hash invalidation data.
- [x] Cache records include source signals for `docs/TASK_BOARD.md`, `tasks/`, `docs/AGENT_HANDOFF.md`, active-run local state, selected `TASK.md`, and selected `evidence.jsonl`.
- [x] Full and fast refresh modes write/read the local cache, and fast refresh invalidates when a task changes, a task is created/deleted, or `docs/TASK_BOARD.md` changes.
- [x] Detail refresh can refresh the selected task from cached task summaries without scanning every capsule directory and reflects selected evidence changes.
- [x] Fast validation reuses unchanged task hashes instead of rereading every cached `TASK.md`.
- [x] Cache is disabled with a warning when `includePrivateEvidence: true` is requested.
- [x] `hadara tui --cache` opts interactive TUI sessions into local cache writes, while default TUI and snapshot mode remain cache-free.
- [x] Cache writes are constrained to `.hadara/local/tui/`.
- [x] Context export excludes TUI cache content and paths.
- [x] 1000-capsule benchmark evidence is recorded.
- [x] Tests or explicit constraints are recorded.
- [x] Evidence is attached.
- [x] Handoff is updated.
