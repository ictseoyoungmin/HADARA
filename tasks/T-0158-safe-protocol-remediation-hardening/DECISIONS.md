# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| TD-1 | Use T-0158 for remediation hardening and move the JSON contract slice to the next task number. | Accepted | The HADARA CLI assigned T-0158 to this follow-up capsule before a JSON contract capsule existed. | `docs/TASK_BOARD.md`; updated planning docs. |
| TD-2 | Treat malformed Task Board and legacy Decisions tables as warning-and-skip states. | Accepted | This avoids silently creating bare rows or duplicate semantic tables during a safe remediation command. | Regression tests. |
| TD-3 | Add optional before/after hashes and expected existence metadata to remediation actions. | Accepted | This supports immediate conflict detection now and gives T-0159 contract work concrete fields to schema-review. | `src/services/protocol-remediation.ts`. |
