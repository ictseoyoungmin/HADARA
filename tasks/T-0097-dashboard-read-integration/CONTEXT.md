# Context

- `docs/AGENT_HANDOFF.md` recommended Dashboard Read Integration as the next capsule after T-0096.
- `docs/DEVELOPMENT_SLICES.md` slice 72 requires route tests for `/api/status`, `/api/tasks`, `/api/evidence`, `/api/active-run`, and `/api/debt`.
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` describes the Dashboard Read API candidate routes and explicitly forbids shell execution, MCP writes, task mutation, browser-state persistence, and provider calls.
- `src/cli/dashboard.ts` already owns static dashboard serving, security headers, method restrictions, and safe route handling.
- Existing service/read-model boundaries provide the needed reports:
  - `createOpsStatusReport()`
  - `createTaskListReport()`
  - `createEvidenceListReport()`
  - `safeCreateActiveRunProjection()`
  - `createOperationalDebtReport()`
