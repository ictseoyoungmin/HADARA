# Decisions

| Decision | Rationale |
|---|---|
| Put evidence attach in a separate contract document. | The current MCP bridge contract describes implemented read-only behavior; future write-capable behavior needs a sharper boundary. |
| Define future write error taxonomy before implementation. | Write-capable tools need stable failure semantics before any mutation path exists. |
| Keep `policy.evaluate` as evaluation-only language. | External agents must not confuse policy preflight output with MCP execution authority. |
