# T-0162 Doctor Remediation Hint Unification

## Metadata

| Field | Value |
|---|---|
| ID | T-0162 |
| Title | Doctor Remediation Hint Unification |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Add doctor remediation hints for existing safe fixes. | Protocol doctor reports should point users to safe dry-run remediation commands without writing files. |

## Scope

| In Scope | Reason |
|---|---|
| Add issue-level `suggestedFix` hints for existing safe-auto fixes. | Covers task board row, evidence JSONL, Decisions table frame, and Project State profile metadata. |
| Add safe-auto remediation objects to doctor reports. | AC-6 strict reading expects doctor reports to expose remediation plans, not only remediate dry-runs. |
| Keep current `protocol remediate --fix` execution surface. | Avoid introducing a second write engine. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Execute remediation from doctor. | Doctor must remain read-only. |
| Add broad or unsafe auto-repair. | Phase 2 only allows bounded safe fixes. |
| Change schema id or release-gate strictness. | `hadara.protocol.consistency.v1` remains additive fixture-level. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31T04:58:06.431Z | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-05-31T04:58:06.431Z | Done | Doctor remediation hints added and validated. | Focused/full Docker checks and built CLI smoke passed. |
