# T-0002 Config and Path Resolver

## Goal

Stabilize portable USB store and project repo store resolution.

## Scope

- Resolve project and portable roots with explicit input overriding environment, and environment overriding defaults.
- Keep default HADARA data out of `projectRoot/data`.
- Normalize Windows drive paths without collapsing drive boundaries.
- Use real paths for containment checks so symlink escapes are detected.

## Out of Scope

- Encrypted secret store.
- Workspace registry management.
- Full cross-machine path migration.

## Status

Done
