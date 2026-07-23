# T-0689 RC2 Developer Test Surface Split

## Identity

| Field | Value |
|---|---|
| ID | T-0689 |
| Title | RC2 Developer Test Surface Split |
| Status | Done |
| Created | 2026-07-23T20:34 |
| Updated | 2026-07-23T20:43 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Exclude HADARA-dev-only developer-surface tests from the default/public `npm test` path while preserving explicit developer and full-suite scripts for HADARA-dev maintenance. |

## Scope

| Boundary | Items |
|---|---|
| In | Split default Vitest execution from developer-only tests that cover `debt`, `dev docker-check`, release/readiness, package smoke/recycle, and clean-checkout surfaces; update test scripts and active validation docs to describe the new split. |
| Out | Deleting additional developer-only runtime code, changing public CLI routing again, or moving dashboard/TUI/MCP debt consumers. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Default `npm test` and the shared base Vitest config no longer execute HADARA-dev-only tests for developer surfaces, while an explicit developer-only script still runs them. | Done | `package.json` now adds `test:hadara-dev` and `test:all`; `vitest.config.ts` excludes the developer-only globs; `vitest.dev.config.ts` runs only that suite. | `package.json`, `vitest.config.ts`, `vitest.dev.config.ts`, `vitest.shared.ts` |
| AC-2 | Active validation guidance reflects the split between general-user and HADARA-dev-only test paths. | Done | The active suite table now distinguishes `npm test`, `npm run test:hadara-dev`, and `npm run test:all`, including the focused developer-only invocation path. | `docs/TEST_STRATEGY.md` |
| AC-3 | Focused validation proves both the public-default and developer-only suites still run. | Done | `ev:T-0689:d9d496acac294bacb5886fc8`, `ev:T-0689:cfa777f91da742b487906861`, `ev:T-0689:6f52fe20d624476ea526d303` | `tasks/T-0689-rc2-developer-test-surface-split/EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `timeout 60s npx vitest run tests/unit/tools-list.test.ts tests/unit/task-close.test.ts tests/contract/provider-contract.test.ts tests/harness/task-capsule.test.ts` | Yes | Passed | `ev:T-0689:d9d496acac294bacb5886fc8` |
| `timeout 60s npx vitest run --config vitest.dev.config.ts` | Yes | Passed | `ev:T-0689:cfa777f91da742b487906861` |
| `git diff --check` | Yes | Passed | `ev:T-0689:6f52fe20d624476ea526d303` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0687-rc2-developer-surface-alignment/RC2_DEVELOPER_SURFACE_REPORT.md` | reference | active | Defines the developer-only code groups that should stop riding on the default test path. |
| `tasks/T-0688-rc2-developer-surface-extraction/TASK.md` | reference | active | The previous capsule already moved those surfaces behind repo-local tooling and names the focused regression area. |
| `docs/TEST_STRATEGY.md` | reference | active | Active validation guidance must describe the new default versus HADARA-dev-only split. |

## Changes

| Area | Summary |
|---|---|
| Test surface split | Added `vitest.shared.ts`, excluded HADARA-dev-only release/debt/dev/package smoke tests from the default config, and added `vitest.dev.config.ts` plus `test:hadara-dev`/`test:all` scripts. |
| Validation docs | Updated `docs/TEST_STRATEGY.md` so the default/public path, developer-only path, and full-repository path are described separately. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Developer-only runtime code still exists behind repo-local tooling; this capsule only removes its tests from the default/public path. | Open | `src/services/release-*.ts`, `src/services/package-*.ts`, `src/services/operational-debt.ts`, `src/dev/docker-check.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-23 | Draft | Initial task scaffold. |
| 2026-07-23 | In Progress | Scoped the capsule around default-test versus HADARA-dev-only test separation. |
| 2026-07-23 | Done | Split the default/public Vitest path from HADARA-dev-only developer-surface tests, updated active validation guidance, and recorded focused proof. |
