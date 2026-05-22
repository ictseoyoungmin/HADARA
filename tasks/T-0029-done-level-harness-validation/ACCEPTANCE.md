# Acceptance Criteria

- [x] `hadara harness validate --level draft` preserves existing structural validation behavior.
- [x] `hadara harness validate --level done` is accepted.
- [x] Unsupported validation levels are rejected.
- [x] Done-level validation requires `TASK.md` status to be Done.
- [x] Done-level validation requires all acceptance checkboxes to be checked.
- [x] Done-level validation requires at least one `evidence.jsonl` record.
- [x] Done-level validation requires non-placeholder handoff content.
- [x] Required Docker validation passes.
- [x] Evidence and handoff documents are updated.
