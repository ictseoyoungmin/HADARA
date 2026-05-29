# T-0147 Init scaffold protocol alignment

## Goal

Align `hadara init` scaffolds with the current general HADARA protocol while avoiding premature Hermes guidance and project-specific HADARA-dev references.

## Scope

- Stop creating Hermes-specific files or guidance from `hadara init`.
- Generate a `.gitignore` that protects HADARA local/portable state and common generated files.
- Replace thin init scaffold docs with structured, general-purpose HADARA protocol docs.
- Define the init profile matrix in generated `docs/IMPLEMENTATION_SOP.md`; keep security/release smoke tests out of the default path.
- Add guidance for manually adding project-specific docs to required reading via `docs/IMPLEMENTATION_SOP.md`.
- Add init tests that enforce generated scaffold structure and profile behavior.

## Out of Scope

- Implementing a new command for registering project-specific docs.
- Adding Hermes compatibility files or instructions.
- Copying HADARA-dev-specific docs such as MCP, release, TUI, or dashboard contracts into every initialized project.
- Changing task capsule creation or harness validation behavior.

## Status

Done
