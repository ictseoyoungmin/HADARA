# T-0097 Dashboard Read Integration

## Goal

Add local read-only dashboard API routes behind `hadara dashboard serve` so the static dashboard server can expose existing HADARA read models without shell execution, provider calls, MCP writes, or browser-state persistence.

## Scope

- Serve JSON responses for local dashboard read API routes:
  - `GET /api/status`
  - `GET /api/tasks`
  - `GET /api/evidence?taskId=<task-id>`
  - `GET /api/active-run`
  - `GET /api/debt`
- Reuse existing shared read-model services instead of duplicating parsing logic.
- Preserve existing static dashboard routes, security headers, GET/HEAD-only behavior, traversal rejection, no-store responses, and safe 404/405/500 failures.
- Add route-level tests for the new dashboard read API behavior.

## Out of Scope

- Rendering live API data in the dashboard HTML.
- Shell execution, provider calls, MCP behavior changes, live streaming, task mutation, evidence writes, run-state writes, or browser-state persistence.
- Broad dashboard UX redesign.

## Status

Done
