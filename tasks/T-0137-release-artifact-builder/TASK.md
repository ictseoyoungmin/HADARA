# T-0137 Release Artifact Builder

## Goal

Build reduced release artifacts without publishing: an npm tarball, SHA-256 checksum, file manifest, package-content whitelist verification, and schema-valid report.

## Scope

- Add explicit `hadara release artifact --execute --json`.
- Build from a disposable staging package that includes only `dist/`, `README.md`, `LICENSE`, and `package.json`.
- Generate a tarball through `npm pack`, a `.sha256` checksum file, and a `.manifest.json` file.
- Verify package contents against the builder whitelist and required files.
- Emit a reduced `hadara.releaseArtifact.v1` report with redacted paths and no raw logs or package contents.
- Support disposable default output and explicit `--output <dir>` output.

## Out of Scope

- Publishing to npm.
- Creating GitHub Releases.
- Docker image builds.
- Installer or install-matrix execution.
- Release-gate evidence freeze requirements.
- MCP release/package execution surfaces.
- Public raw log retention or private raw log manifests.

## Status

Done
