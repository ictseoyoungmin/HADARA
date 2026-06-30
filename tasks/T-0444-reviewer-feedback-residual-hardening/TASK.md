# T-0444 Reviewer Feedback Residual Hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0444 |
| Title | Reviewer Feedback Residual Hardening |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| tasks/T-0444-reviewer-feedback-residual-hardening/artifacts/reviewer-feedback.md | reference | exploratory | review | sha256:07335c6c6e142858255bbcb05e8e33a9f6294bed0b3373c073aa1ea6f3688d6e | Project-local summary of operator-supplied reviewer feedback to apply. |
| docs/specs/0.4.0/productization-redesign/03_Design_Source_Documents_Read_Map_and_Drift.md | implementation-source | implementation-source | approved | sha256:fe90f8ef046cf98fa7acb8e2ae57a27479c44338e10d01fac4f75444d28bc954 | Docs registry/read-map metadata and drift contract. |
| docs/specs/0.4.0/productization-redesign/07_Evidence_Plane_and_Close_Proof_Projection.md | reference | approved | implemented | sha256:3fd28977aef0197f3037a7aef56951ce149a0d868426b68a66e750105e7cf0da | Evidence projection model and wording. |
| docs/specs/0.4.0/productization-redesign/12_CLI_JSON_Contracts_and_Diagnostics.md | reference | approved | implemented | sha256:b808404e76c86bab9370dd2d6c6b76c4324a7e07e5c62c5962f6d4dbfa1659a8 | 0.4 docs register compatibility and diagnostics contract. |

## Goal

| Goal | Notes |
|---|---|
| Apply the remaining reviewer feedback not fully covered by T-0439. | Keep the patch bounded to registry v2 schema alignment, legacy task-doc read-map routing, generated evidence projection wording, and 0.4 guidance for legacy SOP registration commands. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract. | Done | TASK.md |
| 2 | Implement the smallest useful slice. | Done | ev:T-0444:68cba6d6c6e84a9f84e879ca |
| 3 | Validate and record evidence. | Done | ev:T-0444:68cba6d6c6e84a9f84e879ca |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Fresh 0.4 init docs registry files use `hadara.docsRegistry.v2`, while legacy 0.3 migration remains compatible with `hadara.docs.registry.v1`. | Yes | Met | ev:T-0444:68cba6d6c6e84a9f84e879ca | Required | Reviewer feedback item 1 |
| AC-2 | `docs read-map` keeps `TASK.md`, `HANDOFF.md`, and `EVIDENCE.md` in active read-first docs and exposes legacy `CONTEXT.md` only as conditional/historical guidance when present. | Yes | Met | ev:T-0444:68cba6d6c6e84a9f84e879ca | Required | Reviewer feedback item 2 |
| AC-3 | User-facing generated evidence guidance describes `EVIDENCE.md` as a CLI-generated projection file, not agent-editable generated slots. | Yes | Met | ev:T-0444:68cba6d6c6e84a9f84e879ca | Required | Reviewer feedback risk 2 |
| AC-4 | Legacy `init register-doc` / `init enable-integration` SOP-missing guidance routes 0.4 users to `hadara docs register`. | Yes | Met | ev:T-0444:68cba6d6c6e84a9f84e879ca | Required | Reviewer feedback item 5 |
| AC-5 | Validation evidence is recorded. | Yes | Met | ev:T-0444:68cba6d6c6e84a9f84e879ca | Required | HADARA workflow |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Build | `npm run build` in Docker temp copy | Yes | Passed | ev:T-0444:68cba6d6c6e84a9f84e879ca |
| Focused tests | `npm run test:focused -- tests/unit/docs-registry.test.ts tests/unit/init.test.ts tests/unit/protocol-migration.test.ts tests/harness/harness-validate.test.ts tests/unit/schema-fixtures.test.ts` in Docker temp copy | Yes | Passed | ev:T-0444:68cba6d6c6e84a9f84e879ca |
| Built CLI smokes | Fresh init v2 registry, docs register metadata, docs read-map active docs, and legacy init register-doc guidance after `dist` refresh. | Yes | Passed | ev:T-0444:68cba6d6c6e84a9f84e879ca |
| Done validation | `dist/cli/main.js harness validate --task T-0444 --level done --json` | Yes | Passed | ev:T-0444:5cba035f87e74b3692ac3df6 |
| Diff hygiene | `git diff --check` | Yes | Passed | ev:T-0444:5cba035f87e74b3692ac3df6 |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/services/docs-registry.ts | N/A | Add v2 registry file schema default, legacy v1 compatibility, unsupported schema diagnostics, and conditional legacy `CONTEXT.md` read-map routing. | Complete reviewer feedback on registry/read-map metadata behavior. | ev:T-0444:68cba6d6c6e84a9f84e879ca |
| src/services/protocol-migration.ts | N/A | Keep 0.3 protocol migration registry seed on the legacy v1 schema. | Preserve compatibility while fresh 0.4 init moves to v2. | ev:T-0444:68cba6d6c6e84a9f84e879ca |
| src/cli/init.ts, docs/specs/0.4.0/productization-redesign/templates/0.4/HADARA_WORKFLOW.md, src/harness/validate.ts, src/schemas/schema-index.json | N/A | Align generated evidence projection wording and legacy SOP registration guidance. | Reduce agent confusion over CLI-owned projection files and 0.4 docs registration. | ev:T-0444:68cba6d6c6e84a9f84e879ca |
| tests/unit/docs-registry.test.ts, tests/unit/init.test.ts, tests/unit/protocol-migration.test.ts | N/A | Add regression coverage for v2 registry seed, legacy `CONTEXT.md` conditional read-map behavior, and current Task Capsule migration expectations. | Prove the feedback stays fixed. | ev:T-0444:68cba6d6c6e84a9f84e879ca |
| tasks/T-0444-reviewer-feedback-residual-hardening/artifacts/reviewer-feedback.md | N/A | Add project-local summary of reviewer feedback. | Keep Source Documents within the project boundary for done-level validation. | ev:T-0444:5cba035f87e74b3692ac3df6 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Existing committed HADARA-dev `.hadara/docs-registry.json` still uses the historical v1 schema; this capsule changes fresh 0.4 generation and accepts legacy v1 reads, but does not migrate existing registry artifacts. | Open | Future docs registry migration capsule |
