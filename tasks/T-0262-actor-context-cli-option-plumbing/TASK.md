# T-0262 Actor Context CLI Option Plumbing

## Metadata

| Field | Value |
|---|---|
| ID | T-0262 |
| Title | Actor Context CLI Option Plumbing |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Add explicit actor/run CLI option plumbing for Phase 6.1 reports. | Covers task lifecycle reports, `handoff suggest`, and `dev docker-check` without adding scheduler behavior. |

## Scope

| In Scope | Reason |
|---|---|
| Parse `--agent-id`, `--run-id`, `--actor-role`, and `--parent-run-id` for Phase 6.1 CLI surfaces. | Reviewer feedback identified schema-only actor context as too weak for multi-agent compatibility claims. |
| Thread explicit actor context into task finish/ready/close/audit-close/complete reports. | Lifecycle reports already expose `actor`; CLI now supplies it when provided. |
| Thread explicit actor context into `handoff suggest` and `dev docker-check`. | These Phase 6 surfaces also emit actor metadata. |
| Preserve existing defaults when options are absent. | Backward compatible with existing reports and tests. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| No hidden shared-doc writes | Template boundary. |
| No scheduler behavior | Template boundary. |
| No multi-agent runtime claims | Template boundary. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-05T07:22:00.000Z | Draft | Initial task scaffold from operator-workflow template. | `hadara task create --from operator-workflow --title "Actor Context CLI Option Plumbing" --json`. |
| 2026-06-05T07:28:00.000Z | In Progress | Implemented actor CLI option parsing and report plumbing. | Focused Docker wrapper passed task lifecycle, handoff suggestion, and dev docker-check tests. |
| 2026-06-05 | Done | Finished task capsule. | `hadara task finish --execute` |
