# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| All-scope aggregation duplicates issue ids from subreports. | Consumers need stable unique ids within the combined report. | Medium | Remap combined issues to sequential ids and remap remediation issue references. | Mitigated |
| Running every task-scoped check could surface large legacy drift. | `--scope all` might become noisy or fail unexpectedly on historical capsules. | Medium | Use docs/profile plus active-task detail; docs-scope already checks all Task Board/capsule cross-doc drift. | Mitigated |
| Defaulting `protocol doctor --json` to all changes input behavior. | Users previously got a required-option error. | Low | This matches the Phase 2 recommended command surface and is read-only. | Accepted |
