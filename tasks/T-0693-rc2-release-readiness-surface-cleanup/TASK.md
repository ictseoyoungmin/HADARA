# T-0693 RC2 Release Readiness Surface Cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0693 |
| Title | RC2 Release Readiness Surface Cleanup |
| Status | Done |
| Created | 2026-07-23T22:13 |
| Updated | 2026-07-23T22:34 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Move repo-local release/readiness and HADARA-dev wrapper entrypoints out of the shipped `src/cli`/`src/dev` tree into `tools/` so installed CLI sources stop carrying developer-only command handlers. | Keep the user-facing lifecycle surface unchanged while preserving repo-local developer workflows. |

## Scope

| Boundary | Items |
|---|---|
| In | Extract `release`, `smoke`, `package recycle`, and `dev docker-check` wrapper handlers from `src/cli`/`src/dev` into `tools/`, update repo-local dispatcher/tests/metadata, and remove the old shipped-only wrapper files. |
| Out | Removing release/readiness service implementations, removing operational-debt math, or redesigning TUI/status/current-state behavior. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm the remaining release/readiness wrapper surface and coupled metadata. | Done |
| 2 | Move developer-only wrapper handlers into `tools/` and delete the old shipped wrapper files. | Done |
| 3 | Run focused validation, record evidence, and close if the ordinary lifecycle surface still holds. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Repo-local `tools/dev-surfaces.ts` and its tests no longer depend on `src/cli/release-*`, `src/cli/smoke.ts`, `src/cli/package-smoke.ts`, or `src/cli/dev.ts`; the corresponding shipped wrapper files are removed. | Done | `ev:T-0693:ff793e1c4b6547ffad0b2857`, `ev:T-0693:0b108ce45fa14a56ae564b8d` | `tools/dev-surfaces.ts`, `tools/`, `src/cli/`, `src/dev/` |
| AC-2 | Coupled metadata/tests stay aligned and the ordinary user-facing task lifecycle remains intact. | Done | `ev:T-0693:ff793e1c4b6547ffad0b2857`, `ev:T-0693:e71261fc41ef4562aa7c40e7`, `ev:T-0693:5cdb5edbff6b4abd838515c8` | `src/services/capability-registry.ts`, `src/context/code-index.ts`, `tests/unit/*` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| focused developer-surface tests | Yes | Passed | ev:T-0693:ff793e1c4b6547ffad0b2857 |
| task-close lifecycle regression | Yes | Passed | ev:T-0693:e71261fc41ef4562aa7c40e7 |
| TypeScript noEmit | Yes | Passed | ev:T-0693:5cdb5edbff6b4abd838515c8 |
| git diff check | Yes | Passed | ev:T-0693:0b108ce45fa14a56ae564b8d |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0687-rc2-developer-surface-alignment/RC2_DEVELOPER_SURFACE_REPORT.md` | reference | active | Defines release/readiness and HADARA-dev wrapper extraction as the next RC2 boundary. |
| `docs/PROJECT_STATE.md` | reference | active | Confirms deeper release/readiness internals are the next cleanup boundary after dashboard removal. |
| `docs/TEST_STRATEGY.md` | reference | active | Developer-only release/readiness validation already routes through `tools/dev-surfaces.ts`. |
| `docs/ARCHITECTURE.md` | reference | active | Installed product boundary should stay centered on CLI/TUI/read-only MCP over core lifecycle services. |

## Changes

| Area | Summary |
|---|---|
| Repo-local wrapper extraction | Move release/smoke/package/dev command wrappers into `tools/` and keep repo-local invocation through `tools/dev-surfaces.ts`. |
| Metadata/test alignment | Retarget capability-registry, context routing references, and focused tests away from deleted shipped wrapper files. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Release/readiness service implementations and TUI/debt-release consumers still remain in `src/services`/`src/tui` after wrapper extraction. | Open | `src/services/release-*.ts`, `src/tui/read-model.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-23 | Draft | Initial task scaffold. |
| 2026-07-23 | In Progress | Narrowed the capsule to repo-local wrapper extraction for release/readiness and developer-only command entrypoints. |
| 2026-07-23 | Done | Moved developer-only release/smoke/package/dev wrappers into `tools/`, deleted the shipped wrapper files, and passed focused dev-surface plus lifecycle regression validation. |
