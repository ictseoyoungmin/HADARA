# T-0146 Release metadata hardcoding cleanup

## Goal

Remove release-candidate version drift risks from release readiness checks by deriving current package metadata from `package.json` instead of embedding the current RC version in source logic.

## Scope

- Replace current-version hardcoding in release-gate/operational-debt readiness checks with package metadata-derived values.
- Make package smoke command-surface validation accept versioned HADARA tarball examples without requiring one specific RC version.
- Add regression coverage for a future RC version.
- Preserve historical documentation, task evidence, and fixture examples where specific versions are intentional records.

## Out of Scope

- Changing current package metadata.
- Publishing a new package.
- Rewriting historical evidence or validation history.
- Changing release/publish/install execution behavior.
- Removing intentional bootstrap fixture values used to test bootstrap-mode reports.

## Status

Done
