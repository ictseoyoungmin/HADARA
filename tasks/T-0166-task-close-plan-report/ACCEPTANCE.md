# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara task close --task <id> --json` emits a read-only close plan. | Met | Task close tests and built CLI smoke. |
| AC-2 | Report includes done validation, evidence lint, protocol doctor, close evidence loop-boundary metadata, and nextActions. | Met | `tests/unit/task-close.test.ts`. |
| AC-3 | `--execute` remains reserved and does not write. | Met | Reserved execute regression test. |
| AC-4 | Evidence and handoff are updated. | Met | T-0166 evidence and handoff files. |
