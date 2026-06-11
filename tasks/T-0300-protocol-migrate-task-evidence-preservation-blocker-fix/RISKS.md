# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Migration overwrites existing evidence history. | High: task proof history is erased. | Fixed | Existing `evidence.jsonl` now produces a skipped action; regression covers dry-run and execute. | Mitigated |
| Missing legacy evidence index stops being created. | Medium: old capsules remain incomplete. | Low | Missing-file path still uses a planned create action and existing test coverage remains. | Mitigated |
| T-0299 close proof becomes stale after handoff correction. | Medium: task-local close audit drift. | Fixed | Re-ran T-0299 ready/close/audit after handoff edit; audit returned closed-valid. | Mitigated |
| `task finish` breaks the managed Status History table. | High: rendered task status history becomes malformed and close-source history is harder to inspect. | Fixed | Insert Done rows before the managed end marker and add focused regression coverage. | Mitigated |
| rc.1 publish accidentally happens from blocker capsule. | High: bypasses final readiness. | Low | Publish commands remain out of scope and were not run. | Mitigated |
