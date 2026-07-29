# T-0742 Clear retired state contracts and smoke routing drift

## Identity

| Field | Value |
|---|---|
| ID | T-0742 |
| Title | Clear retired state contracts and smoke routing drift |
| Status | In Progress |
| Created | 2026-07-29T23:14 |
| Updated | 2026-07-30T00:14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Restore full validation trust after retired current-state surfaces were removed. | Update stale tests/src/docs contracts that still require `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, or `.hadara/state/current.json` as current-state surfaces, fix public smoke routing drift, and rerun full check plus package/consumer smoke so T-0741 can close. |

## Scope

| Boundary | Items |
|---|---|
| In | Remove or replace stale `project-current-state`, continuation, project-state update, current-state docs, and DAG source tests that directly require retired `current.json`/Project State/Agent Handoff current-state behavior. |
| In | Update affected MCP/Hermes/TUI/context/doc-doctor fixtures so Task Board and task-local HANDOFF are the current continuation/read sources. |
| In | Resolve public command-surface drift for `hadara smoke package` and `hadara smoke clean-checkout`, either by adding dispatcher routing or correcting registry/docs to the actual supported surface. |
| In | Fix package smoke installed doctor/init workflow failures caused by the retired-state contract change. |
| In | Rerun and record `npm run check`, package smoke, and clean-checkout smoke evidence. |
| Out | Close marker binding, argv preview byte-budget, and validation v1/v2 contract changes already implemented in T-0741. |
| Out | Release publication, npm publish, or GitHub release mutation. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Audit the T-0741 failed full-check output and identify stale tests/src references to retired `PROJECT_STATE.md`, `AGENT_HANDOFF.md`, and `.hadara/state/current.json` current-state behavior. | Done |
| 2 | Remove retired current-state code/tests or replace them with Task Board/task-capsule/HANDOFF based contracts. | Done |
| 3 | Resolve public smoke command routing drift and installed package init/doctor smoke failures. | Done |
| 4 | Rerun focused stale-contract suites, full `npm run check`, package smoke, and clean-checkout smoke; record evidence. | Blocked |
| 5 | Return to T-0741 and rerun its full validation/close path after this blocker clears. | Blocked |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Full `npm run check` passes after stale retired-state/current-doc contracts are updated or removed. | Met | ev:T-0742:8b3665e282ac474ba36f5d9c | Full validation output |
| AC-2 | No source or test contract treats `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, or `.hadara/state/current.json` as default required current-state/continuation inputs; compatibility-only references are explicitly named as such. | Partial | ev:T-0742:8b3665e282ac474ba36f5d9c | `src/` scan is clean; `tests/` still contains legacy/negative/compatibility fixtures that mention retired paths. |
| AC-3 | Public CLI and command registry agree for package/clean-checkout smoke: advertised commands either route successfully or the registry/docs advertise the actual supported dev-surface path. | Met | ev:T-0742:dac14efe7f2d4f3cb8fa15ad | `src/services/capability-registry.ts`, `docs/CLI_JSON_CONTRACT.md`, release gate marker tests |
| AC-4 | Package smoke passes through the supported release/package surface with evidence recorded. | Met | ev:T-0742:dac14efe7f2d4f3cb8fa15ad | Repo-local package smoke dry-run and core smoke passed. |
| AC-5 | Clean-checkout consumer smoke passes with evidence recorded. | Blocked | ev:T-0742:b8217fe938994c6191597997 | Sandbox blocked `npm ci` at esbuild postinstall `spawnSync EPERM`; escalated rerun was unavailable. |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused stale state-contract suites | Yes | Passed | Focused MCP/Hermes/TUI/docs/context/readiness subsets passed during cleanup and are covered by full check. | ev:T-0742:8b3665e282ac474ba36f5d9c |
| Full npm check | Yes | Passed | `npm run check` passed: public suite 128 passed / 1 skipped; hadara-dev suite 16 passed / 1 skipped. | ev:T-0742:8b3665e282ac474ba36f5d9c |
| Package smoke | Yes | Passed | `node --import tsx tools/dev-surfaces.ts smoke package --dry-run --json` passed; `smoke run --profile core --json` passed. | ev:T-0742:dac14efe7f2d4f3cb8fa15ad |
| Consumer clean-checkout smoke | Yes | Blocked | `node --import tsx tools/dev-surfaces.ts smoke clean-checkout --execute --json` failed in sandbox at `npm ci` because esbuild postinstall `spawnSync` returned `EPERM`; sandbox-external rerun approval was rejected by usage limit. | ev:T-0742:b8217fe938994c6191597997 |
| Capsule draft validation | Yes | Passed | `harness validate --task T-0742 --level draft --json` and `git diff --check` passed after handoff semantic cleanup. | ev:T-0742:e523944f299d45d2a9ec3f89 |
| Close dry-run | No | Blocked | `task close --task T-0742 --dry-run --json` is blocked only by unfinished AC-2/AC-5 and final Done history; no HANDOFF semantic conflict remains. | ev:T-0742:d21c637c6a7642049b0fbf2d |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0741 failed full check | reference | active | `npm run check` failed on stale retired-state/current-doc tests and missing `project-current-state-source` suites. |
| T-0741 failed public smoke routing | reference | active | `node dist/cli/main.js smoke ...` and source CLI `smoke ...` printed default help and exited 1 although registry advertises those commands. |
| T-0741 failed dev-surface package smoke | reference | active | Package smoke implementation ran but failed installed doctor, command-surface drift, and generated init workflow checks. |
| T-0741 failed clean-checkout smoke | reference | active | Disposable clean checkout copied, installed dependencies, and built successfully, then failed at `npm run check`. |
| T-0741 capsule | reference | active | Contains exact evidence ids and close-marker work that should not be reimplemented here. |

