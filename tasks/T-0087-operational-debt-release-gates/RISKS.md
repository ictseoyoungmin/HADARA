# Risks

| Risk | Mitigation |
|---|---|
| Open debt severity is currently static and subjective. | Keep `advisory` as the default mode; require explicit `strict` mode for blocking readiness reports. |
| Adding release terminology could imply executable release automation. | Keep `hadara release gate --mode advisory|strict --json` read-only and keep `mcp.release.execute` deferred. |
| Dashboard fixtures can drift when ops status grows. | Update both sample fixture and inline fallback, with existing static dashboard tests enforcing parity. |
