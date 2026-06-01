# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Dashboard renders Top Control Bar, Agent Lane, Workstream Panel, Evidence Lens placeholder, and Bottom Inspector. | Done | Focused test asserts all `data-layout` landmarks and section labels. |
| AC-2 | Layout remains responsive and keeps source/health state visible. | Done | CSS includes responsive operator/inspector grids and persistent top source/health badges. |
| AC-3 | UI uses read-only labels and copy-command guidance. | Done | Layout includes read-only badges and copy-command guidance; refresh remains `Refresh Status`. |
| AC-4 | Forbidden mutation/action labels are absent. | Done | Focused forbidden-token scan passed. |
| AC-5 | Live status binding and fixture/inline fallback still render. | Done | T-0193 live/fallback assertions still pass. |
| AC-6 | No new API mutation, shell execution, provider call, MCP write, or release/package behavior is added. | Done | Static HTML/route boundary tests passed; no server route changes added. |
| AC-7 | Focused dashboard layout tests pass. | Done | `dashboard-static.test.ts` passed with 1 file / 13 tests. |
| AC-8 | Full Docker validation passes. | Done | `npm run dev:docker-sync-build` passed with 79 files / 551 tests. |
