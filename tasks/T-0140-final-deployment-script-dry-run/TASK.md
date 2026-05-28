# T-0140 Final Deployment Script Dry Run

## Goal

Implement a read-only final release dry-run path that verifies release readiness through linked public evidence artifacts before any publish/deploy command exists.

## Scope

- Add `hadara release dry-run --json` with reduced schema-valid output.
- Cross-check public package-smoke, clean-checkout smoke, and release-artifact evidence records.
- Require linked evidence artifacts to exist, validate against registered schemas, report source/report `ok`, and match expected category/mode/result.
- Check release artifact package version and manifest hash, and compare git commit metadata when public artifacts provide it.
- Add an explicit release artifact evidence attachment path through `hadara release artifact --execute --attach-evidence --task <task-id>`.
- Update release readiness, schema, and planning docs.

## Out of Scope

- Publishing to npm.
- Creating GitHub Releases.
- Building or publishing Docker images.
- Loading or validating token values.
- Installer/install-matrix execution.
- MCP release/package/install execution surfaces.

## Status

Done
