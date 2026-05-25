# Decisions

## D-0097-01: Dashboard APIs reuse existing read-model services

The dashboard server routes `/api/status`, `/api/tasks`, `/api/evidence`, `/api/active-run`, and `/api/debt` directly to existing shared read-model services. This keeps dashboard integration read-only and avoids duplicating Markdown, JSONL, active-run, or debt parsing logic.

## D-0097-02: API routes live in the existing dashboard response boundary

The new routes are handled by `createDashboardServerResponse()` alongside the static allowlist. Static serving remains unchanged, and API routes inherit no-store/no-sniff/CSP headers plus GET/HEAD-only method handling.

## D-0097-03: Evidence API requires an explicit task id

`/api/evidence` requires `taskId` as a query parameter. Missing task ids return a structured 400 response instead of guessing from active-run state, so callers remain explicit and deterministic.
