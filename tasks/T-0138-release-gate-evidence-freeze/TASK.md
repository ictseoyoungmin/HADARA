# T-0138 Release Gate Evidence Freeze

## Goal

Move `hadara release gate --mode advisory|strict --json` from plan-marker-only readiness toward evidence-backed readiness while preserving the read-only release-gate boundary.

## Scope

- Register standalone schema fixtures for `hadara.smokeEvidenceSummary.v1` and `hadara.releaseArtifact.manifest.v1`.
- Add release-gate checks that read existing Task Capsule evidence records and optional reduced public summary artifacts.
- Require current package-smoke, clean-checkout smoke, and release-artifact evidence in strict mode without executing smoke, packaging, install, publish, GitHub, Docker, or MCP release behavior.
- Preserve remote CI observation as a documented/read-only evidence check.
- Reserve stable install-matrix evidence issue wording without blocking strict mode before an executable install-matrix smoke surface exists.

## Out of Scope

- Running package smoke, clean-checkout smoke, install matrix smoke, release artifact creation, publish/deploy, GitHub Release creation, Docker image builds, or remote CI.
- Retaining raw logs publicly.
- Reading or exposing private evidence raw content or private store paths.
- Adding MCP release/package/install execution surfaces.

## Status

Done
