# T-0158 Safe Protocol Remediation Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0158 |
| Title | Safe Protocol Remediation Hardening |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Harden `hadara protocol remediate` write safety and bounded Markdown edits. | Address T-0157 follow-up review before schema consumers rely on remediation reports. |

## Scope

| In Scope | Reason |
|---|---|
| Atomic remediation writes. | Execute mode should use temp-file plus rename and report write failures. |
| Planned-content conflict checks. | Detect file drift between planning and write application. |
| Project State Metadata upsert hardening. | Preserve existing Metadata table rows and following sections. |
| Task Board table-frame guard. | Avoid appending bare rows into a malformed Task Board file. |
| Decisions legacy-table guard. | Avoid creating duplicate semantic decision tables. |
| Focused regression tests. | Prove the safety behaviors before handoff. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Broad Markdown AST rewriting. | This hardening keeps remediation bounded and low-risk. |
| New Task Board frame remediation fix. | The current change warns/skips when the frame is missing; a dedicated fix can be added later. |
| Protocol JSON schema registration. | Deferred to the next contract slice after the hardening report shape settles. |
| Broad MCP/write-surface changes. | This remains a CLI/service remediation implementation only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31T12:35:00+09:00 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-05-31T12:36:14+09:00 | Active | Begin remediation hardening follow-up implementation. | This capsule |
| 2026-05-31T12:41:07+09:00 | Done | Remediation hardening implemented with focused/full Docker validation and built CLI smoke. | `EVIDENCE.md`, `evidence.jsonl` |