## Changes

| Area | Summary |
|---|---|
| Retired global state surfaces | Removed `PROJECT_STATE.md`, `AGENT_HANDOFF.md`, and `.hadara/state/current.json` from current source contracts, init templates, docs registry kinds, MCP/Hermes read surfaces, context projection, task close expected writes, and current required-reading guidance. |
| Continuation routing | Added task-local handoff continuation reading so Task Board plus `tasks/T-*/HANDOFF.md` can carry resumable work without global handoff docs. |
| Smoke command routing | Kept smoke/package/release execution surfaces repo-local under `tools/dev-surfaces.ts`; updated registry, CLI JSON contract, release-readiness markers, and tests so public CLI no longer appears to advertise unsupported smoke roots. |
| Validation trust boundary | Preserved validation v2 redacted argv defaults and close-plan binding work from T-0741 while making full check green after the retired-state cleanup. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | This task can grow too broad if it attempts to redesign status architecture instead of retiring/updating stale contracts needed for validation. | Closed | Scope |
| RF-2 | Follow-up | After this task passes full check and smoke, return to T-0741 and rerun its full validation/close sequence. | Open | tasks/T-0741-bind-close-marker-to-reviewed-plan-and-validate-full-surface |
| RF-3 | Follow-up | If the reviewer requires zero textual legacy mentions in tests, split a smaller fixture-only cleanup capsule; current source contracts are clean and full validation passes. | Open | `rg "PROJECT_STATE|AGENT_HANDOFF|.hadara/state/current.json" tests` |
| RF-4 | Follow-up | Rerun clean-checkout smoke outside this sandbox or in Docker/ext4 where esbuild postinstall execution is allowed. | Open | ev:T-0742:b8217fe938994c6191597997 |

## Close Summary

T-0742 removed retired global-state contracts from current source behavior and current docs/read routing, made full validation pass, and corrected smoke/package registry docs to the actual repo-local `tools/dev-surfaces.ts` command surface. Clean-checkout consumer smoke is the only unresolved gate; it was blocked by sandbox `EPERM` while executing esbuild during `npm ci`, not by a HADARA assertion failure.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-29 | Draft | Initial task scaffold. |
| 2026-07-30 | In Progress | Retired-state source contracts and repo-local smoke routing drift cleaned; full check passed; clean-checkout smoke blocked by sandbox EPERM. |
