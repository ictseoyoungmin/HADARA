# T-0260 Release Dry-Run Service Decomposition

## Metadata

| Field | Value |
|---|---|
| ID | T-0260 |
| Title | Release Dry-Run Service Decomposition |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Decompose release dry-run internals into smaller services. | Preserve the existing `hadara.releaseDryRun.v1` report shape, dry-run behavior, npm-primary semantics, and no-mutation release boundary. |

## Scope

| In Scope | Reason |
|---|---|
| Extract target configuration preview, provider advisories, evidence validation, readiness summary, and diagnostics helpers. | Keeps release dry-run maintainable before future provider expansion. |
| Add focused tests for extracted services and retain release dry-run/schema regression coverage. | Proves report behavior stays schema-compatible. |
| Update release boundary docs and handoff state. | Keeps operators aware that this is decomposition-only and no release mutation was added. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| No publish execution | Template boundary. |
| No token loading | Template boundary. |
| No registry mutation | Template boundary. |
| No GitHub Release creation | Template boundary. |
| No Docker image build | Template boundary. |
| No PyPI upload | Template boundary. |
| No release mutation | Template boundary. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-05T06:20:00.000Z | Draft | Initial task scaffold from release-read-model template. | `hadara task create --from release-read-model --title "Release Dry-Run Service Decomposition" --json`. |
| 2026-06-05T06:25:00.000Z | In Progress | Extracted release dry-run services and added focused service tests. | Focused Docker wrapper passed release dry-run/schema/service tests. |
| 2026-06-05 | Done | Finished task capsule. | `hadara task finish --execute` |
