# T-0436 T-04A10 Evidence Projection

## Identity

| Field | Value |
|---|---|
| ID | T-0436 |
| Title | T-04A10 Evidence Projection |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/07_Evidence_Plane_and_Close_Proof_Projection.md | constraint | approved | implemented | sha256:740f79ace2b21b293fe312e7cd1498babe6993b9ac9002dee2a5d9ed31db0527 | Defines canonical evidence and projection behavior. |
| docs/specs/0.4.0/productization-redesign/12_CLI_JSON_Contracts_and_Diagnostics.md | reference | approved | implemented | sha256:ddce331eebd5a9d5cfd41282275f7e82c49dff632a93c087cbf5d2ca210ab861 | Defines proposed evidence projection report shape. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | reference | approved | implemented | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Places T-04A10 in the implementation sequence. |

## Goal

| Goal | Notes |
|---|---|
| Keep `EVIDENCE.md` as a generated projection from canonical `evidence.jsonl`. | Add projection refresh on evidence append and an explicit dry-run/execute repair command. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract. | Done | Source Documents table. |
| 2 | Reuse evidence append flow to regenerate projection slots. | Done | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |
| 3 | Add `evidence project` dry-run/execute report. | Done | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |
| 4 | Validate and record evidence. | Done | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `evidence add-command` appends canonical `evidence.jsonl` records and refreshes generated `EVIDENCE.md` projection slots without hiding failed or blocked evidence. | Yes | Met | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 | Required | docs/specs/0.4.0/productization-redesign/07_Evidence_Plane_and_Close_Proof_Projection.md |
| AC-2 | `evidence project --task T-XXXX --json` reports projection drift and `--execute` rewrites only generated `EVIDENCE.md` projection content. | Yes | Met | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 | Required | docs/specs/0.4.0/productization-redesign/12_CLI_JSON_Contracts_and_Diagnostics.md |
| AC-3 | Focused validation evidence is recorded before finalize. | Yes | Met | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 | Required | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Build | `npm run build` in Docker temp copy | Yes | Passed | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |
| Focused tests | `npm run test:focused -- tests/unit/evidence-json.test.ts tests/unit/evidence-projection.test.ts tests/unit/task-capsule.test.ts tests/harness/harness-validate.test.ts tests/unit/task-close.test.ts tests/unit/task-finalize.test.ts tests/unit/schema-fixtures.test.ts tests/unit/command-registry.test.ts` in Docker temp copy | Yes | Passed | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |
| Built CLI smoke | `dist/cli/main.js evidence project --task T-0436 --json` after dist refresh | Yes | Passed | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |
| Done validation | `dist/cli/main.js harness validate --task T-0436 --level done --json` | Yes | Passed | ev:T-0436:9cff9c070c674e54baa24057 |
| Diff hygiene | `git diff --check` | Yes | Passed | ev:T-0436:9cff9c070c674e54baa24057 |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/evidence/evidence.ts | L103-L120, L368-L557 | Added evidence projection reports, projection rendering from canonical records, and append-time projection refresh. | Keep `EVIDENCE.md` generated from append-only `evidence.jsonl`. | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |
| src/cli/evidence.ts | L1-L95 | Added `evidence project` dry-run/execute CLI handling. | Provide explicit projection repair surface. | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |
| src/task/task-capsule.ts | L15-L20 | Updated fresh `EVIDENCE.md` scaffold to managed projection slots. | New capsules should start in the 0.4 projection shape. | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |
| src/harness/validate.ts | L458-L485, L953-L970 | Allowed projection slots and kept duplicate legacy table-header detection. | Harness should validate the new projection shape without losing drift checks. | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |
| src/services/evidence-lint.ts | L145-L149 | Count projected evidence rows in slot-based `EVIDENCE.md`. | Evidence lint should compare projection rows to canonical records. | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |
| src/services/capability-registry.ts | L780-L799 | Registered `evidence project` command metadata. | Keep command registry aligned with the new CLI surface. | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |
| src/core/schema.ts, src/schemas/schema-index.json, src/schemas/evidence-projection.schema.json | L31-L147, L47-L56, L1-L33 | Registered `hadara.evidence.projection.v1` schema. | Keep structured output discoverable and validated. | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |
| tests/unit/evidence-projection.test.ts | L1-L89 | Added append refresh, dry-run/execute repair, and CLI routing coverage. | Prove projection behavior without broad suite changes. | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |
| tests/unit/task-capsule.test.ts, tests/harness/harness-validate.test.ts, tests/unit/schema-fixtures.test.ts | L47-L52, L518-L520, L42-L44 | Updated expectations for projection scaffold, duplicate header fixture, and schema id list. | Keep existing tests aligned with T-04A10 behavior. | ev:T-0436:f4c57fd4dc6a4d9dbffedfe0 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Close readiness snapshot remains T-04A12 scope; this capsule only makes Markdown evidence projection deterministic from canonical evidence records. | Deferred | docs/specs/0.4.0/productization-redesign/09_Close_Source_Contract.md |
