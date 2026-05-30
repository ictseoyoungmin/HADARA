# Decisions

| Decision | Rationale |
|---|---|
| Keep `hadara init upgrade` name but clarify missing-doc expansion semantics. | The command is useful and safe, but it is not a diff/merge profile migration. |
| Add `--require-exists` instead of making missing docs a hard error by default. | Teams may intentionally register planned specs before creating them; strict mode is available when needed. |
| Keep Hermes/MCP CLI capabilities default-available while `enable-integration` only registers project guidance. | Runtime CLI availability and project scaffold guidance are separate concerns. |
