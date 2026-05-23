# Risks

| Risk | Mitigation |
|---|---|
| MCP clients misread a write-capable process as read-only. | Test initialize metadata for both startup modes. |
| Metadata implies broader write access than exists. | Use a narrow `hadara/evidenceAttach` flag and keep shell/provider flags false. |
