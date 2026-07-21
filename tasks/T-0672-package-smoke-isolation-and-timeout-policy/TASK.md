# T-0672 Package Smoke Isolation and Timeout Policy

## Identity

| Field | Value |
|---|---|
| ID | T-0672 |
| Title | Package Smoke Isolation and Timeout Policy |
| Status | Done |
| Created | 2026-07-21T22:23 |
| Updated | 2026-07-21T22:32 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0672 --json`.

## Goal

| Goal | Notes |
|---|---|
| Package smoke and recycle installed smokes behave like isolated consumer projects with explicit timeout attribution. | Reports must show the disposable smoke project root, use per-step timeout policy, and identify the timed-out step instead of surfacing an opaque whole-command timeout. |

## Scope

| Boundary | Items |
|---|---|
| In | npm package smoke/recycle timeout defaults, timeoutPolicy report/schema/docs/tests, built CLI dry-run proof, current known-problem wording. |
| Out | pnpm/yarn/bun support, full package-manager abstraction, package smoke performance rewrite, release runbook sequencing. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define installed-smoke isolation and timeout policy requirements. | Done |
| 2 | Add per-step timeoutPolicy reports and 300s npm/recycle defaults. | Done |
| 3 | Update schemas, CLI JSON contract, release readiness docs, and known-problem projections. | Done |
| 4 | Validate focused tests, build/docs, Docker sync-build, and built CLI dry-runs. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Installed smoke reports show default disposable smokeProjectRoot distinct from sourceRoot. | Done | ev:T-0672:01a2b71bdd444da29c6ddfc6 | `rootRoles.smokeProjectRoot` |
| AC-2 | Installed CLI/package version checks remain required before package recycle passes. | Done | ev:T-0672:d91afa2b9eda4e8da7aab1c6 | `tests/unit/package-recycle.test.ts` |
| AC-3 | Timeout reports identify the slow step rather than only a whole package-smoke timeout. | Done | ev:T-0672:d91afa2b9eda4e8da7aab1c6, ev:T-0672:01a2b71bdd444da29c6ddfc6 | `timeoutPolicy.timeoutStepIds` |
| AC-4 | HADARA-dev source workspace is not used as the installed smoke project. | Done | ev:T-0672:01a2b71bdd444da29c6ddfc6 | `smokeProjectRoot` default disposable path |
| AC-5 | Release smoke timeout policy is documented as per-step 300s default for npm package smoke/recycle. | Done | ev:T-0672:deda156e8b0c44e7bafcf395 | `docs/CLI_JSON_CONTRACT.md`, `docs/RELEASE_READINESS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run test:focused -- tests/unit/package-smoke-dry-run.test.ts tests/unit/package-recycle.test.ts tests/unit/schema-runtime.test.ts` | Yes | Passed | ev:T-0672:d91afa2b9eda4e8da7aab1c6 |
| `npm run build` and `hadara docs doctor --scope all --json` | Yes | Passed | ev:T-0672:deda156e8b0c44e7bafcf395 |
| `npm run dev:docker-sync-build` | Yes | Passed | ev:T-0672:a70865369ec34f1bb4d69b76 |
| Built CLI package smoke/recycle dry-run reports | Yes | Passed | ev:T-0672:01a2b71bdd444da29c6ddfc6 |
| `hadara task close --task T-0672 --json` | Yes | Not Applicable | Proof-last close evidence is appended by the close transaction after validation. |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer release recycle plan | reference | active | Defines T-0672 isolation and timeout policy requirements. |
| T-0670 root separation contract | background | active | Source/evidence/smoke project root roles are prerequisite implementation. |
| `docs/CLI_JSON_CONTRACT.md` | constraint | active | Public JSON contract must describe timeoutPolicy and root-role outputs. |

## Changes

| Area | Summary |
|---|---|
| Package smoke | npm package smoke default timeout is 300s per subprocess step; report includes timeoutPolicy and timeoutStepIds. |
| Package recycle | installed-package recycle default timeout is 300s per subprocess step; report includes timeoutPolicy and timeoutStepIds. |
| Schemas/docs | Added timeoutPolicy to package smoke/recycle schemas and documented 300s per-step release timeout policy. |
| State docs | Updated current known-problem wording to reflect isolated smokeProjectRoot and timeoutStepIds mitigation. |
| Tests | Added timeoutPolicy and timeoutStepIds regression checks. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Deterministic release recycle runbook remains separate. | Open | T-0673 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-21 | Draft | Initial task scaffold. |
| 2026-07-21 | Done | Package smoke isolation and timeout policy is implemented, validated, and ready for proof-last close. |
