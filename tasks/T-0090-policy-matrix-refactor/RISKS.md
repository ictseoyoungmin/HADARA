# Risks

| Risk | Mitigation |
|---|---|
| Refactor changes existing CLI/MCP/fake-shell decisions unexpectedly. | Keep `policy.ts` exports compatible and add regression tests for existing reasons/actions. |
| Matrix categories imply stronger authorization semantics than currently implemented. | Treat this slice as structure plus tests only; leave actor/surface/provider authorization to future work. |
| Host Node/npm validation fails in WSL. | Use reusable Docker workflow recorded in project handoff. |
