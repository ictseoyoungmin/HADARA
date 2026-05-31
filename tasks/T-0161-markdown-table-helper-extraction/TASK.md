# T-0161 Markdown Table Helper Extraction

## Metadata

| Field | Value |
|---|---|
| ID | T-0161 |
| Title | Markdown Table Helper Extraction |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Extract shared Markdown table helpers. | Move duplicated generated-table parsing into a reusable helper while preserving protocol doctor and harness behavior. |

## Scope

| In Scope | Reason |
|---|---|
| Add shared helper for Markdown table parsing/formatting/lookup. | Phase 2 strict-plan hardening requires a common table helper before more remediation work. |
| Update existing protocol/profile/harness callers. | Remove duplicated local parsers without changing issue codes or report shapes. |
| Add focused helper tests. | Prove parsing, malformed divider skipping, safe formatting, and wide text handling. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Change protocol doctor semantics or issue codes. | This is a refactor-plus-helper slice only. |
| Add new remediation behavior. | T-0162 and T-0163 own follow-up remediation surfaces. |
| Rewrite existing Task Capsules or project docs. | Helper extraction must not mutate user content. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31T04:50:57.577Z | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-05-31T04:50:57.577Z | Done | Shared Markdown table helper extracted and validated. | Focused Docker tests passed; full Docker check passed. |
