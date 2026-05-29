# T-0142 Package Metadata Transition Plan

## Goal

Transition package metadata from bootstrap/private mode to the first release-candidate metadata state, then regenerate the release evidence needed for dry-run readiness.

## Scope

- Change root package metadata from `0.0.0-bootstrap`/`private: true` to `0.1.0-rc.0`/`private: false`.
- Add a package `files` whitelist for the existing publishable runtime/documentation files.
- Keep release publish/deploy behavior non-mutating and dry-run only.
- Refresh package-smoke, clean-checkout, release-artifact, release dry-run, and release publish dry-run evidence for the release-candidate metadata.
- Update readiness, task, and handoff documents to reflect the new package metadata state.

## Out of Scope

- `npm publish`, GitHub Release creation, Docker image publishing, artifact upload, registry mutation, and GitHub API mutation.
- MCP executable release/publish surfaces.
- Recording a non-redacted approval actor value for a future mutation-capable runner.
- Moving from `0.1.0-rc.0` to a stable `0.1.0` release.

## Status

Done
