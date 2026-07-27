# DASHBOARD_READ_MODEL_CONTRACT

Historical note only.

The browser dashboard surface was removed during RC2 reduction in T-0691 on July 23, 2026. This file remains only so older references have a stable landing point.

Current operator UI boundary:

- read-only terminal TUI under `src/tui/`
- shared status/task/evidence read models
- no dashboard CLI route, frontend bundle, projection store, or dashboard-only API layer

For current selected-task evidence semantics, use `docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md`.
