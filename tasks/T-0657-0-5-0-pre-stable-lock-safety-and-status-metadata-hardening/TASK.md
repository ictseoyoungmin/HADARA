# T-0657 0.5.0 pre-stable lock safety and status metadata hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0657 |
| Title | 0.5.0 pre-stable lock safety and status metadata hardening |
| Status | Done |
| Created | 2026-07-18T23:42 |
| Updated | 2026-07-18T23:53 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0657 --json`.

## Goal

| Goal | Notes |
|---|---|
| Close the remaining pre-stable gaps in lock ownership safety and status action/report metadata. | Follows reviewer feedback after T-0656; keeps 0.5.0 stable promotion blocked until a fresh rc/stable readiness capsule runs after this source change. |

## Scope

| Boundary | Items |
|---|---|
| In | Task-close lock metadata race hardening, live-owner stale-lock policy, token-proven release, atomic local operation journal writes, project status init action write metadata, active-work readiness wording, and full status compact diagnostic summary. |
| Out | 0.5.0 rc/stable publish, installed-package recycle, full process-kill fault injection, heartbeat lease renewal for long-lived locks, and broad dashboard performance work. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Review post-T-0656 feedback and identify code paths for lock/status contract gaps. | Done |
| 2 | Harden task-close lock acquisition/reclaim/release and operation journal persistence. | Done |
| 3 | Correct project status v2 action metadata, active-work readiness, and full diagnostic summaries. | Done |
| 4 | Add regression tests and run focused/full validation plus Docker dist sync. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh metadata-gap lock directories are not immediately reclaimed, preventing a second process from deleting a lock before `lock.json` is written. | Done | `ev:T-0657:bc6071dc52804e93b3416939` | `src/task/task-close-transaction.ts`, `tests/unit/task-close.test.ts` |
| AC-2 | Live-owner locks are not reclaimed by age alone, and lock release leaves recreated/unknown-token locks in place. | Done | `ev:T-0657:bc6071dc52804e93b3416939` | `src/task/task-close-transaction.ts`, `tests/unit/task-close.test.ts` |
| AC-3 | Dead-owner or old invalid metadata locks reclaim through a quarantine/rename path. | Done | `ev:T-0657:bc6071dc52804e93b3416939` | `src/task/task-close-transaction.ts`, `tests/unit/task-close.test.ts` |
| AC-4 | Close operation journal writes use temp file, fsync, and rename rather than direct overwrite. | Done | `ev:T-0657:bc6071dc52804e93b3416939` | `src/task/task-close-transaction.ts` |
| AC-5 | `hadara init --json` status action is reported as reviewed project-state write, active-work status routes as orientation, and full status exposes debt/state/active-run/known-problem summaries plus state-consistency issues. | Done | `ev:T-0657:bc6071dc52804e93b3416939` | `src/services/project-status-v2.ts`, `tests/unit/status-json.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused status and task-close regression tests | Yes | Passed | `ev:T-0657:bc6071dc52804e93b3416939` |
| Schema/docs focused tests | Yes | Passed | `ev:T-0657:bc6071dc52804e93b3416939` |
| Full unit suite: 153 files passed, 1 skipped; 1141 tests passed, 7 skipped | Yes | Passed | `ev:T-0657:bc6071dc52804e93b3416939` |
| TypeScript build | Yes | Passed | `ev:T-0657:bc6071dc52804e93b3416939` |
| Docker sync build / dist freshness: built CLI smoke reported `distLooksStale:false` | Yes | Passed | `ev:T-0657:bc6071dc52804e93b3416939` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `/home/ymin/.codex/attachments/408692c4-7d7a-43c0-81e4-95b0cefe8bd7/pasted-text.txt` | reference | active | Reviewer feedback defining lock ownership/status metadata gaps after T-0656. |
| `src/task/task-close-transaction.ts` | implementation-source | active | Public close transaction lock and recovery state implementation. |
| `src/services/project-status-v2.ts` | implementation-source | active | Project status v2 action/readiness/source summary implementation. |
| `tests/unit/task-close.test.ts` | reference | active | Lock safety regression coverage. |
| `tests/unit/status-json.test.ts` | reference | active | Status metadata/full-detail regression coverage. |

## Changes

| Area | Summary |
|---|---|
| Task-close locks | Added acquisition grace for missing/invalid metadata, removed alive-owner age-only reclaim, quarantined stale lock removal, used exclusive metadata writes, and made release fail closed without token proof. |
| Close operation journal | Persisted operation state via temp-file/fsync/rename and best-effort directory fsync. |
| Project status v2 | Corrected `hadara init --json` write metadata, changed active-work readiness to orientation routing, and exposed full status diagnostic summaries/state-consistency issues. |
| Tests | Added regression coverage for lock races/reclaim/release and status metadata/full-detail behavior. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Publish should advance to a fresh immutable rc/stable artifact after T-0657; previous 0.5.0-rc.0 artifact is not the current source snapshot. | Open | `tasks/T-0648-0-5-0-rc-0-release-readiness-and-publish-preparation/` |
| RF-2 | Follow-up | Process-kill crash fault injection and heartbeat-based long-lived lock leases remain future hardening; current patch is fail-closed/recovery-safe without heartbeat. | Open | `src/task/task-close-transaction.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | In Progress | Implemented lock ownership and status metadata hardening. |
| 2026-07-18 | Done | Focused tests, full suite, TypeScript build, and Docker sync build passed. |
