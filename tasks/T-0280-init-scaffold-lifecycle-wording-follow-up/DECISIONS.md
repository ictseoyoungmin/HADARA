# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0280-1 | Align generated and root task workflow docs to the actual `finish -> ready -> close -> audit` done flow. | Accepted | `task ready --level done` reports `finish-first` until `TASK.md` and `docs/TASK_BOARD.md` are Done, so generated docs must not instruct ready-before-finish. | T-0280 `task ready` preflight and docs/tests patch. |
| D-0280-2 | Record current PyPI status as published while preserving historical no-upload evidence in T-0276 through T-0278. | Accepted | The user reported real PyPI rc.1 publish is complete; older capsules should still describe their original no-mutation scope. | README, Project State, PyPI runbook, and Agent Handoff updates. |
