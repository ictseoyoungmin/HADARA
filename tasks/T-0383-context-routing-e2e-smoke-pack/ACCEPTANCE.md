# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | A built CLI context-routing smoke script exists with structured JSON output. | Met | `scripts/context-routing-e2e-smoke.mjs` |
| AC-2 | The smoke script has a fast default profile and explicit full/custom workload selection. | Met | `--profile fast`, `--profile full`, `--workloads` |
| AC-3 | Smoke runs do not write context cache in normal read-only/dry-run mode. | Met | Cache fingerprint boundary in report; built fast smoke passed. |
| AC-4 | Unit tests cover package wiring and fake CLI workload execution. | Met | `tests/unit/context-routing-e2e-smoke-script.test.ts` |
| AC-5 | Validation evidence is attached. | Met | `ev:T-0383:d013f3d6e2be494bb6372a41` |
| AC-6 | Handoff/shared state routes the next capsule. | Met | T-0384 routed in handoff/shared docs before close. |
