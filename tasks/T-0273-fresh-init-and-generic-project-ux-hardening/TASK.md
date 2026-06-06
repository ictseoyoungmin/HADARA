# T-0273 Fresh Init and Generic Project UX Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0273 |
| Title | Fresh Init and Generic Project UX Hardening |
| Status | Done |
| Created | 2026-06-06 |
| Updated | 2026-06-06 |

## Goal

| Goal | Notes |
|---|---|
| Fix first-run and generic-project UX findings from T-0271 that affect fresh scaffold confidence before `0.2.0-rc.1`. | Covers init JSON, fresh init doctor, Project State phase parsing, generic handoff suggestion wording, handoff update JSON, and doctor context path clarity. |

## Scope

| In Scope | Reason |
|---|---|
| Add JSON output for `hadara init --json`. | T-0271 found the flag was accepted but emitted text. |
| Add JSON output for `handoff update --json`. | Automation consumers need a structured report for this write command. |
| Make fresh governed `init doctor --json` warning-clean for old profile names. | Generated SOP currently false-positives on generic words such as "full". |
| Parse table-first Project State phase rows. | Fresh scaffold status/dashboard must report `bootstrap-development`, not table headers. |
| Remove HADARA-dev Phase 6 wording from generic `handoff suggest`. | Generic projects should not inherit HADARA-dev roadmap copy. |
| Clarify `doctor` project-context path. | Missing context should point to `.hadara/context/HADARA_CONTEXT.md`. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Change task lifecycle close semantics. | `task status` readiness clarity will be handled in a follow-up lifecycle capsule. |
| Optimize broad lifecycle scan latency. | Performance root-cause work is separate from first-run UX text/JSON fixes. |
| Add a full multi-agent runtime or scheduler. | This capsule only hardens user-facing CLI reports. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-06 | Draft | Initial task scaffold. | `hadara task create "Fresh Init and Generic Project UX Hardening" --json` |
| 2026-06-06 | In Progress | Implemented first-run UX fixes and focused regressions. | Focused Docker tests passed. |
| 2026-06-06 | Done | Finished task capsule. | `hadara task finish --execute` |
