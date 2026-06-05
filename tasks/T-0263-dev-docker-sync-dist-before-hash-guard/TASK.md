# T-0263 Dev Docker Sync Dist Before-Hash Guard

## Metadata

| Field | Value |
|---|---|
| ID | T-0263 |
| Title | Dev Docker Sync Dist Before-Hash Guard |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Make `dev docker-check --sync-dist` reviewed before-hash aware. | Prevent stale workspace `dist` copies when multiple agents may run validation concurrently. |

## Scope

| In Scope | Reason |
|---|---|
| Require matching `--before-hash` before copying Docker-built `dist` to the workspace. | Converts the T-0261 metadata clarification into a fail-closed output sync guard. |
| Support `--allow-missing-before-hash` for first-time sync only. | Allows explicit operator escape hatch when no workspace `dist` hash exists. |
| Report reviewed hash metadata and mismatch/conflict state. | Makes stale sync plans observable in `hadara.dev.docker_check.v1`. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| No hidden shared-doc writes | Template boundary. |
| No scheduler behavior | Template boundary. |
| No multi-agent runtime claims | Template boundary. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-05T07:39:00.000Z | Draft | Initial task scaffold from operator-workflow template. | `hadara task create --from operator-workflow --title "Dev Docker Sync Dist Before-Hash Guard" --json`. |
| 2026-06-05T07:45:00.000Z | In Progress | Implemented initial before-hash guard changes; validation was paused by Docker approval usage limit. | Code and tests updated locally; not closed or committed. |
| 2026-06-05 | Done | Finished task capsule. | `hadara task finish --execute` |
