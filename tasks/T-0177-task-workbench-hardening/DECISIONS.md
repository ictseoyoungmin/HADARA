# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0177-1 | Read Task Board status directly from `docs/TASK_BOARD.md` in the workbench projection. | Accepted | Capsule `TASK.md` status and Task Board status are distinct sources and can drift. | Tests cover status drift, row missing, and capsule drift. |
| D-0177-2 | Keep `task.status` top-level `ok` as report-generation success. | Accepted | Workbench is an operator console, while readiness is represented by `state.ready`, blockers, and issues. | CLI JSON contract and workbench contract updated. |
| D-0177-3 | Prefer `closedValid` and keep `closed` as a compatibility alias. | Accepted | This preserves existing field shape while separating evidence presence from valid passed close evidence. | Close state regression tests. |
