# T-0437 T-04A11 Close Proof Placement

## Identity

| Field | Value |
|---|---|
| ID | T-0437 |
| Title | T-04A11 Close Proof Placement |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/07_Evidence_Plane_and_Close_Proof_Projection.md | constraint | approved | implemented | sha256:740f79ace2b21b293fe312e7cd1498babe6993b9ac9002dee2a5d9ed31db0527 | Defines close proof placement, snapshot, projection, and diagnostics. |
| docs/specs/0.4.0/productization-redesign/09_Close_Source_Contract.md | constraint | approved | implemented | sha256:9a1546bbe4e5dcffebc17dd1460cfa8abedb041503092c7b08a0e4c07cc979f9 | Defines normalized close-source inputs and excludes raw evidence fixed-point hashes. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | reference | approved | implemented | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Places T-04A11 after evidence projection. |

## Goal

| Goal | Notes |
|---|---|
| Keep close proof out of close-source docs while preserving auditable proof in evidence surfaces. | Add a structured close evidence readiness snapshot to canonical evidence and audit reports, while keeping `TASK.md`/`HANDOFF.md` free of close proof payloads. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract. | Done | Source Documents table. |
| 2 | Add structured close evidence snapshot at close append/audit boundaries. | Done | ev:T-0437:fc850943950547939127f430 |
| 3 | Keep close proof projected through `EVIDENCE.md`, not close-source docs. | Done | ev:T-0437:fc850943950547939127f430 |
| 4 | Validate and record evidence. | Done | ev:T-0437:fc850943950547939127f430 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Close evidence records include a structured `closeEvidenceSnapshot` with acceptance ids, readiness evidence refs, unresolved failed/blocked refs, classifications, and summary hash. | Yes | Met | ev:T-0437:fc850943950547939127f430 | Required | docs/specs/0.4.0/productization-redesign/07_Evidence_Plane_and_Close_Proof_Projection.md |
| AC-2 | `task audit-close --json` exposes and validates the snapshot without requiring raw `EVIDENCE.md` or raw `evidence.jsonl` hashes as close-source inputs. | Yes | Met | ev:T-0437:fc850943950547939127f430 | Required | docs/specs/0.4.0/productization-redesign/09_Close_Source_Contract.md |
| AC-3 | Close proof remains absent from `TASK.md` and task-local `HANDOFF.md`; human-visible proof is projected through `EVIDENCE.md`. | Yes | Met | ev:T-0437:fc850943950547939127f430 | Required | docs/specs/0.4.0/productization-redesign/07_Evidence_Plane_and_Close_Proof_Projection.md |
| AC-4 | Focused validation evidence is recorded before finalize. | Yes | Met | ev:T-0437:fc850943950547939127f430 | Required | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Build | `npm run build` in Docker temp copy | Yes | Passed | ev:T-0437:fc850943950547939127f430 |
| Focused tests | `npm run test:focused -- tests/unit/task-close.test.ts tests/unit/evidence-projection.test.ts tests/unit/task-finalize.test.ts tests/unit/schema-fixtures.test.ts tests/unit/command-registry.test.ts` in Docker temp copy | Yes | Passed | ev:T-0437:fc850943950547939127f430 |
| Built CLI smoke | `dist/cli/main.js task close --task T-0437 --json` and `dist/cli/main.js harness validate --task T-0437 --level draft --json` | Yes | Passed | ev:T-0437:fc850943950547939127f430 |
| Done validation | `dist/cli/main.js harness validate --task T-0437 --level done --json` | Yes | Passed | ev:T-0437:d34b135e47e34386b6fa4ff0 |
| Diff hygiene | `git diff --check` | Yes | Passed | ev:T-0437:d34b135e47e34386b6fa4ff0 |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/evidence/evidence.ts | L10-L93, L574-L625 | Added optional `closeEvidenceSnapshot` persistence to evidence v2 records. | Store close proof payload in canonical evidence, not close-source docs. | ev:T-0437:fc850943950547939127f430 |
| src/task/task-close.ts | L1-L180, L617-L730, L900-L989 | Added normalized snapshot creation, close evidence append metadata, audit exposure, and snapshot drift warnings. | Keep close proof auditable without raw evidence fixed-point close-source hashes. | ev:T-0437:fc850943950547939127f430 |
| tests/unit/task-close.test.ts | L45-L175, L315-L395 | Added close snapshot append/audit/drift coverage and close-source placement assertions. | Prove T-04A11 behavior with focused tests. | ev:T-0437:fc850943950547939127f430 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Dashboard/proof-status read models may later surface snapshot details more richly. | Deferred | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |
