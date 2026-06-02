# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Stub the read-only aggregate APIs from committed fixtures for deterministic visual capture. | Accepted | Container-to-host fetch stalls in the harness; stubbing makes screenshots deterministic and is standard for visual regression. | dashboard/visual-check.mjs. |
| D-2 | Rewrite the static test to encode new-design invariants and scan authored source, keeping all governance/server assertions. | Accepted | The old test encoded the old design as a contract; governance must remain enforced. | tests/unit/dashboard-static.test.ts. |
