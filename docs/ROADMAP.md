# ROADMAP

## Phase 0 - Manual HADARA Protocol

- Docs and Task Capsules are maintained manually.
- External agents read/write HADARA-compatible files.

Status: mostly complete for this repository. The protocol is captured in `AGENTS.md`, `docs/IMPLEMENTATION_SOP.md`, Task Capsules, and compact handoff/history documents.

## Phase 1 - HADARA Seed CLI

- `init`
- `doctor`
- `task`
- `evidence`
- `handoff`
- `policy`
- `hermes export-context`

Status: mostly complete. Core commands have JSON envelopes, strict argument handling, and Docker-backed regression coverage.

## Phase 2 - Partial Self-Hosting

- Provider contract
- Tool runtime
- Policy gate
- Evidence store
- Handoff automation

Status: partially complete. Provider contracts, MockProvider/ScriptedProvider, provider fallback, policy preflight, deterministic fake-shell observations, evidence storage, and done-level harness validation exist. Real provider adapters and real shell/tool execution remain deferred.

## Phase 3 - Full Dogfooding

- HADARA can run agentic coding loops against its own repository.
- Dashboard and MCP bridge become operational.

Status: started but not complete. A bounded deterministic agent loop, read-only MCP server/tools, opt-in MCP evidence attach, Operations Status JSON, and a static sample-backed dashboard server exist. Full autonomous dogfooding, live dashboard integration, real provider calls, real shell execution, broad MCP writes, and release packaging remain deferred.
