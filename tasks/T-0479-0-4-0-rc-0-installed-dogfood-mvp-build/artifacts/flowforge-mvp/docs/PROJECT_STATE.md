# PROJECT_STATE

## Product

<!-- hadara:managed:start project-state-metadata {"schema":"hadara.managedSection.v1","owner":"project-state.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Name | FlowForge |
| Purpose | Local-first release planning board for small product teams. |
| HADARA Profile | governed |
<!-- hadara:managed:end project-state-metadata -->

## Current Phase

| Field | Value |
|---|---|
| Phase | MVP dogfood artifact |
| Status | complete |
| Active Task | None |

## Current Status

| Area | Status | Notes |
|---|---|---|
| Scaffold | Complete | HADARA governed scaffold initialized under installed `hadara@0.4.0-rc.0`. |
| Task Capsules | Complete | 12 capsules are marked Done and retained as dogfood evidence. |
| MVP | Complete | FlowForge includes local JSON persistence, REST API, static UI, import/export, readiness reporting, and smoke coverage. |
| Validation | Passed | `npm run smoke` passed; non-document software LOC is 5,397. |

## Single Source of Truth

| Source | Path | Purpose |
|---|---|---|
| Current state | `docs/PROJECT_STATE.md` | Product and capability state. |
| Work queue | `docs/TASK_BOARD.md` | Task status and queue. |
| Next-session handoff | `docs/AGENT_HANDOFF.md` | Compact continuation state. |
| Workflow | `docs/HADARA_WORKFLOW.md` | Generic HADARA lifecycle and evidence rules. |
| Dogfood report | `reports/HADARA_DOGFOOD_REPORT.md` | HADARA timing and UX findings from the installed-package dogfood run. |
