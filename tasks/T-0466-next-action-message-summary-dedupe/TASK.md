# T-0466 Next action message summary dedupe

## Identity

| Field | Value |
|---|---|
| ID | T-0466 |
| Title | Next action message summary dedupe |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/core/next-action.ts | reference | approved | implemented | sha256:c28d5e57cfe34c20ff1f01194eae907c5a7786b572dd03b32c1aa3fafe7ffd2f | Base next-action contract uses `summary`, not `message`. |
| src/task/lifecycle-next-actions.ts | implementation-source | approved | implemented | sha256:9939b897a853fd5ca00d77ebcaccb6d52cc5eae427828d9ce1dda634c2b7d6ac | Shared lifecycle next-action helper. |
| src/task/task-close.ts | implementation-source | approved | implemented | sha256:2db509ff5a118ba3da455526c084cf4de4d41a6580ee28dc03793ab3197ef469 | Close execute next-action construction. |
| src/services/workbench-next-actions.ts | implementation-source | approved | implemented | sha256:9cf8baa62ddbbef3ded0328fdebe51b639b80fe18a58c6f876c30c5724781ea1 | Workbench conversion keeps UX `message` using lifecycle `summary` as fallback. |
| src/schemas/next-action.schema.json | reference | approved | implemented | sha256:03d27616192fc9aa157c9c8733fb0a96503d23cbde7f642ae891ee02cca4053b | Schema check: canonical next-action requires `summary`, not `message`. |
| src/schemas/task-finalize.schema.json | reference | approved | implemented | sha256:75a7b3c1d42b4efaf69438ae2d891fdfb9d27ccb7f3646ca7adb4c745538573a | Schema check: lifecycle next actions are permissive and do not require `message`. |
| src/schemas/task-status.schema.json | reference | approved | implemented | sha256:7e1b7a89848142505dd1b87244f216d531846f4e64cc7d8b12239751f9229aae | Reviewed as separate workbench-style guidance contract, not duplicate lifecycle output. |
| src/schemas/task-workbench.schema.json | reference | approved | implemented | sha256:2a214ee7eec6cda951ce7a23c9680b77a3d24fd08e1b9887207c96984efc0429 | Reviewed as separate UX contract that intentionally uses `message`. |

## Goal

| Goal | Notes |
|---|---|
| Remove redundant `message` output from lifecycle next actions when it duplicates `summary`. | Keep schema churn minimal; preserve separate workbench/status UX messages where they are not duplicate lifecycle fields. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Locate the root duplication point and review adjacent next-action schemas for true duplicate contracts. | Done | Source Documents |
| 2 | Make lifecycle next-action helper emit `summary` only and route manual close execute actions through the helper. | Done | `ev:T-0466:014bbcd28b074852b9d85fdf` |
| 3 | Preserve workbench UX `message` by falling back to lifecycle `summary` during conversion. | Done | `ev:T-0466:4f9f3002cd4444c4a454d6d3` |
| 4 | Validate focused lifecycle/read-model tests, build, and CLI JSON smoke. | Done | `ev:T-0466:a4416987992f42febb201e3c`, `ev:T-0466:4f9f3002cd4444c4a454d6d3`, `ev:T-0466:014bbcd28b074852b9d85fdf` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Lifecycle `primaryNextAction` / `nextActions` carry actionable text in `summary` without redundant duplicate `message`. | Yes | Met | `ev:T-0466:014bbcd28b074852b9d85fdf` | Required | `src/task/lifecycle-next-actions.ts` |
| AC-2 | Close execute next actions use the same lifecycle helper instead of manual `message`/`summary` duplicate objects. | Yes | Met | `ev:T-0466:a4416987992f42febb201e3c` | Required | `src/task/task-close.ts` |
| AC-3 | Workbench/status UX contracts are reviewed and only non-duplicate `message` surfaces are preserved. | Yes | Met | `ev:T-0466:4f9f3002cd4444c4a454d6d3` | Required | `src/services/workbench-next-actions.ts`, schema review |
| AC-4 | Residual unrelated failing test is classified as follow-up and does not block this dedupe acceptance. | Yes | Met | `ev:T-0466:a5cdbfddcf1f470887af9188`, `ev:T-0466:35bccc2385c34ee7be1e8d1d` | Accepted Risk | RF-1 |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused lifecycle next-action tests | `npx vitest run tests/unit/task-finalize.test.ts tests/unit/task-close.test.ts tests/unit/task-finish.test.ts tests/unit/task-ready.test.ts tests/unit/task-lifecycle.test.ts tests/unit/task-complete-flow.test.ts tests/unit/schema-fixtures.test.ts` in `hadara-dev` Docker | Yes | Passed | `ev:T-0466:a4416987992f42febb201e3c` |
| Build | `npm run build` in `hadara-dev` Docker | Yes | Passed | `ev:T-0466:4f9f3002cd4444c4a454d6d3` |
| CLI smoke | `node dist/cli/main.js task finalize --task T-0466 --json` | Yes | Passed | `ev:T-0466:014bbcd28b074852b9d85fdf` |
| Adjacent repair-plan test check | `npx vitest run tests/unit/task-close-repair-plan.test.ts` in `hadara-dev` Docker | No | Blocked | `ev:T-0466:a5cdbfddcf1f470887af9188`, `ev:T-0466:35bccc2385c34ee7be1e8d1d` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| `src/task/lifecycle-next-actions.ts` | L4-L36 | Made `message` deprecated/optional and stopped emitting it from the shared helper. | `summary` is the canonical next-action text; duplicated `message` inflated JSON and confused consumers. | `ev:T-0466:014bbcd28b074852b9d85fdf` |
| `src/task/task-close.ts` | L245-L310 | Converted close execute next-action literals to the lifecycle helper. | Remove manual `message`/`summary` duplicate objects and keep close output consistent. | `ev:T-0466:a4416987992f42febb201e3c` |
| `src/services/workbench-next-actions.ts` | L172-L196 | Converted lifecycle action text into workbench `message` with `action.message ?? action.summary`. | Preserve intentional workbench UX schema while accepting compressed lifecycle actions. | `ev:T-0466:4f9f3002cd4444c4a454d6d3` |
| `tests/unit/task-finalize.test.ts` | L54-L79, L133-L140 | Assert finalize next actions expose `summary` and omit redundant `message`. | Regression coverage for the primary complained-about output. | `ev:T-0466:a4416987992f42febb201e3c` |
| `tests/unit/task-close.test.ts` | L101-L111, L175-L177 | Assert close next actions omit redundant `message`. | Regression coverage for direct close read models. | `ev:T-0466:a4416987992f42febb201e3c` |
| `dist/` | N/A | Refreshed built CLI output from Docker build. | Keep workspace CLI current after TypeScript changes. | `ev:T-0466:4f9f3002cd4444c4a454d6d3` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | `tests/unit/task-close-repair-plan.test.ts` currently fails on close-source hash classification expectations unrelated to next-action dedupe. | Open | `ev:T-0466:a5cdbfddcf1f470887af9188`, `ev:T-0466:35bccc2385c34ee7be1e8d1d` |
