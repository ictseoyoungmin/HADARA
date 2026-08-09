# T-0758 Validate RC3 Read Routing and Delegated Lifecycle

## Identity

| Field | Value |
|---|---|
| ID | T-0758 |
| Title | Validate RC3 Read Routing and Delegated Lifecycle |
| Status | Done |
| Created | 2026-08-09T20:17 |
| Updated | 2026-08-09T20:29 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Validate RC3 document read routing and a delegated task-local HADARA lifecycle in a fresh Init v1 fixture. | The worker must discover routed sources through `task status` and `docs read-map --task`, record evidence, and stop before operator release actions. |

## Scope

| Boundary | Items |
|---|---|
| In | Fresh Init v1 routing fixture, three current release docs, two conditional policy/design docs, three future/deferred docs, mixed Markdown/TXT/DOCX/PDF paths, delegated worker lifecycle, and acceptance evidence. |
| Out | Package publication, npm registry recycle, GitHub release mutation, broad document-content extraction, and operator capsule work. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the RC3 routing and delegated lifecycle acceptance contract. | Done |
| 2 | Exercise fresh Init v1 routing across task, conditional, and excluded document groups. | Done |
| 3 | Run delegated lifecycle acceptance and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh Init v1 uses `.hadara/documents.json` and generated READ_MAP routing without creating a legacy registry. | Met | ev:T-0758:6da98317de3d49aeb87c0522 | `docs/specs/0.5.0-rc3/01_RC3_Read_Routing_and_Delegated_Lifecycle.md` |
| AC-2 | The mixed-format fixture routes three task-scoped release docs to `readFirst`, two policy/design docs to `readIfNeeded`, and three future docs to `doNotReadByDefault`. | Met | ev:T-0758:6da98317de3d49aeb87c0522 | `docs/specs/0.5.0-rc3/01_RC3_Read_Routing_and_Delegated_Lifecycle.md` |
| AC-3 | A delegated worker completes task-local status, validation/evidence, and handoff steps in a fresh fixture without invoking operator release actions. | Met | ev:T-0758:8ad8be24281d479cb9595417 | `docs/specs/0.5.0-rc3/01_RC3_Read_Routing_and_Delegated_Lifecycle.md` |
| AC-4 | Focused routing tests, full repository checks, and the delegated lifecycle smoke pass. | Met | ev:T-0758:6da98317de3d49aeb87c0522; ev:T-0758:8ad8be24281d479cb9595417; ev:T-0758:ca101b756ce54b4c822ded6c | Validation table |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Fresh Init v1 mixed-format read-routing smoke | Yes | Passed | Three task-scoped release paths, two conditional policy paths, and three excluded future paths routed across Markdown/TXT/DOCX/PDF; Init v1 registry and projection verified. | ev:T-0758:6da98317de3d49aeb87c0522 |
| Delegated lifecycle smoke | Yes | Passed | Fresh fixture delegated to Codex CLI; status/read-map, validation/evidence, TASK/HANDOFF update passed; close and release operations were not invoked. | ev:T-0758:8ad8be24281d479cb9595417 |
| Full npm check | Yes | Passed | exit 0 in 51819ms | ev:T-0758:ca101b756ce54b4c822ded6c |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5.0-rc3/00_Init_V1_Document_Routing_Authority.md` | constraint | active | Canonical Init v1 registry and projection contract from T-0757. |
| `docs/HADARA_WORKFLOW.md` | constraint | active | Worker command order and read boundaries. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Evidence, close, and write-boundary semantics. |

## Changes

| Area | Summary |
|---|---|
| Acceptance contract | Defined mixed-format routing groups and delegated worker/reviewer boundary. |
| Routing implementation | Task-scoped Init v1 documents now resolve to `active-spec/readFirst` while explicit excluded and historical tiers remain excluded. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Operator publication and installed consumer recycle remain in T-0759/T-0760 scope. | Open | `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` |

## Close Summary

Routing buckets, delegated lifecycle, and full repository validation are complete. The reviewed proof-last close remains.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-09 | Draft | Initial task scaffold. |
| 2026-08-09 | In Progress | Defined RC3 mixed-format read routing and delegated lifecycle acceptance. |
| 2026-08-09 | Ready for close | Routing buckets, delegated lifecycle, and full npm check passed. |
| 2026-08-09 | Done | Close-source documents prepared for reviewed proof-last execution. |
