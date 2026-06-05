# T-0258 Dev Docker Validation Wrapper

## Metadata

| Field | Value |
|---|---|
| ID | T-0258 |
| Title | Dev Docker Validation Wrapper |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Add official Docker validation wrapper. | `hadara dev docker-check` should run reproducible Docker temp-copy validation with focused/full modes, explicit dist sync, redacted JSON, and evidence-ready summaries. |

## Scope

| In Scope | Reason |
|---|---|
| Dev Docker check service and CLI command. | Provides the Phase 6 wrapper around the reusable Docker validation workflow. |
| JSON schema and registry entry. | Gives external agents a stable machine-readable report. |
| Focused tests and docs. | Proves mode selection, temp-copy boundaries, dist sync metadata, privacy posture, and workflow documentation. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Replacing existing npm helper scripts. | Existing `npm run dev:docker-*` helpers remain available. |
| Running arbitrary shell commands. | Wrapper is scoped to Docker validation steps only. |
| Publishing, release mutation, provider calls, or MCP writes. | T-0258 is validation infrastructure only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-05T05:32:00.000Z | Draft | Initial task scaffold created for Phase 6 dev Docker wrapper work. | Task Capsule exists. |
| 2026-06-05T05:48:36.000Z | In Progress | Implemented wrapper, schema, tests, docs, and built CLI smoke. | Docker validation and wrapper smoke. |
| 2026-06-05 | Done | Finished task capsule. | `hadara task finish --execute` |

