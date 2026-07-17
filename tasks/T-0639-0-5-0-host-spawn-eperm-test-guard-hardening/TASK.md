# T-0639 0.5.0 host spawn EPERM test guard hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0639 |
| Title | 0.5.0 host spawn EPERM test guard hardening |
| Status | Done |
| Created | 2026-07-17 |
| Updated | 2026-07-17 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0639 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Make spawn-dependent tests honest on host environments that reject child-process spawn. | Full suite should pass by skipping only tests whose premise is unavailable (`spawnSync`/`execFileSync` EPERM), while keeping source-level tests active. |

## Scope

| Boundary | Items |
|---|---|
| In | Vitest guards for context-routing e2e script tests, performance-baseline script test, dogfooding built-CLI harness test, and manual publish shell syntax test. |
| Out | Changing production spawn behavior, replacing those script tests, or modifying release scripts. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Add spawn EPERM skip guards to spawn-dependent tests. | Done |
| 3 | Validate focused failures and full check. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Tests that require child-process spawn skip only when Node/Bash spawn returns EPERM. | Done | `ev:T-0639:957ec39ba8c74c1d81de9835` | host spawn EPERM |
| AC-2 | Previously failing test files pass in this host environment. | Done | `ev:T-0639:957ec39ba8c74c1d81de9835` | focused validation |
| AC-3 | Full `npm run check` passes. | Done | `ev:T-0639:c20d29c1105a4b2cb9f78cde` | full validation |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused previously failing files | Yes | Passed | `ev:T-0639:957ec39ba8c74c1d81de9835` |
| TypeScript build | Yes | Passed | `ev:T-0639:8b357e3e4ea44a5d961fbc2b` |
| Full check | Yes | Passed | `ev:T-0639:c20d29c1105a4b2cb9f78cde` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/local/feedback/T-0601-host-full-suite-spawn-eperm.md` | reference | active | Prior host spawn EPERM class. |
| `tasks/T-0638-0-5-0-cross-profile-status-ingress-dogfood/DOGFOOD_REPORT.md` | reference | active | C06 dogfood before full-suite hardening. |

## Changes

| Area | Summary |
|---|---|
| Tests | Added environment guards around tests whose premise requires child-process spawn. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | In a normal container/CI where spawn works, these tests still execute; this host only skips the process-spawn-dependent assertions. | Open | T-0639 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-17 | Draft | Initial task scaffold. |
| 2026-07-17 | In Progress | Added host spawn EPERM guards and validated focused/full test runs. |
| 2026-07-17 | Done | Completed host spawn EPERM guard hardening and full check validation. |
