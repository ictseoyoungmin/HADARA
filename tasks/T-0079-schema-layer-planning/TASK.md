# T-0079 Schema Layer Planning

## Goal

Define the first HADARA schema registry boundary and add initial JSON Schema fixtures for stable read models before broad runtime validation gates are introduced.

## Scope

- Add `docs/SCHEMAS.md` describing schema ids, ownership, versioning, registry rules, and near-term validation policy.
- Add a lightweight schema index under `src/schemas/`.
- Add initial JSON Schema fixtures for recently stabilized read models.
- Add tests that parse the schema fixtures and verify the index stays aligned.

## Out of Scope

- Runtime JSON Schema validation API.
- Replacing TypeScript interfaces or command-specific builders.
- Enforcing schemas as release gates.
- Adding new CLI/MCP surfaces.

## Status

Done
