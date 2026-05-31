# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add `docs/TASK_WORKFLOW_COMMANDS.md` as the canonical task workflow semantics document. | Accepted | README, SOP, AGENTS, and CLI contract should not each become divergent sources of truth. | `docs/TASK_WORKFLOW_COMMANDS.md`; `tests/unit/task-workflow-docs.test.ts`. |
| D-2 | Keep T-0185 documentation/test-only. | Accepted | Existing commands already implement the intended boundaries; this capsule stabilizes operator expectations before UI/read-surface work. | No source command behavior changes. |
| D-3 | Preserve `task status.ok` as report-generation success. | Accepted | `task status` is an operator console, while `task ready`, `task finish`, `task close`, and `task audit-close` carry gate/result meanings. | `docs/TASK_WORKFLOW_COMMANDS.md`; `docs/CLI_JSON_CONTRACT.md`. |
