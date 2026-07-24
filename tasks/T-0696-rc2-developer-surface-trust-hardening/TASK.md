# T-0696 RC2 Developer Surface Trust Hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0696 |
| Title | RC2 Developer Surface Trust Hardening |
| Status | Done |
| Created | 2026-07-24T17:45 |
| Updated | 2026-07-24T18:12 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove false trust signals from RC2 developer-only surfaces and restore validation coverage. | Fix `tools/` type-check coverage, stop shipped placeholder debt/release surfaces from reporting healthy zero-state, and align public docs/metadata with the reduced RC2 surface. |

## Scope

| Boundary | Items |
|---|---|
| In | Add explicit TypeScript checking for repo-local `tools/` code and wire it into `npm run check`. |
| In | Change shipped TUI/status placeholder debt and release-gate surfaces so they report unavailable/deferred developer-only state instead of `ok:true` with zero-valued healthy summaries. |
| In | Align current public docs/metadata/help text with the reduced RC2 surface, including README, release docs, package metadata, and release helper wording. |
| In | Refresh task/shared validation notes and capture fresh evidence for the post-reduction RC2 baseline work. |
| Out | Reintroducing dashboard, public release/debt commands, or the broader DAG/status redesign. |
| Out | Historical/archive-wide cleanup beyond currently routed docs and helper text. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Lock the capsule contract around reviewer P0 trust issues. | Done |
| 2 | Implement the minimal code/config/doc fixes for type-check coverage and developer-surface semantics. | Done |
| 3 | Run focused/full validation, record evidence, and update shared state docs. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `tools/` TypeScript sources are included in an explicit repository check path and regressions fail before full test completion. | Done | `ev:T-0696:95ac829dc59746c8acba80bc`, `ev:T-0696:bd71b20ac84941b0a4f9f826` | `tsconfig.tools.json`, `package.json`, `docs/TEST_STRATEGY.md` |
| AC-2 | Shipped status/TUI developer-surface placeholders no longer imply evaluated zero debt or healthy release readiness when those surfaces are unavailable or deferred. | Done | `ev:T-0696:e45d853be68c4f4ab103c78f`, `ev:T-0696:bd71b20ac84941b0a4f9f826` | `src/services/developer-surface-placeholders.ts`, `src/services/operations-status-service.ts`, `src/tui/read-model.ts` |
| AC-3 | Public RC2 docs and release metadata stop advertising removed or developer-only surfaces as ordinary user paths. | Done | `ev:T-0696:e45d853be68c4f4ab103c78f`, `ev:T-0696:c60d1cdd1b234bef9122ed7e`, `ev:T-0696:d77098002fe04738a82e773c` | `README.md`, `docs/GETTING_STARTED.md`, `docs/RELEASE_READINESS.md`, `docs/RELEASE_NOTES.md`, `package.json`, `scripts/release/manual-publish-rc.sh` |
| AC-4 | Fresh evidence is recorded for the post-reduction RC2 validation path and shared state docs reflect the new trust posture. | Done | `ev:T-0696:95ac829dc59746c8acba80bc`, `ev:T-0696:e45d853be68c4f4ab103c78f`, `ev:T-0696:c60d1cdd1b234bef9122ed7e`, `ev:T-0696:bd71b20ac84941b0a4f9f826`, `ev:T-0696:d77098002fe04738a82e773c` | `tasks/T-0696-rc2-developer-surface-trust-hardening/evidence.jsonl`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run typecheck:tools` | Yes | Passed | `ev:T-0696:95ac829dc59746c8acba80bc` |
| `npm run test:focused -- tests/unit/status-json.test.ts tests/unit/tui-read-model.test.ts tests/unit/schema-runtime.test.ts tests/unit/positioning-docs.test.ts tests/unit/tui-cache.test.ts tests/unit/tui-snapshot.test.ts tests/unit/status-adapters.test.ts` | Yes | Passed | `ev:T-0696:e45d853be68c4f4ab103c78f` |
| `npm run test:hadara-dev -- tests/unit/manual-publish-script.test.ts` | Yes | Passed | `ev:T-0696:c60d1cdd1b234bef9122ed7e` |
| `npm run check` | Yes | Passed | `ev:T-0696:bd71b20ac84941b0a4f9f826` |
| `git diff --check` | Yes | Passed | `ev:T-0696:d77098002fe04738a82e773c` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `pasted-text.txt` | reference | active | Defines the P0/P1 trust and currentness regressions to resolve in this capsule. |
| `docs/PROJECT_STATE.md` | constraint | active | RC2 scope is reduced to HADARA-dev-only developer surfaces before any broader redesign. |
| `docs/AGENT_HANDOFF.md` | reference | active | Current trust baseline still points at the T-0678 rollup and needs explicit follow-through. |
| `docs/RELEASE_READINESS.md` | constraint | active | rc.2 release readiness stays blocked until reviewer fixes, fresh dogfood, and deliberate validation-baseline promotion. |
| `docs/TEST_STRATEGY.md` | constraint | active | Public/default and HADARA-dev-only test split must remain explicit. |

## Changes

| Area | Summary |
|---|---|
| Type-check coverage | Added `tsconfig.tools.json`, explicit `typecheck:src` / `typecheck:tools` scripts, and a `check` path that verifies shipped `src/` plus repo-local `tools/` before the full test split. |
| Developer-surface semantics | Added explicit availability metadata and warning signals so shipped ops-status/TUI debt and release-gate placeholders report `repo-local-only` or `deferred` state instead of healthy zero/evaluated output. |
| Public docs and metadata | README, Getting Started, release docs, workflow budget, test strategy, package metadata, AGENTS guidance, and manual publish helper wording now point at `task status` and repo-local `tools/dev-surfaces.ts` surfaces where appropriate. |
| Regression expectations | Updated status/TUI/docs/cache/snapshot/manual-publish/status-adapter tests to match the reduced RC2 surface and the repo-local helper wording. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Fresh-session dogfood and deliberate validation-baseline promotion beyond the current T-0678 rollup are still required before actual rc.2 release readiness. | Open | `docs/RELEASE_READINESS.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-24 | Draft | Initial task scaffold. |
| 2026-07-24 | In Progress | Scoped the capsule to reviewer P0 trust fixes for `tools/` type-check coverage, developer-surface placeholder semantics, docs drift, and validation follow-through. |
| 2026-07-24 | Done | Implemented the RC2 trust-hardening changes, refreshed focused/full validation, and recorded evidence `ev:T-0696:95ac829dc59746c8acba80bc`, `ev:T-0696:e45d853be68c4f4ab103c78f`, `ev:T-0696:c60d1cdd1b234bef9122ed7e`, `ev:T-0696:bd71b20ac84941b0a4f9f826`, and `ev:T-0696:d77098002fe04738a82e773c`. |
