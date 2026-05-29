# T-0141 Final Publish/Deploy Script

## Goal

Add the final publish/deploy command surface as an approval-gated readiness report that can be validated before any release mutation is allowed.

## Scope

- Add `hadara release publish --mode dry-run|execute --json`.
- Emit schema-valid `hadara.releasePublish.v1` reports.
- Check release dry-run readiness, package publishability metadata, approval metadata, and token presence without exposing token values.
- Privately audit execute-mode requests before returning a blocked report.
- Register the command in capability discovery and release/schema docs.

## Out of Scope

- Running `npm publish`.
- Creating GitHub Releases.
- Building or publishing Docker images.
- Uploading artifacts, mutating registries, or calling GitHub APIs.
- Adding MCP release execution tools.
- Changing package metadata to a publishable release candidate.

## Status

Done
