# Handoff

## Last Completed

T-0097 Dashboard Read Integration is complete. `hadara dashboard serve` response helpers now expose read-only JSON routes for `/api/status`, `/api/tasks`, `/api/evidence?taskId=<task-id>`, `/api/active-run`, and `/api/debt` using existing shared read-model services.

## Next Recommended Step

Start the next capsule for CLI Write Boundary Preflight. Keep shell execution, provider calls, live streaming, MCP writes, task mutation, evidence writes, and browser-state persistence out of dashboard work unless a later capsule explicitly authorizes them.
