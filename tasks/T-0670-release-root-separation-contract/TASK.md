# T-0670 Release root separation contract

## Identity

| Field | Value |
|---|---|
| ID | T-0670 |
| Title | Release root separation contract |
| Status | Done |
| Created | 2026-07-21T21:50 |
| Updated | 2026-07-21T22:10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0670 --json`.

## Goal

| Goal | Notes |
|---|---|
| Release package validation separates source, evidence, and installed-smoke roots. | `smoke package` and `package recycle` must stop treating the source checkout as the implicit installed consumer project, while preserving compatible single-root usage with an explicit warning. |

## Scope

| Boundary | Items |
|---|---|
| In | `smoke package` and `package recycle` CLI options, reports, schemas, command registry/help contract, tests, release-readiness docs. |
| Out | Publishing, GitHub Release mutation, package timeout policy, artifact journal redesign, continuation baseline promotion. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define sourceRoot/evidenceRoot/smokeProjectRoot contract for release package commands. | Done |
| 2 | Implement CLI option wiring, report rootRoles, isolated smoke project execution, and evidence-root attachment. | Done |
| 3 | Update schemas, registry/docs, and tests for the public contract. | Done |
| 4 | Validate with focused tests, full check, Docker build/dist refresh, and built CLI smoke reports. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `smoke package` and `package recycle` reports expose `rootRoles.sourceRoot`, `rootRoles.evidenceRoot`, and `rootRoles.smokeProjectRoot`. | Done | ev:T-0670:455c6f9b9c8a4ca986844853, ev:T-0670:a0db4de46a804dacac1d6aab | `src/services/package-smoke.ts`, `src/services/package-recycle.ts` |
| AC-2 | Installed package smokes run in disposable `smokeProjectRoot` and do not inherit source `HADARA_PROJECT_ROOT`. | Done | ev:T-0670:455c6f9b9c8a4ca986844853 | `tests/unit/package-smoke-dry-run.test.ts`, `src/services/package-recycle.ts` |
| AC-3 | Evidence attachment uses `evidenceRoot`, not the installed smoke project root. | Done | ev:T-0670:455c6f9b9c8a4ca986844853 | `src/services/package-smoke.ts`, `src/services/package-recycle.ts` |
| AC-4 | Compatible single-root `--project` usage remains supported and reports a migration warning. | Done | ev:T-0670:455c6f9b9c8a4ca986844853 | `PACKAGE_SMOKE_PROJECT_ALIAS_ROOTS`, `PACKAGE_RECYCLE_PROJECT_ALIAS_ROOTS` |
| AC-5 | Public command registry, JSON schemas, CLI JSON contract, and release readiness docs describe the separated root roles. | Done | ev:T-0670:455c6f9b9c8a4ca986844853, ev:T-0670:e2ca46f628b54ac588f271ab | `src/services/capability-registry.ts`, `src/schemas/*.schema.json`, `docs/CLI_JSON_CONTRACT.md`, `docs/RELEASE_READINESS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run test:focused -- tests/unit/package-smoke-dry-run.test.ts tests/unit/package-recycle.test.ts tests/unit/schema-runtime.test.ts` | Yes | Passed | ev:T-0670:455c6f9b9c8a4ca986844853 |
| `npm run check` | Yes | Passed | ev:T-0670:fb096f77aeb147cba489741a; approved external rerun after sandbox `git init` EPERM |
| `npm run dev:docker-sync-build` | Yes | Passed | ev:T-0670:9912888711ee486e8844c6c0 |
| Built CLI root-role smoke reports | Yes | Passed | ev:T-0670:a0db4de46a804dacac1d6aab |
| `hadara docs doctor --scope all --json` | Yes | Passed | ev:T-0670:e2ca46f628b54ac588f271ab |
| `hadara task close --task T-0670 --json` | Yes | Not Applicable | Proof-last close evidence is appended by the close transaction after validation. |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer release recycle plan | reference | active | T-0670 fixes release root ambiguity before remaining release-readiness recycle design capsules. |
| T-0667/T-0668/T-0669 release evidence | background | active | RC1 publish/recycle exposed that release capsule commands must separate source, evidence, and consumer roots. |
| `docs/CLI_JSON_CONTRACT.md` | constraint | active | Public JSON response contract must not drift from emitted reports. |

## Changes

| Area | Summary |
|---|---|
| CLI routing | Added `--source-root`, `--evidence-root`, and `--smoke-project-root` option wiring for `smoke package` and `package recycle`. |
| Package smoke | Packs from sourceRoot, attaches evidence to evidenceRoot, executes installed smoke inside smokeProjectRoot, exposes rootRoles, and strips source `HADARA_PROJECT_ROOT` from installed subprocesses. |
| Package recycle | Runs installed consumer smokes inside smokeProjectRoot, attaches evidence to evidenceRoot, exposes rootRoles, and warns when legacy `--project` aliases source/evidence roots. |
| Contracts/docs | Updated command registry, JSON schemas, CLI JSON contract, and release readiness guidance. |
| Tests | Added/updated root-role and environment-leak coverage for package smoke/recycle reports. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Package timeout policy and release recycle runbook remain separate reviewer capsules. | Open | T-0672, T-0673 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-21 | Draft | Initial task scaffold. |
| 2026-07-21 | In Progress | Implemented release root separation contract and began validation. |
| 2026-07-21 | In Progress | Validation passed; ready for task close proof. |
| 2026-07-21 | Done | Release root separation contract is implemented, validated, and ready for proof-last close. |
