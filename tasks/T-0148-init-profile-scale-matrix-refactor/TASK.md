# T-0148 Init profile scale matrix refactor

## Goal

Refactor `hadara init` profiles into general scale-based profiles whose generated documents and SOP required-reading guidance stay consistent.

## Scope

- Replace the primary init profile matrix with general `basic|standard|governed` scale profiles.
- Make `standard` the default profile for ordinary projects.
- Generate optional docs only when the selected profile calls for them.
- Make generated `AGENTS.md`, `docs/IMPLEMENTATION_SOP.md`, and scaffold structure guidance profile-aware so they do not reference missing generated docs.
- Reject unsupported profile names instead of carrying compatibility aliases.
- Update root HADARA-dev SOP to describe the generalized profile model and classify this repository as governed rather than making the model HADARA-dev-specific.
- Update tests and capability/help text for the new profile names.

## Out of Scope

- Adding a command to register project-specific docs.
- Generating Hermes files or Hermes-specific guidance.
- Copying HADARA-dev-specific MCP, release, TUI, or provider contracts into new initialized projects.
- Changing Task Capsule creation or harness validation behavior.

## Status

Done
