# Decisions

- Keep this capsule focused on parity fixes that do not change the read-model boundary: no worker threads, async migration, writes, shell/provider/MCP execution, or dashboard/server behavior.
- Treat `TUI_HEAVY_READS_DEFERRED` as a first-class Overview signal in fast TUI mode. The UI should say deferred instead of implying advisory reads completed with zero debt or an ok release gate.
- Pass `taskListScroll` and `taskSearchActive` from interaction state to snapshots, and let the renderer normalize the window to keep the selected row visible.
- Keep mouse geometry fixed for now, but make it consistent with the rendered task window. A later capsule can replace fixed coordinate logic with renderer-derived hitboxes if needed.
- Make mouse task-row clicks match keyboard Enter and the mockup: select the row, switch to Detail, and refresh selected task detail when the model is still pointed at another task.
