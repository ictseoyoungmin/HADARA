# T-0685 Stable Readiness Review

## Identity

| Field | Value |
|---|---|
| ID | T-0685 |
| Title | Stable Readiness Review |
| Status | Done |
| Created | 2026-07-22T21:40 |
| Updated | 2026-07-22T22:00 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0685 --json`.

## Goal

| Goal | Notes |
|---|---|
| Fix the reviewer-identified task-selection precedence regression and record stable-readiness implications. | Keep this to active/open task selection, stale handoff guarding, and the narrow release gate diagnostic found during review; do not start rc.2 release readiness or publish work. |

## Scope

| Boundary | Items |
|---|---|
| In | Task selection precedence, selected-task ingress behavior, release gate readiness marker compatibility, docs currentness, and focused validation. |
| Out | npm publish, GitHub Release mutation, version bumping, release artifact regeneration, broad Phase D implementation, and historical capsule rewrites. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Run bounded readiness diagnostics and inspect mismatches. | Done |
| 3 | Apply only necessary narrow fixes, or record no-change review. | Done |
| 4 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | In Progress Task Board work and valid current-state activeTask beat stale project handoff/continuation guidance. | Done | `ev:T-0685:d5276c1ecdff40d0bd97aef4`; `ev:T-0685:8a93bab213ea414f86d75bd6` | `src/task/task-selection.ts`; `tests/unit/task-selection.test.ts`; `tests/unit/task-selection-continuation.test.ts` |
| AC-2 | Public task-selection precedence metadata matches the implemented order. | Done | `ev:T-0685:d5276c1ecdff40d0bd97aef4` | `src/services/task-selection-status-v2.ts`; `tests/unit/task-workbench.test.ts` |
| AC-3 | Strict release gate accepts the current explicit clean-source/journal/attach release artifact evidence flow. | Done | `ev:T-0685:0c78ad4adc5a4b25ba7a5f8d` | `src/services/operational-debt.ts`; `tests/unit/operational-debt.test.ts` |
| AC-4 | Validation evidence is recorded and the known release dry-run freshness failure is analyzed rather than hidden. | Done | `ev:T-0685:404504aac0304899abc2f9c6`; `ev:T-0685:ae0d9bf84c404730a778601d` | `tasks/T-0685-stable-readiness-review/evidence.jsonl`; `docs/RELEASE_READINESS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npx vitest run tests/unit/task-selection.test.ts tests/unit/task-selection-continuation.test.ts tests/unit/task-workbench.test.ts tests/unit/operational-debt.test.ts` | Yes | Passed | `ev:T-0685:d5276c1ecdff40d0bd97aef4` |
| `npm run build` | Yes | Passed | `ev:T-0685:a316ebac7a1a4c3ab1874d8d` |
| `node dist/cli/main.js task status --json` | Yes | Passed | `ev:T-0685:8a93bab213ea414f86d75bd6` |
| `node dist/cli/main.js release gate --mode strict --json` | Yes | Passed | `ev:T-0685:0c78ad4adc5a4b25ba7a5f8d` |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | `ev:T-0685:ae0d9bf84c404730a778601d` |
| `npx vitest ... current-state-docs && git diff --check` | Yes | Passed | `ev:T-0685:d027a4b78aca492bb84fb7e3` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | reference | active | Session-required context anchor. |
| `docs/PROJECT_STATE.md` | reference | active | Current release, active task, known problems, validation baseline. |
| `docs/AGENT_HANDOFF.md` | reference | active | Compact current handoff and continuation guidance. |
| `docs/TASK_BOARD.md` | reference | active | Task queue and capsule status. |
| `docs/HADARA_WORKFLOW.md` | reference | active | Status-first task loop and release validation routing. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Close/evidence/status semantics. |
| `docs/DEVELOPMENT_SLICES.md` | reference | active | Slice ordering and completed-slice evidence. |
| `docs/RELEASE_NOTES.md` | reference | active | Planned rc.2 scope and current rc.1 release notes. |
| `docs/RELEASE_READINESS.md` | reference | active | Current release-readiness baseline and release boundaries. |
| Reviewer feedback attachment | constraint | active | Identified stale handoff precedence as the required P0 fix for this capsule. |

## Changes

| Area | Summary |
|---|---|
| Task selection | Reordered selection so In Progress Task Board rows, cross-checked current-state activeTask, and existing open Task Board rows beat development slices, project handoff, structured nextWork, continuation, and first-task fallback. |
| Status metadata | Updated task-selection status v2 precedence descriptions to match the implemented order. |
| Release gate | Allowed the strict gate's CI/release workflow decision marker to accept the current clean-source/journal/attach artifact evidence flow as well as the legacy `dist-release` example. |
| Current-state docs | Restored current-state managed projection headings/metadata to the built generator's compatibility checkpoint wording after task-create drift. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | HEAD-level three-profile fresh-session dogfood remains needed before rc.2/stable readiness promotion. | Open | `docs/AGENT_HANDOFF.md` |
| RF-2 | Follow-up | Release dry-run still correctly blocks on current-commit release artifact freshness; refresh artifacts only in a dedicated release-readiness capsule. | Open | `docs/RELEASE_READINESS.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-22 | Draft | Initial task scaffold. |
| 2026-07-22 | Done | Fixed active/open task precedence over stale handoff, updated release gate marker compatibility, and recorded validation evidence. |
