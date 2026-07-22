# ARCHITECTURE

## Product Boundary

HADARA is a local-first evidence control plane for trustworthy agentic development. It owns the project-local facts and proof that let operators answer: what is active, what changed, what was validated, what can close, and what the next session should do.

It is not positioned as a full agent controller, provider runtime, cloud queue, or general shell-execution platform. Those broader surfaces remain deferred because the current product advantage is portable state, bounded context, evidence integrity, and guarded workflow transitions across whatever coding agent or human operator a project chooses.

## Layers

```text
[Human Operators / Coding Agents]
              ↓
[CLI / Dashboard / TUI / read-only MCP]
              ↓
[Task / Current State / Evidence / Docs / Policy Services]
              ↓
[Portable Project Store + Harness / Release Gates]

Optional or deferred adapters:
[Bounded Agent Loop / Provider Adapters / Tool Runtime]
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
- Adaptive task-status read model; top-level `status` is a deprecated alias, not a second evaluator
- Live read-only dashboard APIs, projection cache, Preact single-asset operator console, and local server
- Integrated read-only terminal TUI with snapshot, interactive, cache, and shared read-model paths
- Release artifact, package smoke, clean-checkout smoke, release gate, dry-run, and approval-gated publish planning surfaces
- Context graph, code index, context pack/slice, session-start routing, and local cache read models
- Document registry, read maps, managed section patch plans, and protocol consistency diagnostics
- Markdown-first task routing with a command-owned 0.5.x compatibility checkpoint

Partially implemented:

- Agent Controller: bounded deterministic loop exists; full autonomous controller is deferred.
- Tool Runtime: fake shell observations and policy preflight exist; real shell execution is deferred.
- MCP bridge: read tools and opt-in evidence attach exist; broad write tools, shell execution, and provider calls remain deferred.
- Context routing: bounded and cache-backed paths exist; cold/live graph reads remain filesystem-sensitive on mounted workspaces.
- Release automation: artifact and readiness surfaces exist; public publish mutation remains operator-approved and intentionally narrow.

Not implemented:

- Full Agent Controller
- Real provider adapters
- Tool runtime execution engine
- Broad write-capable MCP tools
- Private evidence encryption

## Portable/Project Store Boundary

### Portable Store

`data/` belongs to the local HADARA installation, often on USB.

### Project Store

`docs/`, `tasks/`, `.hadara/context`, `.hadara/state`, and agent context files belong to the project repository.

`docs/TASK_BOARD.md`, Task Capsules, and project-authored Markdown own inspectable task and project intent. `.hadara/state/current.json` remains a command-owned 0.5.x compatibility checkpoint, not Required Reading; default task selection prefers Markdown sources and treats a missing or malformed checkpoint as advisory. Managed checkpoint projections keep older readers operable during migration without becoming the human authoring surface.

### TUI Boundary

The TUI is a read-only terminal work console over existing HADARA read models. Its integrated implementation lives under `src/tui/` and shares services rather than inventing a separate data source.

The TUI must not execute shell commands, call providers, call MCP tools, mutate Task Capsules, write evidence, update handoff, run releases, or treat terminal cache/state as committed evidence. Any TUI cache must stay in ignored machine-local state such as `.hadara/local/tui/`.
