# Context

- `docs/AGENT_HANDOFF.md` marks T-0097 complete and recommends CLI Write Boundary Preflight next.
- `docs/DEVELOPMENT_SLICES.md` order 73 names this slice and requires write-preflight tests that list files before task/evidence/handoff/run-state/debt writes.
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` defines the seed `hadara.write.preflight.v1` shape and keeps broad MCP writes out of scope.
- Current implemented write commands include task create, evidence collect, and handoff update.
- Run-state write and debt mutation commands remain deferred; this task may preflight their expected boundary without implementing the writes.
- Existing local user change in `src/cli/dashboard.ts` updates the dashboard serve log message; preserve it.
