# Context

- `docs/DEVELOPMENT_SLICES.md` lists slice 67 as Operational Debt Release Gates.
- `docs/V1_0_CAPSULE_BACKLOG.md` describes the target as debt list/show reports, ops aggregate counts, and release-gate debt checks.
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` says open high-severity debt should warn first; blocking behavior is deferred.
- T-0069 introduced the foundational static operational debt report in `src/services/operational-debt.ts`.
- T-0086 completed active-run read surfaces; active-run writes, broad MCP writes, shell execution, provider calls, and live dashboard APIs remain deferred.
