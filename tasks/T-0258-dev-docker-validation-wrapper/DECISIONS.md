# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement the wrapper as `hadara dev docker-check` instead of replacing npm scripts. | Accepted | Preserves existing helper workflow while adding a structured JSON surface for agents. | CLI and docs. |
| D-2 | Use an injectable runner in tests. | Accepted | Unit tests can prove report semantics without invoking Docker. | `tests/unit/dev-docker-check.test.ts`. |
| D-3 | Keep raw subprocess logs out of JSON. | Accepted | T-0258 requires evidence-ready reports without secret/path leakage. | Privacy tests and schema. |
