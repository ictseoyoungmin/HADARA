# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Release dry-run reports operator readiness metadata. | Done | `release dry-run` reports `readiness` with next actions and blocker/warning counts. |
| AC-2 | Release dry-run reports timing diagnostics. | Done | `diagnostics.stageTimings` and `slowStageWarnings` identify slow stages without affecting release readiness. |
| AC-3 | Schema and focused tests cover the additive report fields. | Done | Docker full check passed 92 files / 611 tests; schema and release dry-run focused tests cover the new fields. |
| AC-4 | Validation evidence and handoff capture the remaining release blocker. | Done | Evidence records attached; handoff records stale release artifact evidence and strict-gate latency. |
