# T-0732 Close operation reconciliation follow-up hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0732 |
| Title | Close operation reconciliation follow-up hardening |
| Status | Done |
| Created | 2026-07-28T23:39 |
| Updated | 2026-07-29T00:01 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0732 --json`.

## Goal

| Goal | Notes |
|---|---|
| Close the remaining reviewer P1/P2 gaps in `T-0731` close-operation recovery marker reconciliation. | Reviewer found that a persisted marker's write set was never checked for equality against the regenerated plan, proof-pending resume bypassed close-source drift detection, `resumable` was computed from a fallback that was almost always wrong, and several smaller hardening gaps (hash format validation, recoveredWrites reporting, durable terminal marker persist, symlink confinement) remained open. |

## Scope

| Boundary | Items |
|---|---|
| In | `reconcileCloseOperationMarker()` write-set/close-source drift ordering and gating, `resumable` computation, marker hash-format validation, `recoveredWrites` reporting, durable closed-valid marker persistence before cleanup, realpath/symlink confinement for task-local write path resolution (reconciliation and the bookkeeping write applier). |
| Out | Full legacy `bookkeeping` domain removal (RF-1 from T-0731, unchanged). Full close-basis/final-source hash field separation (RF-2 from T-0731, unchanged) — this capsule closes the safety gap with a write-set equality gate instead of adding new original/resume hash fields. The unrelated current-state projection Markdown-backtick artifact and stale continuation cleanup (separate bug in `project-current-state` projection, not part of close-operation reconciliation). |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Read T-0731 reviewer P1/P2 notes and the current `execute.ts`/`bookkeeping.ts` reconciliation implementation. | Done |
| 2 | Fix reconciliation ordering (close-source drift before proof-pending) and add a write-set equality gate so persisted vs. regenerated plans cannot silently diverge. | Done |
| 3 | Fix `resumable` computation, add hash-format validation, thread `recoveredWrites`, persist closed-valid durably before cleanup, add symlink confinement. | Done |
| 4 | Update/add regression tests (real-write prefix-partial resume, proof-pending drift bypass, write-set mismatch, resumable corrections) and validate. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Resuming a persisted close operation (`all-before`/`prefix-partial`/`all-after`) fails closed when the regenerated write set does not exactly match the persisted `writeSetHash`, instead of silently resuming with a stale plan. | Met | ev:T-0732:4afe3e28706f4ecbbaf9b939 | Reviewer P1-1/P1-4 |
| AC-2 | Proof-pending resume checks close-source drift before resuming; a close-source change after a proof-pending marker was recorded blocks the retry instead of proceeding to proof. | Met | ev:T-0732:4afe3e28706f4ecbbaf9b939 | Reviewer P1-2 |
| AC-3 | `recovery.resumable` is `false` whenever the marker/reconciliation path returned a blocking issue (malformed marker, schema-invalid marker, source drift, non-prefix/conflicting writes), and stays `true` for genuinely resumable in-progress operations. | Met | ev:T-0732:4afe3e28706f4ecbbaf9b939 | Reviewer P1-3 |
| AC-4 | Marker hash fields (`closeSourceHash`, `planHash`, `writeSetHash`, `finalSourceHash`) are validated against a `sha256:[a-f0-9]{64}` pattern at runtime, not just `typeof === 'string'`. | Met | ev:T-0732:4afe3e28706f4ecbbaf9b939 | Reviewer P2 |
| AC-5 | `recoveredWrites` reflects writes recovered via reconciliation (already-applied writes found on resume) instead of always reporting 0. | Met | ev:T-0732:4afe3e28706f4ecbbaf9b939 | Reviewer P2 |
| AC-6 | A successful close persists the closed-valid operation marker durably before the terminal marker cleanup removes it. | Met | ev:T-0732:4afe3e28706f4ecbbaf9b939 | Reviewer P2 |
| AC-7 | Task-local expected-write path resolution (reconciliation classifier and the bookkeeping write applier) is confined via realpath, not lexical `..`/absolute checks alone. | Met | ev:T-0732:4afe3e28706f4ecbbaf9b939 | Reviewer P2 |
| AC-8 | The close-source basis is computed from the virtual fully-bookkept snapshot whenever any bookkeeping write is still pending, not only when `TASK.md` itself is undone, so a genuine prefix-partial recovery cannot compute an inconsistent close-source hash between attempts. | Met | ev:T-0732:4afe3e28706f4ecbbaf9b939 | Discovered while building AC-1 regression coverage |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused task-close/schema tests (`tests/unit/task-close.test.ts`, `tests/unit/task-close-source.test.ts`, `tests/unit/schema-runtime.test.ts`, `tests/unit/schema-fixtures.test.ts`, `tests/unit/docs-registry.test.ts`) | Yes | Passed | ev:T-0732:4afe3e28706f4ecbbaf9b939 |
| TypeScript source no-emit (`./node_modules/.bin/tsc -p tsconfig.json --noEmit`) | Yes | Passed | ev:T-0732:33639c1adfba44b19d73d32b |
| Tools typecheck (`npm run typecheck:tools`) | Yes | Passed | ev:T-0732:8ac494d5883f435eba10faa8 |
| Public unit suite (`npm test`) | Yes | Passed | ev:T-0732:56f20fa21b86488093d44538 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer P1/P2 notes on T-0731 | constraint | active | Defines this capsule's acceptance. |
| `src/task/close/execute.ts`, `src/task/close/bookkeeping.ts` | implementation-source | active | Reconciliation, marker validation, and bookkeeping write confinement. |
| `docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md` | constraint | active | Normative close/recovery contract. |

## Changes

| Area | Summary |
|---|---|
| `src/task/close/execute.ts` | Write-set equality gate (compares the regenerated pending write set, not the full original, against the persisted marker) before any `all-before`/`prefix-partial`/`all-after` resume; close-source drift checked before the `proof-pending` resume branch; `resumable` is now explicit and `false` whenever the marker/reconciliation path returns a blocking issue; `recoveredWrites` threaded through attempt/mutation summaries; `closeSourceHash`/`planHash`/`writeSetHash`/`finalSourceHash` validated against a `sha256:[a-f0-9]{64}` pattern; task-local path resolution confined via `isInside` (realpath-based) instead of a lexical `..` check; closed-valid operation state is always persisted durably before terminal marker cleanup. |
| `src/task/close/bookkeeping.ts` | `applyCloseBookkeepingWrites` path confinement switched to the same realpath-based `isInside` check. |
| `src/task/close/plan.ts` | `createClosePlanReports` now uses the virtual fully-bookkept snapshot whenever any bookkeeping write is pending (matching the executor's own rule), not only when `TASK.md` itself is undone — closes an inconsistent close-source-hash gap a genuine prefix-partial recovery could hit. |
| `src/schemas/task-close-v3.schema.json` | Added the matching `sha256:[a-f0-9]{64}` pattern to `closeSourceHash`/`planHash`/`writeSetHash`/`finalSourceHash`. |
| `tests/unit/task-close.test.ts` | Replaced the fabricated-file prefix-partial test with one that resumes real bookkeeping writes and asserts final file content; added write-set-mismatch and proof-pending drift-bypass regression tests; corrected three stale `resumable: true` expectations; updated two tests whose specific issue-code assertions depended on the old inconsistent virtual/real-root behavior. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full legacy `bookkeeping` domain removal remains out of this capsule (carried from T-0731 RF-1). | Open | Reviewer P2 |
| RF-2 | Follow-up | Full close-basis/final-source hash field separation remains deferred; this capsule closes the safety gap via a write-set equality gate instead (carried from T-0731 RF-2). | Open | Reviewer P2 |
| RF-3 | Follow-up | Current-state projection Markdown-backtick path artifact and stale continuation cleanup is a separate bug outside close-operation reconciliation scope. | Open | Reviewer P2 |

## Close Summary

Closed the remaining reviewer P1/P2 gaps from T-0731: resume of a persisted close operation now fails closed unless the regenerated pending write set exactly matches the persisted one; proof-pending resume checks close-source drift before resuming instead of skipping the check; `recovery.resumable` reflects whether the marker path is actually safe to retry instead of an almost-always-true fallback; marker hash fields are pattern-validated; `recoveredWrites` is reported; a successful close durably persists its closed-valid marker before cleanup; task-local write path resolution is realpath-confined in both reconciliation and the bookkeeping write applier. Building real (non-fabricated) regression coverage for prefix-partial resume also surfaced and fixed a related bug: the close-source basis computation only used the virtual fully-bookkept snapshot when `TASK.md` itself was undone, so a prefix-partial state where `TASK.md` is already Done but another bookkeeping write is still pending computed an inconsistent close-source hash between attempts.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | In Progress | Accepted reviewer P1/P2 close-operation reconciliation follow-up as task acceptance; implemented reconciliation/marker fixes. |
| 2026-07-29 | Done | Implemented and validated close operation reconciliation follow-up hardening. |
