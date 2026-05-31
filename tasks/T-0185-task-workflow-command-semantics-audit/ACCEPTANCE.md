# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `task status`, `ready`, `finish`, `close`, `audit-close`, `next`, and `evidence add-command` roles are documented with read/write boundaries, dry-run behavior, and `ok` semantics. | Done | `docs/TASK_WORKFLOW_COMMANDS.md`; `docs/CLI_JSON_CONTRACT.md`. |
| AC-2 | README Quick Start includes the standard task completion loop. | Done | `README.md` Complete a Task Capsule section. |
| AC-3 | AGENTS/SOP register task workflow semantics and include the standard loop. | Done | `AGENTS.md`; `docs/IMPLEMENTATION_SOP.md`. |
| AC-4 | Regression coverage prevents docs drift for the workflow loop and command semantics. | Done | `tests/unit/task-workflow-docs.test.ts`; focused test and Docker sync-build passed. |
| AC-5 | Evidence is attached and handoff is updated. | Done | `EVIDENCE.md`, `evidence.jsonl`, and `HANDOFF.md` updated. |
