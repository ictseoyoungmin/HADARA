# Decisions

## D-0109-001: TUI Cache Is Internal Local Acceleration

`hadara.tui.cache.v1` is implemented as an internal local cache record under `.hadara/local/tui/read-model-cache.json`. It is intentionally not registered as a stable public schema or release gate in this slice.

## D-0109-002: Cache Is Opt-In for Public TUI

The public TUI remains cache-free by default. `hadara tui --cache` enables interactive local cache writes, and `--no-cache` overrides it. Snapshot mode remains cache-free even if `--cache` is present so non-interactive smoke rendering stays mutation-free.

## D-0109-003: Detail Refresh Uses Cached Task Summaries

Detail refresh reuses the cached task list to locate the selected capsule and reads only the selected task files/evidence. This avoids scanning every capsule when opening a different selected task from an already cached TUI model.
