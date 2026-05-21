# ARCHITECTURE

## Layers

```text
[CLI / Dashboard]
       ↓
[Agent Controller]
       ↓
[Provider Adapter]
       ↓
[Tool Runtime]
       ↓
[Policy Layer]
       ↓
[State Store]
       ↓
[Harness & Testkit]
```

## Current Bootstrap Scope

Implemented:

- CLI seed
- Path resolver
- Audit writer
- Redaction
- Policy classifier seed
- Provider contract
- MockProvider
- Task Capsule creation
- Evidence append
- Handoff update
- Hermes context export

Not implemented:

- Full Agent Controller
- Real provider adapters
- Tool runtime execution engine
- Dashboard
- MCP server
- Release packager

## Portable/Project Store Boundary

### Portable Store

`data/` belongs to the local HADARA installation, often on USB.

### Project Store

`docs/`, `tasks/`, `.hadara/context`, and agent context files belong to the project repository.
