# T-0735 Close plan final contract cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0735 |
| Title | Close plan final contract cleanup |
| Status | Done |
| Created | 2026-07-29T17:51 |
| Updated | 2026-07-29T18:15 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Finalize the task-close public contract after reviewer feedback. | Remove the remaining independent guarded-write report identity, require proof append guards on transaction write paths, fix proof-last workflow wording, and return structured fail-closed reports for the remaining proof-boundary task-missing race. |

## Scope

| Boundary | Items |
|---|---|
| In | `task close` plan/report/runtime contract cleanup for guarded writes, proof append guard API, proof-last documentation, and structured proof-boundary failures. |
| Out | New agent UX surfaces, broad lifecycle redesign, release publication, installed abrupt-kill dogfood, and unrelated dashboard/TUI/provider work. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Inspect current close plan/evidence modules and tests. | Done |
| 3 | Implement the reviewer residual fixes. | Done |
| 4 | Validate and record evidence. | Done |
| 5 | Finalize close-source docs and run `task close`. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Close plans own a plain guarded write set directly, without an independent guarded-write report schema/command/status/formatter identity. | Done | ev:T-0735:30fc1bfebae64ab1bfe98117 | Reviewer residual P1-1 |
| AC-2 | Transactional proof append cannot be reached through a public unguarded writer; proof append guard is required on write-capable close paths. | Done | ev:T-0735:30fc1bfebae64ab1bfe98117 | Reviewer residual P2-1 |
| AC-3 | Workflow documentation describes proof-last runtime ordering: guarded writes, actual filesystem revalidation, readiness evidence, close proof, audit. | Done | ev:T-0735:30fc1bfebae64ab1bfe98117 | Reviewer residual P1-2 |
| AC-4 | Task Capsule disappearance at proof-boundary is reported as a structured fail-closed close issue instead of a raw exception. | Done | ev:T-0735:30fc1bfebae64ab1bfe98117 | Reviewer residual P2-2 |
| AC-5 | Validation evidence is recorded and the task closes to `closed-valid`. | Done | ev:T-0735:852d15f5dced4175ae26d31a | `docs/TASK_WORKFLOW_COMMANDS.md` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| TypeScript no-emit | Yes | Passed | npx tsc --noEmit passed after close-plan contract changes. | ev:T-0735:1b19c42e4e9f4ddd9e9936fd |
| Full project check | Yes | Passed | Final npm run check passed after docs/task updates: build, tools typecheck, public 136 files / 1092 tests, HADARA-dev 16 files / 134 tests. | ev:T-0735:852d15f5dced4175ae26d31a |
| Focused task-close contract tests | Yes | Passed | npx vitest run tests/unit/task-close.test.ts tests/unit/task-close-source.test.ts tests/unit/command-registry.test.ts tests/unit/task-workflow-docs.test.ts pass | ev:T-0735:30fc1bfebae64ab1bfe98117 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `/home/ymin/.codex/attachments/89b70d63-481e-4168-bc85-ac05230021eb/pasted-text.txt` | reference | active | Final residual close-contract review. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Proof-last task close wording and write boundary semantics. |
| `src/task/close/*` | implementation-source | active | Close transaction planning, guarded writes, evidence append, recovery, and reporting. |
| `tests/**/*task*close*` | implementation-source | active | Focused regression coverage for close transaction contract. |

## Changes

| Area | Summary |
|---|---|
| Close plan contract | Public close-plan reports now expose direct `writes` and `writeSetHash`; the old guarded-write schema/command/status/formatter identity is removed. |
| Proof append guard | Proof append uses `executeGuardedTaskCloseEvidence` with a required marker guard, and direct close-plan execute without that guard fails closed. |
| Proof-boundary failures | Missing task capsules during readiness/proof append are converted to structured `TASK_CLOSE_PROOF_APPEND_TASK_MISSING` issues. |
| Hash semantics | Operation `closeBasisHash` is separated from final source hash; source drift is checked through the operation's final-source field. |
| Workflow docs | `TASK_WORKFLOW_COMMANDS.md` and init templates now describe proof-last ordering. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Close transaction code is heavily interconnected; focused regressions and full check passed after the narrow cleanup. | Mitigated | ev:T-0735:30fc1bfebae64ab1bfe98117 |

## Close Summary

Final task-close contract cleanup removed the remaining independent guarded-write report identity from public close plans, required guarded proof append through the transaction marker, converted the proof-boundary task-missing race to a structured fail-closed issue, separated operation basis and final source hash semantics, and corrected proof-last workflow wording.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-29 | Draft | Initial task scaffold. |
| 2026-07-29 | In Progress | Scoped final task-close contract cleanup from reviewer residuals. |
| 2026-07-29 | Done | Implemented final task-close contract cleanup and recorded focused/typecheck/full validation evidence. |
