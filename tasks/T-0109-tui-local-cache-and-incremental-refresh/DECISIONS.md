# Decisions

## D-0109-001: TUI Cache Is Internal Local Acceleration

`hadara.tui.cache.v1` is implemented as an internal local cache record under `.hadara/local/tui/read-model-cache.json`. It is intentionally not registered as a stable public schema or release gate in this slice.

## D-0109-002: Cache Is Opt-In for Public TUI

The public TUI remains cache-free by default. `hadara tui --cache` enables interactive local cache writes, and `--no-cache` overrides it. Snapshot mode remains cache-free even if `--cache` is present so non-interactive smoke rendering stays mutation-free.

## D-0109-003: Detail Refresh Uses Cached Task Summaries

Detail refresh reuses the cached task list to locate the selected capsule and reads only the selected task files/evidence. This avoids scanning every capsule when opening a different selected task from an already cached TUI model.

## D-0109-004: Fast Cache Requires Project-Level Source Signals

Fast cache validation uses source signals for `tasks/`, `docs/TASK_BOARD.md`, `docs/AGENT_HANDOFF.md`, active-run local state, the selected task, and selected evidence. This keeps the cache fast while invalidating on new/deleted tasks, board-only changes, selected evidence changes, and active-run/handoff updates.

## D-0109-005: Private Evidence Read Models Are Not Cacheable

When `includePrivateEvidence: true` is requested, TUI cache is disabled and the read model is loaded directly. Local cache is ignored machine state, but keeping private evidence metadata out of it makes the policy simpler and safer.
