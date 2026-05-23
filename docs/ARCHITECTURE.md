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
- Policy execution preflight
- Provider contract
- MockProvider
- ScriptedProvider
- Provider fallback executor
- Task Capsule creation
- Task Capsule draft/done validation
- Evidence append and managed public text artifact copy
- Evidence index schema validation
- Handoff update
- Hermes context export
- CLI JSON envelopes for core commands
- Deterministic harness replay scaffold
- Deterministic fake-shell observation harness
- Minimal deterministic agent loop over ScriptedProvider and fake shell observations
- Read-only MCP stdio server and read tools
- Opt-in MCP evidence attach with approval metadata and private audit records
- Operations status JSON read model
- Static sample-backed dashboard shell and local static dashboard server

Partially implemented:

- Agent Controller: bounded deterministic loop exists; full autonomous controller is deferred.
- Tool Runtime: fake shell observations and policy preflight exist; real shell execution is deferred.
- Dashboard: static sample-backed shell and CLI serving exist; live/product-served integration is deferred.
- MCP bridge: read tools and opt-in evidence attach exist; broad write tools, shell execution, and provider calls remain deferred.

Not implemented:

- Full Agent Controller
- Real provider adapters
- Tool runtime execution engine
- Live/product dashboard integration
- Broad write-capable MCP tools
- Release packager
- Private evidence encryption

## Portable/Project Store Boundary

### Portable Store

`data/` belongs to the local HADARA installation, often on USB.

### Project Store

`docs/`, `tasks/`, `.hadara/context`, and agent context files belong to the project repository.
