# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/task/task-capsule.ts | Modified | Add direct single-task capsule lookup helper. | Complete |
| src/task/task-finish.ts | Modified | Avoid broad capsule scan for `task finish`. | Complete |
| src/services/task-read-model.ts | Modified | Avoid broad capsule scan for single-task read/show. | Complete |
| src/services/evidence-list.ts | Modified | Avoid broad capsule scan for single-task evidence list. | Complete |
| src/services/evidence-lint.ts | Modified | Avoid broad capsule scan for single-task evidence lint. | Complete |
| src/services/task-workbench.ts | Modified | Add additive readiness state separating current readiness and close proof validity. | Complete |
| src/services/dashboard-task-detail.ts | Modified | Keep dashboard fast workbench projection compatible with new readiness field. | Complete |
| src/dev/docker-check.ts | Modified | Add bounded failed-step exit code and debug hint. | Complete |
| src/schemas/task-workbench.schema.json | Modified | Document additive `state.readiness` contract. | Complete |
| src/schemas/dev-docker-check.schema.json | Modified | Document Docker check issue diagnostics fields. | Complete |
| tests/unit/task-finish.test.ts | Modified | Add regression for direct task lookup. | Complete |
| tests/unit/task-workbench.test.ts | Modified | Cover additive readiness semantics. | Complete |
| tests/unit/dev-docker-check.test.ts | Modified | Cover failed-step exit code/debug hint without raw logs. | Complete |
| docs/TASK_BOARD.md | Modified | Add T-0274 capsule row. | Complete |
| tasks/T-0274-lifecycle-status-clarity-and-performance-hardening/* | Modified | Record capsule plan, evidence, risks, acceptance, and handoff. | Complete |
