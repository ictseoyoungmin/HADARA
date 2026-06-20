# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Successful `task close --json` dry-runs return `append-close-evidence` as the primary/only next action instead of redundant validation reruns. | Met | `ev:T-0395:0bfa119bfc5e43a489d31794`, `ev:T-0395:a2c33196f7704223ae5e0044` |
| AC-2 | Failed close dry-runs still expose validation/lint/blocker guidance. | Met | `ev:T-0395:0bfa119bfc5e43a489d31794` |
| AC-3 | Lifecycle and complete-flow consumers remain compatible. | Met | `ev:T-0395:0bfa119bfc5e43a489d31794` |
| AC-4 | Full Docker sync-build and diff hygiene pass. | Met | `ev:T-0395:6c210dc953974c32acf008b7`, `ev:T-0395:7626ac62b2db4570ac2a87c8` |
| AC-5 | Capsule and shared handoff/state docs are updated before close. | Met | This capsule handoff plus shared doc updates in the T-0395 diff. |
