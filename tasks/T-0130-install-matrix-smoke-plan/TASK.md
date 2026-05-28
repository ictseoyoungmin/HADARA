# T-0130 Install Matrix Smoke Plan

## Goal

Define the install matrix smoke plan before adding executable install-matrix runners or install mutation.

## Scope

- Document Linux source, Linux package, WSL source, Windows source, Windows package, USB Windows, USB WSL, and installed-CLI major-feature smoke rows.
- Document evidence boundaries for reduced public results, private/raw logs, private paths, and platform-specific observations.
- Strengthen the read-only release gate so strict readiness requires the install matrix plan markers.
- Keep this capsule planning-only: no installer execution, no package smoke execution, no package artifacts, no portable bundle creation, and no publish/deploy behavior.

## Out of Scope

- Creating installer scripts or portable launchers.
- Running package smoke, `npm pack`, package installation, USB validation, or real Windows validation.
- Writing install-matrix evidence artifacts beyond this Task Capsule's public validation evidence.
- Adding MCP install/package execution surfaces.

## Status

Done
