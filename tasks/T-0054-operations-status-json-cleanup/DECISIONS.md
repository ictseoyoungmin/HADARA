# Decisions

| Decision | Rationale |
|---|---|
| Keep `ok: true` for warning-only degraded snapshots. | Dashboards can render partial state while using `issues` to indicate degraded inputs. |
| Add `rawStatusCounts` instead of expanding `counts`. | This keeps the dashboard schema stable while preserving detail for diagnostics. |
| Do not inspect live MCP process status in T-0054. | The current status command is a local read model, not a runtime monitor. |
