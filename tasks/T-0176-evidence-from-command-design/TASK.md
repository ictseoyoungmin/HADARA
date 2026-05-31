# T-0176 Evidence From Command Design

## Metadata

| Field | Value |
|---|---|
| ID | T-0176 |
| Title | Evidence From Command Design |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Design future `evidence from-command` safely. | Capture shell-executing evidence boundaries without implementing execution. |

## Scope

| In Scope | Reason |
|---|---|
| Design doc and security alignment. | Document future dry-run/execute contract, policy gates, redaction, raw-log boundaries, and MCP exclusion. |
| CLI contract clarification. | Make clear that `evidence add-command` remains non-executing. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implementing `evidence from-command`. | Phase 3 requires design/dry-run planning only. |
| Adding shell/MCP execution. | Deferred high-risk future work. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31 | Draft | Initial task scaffold. | Task created through HADARA CLI. |
| 2026-05-31 | Done | Evidence from-command design boundary documented and validated. | Design/security/CLI docs and validation evidence. |
