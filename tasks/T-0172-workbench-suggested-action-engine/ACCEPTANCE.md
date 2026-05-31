# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Missing evidence JSONL suggests safe remediation dry-run. | Met | Unit test covers `remediate-evidence-jsonl` with dry-run and execute command. |
| AC-2 | Evidence enum issue suggests lint/repair guidance, not direct edit. | Met | Unit test covers invalid kind mapping to `hadara evidence lint`. |
| AC-3 | Ready task suggests `task close --json`. | Met | Unit test covers close dry-run plus paired execute command. |
| AC-4 | Closed task suggests `task audit-close --json`. | Met | Unit test covers closed state audit action. |
| AC-5 | Suggested execute commands are paired with dry-run commands where applicable. | Met | Unit test covers close and remediation dry-run/execute pairing. |
| AC-6 | Evidence is attached. | Met | `EVIDENCE.md` and `evidence.jsonl` contain focused/full/smoke command-log evidence. |
| AC-7 | Handoff is updated. | Met | Task and project handoffs updated. |
