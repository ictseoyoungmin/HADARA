# T-0156 Profile Drift Remediation Guide

## Metadata

| Field | Value |
|---|---|
| ID | T-0156 |
| Title | Profile Drift Remediation Guide |
| Status | Done |
| Created | 2026-05-30 |
| Updated | 2026-05-30 |

## Goal

| Goal | Notes |
|---|---|
| Add concrete profile drift diagnostics and remediation guidance to the protocol doctor. | `hadara protocol doctor --scope profile` must report profile doc-set, metadata, and Required Reading drift with actionable manual remediation entries. |

## Scope

| In Scope | Reason |
|---|---|
| Profile-scope protocol doctor report. | T-0156 is the planned Profile Drift Remediation Guide capsule. |
| Mixed/partial profile doc-set detection. | Users need to understand whether basic, standard, or governed docs are incomplete. |
| Basic-to-governed metadata drift guidance. | The planned acceptance specifically requires PROJECT_STATE, SOP, and AGENTS remediation hints. |
| JSON remediations array population for profile drift. | T-0153/T-0155 left remediations empty; this capsule adds manual guide entries without executing writes. |
| Unit and CLI coverage. | The behavior is part of the CLI contract and needs regression tests. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Automatic profile merge or file writes. | Safe-auto execution is reserved for the remediation command capsule. |
| Full project docs consistency expansion. | Completed in T-0155; this capsule focuses on profile remediation guidance. |
| Git-aware history checks. | Excluded from Phase 2 doctor scope. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-30T17:20:16+09:00 | Draft | Initial task scaffold. | hadara task create |
| 2026-05-30T17:20:16+09:00 | Active | Begin Profile Drift Remediation Guide implementation. | This capsule |
| 2026-05-30T17:29:30+09:00 | Done | Implemented profile-scope doctor reports and manual remediation guidance with Docker validation. | `EVIDENCE.md`, built CLI smokes |
| 2026-05-30T17:51:13+09:00 | Done | Added declared/detected/target profile summary policy and stricter Required Reading table checks. | `EVIDENCE.md`, profile policy follow-up |
