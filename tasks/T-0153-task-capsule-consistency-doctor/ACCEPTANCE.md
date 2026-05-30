# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara protocol doctor --task <id> --json` emits a read-only `hadara.protocol.consistency.v1` task-scoped report. | Met | Built CLI smoke returned `ok: true` for T-0153 with zero issues. |
| AC-2 | The task-scoped report includes stable issue codes for missing files, Task Board status drift, Done with pending acceptance, missing/empty evidence JSONL, stale project handoff, and scaffold placeholder drift. | Met | Focused protocol consistency tests cover the requested drift classes. |
| AC-3 | Focused tests cover the new service and CLI command shape without adding write/remediation behavior. | Met | `tests/unit/protocol-consistency.test.ts` and `tests/unit/protocol-cli.test.ts` passed. |
| AC-4 | Evidence is attached in `EVIDENCE.md` and `evidence.jsonl`. | Met | Evidence rows recorded for focused tests, full check, built CLI smoke, and host validation constraint. |
| AC-5 | Project handoff, task board, project state, and development slices are updated before completion. | Met | Project docs updated before done-level harness validation. |
