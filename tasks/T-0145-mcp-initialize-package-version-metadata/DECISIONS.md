# Decisions

- MCP `serverInfo.version` is server package metadata. It must not be derived from the project root supplied to MCP read tools.
- Preserve existing MCP capability metadata and instructions while changing only the stale server version value.
- Use a non-throwing fallback for unreadable package metadata so initialize remains available.
