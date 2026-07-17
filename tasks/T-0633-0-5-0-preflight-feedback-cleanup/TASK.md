# T-0633 0.5.0 preflight feedback cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0633 |
| Title | 0.5.0 preflight feedback cleanup |
| Status | Done |
| Created | 2026-07-17 |
| Updated | 2026-07-17 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0633 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Remove 0.5.0 preflight UX friction that would confuse status/close work. | Address four local feedback themes before the 0.5.0 status ingress implementation: evidence projection lint drift, validation baseline wording, token alias diagnostics, and no-bin-links entrypoint guidance. |

## Scope

| Boundary | Items |
|---|---|
| In | Evidence projection/lint count consistency; current trusted validation baseline wording checks; CLI-only category/source token aliases and structured alias diagnostics; generated workflow no-bin-links/direct-entrypoint guidance. |
| Out | 0.5.0 status v2 implementation; task close transaction implementation; broad command portfolio changes; release publishing. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract from local feedback. | Done |
| 2 | Fix evidence projection/lint row-count drift. | Done |
| 3 | Clarify validation baseline semantics in status-facing docs/tests. | Done |
| 4 | Add safe CLI aliases and structured alias diagnostics for common token friction. | Done |
| 5 | Improve generated no-bin-links/direct-entrypoint guidance. | Done |
| 6 | Validate focused behavior and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Evidence projection escapes multiline summaries and lint compares against generated projection semantics without false count drift. | Done | ev:T-0633:3b4f78b1a7304526a897d9c1, ev:T-0633:9759a13b5d804a32a5c7b5b7 | `.hadara/local/feedback/T-0632-evidence-projection-count-drift.md` |
| AC-2 | Current-state validation baseline remains documented as the current trusted validation baseline, not necessarily latest-task evidence. | Done | ev:T-0633:3b4f78b1a7304526a897d9c1 | `.hadara/state/current.json`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` |
| AC-3 | Common CLI-only aliases are accepted or reported with structured aliases while persisted schema values remain canonical. | Done | ev:T-0633:3b4f78b1a7304526a897d9c1 | `.hadara/local/feedback/T-0631-evidence-category-diagnostic-token.md`, `.hadara/local/feedback/T-0628-delegated-dogfood-residuals.md` |
| AC-4 | Generated workflow docs include copyable no-bin-links/direct-entrypoint fallback guidance for global and project-local installs. | Done | ev:T-0633:3b4f78b1a7304526a897d9c1 | `.hadara/local/feedback/T-0623-rc1-delegated-dogfood-findings.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused preflight feedback cleanup tests | Yes | Passed | ev:T-0633:3b4f78b1a7304526a897d9c1 |
| TypeScript build | Yes | Passed | ev:T-0633:7c3110f878b24b36b8ea555c |
| Built CLI T-0632 evidence lint smoke | Yes | Passed | ev:T-0633:9759a13b5d804a32a5c7b5b7 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| .hadara/local/feedback/T-0632-evidence-projection-count-drift.md | implementation-source | active | Evidence lint/projection mismatch to remove before 0.5.0. |
| .hadara/local/feedback/T-0631-evidence-category-diagnostic-token.md | implementation-source | active | Evidence category alias friction. |
| .hadara/local/feedback/T-0628-delegated-dogfood-residuals.md | implementation-source | active | Token aliases, validation baseline wording, python command ambiguity. |
| .hadara/local/feedback/T-0623-rc1-delegated-dogfood-findings.md | implementation-source | active | no-bin-links/direct-entrypoint and generated docs findings. |

## Changes

| Area | Summary |
|---|---|
| Evidence projection/lint | Escaped multiline projection summaries and exposed projected/omitted row counts so lint no longer compares broken markdown rows against raw JSONL records. |
| Controlled vocabulary | Added CLI-only diagnostic/diagnostics evidence category aliases to operation, source role aliases for current-state canon, source state aliases such as planned/done, and schema/harness alias diagnostics. |
| Generated workflow docs | Kept generated no-bin-links fallback package-manager-neutral while adding project-local direct-entrypoint guidance. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Python command ambiguity from T-0628 is adjacent validation-wrapper UX and remains outside this focused preflight cleanup unless touched by tests. | Deferred | `.hadara/local/feedback/T-0628-delegated-dogfood-residuals.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-17 | Draft | Initial task scaffold. |
| 2026-07-17 | In Progress | Started 0.5.0 preflight cleanup for four local feedback themes. |
| 2026-07-17 | Done | Implemented feedback cleanup and recorded focused tests, build, and T-0632 lint smoke evidence. |
