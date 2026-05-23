# Decisions

| Decision | Rationale |
|---|---|
| Start Hermes/MCP work with a read-only contract task. | The bridge should first expose HADARA state and validation semantics without write or execution risk. |
| Keep CLI JSON command-specific schemas. | Existing commands already expose stable command envelopes; the shared CLI error envelope only covers early/global failures. |
| Use `hadara.*` MCP tool names. | Namespacing makes the tools clear when multiple MCP servers are connected. |
