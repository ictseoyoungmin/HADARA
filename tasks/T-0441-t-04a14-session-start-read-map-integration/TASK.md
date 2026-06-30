# T-0441 T-04A14 Session Start Read-Map Integration

## Identity

| Field | Value |
|---|---|
| ID | T-0441 |
| Title | T-04A14 Session Start Read-Map Integration |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/03_Design_Source_Documents_Read_Map_and_Drift.md | implementation-source | implementation-source | approved | sha256:fe90f8ef046cf98fa7acb8e2ae57a27479c44338e10d01fac4f75444d28bc954 | Defines read-map buckets and drift warnings. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | implementation-source | implementation-source | approved | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Places this capsule as T-04A14 and excludes release work. |
| docs/AGENT_HANDOFF.md | reference | normative | approved | sha256:1d69b7bf066b9156f3d1fe53b8325c95570daba9c1e152a68d8902ae9524d2c8 | Current handoff now points next work at T-04A15 after T-0441 completion. |

## Goal

| Goal | Notes |
|---|---|
| Make `hadara session start --task T-XXXX --json` consume the docs read-map and source document drift. | Reuse the existing docs read-map and TASK source-hash validation logic; expose compact read guidance without adding broad raw docs/specs reads. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract and source document hashes. | Done | TASK.md |
| 2 | Trace existing session start, docs read-map, and source-hash validation services. | Done | src/context/session-start.ts; src/services/docs-registry.ts; src/harness/validate.ts |
| 3 | Add compact read-map/drift metadata to task-scoped Session Start. | Done | ev:T-0441:619636a6d5a34be2a42bf1d9 |
| 4 | Validate with focused tests, built CLI smoke, harness, and diff hygiene. | Done | ev:T-0441:619636a6d5a34be2a42bf1d9; ev:T-0441:22402ccb85324b76a2d2bc79; ev:T-0441:3abf3c957375418e9626a68c |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Task-scoped Session Start includes compact docs read-map guidance derived from `docs read-map`. | Yes | Met | ev:T-0441:619636a6d5a34be2a42bf1d9; ev:T-0441:22402ccb85324b76a2d2bc79 | Required | docs/specs/0.4.0/productization-redesign/03_Design_Source_Documents_Read_Map_and_Drift.md |
| AC-2 | Task-scoped Session Start surfaces source document drift for the active task without broad raw docs/specs reads. | Yes | Met | ev:T-0441:619636a6d5a34be2a42bf1d9 | Required | docs/specs/0.4.0/productization-redesign/03_Design_Source_Documents_Read_Map_and_Drift.md |
| AC-3 | Default/no-task Session Start remains bounded and does not require a task read-map. | Yes | Met | ev:T-0441:619636a6d5a34be2a42bf1d9 | Required | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |
| AC-4 | Stale handoff next-step detail is corrected to point at the next capsule after T-0441. | Yes | Met | docs/AGENT_HANDOFF.md | Required | docs/AGENT_HANDOFF.md |
| AC-5 | Validation evidence is recorded and the capsule is ready for finalize/audit close proof. | Yes | Met | ev:T-0441:619636a6d5a34be2a42bf1d9; ev:T-0441:22402ccb85324b76a2d2bc79; ev:T-0441:3abf3c957375418e9626a68c; ev:T-0441:3356794fd240478ca59880fb | Required | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused Docker tests | `npm run build && npm run test:focused -- tests/unit/session-start.test.ts tests/unit/docs-registry.test.ts tests/harness/harness-validate.test.ts` in `hadara-dev` temp copy | Yes | Passed | ev:T-0441:619636a6d5a34be2a42bf1d9 |
| Built CLI smoke | `hadara session start --task T-0441 --json` reports read-map/drift metadata. | Yes | Passed | ev:T-0441:22402ccb85324b76a2d2bc79 |
| Done-level harness | `hadara harness validate --task T-0441 --level done --json` | Yes | Passed | ev:T-0441:3356794fd240478ca59880fb |
| Diff hygiene | `git diff --check` | Yes | Passed | ev:T-0441:3abf3c957375418e9626a68c |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/context/session-start.ts | L18-L225 | Add compact `docsReadMap` summary to task-scoped Session Start and add `docs-read-map` guidance command. | Reuse existing read-map and source-hash validation instead of broad raw doc reads. | ev:T-0441:619636a6d5a34be2a42bf1d9 |
| tests/unit/session-start.test.ts | L10-L305 | Cover docsReadMap presence, no-task omission, guidance command, and source document drift surfacing. | Lock the session-start/read-map contract. | ev:T-0441:619636a6d5a34be2a42bf1d9 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Risk | `docs read-map` output can be large in this repository, so Session Start should expose compact counts/top paths rather than embedding the full report. | Open | docs/specs/0.4.0/productization-redesign/03_Design_Source_Documents_Read_Map_and_Drift.md |
