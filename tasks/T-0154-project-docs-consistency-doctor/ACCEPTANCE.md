# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara protocol doctor --scope docs --json` emits a read-only docs-scope consistency report. | Met | Built CLI smoke returned `scope: "docs"`, `ok: true`, and docs summary fields. |
| AC-2 | Docs-scope checks cover project document presence, Task Board versus capsule drift, handoff latest-completed drift, and SOP Required Reading missing paths. | Met | Focused protocol consistency tests cover `PROJECT_DOC_MISSING`, required-reading drift, Task Board status/capsule drift, and latest-completed handoff drift. |
| AC-3 | Existing `hadara protocol doctor --task <id> --json` behavior remains compatible. | Met | Focused CLI tests and built CLI smoke for T-0154 task mode passed. |
| AC-4 | Focused tests and a built CLI smoke are recorded. | Met | Evidence records include focused tests, full check, and built CLI smoke. |
| AC-5 | Evidence and handoff/state docs are updated before Done. | Met | Task evidence, task-local handoff, and project docs updated. |
