# Risks

| Risk | Mitigation |
|---|---|
| A publish/deploy command could imply mutation before the package is actually releasable. | The command reports readiness only, keeps all `willExecute` and mutation privacy flags false, and returns blocked status for current bootstrap/private metadata. |
| Token values could leak into JSON, logs, or evidence. | Reports only token names and boolean presence; tests assert secret-like token values are absent from output and audit records. |
| Execute mode could become a hidden release path. | Execute mode requires approval metadata, writes a private audit event, and remains blocked before `npm publish`, GitHub Release creation, Docker build, registry mutation, or API calls. |
| MCP clients could discover a release execution surface prematurely. | No MCP tool is added; capability notes keep MCP release execution deferred. |
