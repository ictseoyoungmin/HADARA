# Acceptance Criteria

- [x] `src/tui/read-model.ts` returns a typed internal aggregate from existing read-model services.
- [x] Aggregator selects the active-run task when available and otherwise falls back to the latest task.
- [x] Selected task detail and evidence are included for the selected task.
- [x] Active-run resume, debt, advisory release gate, tools, and write-preflight preview are included.
- [x] Tests prove the aggregator does not create task capsules, write evidence, update handoff, mutate active-run state, call providers, call MCP, execute shell commands, or create TUI cache files.
- [x] Evidence is attached.
- [x] Handoff is updated.
