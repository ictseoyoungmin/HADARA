# Context

- `docs/AGENT_HANDOFF.md` marks T-0075 complete and recommends the Evidence List Read Model P0 candidate next.
- `docs/DEVELOPMENT_SLICES.md` slice 61 defines the done evidence: `hadara.evidence.list.v1` report builder and malformed JSONL degraded-read tests.
- `docs/V1_0_CAPSULE_BACKLOG.md` lists Evidence List Read Model as the next immediate P0 capsule.
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` defines the target `hadara.evidence.list.v1` shape and degraded-read behavior.
- `docs/MCP_BRIDGE_CONTRACT.md` lists `hadara.evidence.list` as a planned read-only v1 MCP tool.
- Docker is the current validation path because host Node/npm is unreliable in this WSL environment.
