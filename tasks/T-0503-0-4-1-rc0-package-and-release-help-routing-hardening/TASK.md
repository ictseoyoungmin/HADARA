# T-0503 0.4.1 rc0 package and release help routing hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0503 |
| Title | 0.4.1 rc0 package and release help routing hardening |
| Status | Done |
| Created | 2026-07-07 |
| Updated | 2026-07-07 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Ensure package/release/dev smoke surfaces render command help on `--help` instead of executing dry-runs or required-argument validation before `0.4.1-rc.0` release smoke. | Follow up the T-0502 local feedback without starting publish/release mutation work. |

## Scope

| Boundary | Items |
|---|---|
| In | `package smoke --help`, `package recycle --help`, release helper command `--help` paths, `dev docker-check --help`, focused help-routing regression tests, built CLI help smokes, T-0503 evidence/finalize. |
| Out | npm publish, GitHub release, package-smoke execute, release artifact mutation, broad command-portfolio removal, unrelated command families that already have tested help handling. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define T-0503 task contract from T-0502 local feedback and current handoff state. | Done |
| 2 | Inspect package/release/dev CLI handlers and registry command ids for matching help entries. | Done |
| 3 | Add early `--help` handling before dry-run/execute/required-argument behavior for scoped handlers. | Done |
| 4 | Add focused tests proving scoped `--help` calls render help, return handled, and do not set failure exit codes or execute reports. | Done |
| 5 | Run focused tests, TypeScript build, and built CLI help smokes; record evidence. | Done |
| 6 | Update shared state docs and finalize T-0503. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara package smoke --help` and `hadara package recycle --help` render registry-backed command help instead of package reports. | Met | `ev:T-0503:d5ceb1ae861c4347bed3fb62`, `ev:T-0503:fd0b99de773b4bc28676d048` | `.hadara/local/feedback/T-0502-package-smoke-help-routing.md` |
| AC-2 | Release helper command `--help` paths in scope render command help before mutation/dry-run/required-argument behavior. | Met | `ev:T-0503:d5ceb1ae861c4347bed3fb62`, `ev:T-0503:fd0b99de773b4bc28676d048` | `src/cli/release-*.ts` |
| AC-3 | `hadara dev docker-check --help` renders command help before running any Docker/check planning. | Met | `ev:T-0503:d5ceb1ae861c4347bed3fb62`, `ev:T-0503:fd0b99de773b4bc28676d048` | `src/cli/dev.ts` |
| AC-4 | Focused tests and built CLI smokes prove the help paths return success without setting failure exit codes. | Met | `ev:T-0503:d5ceb1ae861c4347bed3fb62`, `ev:T-0503:fd0b99de773b4bc28676d048` | Tests |
| AC-5 | Validation evidence is recorded and the task closes `closed-valid`. | Met | `ev:T-0503:39e5f4d5a3fe4811ba7b7bb3`, `ev:T-0503:673dd9cf6ae841a5bf6cfd32` | T-0503 |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused help-routing tests | Yes | Passed | `ev:T-0503:d5ceb1ae861c4347bed3fb62` |
| TypeScript build | Yes | Passed | `ev:T-0503:d5ceb1ae861c4347bed3fb62` |
| Built CLI help smokes | Yes | Passed | `ev:T-0503:fd0b99de773b4bc28676d048` |
| Harness validate T-0503 | Yes | Passed | `ev:T-0503:39e5f4d5a3fe4811ba7b7bb3` |
| Harness validate T-0503 final | Yes | Passed | `ev:T-0503:673dd9cf6ae841a5bf6cfd32` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/local/feedback/T-0502-package-smoke-help-routing.md` | reference | approved | Local-only feedback describing package smoke `--help` dry-run behavior. |
| `src/cli/package-smoke.ts` | reference | approved | Package smoke/recycle handler currently lacks early help routing. |
| `src/cli/release-*.ts` | reference | approved | Release helper handlers should not mutate or require args when help is requested. |
| `src/cli/dev.ts` | reference | approved | Dev docker-check handler should render help before planning/execution. |
| `src/services/capability-registry.ts` | reference | approved | Registry-backed help source for command ids. |

## Changes

| Area | Summary |
|---|---|
| Help routing | Added early `--help` routing for `package smoke`, `package recycle`, `dev docker-check`, `release dry-run`, `release closeout`, `release publish`, `release artifact`, and `release gate`. |
| Tests | Expanded `cli-help-routing` regression coverage and ran package/release/dev adjacent focused tests plus TypeScript build. |
| Docs/state | Updated `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/TASK_BOARD.md`, and this capsule for T-0503 close. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full central help routing across every command family may still be useful after this scoped release-smoke fix. | Open | T-0502 feedback |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-07 | Draft | Initial task scaffold. |
| 2026-07-07 | In Progress | Scoped to package/release/dev help routing before rc0 release smoke. |
| 2026-07-07 | In Progress | Implemented scoped help routing and recorded focused tests/build plus built CLI help smoke evidence. |
| 2026-07-07 | Done | Shared state docs updated and task prepared for finalize. |
