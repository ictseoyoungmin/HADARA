# T-0139 CI Release Workflow Target Decision

## Goal

Decide HADARA's initial release workflow targets and document the approval/token/evidence boundaries before any publish or deploy script exists.

## Scope

- Document npm package as the primary release target.
- Document GitHub Release with tarball, checksum, and manifest as the secondary release target.
- Document Docker image publishing as deferred unless the product surface changes.
- Document required secret/token names without storing values.
- Carry forward T-0138 follow-up requirements for evidence freshness, artifact cross-checks, and release-artifact evidence creation flow.
- Add a read-only release-gate readiness check for the target decision markers.

## Out of Scope

- Publishing to npm.
- Creating GitHub Releases.
- Building or publishing Docker images.
- Adding release script execution, registry mutation, GitHub API calls, or token loading.
- Implementing T-0140 dry-run release scripts.

## Status

Done
