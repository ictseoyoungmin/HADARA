# T-0453 Agent UX Validation Run Task Sync Decoupling

## Identity

| Field | Value |
|---|---|
| ID | T-0453 |
| Title | Agent UX Validation Run Task Sync Decoupling |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| .hadara/context/MEMORY.md | background | reference-only | implemented | sha256:aeec9df16c7aeeb9c5f5a7787a3ce9faf153f95eb98fa1ff4ef80cfd36948834 | Captures the T-0452 validation-run loop finding. |
| docs/TASK_WORKFLOW_COMMANDS.md | reference | normative | implemented | sha256:d079516aa29a9c92ebfe16ddcf87762ccc334b7fdb7b0ea51b83c272fae7aac1 | Defines task lifecycle and validation evidence command semantics. |
| src/services/validation-run.ts | implementation-source | normative | implemented | sha256:f12b14eba440c383e3f7fe1b53b5b49a930b4605ef018e9318afd1775a76bbb8 | Owns validation command execution, evidence append, projection, and TASK.md row sync behavior. |
| src/cli/validation.ts | implementation-source | normative | implemented | sha256:2829f3bbfd67aa4a6a6a0af870a1cdc839b5a1a4b953c2fb51dd667d5d9cde88 | Owns validation CLI option parsing. |
| src/services/capability-registry.ts | implementation-source | normative | implemented | sha256:77fec03450f02d0ab2cab60972f11542875cf1fb95a4c87a8401b0f933457c63 | Owns command registry help and default lifecycle wording. |
| src/cli/init.ts | implementation-source | normative | implemented | sha256:6b250a14b4bcbd3c95f77b8a0e3c0188050f7caa600fdb62236ef5ea3eb8d5e8 | Owns generated workflow guidance for new HADARA projects. |
| tests/unit/validation-run.test.ts | implementation-source | normative | implemented | sha256:96f218c397375d4f64b351cca46d81a319ca37e398a2ecca384abbe3c3c1d333 | Regression coverage for validation-run behavior. |
| tests/unit/init.test.ts | implementation-source | normative | implemented | sha256:dde32f51c18948a990b354c5528f27cbdc6e05e11ca31de87f64fd26f2611adc | Regression coverage for generated workflow guidance. |
| src/schemas/validation-run.schema.json | implementation-source | normative | implemented | sha256:6ef37a26d6fa85f5317ff39b126ef7295a942f3db18c3c898334329035932ddf | JSON schema contract for validation-run reports. |
| docs/specs/0.4.0/productization-redesign/templates/0.4/HADARA_WORKFLOW.md | reference | reference-only | implemented | sha256:8bfa797c2cf59d4a68b17945b09f22a13afc2de97d86b44a3e200b31fcc20a84 | 0.4 workflow template guidance. |
| docs/AGENT_HANDOFF.md | reference | normative | implemented | sha256:f369708ef35ffd1bf15b3a47dcc7710e34fb91174b1c5618a4ff61dc883aa668 | Current active-work handoff. |
| docs/PROJECT_STATE.md | reference | normative | implemented | sha256:0b419ea09089ea5599eb296f61d320d9b55465ca3957355e9b9600db40537ff7 | Current project state. |
| docs/TASK_BOARD.md | reference | normative | implemented | sha256:dd1d7f5cebc59fa7f0d780b02e8cdf903d60bd8dd6b5c887763b80a6c382880a | Current task board row. |

## Goal

| Goal | Notes |
|---|---|
| Decouple validation evidence capture from automatic close-source task prose churn. | `hadara validation run` should record real execution evidence by default without rewriting `TASK.md`; agents can opt in to TASK.md Validation row sync with `--update-task` when that is the intended close-source edit. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract from T-0452 dogfood friction. | Done | TASK.md |
| 2 | Make `validation run` evidence-only by default and add explicit `--update-task` sync. | Done | `ev:T-0453:facedecf71cf4747adfdd522` |
| 3 | Align schema, registry/help, generated workflow docs, and tests with the new boundary. | Done | `ev:T-0453:facedecf71cf4747adfdd522`, `ev:T-0453:bff69d665fcb466fb9bc910b` |
| 4 | Validate, finalize, and record capsule evidence. | Done | `ev:T-0453:6a76b8b335fb4151b6d9f92a` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Running `validation run` without `--update-task` appends validation evidence and refreshes projection without changing the active `TASK.md` Validation row. | Yes | Met | `ev:T-0453:facedecf71cf4747adfdd522` | Required | src/services/validation-run.ts |
| AC-2 | Running `validation run --update-task` preserves the existing explicit TASK.md Validation row sync behavior. | Yes | Met | `ev:T-0453:facedecf71cf4747adfdd522` | Required | src/cli/validation.ts |
| AC-3 | Command registry, generated workflow docs, and current workflow docs teach evidence-only default behavior and opt-in task row sync. | Yes | Met | `ev:T-0453:facedecf71cf4747adfdd522` | Required | docs/TASK_WORKFLOW_COMMANDS.md |
| AC-4 | T-0453 implementation is validated and ready for finalize without release readiness, publish, package recycle, or stable release work. | Yes | Met | `ev:T-0453:6a76b8b335fb4151b6d9f92a` | Required | docs/AGENT_HANDOFF.md |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused validation-run tests | bash -lc cd /tmp/hadara && npx vitest run tests/unit/validation-run.test.ts tests/unit/init.test.ts tests/unit/lifecycle-guide.test.ts | Yes | Passed | ev:T-0453:facedecf71cf4747adfdd522 |
| TypeScript build | bash -lc cd /tmp/hadara && npm run build | Yes | Passed | ev:T-0453:bff69d665fcb466fb9bc910b |
| Final capsule checks | bash -lc node dist/cli/main.js harness validate --task T-0453 --level done --json && node dist/cli/main.js evidence lint --task T-0453 --json && git -c safe.directory=/workspace diff --check | Yes | Passed | ev:T-0453:6a76b8b335fb4151b6d9f92a |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/services/validation-run.ts | N/A | Added opt-in TASK.md Validation row sync mode and evidence-only default report metadata. | Reduce validation/edit/validation close-source churn for agents. | `ev:T-0453:facedecf71cf4747adfdd522` |
| src/cli/validation.ts | N/A | Added `--update-task` flag and text output for skipped row sync. | Let agents choose task prose writes deliberately. | `ev:T-0453:facedecf71cf4747adfdd522` |
| src/schemas/validation-run.schema.json | N/A | Added `taskValidationRow.mode` schema metadata. | Make the report contract explicit for downstream agents. | `ev:T-0453:facedecf71cf4747adfdd522` |
| src/services/capability-registry.ts, src/cli/init.ts, docs/TASK_WORKFLOW_COMMANDS.md, docs/specs/0.4.0/productization-redesign/templates/0.4/HADARA_WORKFLOW.md | N/A | Aligned command guidance with evidence-only default and opt-in task row sync. | Prevent scaffold/help docs from reintroducing the old loop. | `ev:T-0453:facedecf71cf4747adfdd522` |
| tests/unit/validation-run.test.ts, tests/unit/init.test.ts | N/A | Added/updated regression coverage for default skip and opt-in sync behavior. | Keep agent UX boundary stable. | `ev:T-0453:facedecf71cf4747adfdd522` |
| .hadara/context/MEMORY.md | N/A | Recorded validation-run close-source churn dogfood lesson. | Preserve practical HADARA usage knowledge. | TASK.md |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | This is capsule 1 of the requested 5-15 capsule agent UX refactor loop; broader validation attempt/supersession and finalize progress UX remain future capsules. | Open | .hadara/context/MEMORY.md |
