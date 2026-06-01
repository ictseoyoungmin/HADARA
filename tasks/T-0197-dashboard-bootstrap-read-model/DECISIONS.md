# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep T-0197 cache metadata explicit but disabled. | Accepted | Phase 5.5 wants cache semantics visible, but actual TTL cache behavior belongs to T-0201. | `cache.status: "disabled"` in `hadara.dashboard.bootstrap.v1`. |
| D-2 | Include compact selected-task proof only. | Accepted | First paint should not carry deep evidence payloads or raw artifact/path data; detail aggregation is T-0199. | Selected-task tests assert no `records` or `evidencePath`. |
| D-3 | Build bootstrap from existing read-model services. | Accepted | Dashboard authority should stay in shared HADARA read models instead of frontend inference or raw Markdown/JSONL parsing. | `createDashboardBootstrapReport()` composes status, task list, timeline, workbench, and lint services. |
