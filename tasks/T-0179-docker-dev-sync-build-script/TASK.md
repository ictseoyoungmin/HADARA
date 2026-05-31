# T-0179 Docker Dev Sync Build Script

## Metadata

| Field | Value |
|---|---|
| ID | T-0179 |
| Title | Docker Dev Sync Build Script |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Add a reusable Docker sync-build helper. | Reduce hand-assembled temp-copy, install, check, workspace dist refresh, and built CLI smoke commands. |

## Scope

| In Scope | Reason |
|---|---|
| Repo-level shell helper | Encapsulates the HADARA-dev Docker validation workflow without adding a self-hosted HADARA build command yet. |
| npm script aliases | Provide memorable `npm run dev:docker-check` and `npm run dev:docker-sync-build` entrypoints. |
| Static tests and docs | Keep the helper discoverable and syntax-checked. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| `hadara dev sync-build` command | Self-building CLI command is deferred until the script workflow proves stable. |
| Release/package smoke replacement | This helper is for local dev validation only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31 | Draft | Initial task scaffold. | Task creation output. |
| 2026-05-31 | Active | Started Docker sync-build helper implementation. | This capsule. |
| 2026-05-31 | Done | Docker dev sync-build helper implemented and validated. | T-0179 evidence records. |
