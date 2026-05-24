# Decisions

Record task-local design decisions here.

- Treat `hadara.active_run.projection.v1` as the shared CLI/MCP read payload for both `run-state show` and `hadara.active.run.read`.
- Make `hadara.active.run.resume` a read-only guidance view derived from the same projection rather than a state-changing resume action.
- Leave all run-state mutation commands deferred to avoid introducing write policy before the read surfaces settle.
