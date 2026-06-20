# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | For successful `task close --json` dry-runs, return only `append-close-evidence` as the next action. | Accepted | The dry-run has already executed done validation, evidence lint, and protocol doctor; repeating those as primary next actions creates redundant agent guidance. | `ev:T-0395:0bfa119bfc5e43a489d31794` |
| D-2 | Preserve validation/lint/blocker guidance for failed close dry-runs. | Accepted | Blocked capsules still need explicit remediation commands and review guidance. | `ev:T-0395:0bfa119bfc5e43a489d31794` |
| D-3 | Do not change report schemas. | Accepted | This is a compatible content/ordering hardening of existing `nextActions`, not a schema break. | `ev:T-0395:6c210dc953974c32acf008b7` |
