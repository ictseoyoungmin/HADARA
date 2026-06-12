# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Root workflow docs explain incremental documentation timing. | Done | AGENTS, SOP, and TASK_WORKFLOW_COMMANDS updated; task-workflow-docs test covers root docs. |
| AC-2 | Generated init workflow docs include the same timing model. | Done | `src/cli/init.ts` templates and init tests updated. |
| AC-3 | Root and generated docs explain read-only parallel / write-boundary serialized rules. | Done | Tests assert `Parallelize read-only discovery` and `Serialize same-file writes` guidance. |
| AC-4 | Fresh init tests prove scaffolded docs include this guidance. | Done | Docker focused init test passed. |
| AC-5 | No CLI behavior changes beyond generated documentation content. | Done | Scope limited to docs/templates/tests; built fresh-init smoke passed. |
| AC-6 | Evidence is attached and handoff is updated before close. | Done | `evidence add-command` recorded validation evidence; task and project handoff docs updated. |
