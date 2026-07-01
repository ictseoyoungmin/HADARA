# T-0450 T-04A22 Lifecycle UX Hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0450 |
| Title | T-04A22 Lifecycle UX Hardening |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md | implementation-source | normative | approved | sha256:79c5b525a1ccfa68d018d90a1a2b42be4b2a148dd8b26a1d4650355e601a17c0 | Dogfood exposed validation/evidence lifecycle friction. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | implementation-source | normative | approved | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | T-04A22 is the self-review hardening batch after profile dogfood. |
| .agent_alpha_test/feedback/usability/negative.md | reference | reference-only | draft | sha256:9e01f86365433625a8edc70ecb73ec358243f0ecd468d89e533ddfb5948c0ae8 | Requests clearer validate/evidence examples and active task/evidence discoverability. |
| .agent_alpha_test/feedback/validation/negative.md | reference | reference-only | draft | sha256:71f89c3c4c47455c5d62dff49ebb61a2a04432075b19db05c063b52dc566365a | Notes validation harness and semantic validation gaps. |

## Goal

| Goal | Notes |
|---|---|
| Reduce the lifecycle friction observed during basic/governed dogfood. | Add a small validation command wrapper that records real execution evidence and updates the matching TASK.md Validation row, and make finalize dry-run expose a ready-to-close state instead of looking like a blocker when only close evidence append remains. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract. | Done | TASK.md |
| 2 | Add validation wrapper MVP for command execution, evidence append, projection refresh, Validation row update, and resolution tags. | Done | ev:T-0450:91632ae5de42456aa4e2c608 |
| 3 | Add additive finalize lifecycle vocabulary for blocked, ready-to-close, closed-valid, and closed-stale. | Done | ev:T-0450:91632ae5de42456aa4e2c608 |
| 4 | Expose the new validation command in help/registry/schema surfaces. | Done | ev:T-0450:91632ae5de42456aa4e2c608 |
| 5 | Validate and record evidence. | Done | ev:T-0450:91632ae5de42456aa4e2c608, ev:T-0450:ea07a22c3f7e4630a2987e12, ev:T-0450:52e434e359144e9387c5c591 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `hadara validation run --task <id> --check <name> -- <command...>` executes the command, records durable validation evidence from the real exit code, refreshes `EVIDENCE.md`, and updates the matching TASK.md Validation row's Latest Result and Evidence. | Yes | Met | ev:T-0450:91632ae5de42456aa4e2c608, ev:T-0450:52e434e359144e9387c5c591 | Required | .agent_alpha_test/feedback/usability/negative.md |
| AC-2 | Failed validation commands record failed evidence and update the Validation row to Failed without marking Acceptance rows Met or changing Disposition. | Yes | Met | ev:T-0450:91632ae5de42456aa4e2c608, ev:T-0450:e1432ab6b23e42ab9a6c02a2 | Required | .agent_alpha_test/feedback/validation/negative.md |
| AC-3 | `task finalize --json` exposes additive lifecycle state fields so a close-evidence-only pending write is `ready-to-close`/executable, not only an error-looking missing-close-evidence report. | Yes | Met | ev:T-0450:91632ae5de42456aa4e2c608 | Required | docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md |
| AC-4 | Command registry/help/schema surfaces include the validation wrapper and finalize state additions without breaking existing JSON consumers. | Yes | Met | ev:T-0450:91632ae5de42456aa4e2c608, ev:T-0450:ea07a22c3f7e4630a2987e12 | Required | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |
| AC-5 | Validation evidence is recorded in this capsule. | Yes | Met | ev:T-0450:91632ae5de42456aa4e2c608, ev:T-0450:ea07a22c3f7e4630a2987e12, ev:T-0450:52e434e359144e9387c5c591 | Required | HADARA workflow |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused unit tests | bash -lc cd /tmp/hadara && npx vitest run tests/unit/validation-run.test.ts tests/unit/task-finalize.test.ts tests/unit/command-registry.test.ts tests/unit/help.test.ts tests/unit/evidence-projection.test.ts | Yes | Passed | ev:T-0450:91632ae5de42456aa4e2c608 |
| Built CLI smoke | node dist/cli/main.js help --json | Yes | Passed | ev:T-0450:41e99cf3985746bc9e75106e |
| Capsule checks | bash -lc node dist/cli/main.js harness validate --task T-0450 --level done --json && node dist/cli/main.js evidence lint --task T-0450 --json && git -c safe.directory=/workspace diff --check | Yes | Passed | ev:T-0450:52e434e359144e9387c5c591 |
| TypeScript build | bash -lc cd /tmp/hadara && npm run build | Yes | Passed | ev:T-0450:ea07a22c3f7e4630a2987e12 |
| Capsule check failure resolution | git -c safe.directory=/workspace diff --check | Yes | Passed | ev:T-0450:e1432ab6b23e42ab9a6c02a2 |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| tasks/T-0450-t-04a22-lifecycle-ux-hardening/TASK.md | L1-L78 | Defined lifecycle UX hardening contract. | Establish scope before code changes. | TASK.md |
| src/services/validation-run.ts | L1-L220 | Added real command execution wrapper, evidence append, EVIDENCE.md projection refresh, TASK.md Validation row update, and resolution tags. | Reduce validation/evidence recording friction for agents. | ev:T-0450:91632ae5de42456aa4e2c608 |
| src/cli/validation.ts, src/cli/main.ts | L1-L90 | Added `hadara validation run` command dispatch with 0.4 mutation boundary checks. | Provide a single CLI path for validation plus evidence capture. | ev:T-0450:41e99cf3985746bc9e75106e |
| src/task/task-finalize.ts, src/schemas/task-finalize.schema.json | L1-L520 | Added additive finalize `state`, `planStatus`, `blockingIssues`, and `pendingWrites`; close-evidence-only dry-run now reports `ready-to-close`. | Make finalize dry-run less misleading when only the close proof append remains. | ev:T-0450:91632ae5de42456aa4e2c608 |
| src/evidence/evidence.ts | L480-L610 | Made EVIDENCE.md residual projection show exact-marker resolved failed evidence as Resolved with resolver id. | Keep projection output aligned with evidence lint semantics. | ev:T-0450:91632ae5de42456aa4e2c608 |
| src/services/capability-registry.ts, src/services/lifecycle-guide.ts, src/core/schema.ts, src/schemas/schema-index.json, src/schemas/validation-run.schema.json | L1-L1100 | Registered validation wrapper in help/registry/lifecycle/schema surfaces. | Keep agent-facing command discovery aligned with implementation. | ev:T-0450:91632ae5de42456aa4e2c608 |
| tests/unit/validation-run.test.ts, tests/unit/task-finalize.test.ts, tests/unit/command-registry.test.ts, tests/unit/help.test.ts, tests/unit/evidence-projection.test.ts | L1-L360 | Added regression coverage for validation wrapper, failed validation behavior, finalize state vocabulary, registry, help, and resolved residual projection. | Lock the UX hardening behavior. | ev:T-0450:91632ae5de42456aa4e2c608 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Acceptance row auto-update remains out of scope unless explicit validation-to-acceptance mapping is designed. | Open | .agent_alpha_test/feedback/usability/negative.md |
| RF-2 | Follow-up | A future validation wrapper pass can add optional stdout/stderr artifact capture with redaction; T-0450 records hashes only. | Open | .agent_alpha_test/feedback/validation/negative.md |
