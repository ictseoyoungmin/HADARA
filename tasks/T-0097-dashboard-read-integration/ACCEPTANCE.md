# Acceptance Criteria

- [x] `hadara dashboard serve` response helpers expose read-only JSON for `/api/status`, `/api/tasks`, `/api/evidence?taskId=<task-id>`, `/api/active-run`, and `/api/debt`.
- [x] API routes reuse existing shared read-model services and do not add shell execution, provider calls, MCP writes, task mutation, evidence writes, or browser-state persistence.
- [x] Static dashboard serving behavior remains GET/HEAD-only, no-store/no-sniff/CSP-protected, traversal-resistant, and safely degraded on missing files or unexpected errors.
- [x] Dashboard route tests cover the new API endpoints and boundary behavior.
- [x] Evidence is attached.
- [x] Handoff is updated.
