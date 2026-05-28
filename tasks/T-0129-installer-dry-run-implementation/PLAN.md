# Plan

1. Read HADARA protocol docs, release/install planning docs, schema docs, and T-0128 handoff.
2. Replace scaffold capsule docs with T-0129-specific scope, risks, files, tests, decisions, and acceptance criteria.
3. Add a shared install-plan report service that produces schema-valid `hadara.install.plan.v1` reports without writes.
4. Add `hadara install plan` CLI handling and register the command in capability discovery.
5. Add focused tests for schema validity, redacted paths, execute-disabled behavior, and CLI JSON output.
6. Run Docker focused and full validation, then record evidence.
7. Update project state, task board, development slices, backlog, and handoff before stopping.
