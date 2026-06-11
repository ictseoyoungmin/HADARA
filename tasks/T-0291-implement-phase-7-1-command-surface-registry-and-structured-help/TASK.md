# T-0291 Implement Phase 7.1 command surface registry and structured help

## Metadata

| Field | Value |
|---|---|
| ID | T-0291 |
| Title | Implement Phase 7.1 command surface registry and structured help |
| Status | Done |
| Created | 2026-06-11 |
| Updated | 2026-06-11 |

## Goal

| Goal | Notes |
|---|---|
| Phase 7.1 command surface registry | Promote `src/services/capability-registry.ts` into the single authoritative CLI command inventory and use it for structured help, commands JSON, and tools-list projection. |

## Scope

| In Scope | Reason |
|---|---|
| Registry-backed command metadata | Required by Phase 7.1 so every public CLI surface has one classified entry. |
| Lifecycle-oriented `hadara help` and `hadara help lifecycle` | Required to reduce default command inference for worker agents. |
| `hadara help command <id>` and `hadara help family <family>` | Required structured discovery surfaces. |
| `hadara commands --json` with filters | Required machine-readable registry contract. |
| Tools-list compatibility projection | Required to keep `tools list` compatible while avoiding a second CLI inventory. |
| Schemas, docs, and focused drift tests | Required acceptance coverage for Phase 7.1. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Deleting, renaming, or deprecating executable commands | Phase 7.1 classifies the existing surface; removal decisions are Phase 7.2 work. |
| Docs registry or managed Markdown writes | Deferred to Phase 7.3 and Phase 7.4. |
| Runtime behavior changes for existing commands | Phase 7.1 is discovery/help focused. |
| npm publish, GitHub Release, Docker image release | Release activity remains out of scope for this capsule. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-11 | Draft | Created capsule for Phase 7.1 command registry work after T-0290 staged the Phase 7 specs. | `docs/specs/0.3.0/02_Phase_7_1_Command_Surface_Registry_and_Structured_Help.md` |
| 2026-06-11 | In Progress | Implemented registry-backed help/commands/tools-list projection and recorded focused validation evidence. | `EVIDENCE.md` |
| 2026-06-11 | Done | Finished task capsule. | `hadara task finish --execute` |
