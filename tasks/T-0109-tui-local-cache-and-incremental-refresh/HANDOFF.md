# Handoff

## Last Completed

T-0109 added an internal TUI local cache service and opt-in interactive `hadara tui --cache` path. Cache records are written only under `.hadara/local/tui/read-model-cache.json`, include project-level source signals plus task index mtime/size/hash data, support full/fast/detail/none refresh modes, and remain excluded from context export. Fast cache now invalidates on new/deleted tasks, Task Board-only changes, selected task/evidence changes, handoff changes, and active-run local-state changes. Default interactive TUI, `--no-cache`, and snapshot mode remain cache-free, and cache is disabled when private evidence metadata is requested.

## Next Recommended Step

Return to the release/packaging track by default. If TUI remains the priority, the next focused capsule is the TUI visual parity pass: color/theme polish, status/log/loading frame, richer cards, badges, and snapshot presentation hardening without adding writes, shell/provider/MCP calls, or server behavior.
