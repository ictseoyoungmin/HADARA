# Decisions

## D-001: Primary Command Name

Use `hadara package smoke` as the primary future command. Avoid `hadara release smoke` as the primary command because "release" reads as closer to publish/deploy, while this surface is limited to package installability smoke.

## D-002: Dry-run First

The first implementation should default to dry-run planning. Real package-smoke execution must require an explicit user command in a later capsule.

## D-003: Evidence Attachment Is Explicit

Package-smoke evidence attachment should require `--task <task-id>` plus `--attach-evidence`. Public evidence must be reduced and redaction-checked; raw logs belong in disposable workspace or ignored private/local storage.

## D-004: Release Gate Remains Read-only

The release gate may require command-surface planning markers, but it must not call package-smoke commands or execute package/release actions.

## D-005: MCP Boundary

Package smoke must not be callable from MCP by default. If a future MCP surface is added, it must be opt-in, approval-gated, and privately audited.
