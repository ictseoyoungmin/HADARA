# Context

- `docs/AGENT_HANDOFF.md` names Schema Layer Planning as the next P0 slice after T-0078.
- `docs/V1_0_CAPSULE_BACKLOG.md` defines this slice as introducing schema registry boundaries before broad JSON schema validation.
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` lists candidate schema files and a future runtime API.
- This task should not implement runtime validation or release gates yet.
- T-0078 left a neutral capability registry in place; schema fixtures should complement that boundary rather than duplicate CLI/MCP adapters.
