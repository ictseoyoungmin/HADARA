# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-10 | `hadara context graph --json` emits a schema-valid full context graph report. | Done | tests/unit/context-graph-cli.test.ts; ev:T-0352:d70ee6360acf43948d7cf620 |
| AC-11 | `hadara context graph --task T-XXXX --json` emits task mode with embedded task context. | Done | built CLI smoke; ev:T-0352:d70ee6360acf43948d7cf620 |
| AC-12 | `context.graph` is registered in command metadata and documented as a read-only projection. | Done | src/services/capability-registry.ts, docs/CLI_JSON_CONTRACT.md, docs/COMMAND_SURFACE.md |
| AC-13 | Focused tests, full Docker check, dist refresh, built CLI smokes, and diff check pass. | Done | ev:T-0352:d70ee6360acf43948d7cf620 |
