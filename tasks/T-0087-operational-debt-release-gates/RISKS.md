# Risks

| Risk | Mitigation |
|---|---|
| Open debt severity is currently static and subjective. | Use warning-only release-gate behavior and defer blocking gates until records become richer and less noisy. |
| Adding release terminology could imply executable release automation. | Keep `hadara release gate --json` read-only and keep `mcp.release.execute` deferred. |
| Dashboard fixtures can drift when ops status grows. | Update both sample fixture and inline fallback, with existing static dashboard tests enforcing parity. |
