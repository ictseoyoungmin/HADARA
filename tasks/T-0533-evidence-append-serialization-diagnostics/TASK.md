# T-0533 evidence append serialization diagnostics

## Identity

| Field | Value |
|---|---|
| ID | T-0533 |
| Title | evidence append serialization diagnostics |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Surface evidence append lock waits in CLI responses and docs. | Feedback from T-0532 showed parallel evidence writes can happen accidentally even though protocol requires serialization. Keep canonical evidence unchanged while making lock contention visible. |

## Scope

| Boundary | Items |
|---|---|
| In | `appendEvidenceWithResult` append-lock diagnostics, `validation run` and `evidence add-command` JSON/text surfacing, workflow/init docs, focused tests. |
| Out | Changing evidence record fingerprints, replacing the lock implementation, background queues, or allowing parallel same-task evidence writes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract from T-0532 serialization feedback. | Done |
| 2 | Add append-lock diagnostics without persisting them into canonical evidence records. | Done |
| 3 | Surface diagnostics in validation/evidence CLI responses and docs/templates. | Done |
| 4 | Validate focused tests, build, Docker sync-build, and record evidence serially. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Evidence append responses expose task-scoped lock diagnostics (`path`, `waitedMs`, `contended`, `timeoutMs`) without adding those diagnostics to persisted evidence records. | Met | ev:T-0533:32a794348e834d1fbec93bb8 | `.hadara/local/feedback/T-0532-evidence-append-serialization.md` |
| AC-2 | `validation run` and `evidence add-command` JSON/text surfaces document or print append-lock waits where relevant. | Met | ev:T-0533:32a794348e834d1fbec93bb8 | `docs/TASK_WORKFLOW_COMMANDS.md` |
| AC-3 | Root workflow docs and generated init templates warn operators not to parallelize evidence append writes and explain `evidence.appendLock`. | Met | ev:T-0533:32a794348e834d1fbec93bb8 | `src/init/templates.ts` |
| AC-4 | Validation evidence is recorded serially for this capsule. | Met | ev:T-0533:98cc1f9ad1d84b8c8ff7f6a0, ev:T-0533:32a794348e834d1fbec93bb8, ev:T-0533:ad3a9be3436e4e16941e3365 | `docs/TASK_WORKFLOW_COMMANDS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused evidence/validation tests | Yes | Passed | ev:T-0533:32a794348e834d1fbec93bb8 |
| TypeScript build | Yes | Passed | ev:T-0533:98cc1f9ad1d84b8c8ff7f6a0 |
| Docker sync-build | Yes | Passed | ev:T-0533:ad3a9be3436e4e16941e3365 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/local/feedback/T-0532-evidence-append-serialization.md` | reference | active | Local feedback from prior capsule; not a commit artifact. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Serialization rule authority. |

## Changes

| Area | Summary |
|---|---|
| Evidence writer | `appendEvidenceWithResult` now returns response-only `appendLock` diagnostics while keeping persisted evidence records unchanged. |
| CLI JSON/text | `evidence add-command` and `validation run` expose append-lock diagnostics in JSON; text output prints lock waits only when contention occurred. |
| Workflow docs/templates | Root workflow/JSON contract docs and generated init templates now warn that same-task evidence appends must be serialized and point to `evidence.appendLock`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Lock diagnostics must remain response metadata only; persisting it would churn evidence fingerprints. | Mitigated | `tests/unit/evidence-json.test.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Implementing append-lock diagnostics from T-0532 feedback. |
| 2026-07-08 | Ready | Focused tests, build, Docker sync-build, and serial evidence recording completed. |
