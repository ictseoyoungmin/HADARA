# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Rename semantics through additive fields rather than removing the old hash field. | Accepted | Keeps existing consumers working while clarifying the primary report hash. | `task-close` tests assert old alias equals report hash. |
| D-2 | Add a separate close-relevant source hash. | Accepted | Audit needs to detect post-close file drift that does not necessarily change diagnostic issue output. | Audit drift unit test changes `PLAN.md` and expects source-hash warning. |
| D-3 | Keep close audit read-only. | Accepted | Preserves the validation/close/audit three-layer model and avoids a re-close loop. | `task audit-close` only returns a report. |
