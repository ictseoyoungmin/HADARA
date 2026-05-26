# Acceptance Criteria

- [x] `src/tui/cache.ts` implements a local TUI cache record under `.hadara/local/tui/`.
- [x] Cache records include a task summary index with mtime, size, and hash invalidation data.
- [x] Full and fast refresh modes write/read the local cache, and fast refresh invalidates when a task changes.
- [x] Detail refresh can refresh the selected task from cached task summaries without scanning every capsule directory.
- [x] `hadara tui --cache` opts interactive TUI sessions into local cache writes, while default TUI and snapshot mode remain cache-free.
- [x] Cache writes are constrained to `.hadara/local/tui/`.
- [x] Context export excludes TUI cache content and paths.
- [x] 1000-capsule benchmark evidence is recorded.
- [x] Tests or explicit constraints are recorded.
- [x] Evidence is attached.
- [x] Handoff is updated.
