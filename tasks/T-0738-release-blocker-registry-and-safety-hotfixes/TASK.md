# T-0738 Release blocker registry and safety hotfixes

## Identity

| Field | Value |
|---|---|
| ID | T-0738 |
| Title | Release blocker registry and safety hotfixes |
| Status | Done |
| Created | 2026-07-29T20:04 |
| Updated | 2026-07-29T20:20 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove current release blockers in priority order. | Repaired docs registry/projection, added regression coverage, hardened close execute guard preflight, sanitized validation output previews, and surfaced task-local HANDOFF continuation through task selection status. |

## Scope

| Boundary | Items |
|---|---|
| In | 1순위 hotfix: repair `.hadara/docs-registry.json`, regenerate `docs/DOC_REGISTRY.md`, add a repository registry regression test, validate parse/schema/render behavior, and record evidence. |
| In | 2순위 transaction safety: move direct execute proofAppendGuard checks before first mutation so missing guard is zero-write execute-refused. |
| In | 3순위 validation output trust boundary: default redaction, ANSI/control stripping, head+tail preview, raw-output opt-in, schema required/strictness. |
| In | 4순위 continuation: materialize actionable task-local HANDOFF into Task Board/Draft task or a structured queue. |
| Out | Broad release publication work; restoring global `PROJECT_STATE.md`, `AGENT_HANDOFF.md`, or `.hadara/state/current.json` as required-reading surfaces. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Hotfix docs registry JSON and regenerate Markdown projection. | Done |
| 2 | Add repository-registry regression coverage. | Done |
| 3 | Move direct execute proofAppendGuard refusal before first mutation. | Done |
| 4 | Harden validation output preview trust boundary. | Done |
| 5 | Surface actionable task-local HANDOFF continuation as structured task-selection next work. | Done |
| 6 | Validate parse/schema/render and focused tests; record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `.hadara/docs-registry.json` parses as JSON and no longer contains required/canonical entries for `.hadara/state/current.json`, `docs/AGENT_HANDOFF.md`, or `docs/PROJECT_STATE.md`. | Done | ev:T-0738:034d842cd14346e3a115544d | Release blocker report |
| AC-2 | `docs/DOC_REGISTRY.md` is regenerated from the repaired registry and no longer projects the deleted three paths as canonical/required. | Done | ev:T-0738:034d842cd14346e3a115544d | Release blocker report |
| AC-3 | A regression test checks the repository docs registry fixture parses and excludes removed global continuation paths. | Done | ev:T-0738:a2b68c4e27964adc8afccc6b; ev:T-0738:898bee889e324be0b3e41d7c | Release blocker report |
| AC-4 | Direct execute refuses before guarded writes when proofAppendGuard is missing. | Done | ev:T-0738:898bee889e324be0b3e41d7c | User priority order |
| AC-5 | Validation output previews are redacted by default, strip terminal controls, use head+tail truncation, and expose raw output only by opt-in. | Done | ev:T-0738:898bee889e324be0b3e41d7c | User priority order |
| AC-6 | Actionable task-local HANDOFF continuation is discoverable through structured task-selection status after Task Board and slice work are exhausted. | Done | ev:T-0738:898bee889e324be0b3e41d7c | User priority order |
| AC-7 | Focused validation passes and evidence is recorded. | Done | ev:T-0738:898bee889e324be0b3e41d7c; ev:T-0738:47d8b0d6199c49b6b1de1123 | HADARA workflow |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Registry parse/schema/render | Yes | Passed | JSON parse, docs doctor, docs render already-current, and removed path checks passed. | ev:T-0738:034d842cd14346e3a115544d |
| Focused docs registry tests | Yes | Passed | exit 0 in 2240ms | ev:T-0738:a2b68c4e27964adc8afccc6b |
| TypeScript no-emit | Yes | Passed | exit 0 in 4793ms | ev:T-0738:47d8b0d6199c49b6b1de1123 |
| Registry parse schema render | Yes | Passed | exit 0 in 665ms | ev:T-0738:034d842cd14346e3a115544d |
| Focused hotfix regression tests | Yes | Passed | exit 0 in 7290ms | ev:T-0738:898bee889e324be0b3e41d7c |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User priority order | background | active | Defines hotfix, transaction safety, validation output boundary, and continuation order. |
| Release blocker attachment | background | active | Identifies malformed docs registry, stale projection, and follow-up risks. |
| .hadara/docs-registry.json | implementation-source | active | Broken machine-readable registry to repair. |
| docs/DOC_REGISTRY.md | implementation-source | active | Markdown projection to regenerate after registry repair. |
| src/services/docs-registry.ts | implementation-source | active | Registry render and doctor behavior. |
| tests/unit/docs-registry.test.ts | implementation-source | active | Regression location for repository registry fixture validation. |

## Changes

| Area | Summary |
|---|---|
| Docs registry | Repaired malformed `.hadara/docs-registry.json`, regenerated `docs/DOC_REGISTRY.md`, and added repository fixture regression coverage. |
| Task close transaction | Added a pre-mutation direct execute refusal when a close plan may need proof append but no proofAppendGuard is available. |
| Validation run | Added default redacted previews, terminal control stripping, UTF-8 safe head+tail truncation, raw output opt-in, and strict required capture schema fields. |
| Task selection continuation | Added task-local `HANDOFF.md` continuation discovery after Task Board and slices are exhausted, without restoring global current-state required-reading surfaces. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | The registry JSON was malformed, so registry-backed routing, render, doctor, required-reading, and close/source policies could degrade until fixed. | Closed | ev:T-0738:034d842cd14346e3a115544d |
| RF-2 | Follow-up | Direct execute proofAppendGuard preflight should be moved before first mutation. | Closed | ev:T-0738:898bee889e324be0b3e41d7c |
| RF-3 | Follow-up | Validation output previews should default to redacted/sanitized output with raw output behind explicit opt-in. | Closed | ev:T-0738:898bee889e324be0b3e41d7c |
| RF-4 | Follow-up | Actionable task-local HANDOFF continuation should be materialized into a discoverable queue or draft task path. | Closed | ev:T-0738:898bee889e324be0b3e41d7c |

## Close Summary

T-0738 completed the requested release-blocker sequence. The docs registry now parses and renders cleanly, removed global continuation paths stay out of registry/projection fixtures, direct close execute refuses before mutation without a proof append guard, validation output previews are sanitized/redacted by default, and task-local HANDOFF continuation is surfaced as structured task-selection status when no Task Board or slice work remains.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-29 | Draft | Initial task scaffold. |
| 2026-07-29 | In Progress | Planned ordered release-blocker hotfix work and started docs registry repair. |
| 2026-07-29 | Done | Completed registry hotfix, transaction safety, validation output boundary, task-local HANDOFF continuation routing, and focused validation. |
