# T-0688 RC2 Developer Surface Extraction

## Identity

| Field | Value |
|---|---|
| ID | T-0688 |
| Title | RC2 Developer Surface Extraction |
| Status | Done |
| Created | 2026-07-23T20:04 |
| Updated | 2026-07-23T20:28 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove repo-local developer surfaces from the installed/public CLI while preserving them through `tools/dev-surfaces.ts`, release scripts, and focused regression coverage. |

## Scope

| Boundary | Items |
|---|---|
| In | Remove public routing/help/tools exposure for `debt`, `dev`, `release`, `smoke`, and `package recycle`; add repo-local `tools/dev-surfaces.ts`; retarget release scripts/docs/tests; drop the unnecessary installed `smoke run` package-smoke step. |
| Out | Dashboard/TUI debt route removal, MCP debt tool removal, DAG/status redesign, and broader release-schema deletion. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Installed/public CLI no longer routes or advertises developer-only `debt`, `dev`, `release`, `smoke`, and `package recycle` roots; repo-local developer tooling remains available through `tools/dev-surfaces.ts` and updated release scripts. | Done | Public CLI routing/help/tools projection no longer includes the hidden roots; `tools/dev-surfaces.ts` dispatches the retained handlers; release scripts use the repo-local tool path. | `src/cli/main.ts`, `src/cli/help.ts`, `src/services/capability-registry.ts`, `tools/dev-surfaces.ts`, `scripts/release/*.sh` |
| AC-2 | Focused validation covers the extraction and records proof in the capsule evidence store. | Done | `ev:T-0688:d64c7d8b3b424db685afd22a`, `ev:T-0688:1e1a2ad2719f410c91b95c80`, `ev:T-0688:0165374b71f54fd58854a11f` | `tasks/T-0688-rc2-developer-surface-extraction/EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `timeout 60s npm run build -- --pretty false` | Yes | Passed | `ev:T-0688:d64c7d8b3b424db685afd22a` |
| `timeout 120s npx vitest run tests/unit/tools-list-command-registry.test.ts tests/unit/tools-list.test.ts tests/unit/command-registry.test.ts tests/unit/package-smoke-dry-run.test.ts tests/unit/clean-checkout-smoke.test.ts tests/unit/feature-smoke.test.ts tests/unit/mcp-tools.test.ts tests/unit/operational-debt.test.ts tests/unit/release-dry-run.test.ts` | Yes | Passed | `ev:T-0688:1e1a2ad2719f410c91b95c80` |
| `git diff --check` | Yes | Passed | `ev:T-0688:0165374b71f54fd58854a11f` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0687-rc2-developer-surface-alignment/RC2_DEVELOPER_SURFACE_REPORT.md` | reference | active | File inventory and RC2 reduction boundary for this extraction capsule. |
| `docs/RELEASE_READINESS.md` | reference | active | Current release/readiness guidance had to move to repo-local developer tooling examples. |
| `docs/TEST_STRATEGY.md` | reference | active | Package-smoke, clean-checkout, and feature-smoke documentation had to follow the same tool-path change. |

## Changes

| Area | Summary |
|---|---|
| Public CLI surface | Removed `dev`, `debt`, `release`, `smoke`, and `package` routing from `src/cli/main.ts` and hid the corresponding registry/tool/help surfaces behind repo-local exposure metadata. |
| Repo-local tooling | Added `tools/dev-surfaces.ts` plus `npm run dev:surface` and switched release helper scripts to use the repo-local dispatcher. |
| Release/readiness internals | Retargeted clean-checkout, release-readiness summaries, feature smoke, and operational-debt expectations to the repo-local tool path; removed the unnecessary installed `smoke run` package-smoke step. |
| Docs and tests | Updated active docs and focused tests to the new developer-only execution path. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Dashboard/TUI debt routes and MCP debt read tools still depend on developer-surface services even though public CLI exposure is removed. | Open | `src/cli/dashboard.ts`, `src/tui/read-model.ts`, `src/services/operational-debt.ts` |
| RF-2 | Follow-up | Release/readiness schemas and internal service modules still exist for HADARA-dev workflows; this capsule hid the public entrypoints rather than deleting every implementation. | Open | `src/services/release-*.ts`, `src/services/package-*.ts`, `src/schemas/*release*`, `src/schemas/*smoke*` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-23 | Draft | Initial task scaffold. |
| 2026-07-23 | Done | Public developer-only command roots were demoted to repo-local tooling, release scripts/docs/tests were retargeted, and focused validation/evidence passed. |
