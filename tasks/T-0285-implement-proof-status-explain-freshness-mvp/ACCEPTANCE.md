# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `proof status --task <id> --json` emits compact task-readiness proof JSON. | Met | Built proof status smoke passed. |
| AC-2 | `proof explain --task <id> --json` includes explanation rules and semantic/freshness issue codes. | Met | Focused proof CLI test passed. |
| AC-3 | Verdicts cover sufficient, blocked, warning/private-only, and stale/missing freshness cases. | Met | Focused proof tests passed. |
| AC-4 | Evidence and close freshness are derived from existing evidence lint and task close audit read models. | Met | `/tmp` build passed; focused proof/evidence/close tests passed. |
| AC-5 | Evidence and handoff/state docs are updated before close. | Met | T-0285 evidence records appended; state docs updated before close. |
