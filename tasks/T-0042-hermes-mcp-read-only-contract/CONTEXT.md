# Context

T-0038 added a shared `hadara.cli.error.v1` fallback JSON envelope for early CLI parse and validation failures. Normal command failures still use command-specific JSON schemas.

T-0040 compacted `docs/AGENT_HANDOFF.md` and moved historical entries to `docs/HANDOFF_HISTORY.md` and `docs/VALIDATION_HISTORY.md`.

T-0041 reclassified old Draft work and left Hermes/MCP bridge expansion as the next roadmap item.

Before implementing a server, external agents need a stable read-only contract that says which HADARA state can be read, which validation/policy operations can be evaluated, and which write/execution behavior remains explicitly unavailable.
