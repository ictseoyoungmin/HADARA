# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Workbench task projection reports `taskStatus`, true `taskBoardStatus`, `taskBoardPath`, and `taskBoardPresent` separately. | Done | `tests/unit/task-workbench.test.ts`; built CLI smoke evidence. |
| AC-2 | Workbench emits explicit Task Board status drift, row missing, and capsule drift issues. | Done | `tests/unit/task-workbench.test.ts`. |
| AC-3 | All workbench nextActions are normalized so optional undefined fields do not fail raw schema validation. | Done | `tests/unit/workbench-next-actions.test.ts`. |
| AC-4 | Workbench state separates close evidence presence from valid passed close evidence. | Done | `tests/unit/task-workbench.test.ts`. |
| AC-5 | `task.status` contract documents that `ok` means report generation success, not readiness. | Done | `docs/CLI_JSON_CONTRACT.md`; `docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md`. |
| AC-6 | Focused and full validation evidence is recorded. | Done | T-0177 evidence records. |
| AC-7 | Handoff and state docs are updated; no git commit is created. | Done | `docs/AGENT_HANDOFF.md`; final response will report no commit. |
