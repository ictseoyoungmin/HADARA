# ARCHITECTURE

## Layers

```text
[CLI / Dashboard / TUI]
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
- TUI design notes based on `.mockup/tui` and `.mockup/tui-final` mockups

Partially implemented:

- Agent Controller: bounded deterministic loop exists; full autonomous controller is deferred.
- Tool Runtime: fake shell observations and policy preflight exist; real shell execution is deferred.
- Dashboard: static sample-backed shell and CLI serving exist; live/product-served integration is deferred.
- TUI: mockups and product design notes exist; integrated production TUI is deferred.
- MCP bridge: read tools and opt-in evidence attach exist; broad write tools, shell execution, and provider calls remain deferred.

Not implemented:

- Full Agent Controller
- Real provider adapters
- Tool runtime execution engine
- Live/product dashboard integration
- Integrated production TUI
- Broad write-capable MCP tools
- Release packager
- Private evidence encryption

## Portable/Project Store Boundary

### Portable Store

`data/` belongs to the local HADARA installation, often on USB.

### Project Store

`docs/`, `tasks/`, `.hadara/context`, and agent context files belong to the project repository.

### TUI Boundary

The planned TUI is a read-only terminal work console over existing HADARA read models. Its first integrated implementation should live under `src/` as TypeScript and use shared services rather than inventing a separate data source.

The TUI must not execute shell commands, call providers, call MCP tools, mutate Task Capsules, write evidence, update handoff, run releases, or treat terminal cache/state as committed evidence. Any TUI cache must stay in ignored machine-local state such as `.hadara/local/tui/`.
