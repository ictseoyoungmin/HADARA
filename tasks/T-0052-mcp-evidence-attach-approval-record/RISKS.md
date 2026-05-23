# Risks

| Risk | Mitigation |
|---|---|
| Server-level opt-in becomes the only approval signal. | Require per-call approval actor and reason before evidence collection. |
| Approval details leak into committed evidence. | Record approval metadata only in private audit events. |
| Nested schema validation is incomplete. | Extend MCP argument validation for object properties and required nested fields. |
