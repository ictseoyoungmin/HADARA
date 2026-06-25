# T-0409 Handoff Stale Known-Problem Detector

## Metadata

| Field | Value |
|---|---|
| ID | T-0409 |
| Title | Handoff Stale Known-Problem Detector |
| Status | Done |
| Created | 2026-06-25 |
| Updated | 2026-06-25 |

## Goal

| Goal | Notes |
|---|---|
| Add read-only stale known-problem detection for `docs/AGENT_HANDOFF.md`. | Agents can find likely obsolete handoff known-problem rows without automatic deletion or shared-doc writes. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara handoff stale-problems --json` report. | Smallest agent-facing read-only surface from the 0.3.4 Agent UX Hardening spec. |
| Schema/registry/CLI wiring. | External agents need stable JSON shape and command discovery. |
| Focused tests and built smoke. | Verify no writes, candidate reporting, schema registration, and current-repo behavior. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Automatic row deletion or rewrite. | Handoff cleanup remains human/coordinator reviewed. |
| Broad handoff cleanup. | This task only detects candidates; it does not edit current known-problem rows. |
| Release closeout planning. | Covered by the next 0.3.4 capsule, T-0410. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-25T04:24:00.000Z | Draft | Initial task scaffold. | Task create. |
| 2026-06-25T04:38:00.000Z | Done | Implemented and validated read-only handoff stale-problems report. | `ev:T-0409:733b5dd43ab7400ab1e77e87` |
<!-- hadara:managed:end task-status-history -->
