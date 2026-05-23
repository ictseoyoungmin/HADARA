# Decisions

| Decision | Rationale |
|---|---|
| Promote the comfort dark mockup to dashboard visual baseline. | The mockup is the strongest current expression of HADARA dashboard layout, hierarchy, palette, card grouping, and navigation feel. |
| Keep `hadara.ops.status.v1` authoritative. | The visual baseline must not define schema, live integration, write behavior, MCP behavior, or dashboard state persistence. |
| Do not directly copy the original mockup implementation. | The original mockup contains base64 imagery, demo task data, localStorage, and extensive `innerHTML` rendering. T-0057 adopts shell direction without copying those behaviors. |
