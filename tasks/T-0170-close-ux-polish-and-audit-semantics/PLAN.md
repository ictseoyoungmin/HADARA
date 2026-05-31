# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and current close-model code. | Done | AGENTS context, project state, handoff, Task Board, slices, schemas, and task close code reviewed. |
| 2 | Split close diagnostic report hash from close-relevant source hash. | Done | `TaskCloseReport.validation` now exposes report/source hashes and keeps deprecated report-hash alias. |
| 3 | Polish execute-mode nextActions and append result metadata. | Done | Execute success returns appended/audit actions; close evidence reports Markdown and JSONL paths. |
| 4 | Add read-only close audit command and schema. | Done | `hadara task audit-close --task <id> --json` and `hadara.task.audit_close.v1` added. |
| 5 | Run validation and update docs/evidence. | Done | Focused Docker tests passed; full validation to be recorded before final handoff. |
