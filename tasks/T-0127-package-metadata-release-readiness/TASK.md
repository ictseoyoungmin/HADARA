# T-0127 Package Metadata Release Readiness

## Goal

Prepare HADARA package metadata release-readiness decisions before any publish, package-smoke execution, or installer mutation work.

## Scope

- Record package name, fallback naming, version, `private`, `files`, license path, publish target, and installed CLI verification decisions in tracked docs.
- Add a read-only release-gate readiness check for the package metadata decision markers.
- Cover the new release-gate check with focused tests.
- Keep actual package publishing and package execution deferred.

## Out of Scope

- Publishing to npm or creating a GitHub Release.
- Running `npm pack`, package-smoke execution, install smoke, or release artifact builds.
- Changing `package.json` to `private: false`.
- Adding `files` entries that reference installer or portable files before those files exist.
- Choosing a final legal license on behalf of the project owner.
- Adding installer scripts, portable launchers, Docker images, MCP package/release tools, or provider/shell execution.

## Status

Done
