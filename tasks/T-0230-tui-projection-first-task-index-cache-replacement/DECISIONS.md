# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use dashboard task projection first, then Task Board rows, then legacy task scan fallback. | Accepted | TUI must share operator read-model architecture and avoid duplicated broad Markdown semantics. | `createTuiTaskListReport()` |
| D-2 | Stop using `tasks/` directory membership as a fast-cache source signal. | Accepted | Directory scans are the `/mnt/f` bottleneck this capsule is removing. | TUI cache tests |
| D-3 | Make `hadara tui --snapshot` use fast profile. | Accepted | Snapshot mode is a smoke/render surface; full advisory work should not block first terminal output. | CLI and feature-smoke updates |
