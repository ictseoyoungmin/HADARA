# Decisions

| Decision | Rationale |
|---|---|
| Keep `hadara init upgrade` name and add targeted generated metadata merge. | The command creates missing docs and updates known generated profile metadata, while still avoiding arbitrary user-content diff/merge. |
| Add `--require-exists` instead of making missing docs a hard error by default. | Teams may intentionally register planned specs before creating them; strict mode is available when needed. |
| Keep Hermes/MCP CLI capabilities default-available while `enable-integration` only registers project guidance. | Runtime CLI availability and project scaffold guidance are separate concerns. |
| Use temp-file/rename rollback for multi-file init follow-up writes. | It gives integration enablement transaction-like behavior across SOP and integration docs without broad storage infrastructure. |
