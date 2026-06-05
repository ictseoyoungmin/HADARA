# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `--from release-read-model` creates capsule docs with release boundaries. | Done | Unit tests and built CLI smoke. |
| AC-2 | `--from lifecycle-hardening` creates finish/ready/close/audit expectations. | Done | Unit tests. |
| AC-3 | Templates do not mark task Done or attach evidence. | Done | Unit tests verify Draft/evidence behavior. |
| AC-4 | Unknown template returns a clear error with supported templates and creates no capsule. | Done | Unit test and built unknown-template smoke. |
| AC-5 | Template output is schema-valid. | Done | `hadara.task.create.v1` schema validation tests. |
| AC-6 | Evidence is attached. | Done | Two public command-log records appended in `EVIDENCE.md` and `evidence.jsonl`. |
| AC-7 | Handoff is updated. | Done | `docs/AGENT_HANDOFF.md` updated to T-0259/T-0260 state. |
