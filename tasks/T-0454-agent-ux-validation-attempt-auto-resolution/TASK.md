# T-0454 Agent UX Validation Attempt Auto Resolution

## Identity

| Field | Value |
|---|---|
| ID | T-0454 |
| Title | Agent UX Validation Attempt Auto Resolution |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| tasks/T-0453-agent-ux-validation-run-task-sync-decoupling/HANDOFF.md | reference | approved | implemented | sha256:d10f47e56812984d3bfeb4445c9909da469ff6692a75dc660f2045a1c81da649 | Previous UX capsule routed this work to validation attempt/latest-result modeling. |
| .hadara/context/MEMORY.md | background | approved | implemented | sha256:b9e9150a06cb60129cd1099c2d7dce2dfdc0107f84c51a8ed7d1182355a5e94b | Dogfood notes for validation evidence, attempt projection, and CLI help/spawn UX follow-ups. |
| src/services/validation-run.ts | implementation-source | approved | implemented | sha256:e40fabd68f7e7bc9ab44c377cf7b128dc8016f50e7e0831340445971a9dbb766 | Validation execution report and evidence tag behavior. |
| src/schemas/validation-run.schema.json | implementation-source | approved | implemented | sha256:862c9d598ec6aa120a19b6f79909253fe2c6c2f751daddd452a91ec055b6d696 | JSON schema for the validation-run report. |
| tests/unit/validation-run.test.ts | implementation-source | approved | implemented | sha256:8904b6cb221be3d89025778ebb716a4d8a172884f07de595803c361db2081ad5 | Focused regression coverage for check keys and auto-resolution. |
| src/services/capability-registry.ts | implementation-source | approved | implemented | sha256:af55b4093e605cb201bf4a81bcad36fb6d38539e9aac2531a218d36a489348f1 | Registry-facing command description. |
| docs/TASK_WORKFLOW_COMMANDS.md | reference | approved | implemented | sha256:c14e9d7d396ed213dfe1c9b42b6c6c27350abbb80725c0108ecde869147e9bfe | Agent workflow guidance for validation-run resolution behavior. |

## Goal

| Goal | Notes |
|---|---|
| Reduce repeated-validation bookkeeping for agents. | `hadara validation run` should identify attempts for the same validation check and automatically resolve earlier failed or blocked attempts when a later same-check attempt passes. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Add stable validation check keys and attempt metadata to validation-run reports. | Done | `ev:T-0454:10fe55713fac48b2907d76b6` |
| 2 | Auto-attach `resolves:<id>` tags for prior unresolved failed or blocked attempts when the same check later passes. | Done | `ev:T-0454:385fa69b38dc4641839a69bb` |
| 3 | Update registry/workflow guidance and focused tests. | Done | `ev:T-0454:10fe55713fac48b2907d76b6`, `ev:T-0454:0287e6d080ec411880afc44b` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Each validation-run evidence record gets a stable `validation-check:<key>` tag and the report exposes attempt metadata. | Yes | Met | `ev:T-0454:10fe55713fac48b2907d76b6` | Required | `src/services/validation-run.ts` |
| AC-2 | A later passed attempt for the same check automatically resolves earlier unresolved failed or blocked attempts. | Yes | Met | `ev:T-0454:385fa69b38dc4641839a69bb` resolves `ev:T-0454:f3a4b2dfcbdd44b39c90d9f6` | Required | `tasks/T-0454-agent-ux-validation-attempt-auto-resolution/EVIDENCE.md` |
| AC-3 | The validation-run JSON schema, focused tests, and command registry/docs describe the new attempt model without restoring default `TASK.md` row writes. | Yes | Met | `ev:T-0454:10fe55713fac48b2907d76b6`, `ev:T-0454:0287e6d080ec411880afc44b` | Required | `src/schemas/validation-run.schema.json`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Dogfood auto-resolution probe | Failed `node -e "process.exit(2)"`, then passed `node -e "process.exit(0)"` under the same validation check. | Yes | Passed | `ev:T-0454:385fa69b38dc4641839a69bb` resolves `ev:T-0454:f3a4b2dfcbdd44b39c90d9f6` |
| Focused validation-run tests | `cd /tmp/hadara && npx vitest run tests/unit/validation-run.test.ts` | Yes | Passed | `ev:T-0454:10fe55713fac48b2907d76b6` |
| TypeScript build | `cd /tmp/hadara && npm run build` | Yes | Passed | `ev:T-0454:0287e6d080ec411880afc44b` |
| Done-level harness validation | Direct `node dist/cli/main.js harness validate --task T-0454 --level done --json` after validation-run wrapper attempts were blocked by nested spawn EPERM. | Yes | Passed | `ev:T-0454:fe8b5a505bd94cbaa6805dc4` resolves `ev:T-0454:e0c6c2bdd8184cd4a13d245e`, `ev:T-0454:f48ea70b5ca34161897c7b79` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| `src/services/validation-run.ts` | N/A | Added stable validation check keys, attempt metadata, same-check unresolved failure lookup, and auto `resolves:<id>` tags on passing retries. | Reduce manual evidence repair work after validation retries. | `ev:T-0454:385fa69b38dc4641839a69bb`, `ev:T-0454:10fe55713fac48b2907d76b6` |
| `src/schemas/validation-run.schema.json` | N/A | Added the `attempt` report object to the validation-run schema. | Keep JSON consumers aligned with the additive report field. | `ev:T-0454:0287e6d080ec411880afc44b` |
| `tests/unit/validation-run.test.ts` | N/A | Covered check-key tagging and auto-resolution of an earlier failed attempt. | Prevent regression in the repeated validation workflow. | `ev:T-0454:10fe55713fac48b2907d76b6` |
| `src/services/capability-registry.ts`, `docs/TASK_WORKFLOW_COMMANDS.md` | N/A | Documented validation-run attempt auto-resolution. | Make agent-facing command guidance match product behavior. | `ev:T-0454:0287e6d080ec411880afc44b` |
| `tasks/T-0454-agent-ux-validation-attempt-auto-resolution/*` | N/A | Completed capsule docs and evidence projection for the dogfood loop. | Prepare the capsule for finalize/audit. | `ev:T-0454:385fa69b38dc4641839a69bb` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | A read model should project latest validation attempts by check so agents do not need to inspect raw evidence records for current validation state. | Open | Next agent UX capsule |
| RF-2 | Follow-up | `validation run` reported nested `spawnSync node EPERM` and `spawnSync bash EPERM` in this sandbox while direct commands passed. The command should distinguish wrapper execution failures from child command results more clearly. | Open | `ev:T-0454:e0c6c2bdd8184cd4a13d245e`, `ev:T-0454:f48ea70b5ca34161897c7b79` |
| RF-3 | Follow-up | `evidence add-command --task T-0454 --help` recorded default evidence instead of help output. | Open | `ev:T-0454:602ec6f3079b4f3eae6c509a` |
