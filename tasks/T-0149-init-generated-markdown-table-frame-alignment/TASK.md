# T-0149 Init Generated Markdown Table Frame Alignment

## Goal

Align `hadara init` generated markdown files with the table-first, heading-stable document structure from `docs/specs/HADARA_Init_Refactoring_Phase1_Development_Plan.md`, while keeping generated content generic and profile-aware.

## Scope

- Update generated `hadara init` markdown templates in `src/cli/init.ts`.
- Update init regression tests for canonical table frames, generic content, `.gitignore` boundaries, and profile-aware references.
- Update root README entry-surface wording for current init profiles and optional integration boundaries.
- Update HADARA tracking docs and evidence for the completed slice.

## Out of Scope

- Stale scaffold doctor or migration checks for already-initialized repositories.
- New Hermes, MCP, dashboard, provider, release, installer, or deployment behavior.
- Profile upgrade or project-specific required-reading registration commands.
- Task Capsule file-structure changes.

## Status

Done
