# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Store task projection index under `source-signals/tasks`. | Accepted | The index is source-signal metadata plus task summaries, not selected-task detail. | `src/services/dashboard-task-projection.ts`. |
| D-2 | Use mtime/size-derived signals for this slice. | Accepted | The Phase 5.7 spec allows mtime/size signals and keeps refresh cheap. | `fileSignal`. |
| D-3 | Reuse title/status/evidence counts independently. | Accepted | If only `TASK.md` changes, evidence count can be reused; if only evidence changes, title/status can be reused. | `buildTaskProjectionEntry`. |
| D-4 | Core route prefers task projection when present. | Accepted | Warm task projection gives better task summaries than Task Board-only fallback while keeping foreground route bounded. | `src/services/dashboard-core.ts`. |
