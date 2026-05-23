# Acceptance Criteria

- [x] `hadara.evidence.attach` input schema requires `approval`.
- [x] Missing approval is rejected as `TOOL_INPUT_INVALID` before evidence collection.
- [x] Approval actor and reason require non-empty strings.
- [x] Successful write audit events include approval metadata.
- [x] Failed write audit events include approval metadata when supplied.
- [x] No shell execution or provider calls are added.
- [x] Required Docker validation passes.
- [x] Done-level capsule validation passes.
- [x] Evidence and handoff documents are updated.
