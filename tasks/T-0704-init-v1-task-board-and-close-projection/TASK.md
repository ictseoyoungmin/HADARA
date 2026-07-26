# T-0704 Init v1 Task Board and Close Projection

## Identity

| Field | Value |
|---|---|
| ID | T-0704 |
| Title | Init v1 Task Board and Close Projection |
| Status | Done |
| Targets | project |
| Created | 2026-07-26T18:00 |
| Updated | 2026-07-26T19:00 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Complete the Init v1 Task Board and close-projection boundary. | Make task creation and valid close operate on the frozen six-column Board contract while preserving legacy Board compatibility and preventing inferred Result text. |

## Scope

| Boundary | Items |
|---|---|
| In | Init v1 Board parser/writer; project-default and explicit task targets; compact TargetRef rendering; optional `Close Summary` normalization; Result/source-hash close projection; valid-close-only Done ordering; legacy row preservation and drift diagnostics; focused/schema/CLI coverage. |
| Out | Full document routing; legacy field-by-field migration or destructive Board rewrite; task lifecycle redesign beyond the close projection boundary; installed-package final acceptance; release mutation. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Trace the current Board/create/finish/close flow against D-001 through D-007 and freeze the minimal compatibility boundary. | Done |
| 2 | Implement one schema-aware Board interface and route task create plus close projection through it. | Done |
| 3 | Add focused regressions for targets, optional Close Summary, valid-close ordering, and legacy preservation. | Done |
| 4 | Run Docker validation, refresh `dist`, record evidence, and update shared state/handoff docs. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh Init v1 Board parsing and task creation use `ID, Title, Status, Targets, Capsule, Result`, default missing targets to `project`, and render explicit targets deterministically. | Met | `ev:T-0704:34963cd6a53849c3980b1c8c`, `ev:T-0704:70c89bcc1c3d458a9c4bc958` | D-001, D-002, D-007 |
| AC-2 | Only a valid close records Board `Done`; failed close leaves the row unchanged. | Met | `ev:T-0704:dc7d443f64cd467ca667cb3e` | D-003 |
| AC-3 | An exact optional `## Close Summary` is normalized to one plain-text line capped at 160 Unicode code points and projected to Result with source traceability; absence remains `-` and is not a blocker. | Met | `ev:T-0704:34963cd6a53849c3980b1c8c`, `ev:T-0704:dc7d443f64cd467ca667cb3e` | D-004, D-005 |
| AC-4 | Generic Notes are never inferred as Result, and legacy five-column Boards remain readable/writable without losing Notes or extra cells. | Met | `ev:T-0704:34963cd6a53849c3980b1c8c`, `ev:T-0704:dc7d443f64cd467ca667cb3e` | D-006, REG-007 |
| AC-5 | Focused tests, full Docker checks, built CLI smokes, schema checks, and repository hygiene pass with durable evidence. | Met | `ev:T-0704:dc7d443f64cd467ca667cb3e`, `ev:T-0704:70c89bcc1c3d458a9c4bc958`, `ev:T-0704:925266b4540f415a954f07ef` | `docs/TEST_STRATEGY.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused Task Board/create/close tests in Docker | Yes | Passed | `ev:T-0704:34963cd6a53849c3980b1c8c`, `ev:T-0704:dc7d443f64cd467ca667cb3e` |
| Full `npm run check` equivalent in Docker | Yes | Passed | `ev:T-0704:dc7d443f64cd467ca667cb3e` |
| Built CLI Init v1 task create/close smoke | Yes | Passed | `ev:T-0704:70c89bcc1c3d458a9c4bc958` |
| `git diff --check` and evidence lint | Yes | Passed | `ev:T-0704:925266b4540f415a954f07ef` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/redesign/HADARA_INIT_V1_FINAL_FREEZE_SPEC_KO.md` | decision | active | Frozen Board and Close Summary contract; INIT-M4 boundary. |
| `docs/specs/0.5/redesign/HADARA_INIT_V1_ACCEPTANCE.md` | constraint | active | D-001 through D-007, Q-004, and REG-007 acceptance. |
| `tasks/T-0698-init-v1-contract-and-characterization/INIT_V1_IMPLEMENTATION_MAP.md` | reference | active | Ordered capsule 5 scope. |
| `docs/ARCHITECTURE.md` | constraint | active | Preserve Task Capsule, evidence, and local-first boundaries. |
| `docs/SECURITY_MODEL.md` | constraint | active | Bounded, fail-closed lifecycle writes. |
| `docs/TEST_STRATEGY.md` | constraint | active | Docker-first validation and current `dist`. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Proof-last close and evidence recording. |

## Changes

| Area | Summary |
|---|---|
| Task Board | Added one schema-aware parser/writer for the frozen six-column v1 contract while preserving legacy Notes and extra cells. |
| Task creation | Added repeatable `--target`, project defaulting, compact deterministic projection, and explicit Targets in new TASK.md identity. |
| Close projection | Added the exact optional `## Close Summary` interface, Markdown-to-plain normalization, Unicode cap, and Result projection on valid finish/close flow. |
| Consumers and docs | Routed workbench, state, consistency, and close-source reads through the shared Board model; updated CLI, architecture, security, workflow, and test contracts. |
| Validation | Added focused regressions, refreshed built `dist`, ran corrected serial full Docker validation, and exercised built CLI create plus read-only close. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Exact legacy field migration remains separately gated; this capsule preserves legacy Board content rather than destructively rewriting it. | Deferred | `OPEN-LEGACY-01` |
| RF-2 | Follow-up | Exact TargetRef-based document selection remains in the next ordered document-routing capsule. | Deferred | `INIT_V1_IMPLEMENTATION_MAP.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-26 | Draft | Initial task scaffold. |
| 2026-07-26 | In Progress | Read the frozen contract and traced the Init v1 Board template against legacy-only task create/finish writers. |
| 2026-07-26 | In Progress | Implemented the shared Board model, target source/projection, Close Summary normalization, legacy preservation, and consumer routing. |
| 2026-07-26 | Done | Focused, full serial Docker, built CLI, and dist freshness validation passed; continuation now routes to Init v1 Document Routing. |

## Close Summary

Added Init v1 Task Board targets and close Result projection with exact Close Summary handling and legacy preservation.
