# T-0028 Init Profiles Protocol Docs

## Goal

Improve first-use project initialization by adding init profiles and generating the core HADARA protocol documents that Hermes/export-context expects.

## Scope

- Add `hadara init --profile minimal|full|hadara-protocol`.
- Keep default `hadara init` compatible by using the minimal profile.
- Generate `docs/ARCHITECTURE.md`, `docs/IMPLEMENTATION_SOP.md`, and `docs/DEVELOPMENT_SLICES.md` during initialization.
- Add focused tests for profile validation and generated documents.

## Out of Scope

- Done-level harness validation.
- Run scenario scaffolding.
- Dashboard, real provider adapters, or MCP server expansion.
- Rich project-specific document authoring.

## Status

Done
