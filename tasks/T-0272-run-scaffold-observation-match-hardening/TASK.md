# T-0272 Run Scaffold Observation Match Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0272 |
| Title | Run Scaffold Observation Match Hardening |
| Status | Done |
| Created | 2026-06-06 |
| Updated | 2026-06-06 |

## Goal

| Goal | Notes |
|---|---|
| Fix generated deterministic run scenarios so `run scaffold` output works unchanged with fake-shell JSON observations. | T-0271 found that generated scripts matched raw stdout, while `hadara run` provides fake-shell observations as JSON tool messages. |

## Scope

| In Scope | Reason |
|---|---|
| Update the scaffolded scripted-provider second step matcher. | The matcher must target a stable observation-envelope substring instead of raw stdout. |
| Add regression coverage for multiline stdout. | Multiline stdout reproduced the installed-package failure and verifies the generated script remains usable without manual edits. |
| Verify with built CLI smoke. | The published-package recycle finding came from an end-to-end interface, not only helper-level code. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Change fake-shell observation schema. | The existing observation envelope is already correct and widely consumed. |
| Add a fuzzy provider matcher. | The generated script can be fixed without changing ScriptedProvider semantics. |
| Resolve lower-priority T-0271 fresh-init/status/handoff findings. | Those findings will be grouped in follow-up capsules. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-06 | Draft | Initial task scaffold. | `hadara task create "Run Scaffold Observation Match Hardening" --json` |
| 2026-06-06 | In Progress | Implemented scaffold matcher regression and began validation. | Focused Docker temp-copy check passed. |
| 2026-06-06 | Done | Finished task capsule. | `hadara task finish --execute` |
