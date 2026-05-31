# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Existing task returns `hadara.task.workbench.v1`. | Met | Focused unit test covers schemaVersion and command. |
| AC-2 | Missing task returns `ok:false` and task-style exit code 6 through CLI. | Met | Focused unit test covers missing task CLI behavior. |
| AC-3 | Report includes task identity and Task Board status. | Met | Focused unit test covers task id/title/status and Task Board status. |
| AC-4 | Report includes evidence list/lint summary. | Met | Focused unit test covers lint and latest evidence summary. |
| AC-5 | Report includes ready/close state. | Met | Focused unit test covers close plan and ready/closed state. |
| AC-6 | Report includes docs/profile/task doctor summary. | Met | Service report includes task close protocol summary plus docs/profile protocol summaries. |
| AC-7 | Command performs no writes. | Met | Focused no-write snapshot test covers project docs and task evidence files. |
| AC-8 | Done-level harness is not run more than once per report. | Met | Focused unit test spies on `createHarnessValidateReport`. |
| AC-9 | Evidence is attached. | Met | `EVIDENCE.md` and `evidence.jsonl` contain focused/full/smoke command-log evidence. |
| AC-10 | Handoff is updated. | Met | Task and project handoffs updated. |
