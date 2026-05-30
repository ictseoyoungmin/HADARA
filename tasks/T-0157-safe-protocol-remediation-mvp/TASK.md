# T-0157 Safe Protocol Remediation MVP

## Metadata

| Field | Value |
|---|---|
| ID | T-0157 |
| Title | Safe Protocol Remediation MVP |
| Status | Done |
| Created | 2026-05-30 |
| Updated | 2026-05-30 |

## Goal

| Goal | Notes |
|---|---|
| Add a dry-run-first bounded protocol remediation command. | `hadara protocol remediate` must support only explicitly allowed low-risk fixes and require `--execute` before writing. |

## Scope

| In Scope | Reason |
|---|---|
| Missing Task Board row remediation. | Planned acceptance requires adding a missing row from an existing Task Capsule. |
| Missing Decisions table frame remediation. | Planned acceptance requires inserting a missing table frame without rewriting legacy decision prose. |
| Exact Project State profile row remediation. | Planned acceptance requires updating an exact profile row. |
| Missing `evidence.jsonl` remediation. | Planned acceptance requires creating a missing evidence index file. |
| Dry-run and execute JSON reports. | The command must be evidence-friendly and safe by default. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Deleting rows or files. | Excluded by Phase 2 plan. |
| Marking acceptance criteria Met. | Excluded because it changes completion judgment. |
| Rewriting summaries or legacy prose. | Excluded by Phase 2 plan and too broad for MVP. |
| Broad arbitrary Markdown rewriting. | This MVP only handles bounded known edits. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-30T18:07:40+09:00 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-05-30T18:07:40+09:00 | Active | Begin Safe Protocol Remediation MVP implementation. | This capsule |
| 2026-05-30T18:12:11+09:00 | Done | Implemented dry-run-first bounded remediation command with Docker validation. | `EVIDENCE.md`, built CLI smoke |
