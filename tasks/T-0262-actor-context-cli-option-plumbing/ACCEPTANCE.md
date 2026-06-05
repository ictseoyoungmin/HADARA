# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Actor CLI options are accepted and reflected in Phase 6.1 report actor fields. | Done | Task finish/ready/close/audit-close/complete, handoff suggest, and dev docker-check tests cover explicit actor input. |
| AC-2 | Existing defaults are preserved when actor options are absent. | Done | Existing default actor assertions remain in focused workflow tests. |
| AC-3 | Out-of-scope boundaries remain true. | Done | No scheduler, task assignment service, hidden shared-doc write, provider execution, or multi-agent runtime behavior added. |
| AC-4 | Template expected evidence is recorded. | Done | Focused Docker wrapper passed; Docker sync-build passed 100 files / 667 tests; built CLI actor smoke returned explicit actor metadata. |
| AC-5 | Evidence is attached and handoff is updated. | Done | Evidence `ev:T-0262:cac611b6fbc64aaf9b5e44ec` attached; shared state docs updated. |
