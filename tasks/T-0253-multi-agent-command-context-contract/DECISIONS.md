# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep T-0253 contract-only with no existing CLI option adoption. | Accepted | The Phase 6 spec requires common metadata before command-specific workflow compression. | No command handler changes; focused tests cover new helpers only. |
| D-2 | Register common context schemas as fixture-level standalone schemas. | Accepted | Existing schema registry expects each registered schema to be loadable and independently validatable. | `schema-fixtures` and `schema-runtime` focused tests. |
