# Context

T-0055 defined `hadara.ops.status.v1` and the dashboard read model contract. T-0056 added a minimal static dashboard that consumes the sample fixture.

Design baseline:

- `docs/design/mockups/HADARA_web_ui_v0.1_comfort_dark.html`

Data source:

- `docs/design/fixtures/hadara.ops.status.sample.json`

T-0057 adopts the mockup's shell direction only. It does not adopt demo task data, schema changes, live CLI/MCP calls, local state persistence, or every mockup page/tab. The authoritative data contract remains `hadara.ops.status.v1`.
