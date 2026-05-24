# Risks

| Risk | Mitigation |
|---|---|
| MCP context export accidentally writes `.hadara/context/HADARA_CONTEXT.md`. | Add a test that calls `hadara.context.export` and asserts the file does not exist afterward. |
| CLI context export behavior regresses while splitting content generation. | Keep `exportHadaraContext()` as the write function and retain CLI JSON tests. |
| Tool looks write-capable because it exports context. | Mark MCP schema read-only and return `mode: "memory"` with `contextPath: null`. |
