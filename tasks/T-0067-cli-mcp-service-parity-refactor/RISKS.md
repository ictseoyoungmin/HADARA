# Risks

| Risk | Mitigation |
|---|---|
| Refactor could accidentally change JSON shapes. | Add equality tests comparing MCP payloads against shared report builders. |
| Only project/handoff reads are centralized in this slice. | Keep the slice narrow and leave broader run-state/service work to T-0068. |
