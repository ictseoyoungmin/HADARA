# Decisions

| Decision | Rationale |
|---|---|
| Derive write metadata from `enableEvidenceAttach`. | This matches the only current opt-in write-capable MCP behavior. |
| Keep the phase string explicit. | Clients can distinguish default read-only bridge mode from the narrow evidence attach mode. |
