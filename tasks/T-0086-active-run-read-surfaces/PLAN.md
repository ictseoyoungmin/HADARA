# Plan

1. Read HADARA protocol docs, CLI JSON contract, MCP bridge contract, and active-run planning notes.
2. Create T-0086 through the HADARA CLI.
3. Add a read-only CLI handler for `hadara run-state show`.
4. Register `hadara.active.run.read` and `hadara.active.run.resume` as read-only MCP tools backed by the active-run projection.
5. Update capability discovery, contracts, and focused tests.
6. Run focused tests, full Docker check, CLI/MCP smokes, and done-level harness validation.
7. Record evidence and refresh project handoff/state documents.
