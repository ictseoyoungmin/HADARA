# T-0126 Package Smoke Command Surface Design

## Goal

Define the `hadara package smoke` command surface before any executable package-smoke implementation.

## Scope

- Document the package-smoke command name, flags, approval semantics, timeout, cleanup, failure behavior, evidence attachment behavior, and MCP boundary.
- Keep the release gate read-only and add a readiness check that requires command-surface design markers before strict release readiness passes.
- Ensure the release/install/package-smoke plan referenced by tracked docs is itself trackable.
- Add focused regression coverage for the new release-gate command-surface check.
- Update project state, development slices, task board, handoff, and task evidence.

## Out of Scope

- Implementing `hadara package smoke`.
- Running `npm pack`, `npm install`, package install smoke, release artifact creation, checksums, publish/deploy, GitHub calls, Docker image builds, or MCP release/package execution.
- Adding package-smoke evidence attachment behavior.
- Changing package metadata, version, `private`, license, or publish target.

## Status

Done
