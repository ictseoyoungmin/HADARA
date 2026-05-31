# T-0170 Close UX Polish and Audit Semantics

## Metadata

| Field | Value |
|---|---|
| ID | T-0170 |
| Title | Close UX Polish and Audit Semantics |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Close UX/audit polish | Clarify task close hashes, improve execute-mode nextActions, expose close evidence append metadata, and add read-only close audit diagnostics before Phase 3. |

## Scope

| In Scope | Reason |
|---|---|
| `task close` JSON contract polish | Split diagnostic report hash from close-relevant source hash while keeping additive compatibility. |
| Execute-mode nextActions | Make successful execute output describe appended close evidence and optional audit instead of required checks already run. |
| Close evidence append result | Report canonical Markdown and JSONL evidence paths after append. |
| `task audit-close` | Add read-only audit command that verifies close evidence presence, shape, and post-close drift. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Automatic status/Task Board/handoff close writes | This capsule only polishes close evidence/audit semantics; broader close automation remains separate scope. |
| Re-closing tasks | Audit is read-only and must not append close evidence. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31T00:00:00.000Z | Draft | Initial task scaffold. | Created by `hadara task create`. |
| 2026-05-31T07:25:00.000Z | Done | Close UX polish and audit semantics implemented. | Focused Docker tests passed. |
