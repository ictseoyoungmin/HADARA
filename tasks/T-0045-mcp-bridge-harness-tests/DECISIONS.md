# Decisions

| Decision | Rationale |
|---|---|
| Compare MCP payloads to report builders instead of shelling out to CLI commands. | This keeps tests deterministic, fast, and free of subprocess execution while still checking contract parity. |
| Keep dispatch error mapping in JSON-RPC `error.data.issue`. | This matches T-0044 and preserves HADARA issue semantics inside transport errors. |
