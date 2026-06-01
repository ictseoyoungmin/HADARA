# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard read-only/cache/debug contract. | Read |
| docs/DASHBOARD_PRODUCTION_READINESS_REVIEW.md | Production-readiness boundary audit. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Dashboard server usually serves one project root, but helper APIs may be called with multiple project roots in one process. | User review and current service shape. | Cache collision if keys do not include a project fingerprint. |
| v1 aggregate schemas still include `source.projectRoot`. | Existing contract/tests. | Removing it immediately would be a breaking change; add redacted fields first. |
| Screenshot issues include non-functional nav and overlong status chips. | User screenshot and HTML inspection. | Static UI looks stuck on Home and crowded even when data is correct. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Dashboard actions must remain read-only. | `docs/DASHBOARD_READ_MODEL_CONTRACT.md` | Refresh/polling only re-read status/bootstrap APIs. |
| Cache remains process-memory only. | `docs/DASHBOARD_READ_MODEL_CONTRACT.md` | No persisted cache files or browser project-state storage. |
| Use Docker validation for CLI changes. | `AGENTS.md` / `docs/IMPLEMENTATION_SOP.md` | `npm run dev:docker-sync-build` used for final validation. |
