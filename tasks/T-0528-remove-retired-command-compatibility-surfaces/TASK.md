# T-0528 remove retired command compatibility surfaces

## Identity

| Field | Value |
|---|---|
| ID | T-0528 |
| Title | remove retired command compatibility surfaces |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove the retired public compatibility surfaces that no longer need redirect stubs. | Fully remove routing and dedicated dead implementation/schema/tests for the clear deletion candidates while preserving canonical replacements such as `task status`, `docs register`, `evidence add-command`, and top-level `status`. |

## Scope

| Boundary | Items |
|---|---|
| In | Remove public routing/stubs for `task next`, `task show`, `task upgrade-scaffold`, `evidence collect`, `init register-doc`, `docs archive`, `handoff stale-problems`, and `ops status`; remove dedicated dead services/schemas/tests where no current internal consumer remains; update current docs/tests. |
| Out | Remove `write preflight`, `policy check-shell`, old `package smoke`, lifecycle migration stubs, or the internal next-work recommendation projection consumed by `task status --json`. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Remove retired command handlers/stubs and prevent accidental `init register-doc` fallback to plain init. | Done |
| 2 | Delete dedicated dead implementation/schema/test files and update surviving tests/docs. | Done |
| 3 | Validate build, focused suites, and built CLI deletion smokes; record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The eight selected retired commands no longer route to public command handlers or `commandRemoved` stubs. | Done | `ev:T-0528:c1a644032e3e419c9d1d5ea8` | User request. |
| AC-2 | `init register-doc` does not accidentally execute plain `init`. | Done | `ev:T-0528:c1a644032e3e419c9d1d5ea8` | Built CLI smoke and `tests/unit/init.test.ts`. |
| AC-3 | Dedicated dead schema/service/test files for `docs archive`, `handoff stale-problems`, and `task upgrade-scaffold` are removed from current schema registration and focused tests. | Done | `ev:T-0528:c1a644032e3e419c9d1d5ea8` | `docs archive`, `handoff stale-problems`, `task upgrade-scaffold`. |
| AC-4 | Canonical replacements still build and focused command-surface tests pass. | Done | `ev:T-0528:c1a644032e3e419c9d1d5ea8` | `task status`, `docs register`, `evidence add-command`, `status`. |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| TypeScript build | Yes | Passed | `ev:T-0528:c1a644032e3e419c9d1d5ea8` |
| Focused Vitest | Yes | Passed | `ev:T-0528:c1a644032e3e419c9d1d5ea8` |
| Built CLI deletion smoke | Yes | Passed | `ev:T-0528:c1a644032e3e419c9d1d5ea8` |
| Docker sync build | Yes | Passed | `ev:T-0528:71dea0c06e9047c3be8f1a2e` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | implementation-source | active | Remove the clear deletion candidates and `ops status`. |
| `tasks/T-0521-command-portfolio-reduction-inventory/COMMAND_PORTFOLIO.md` | reference | active | Command portfolio inventory and reduction rationale. |
| `docs/specs/0.4.1/rc0-scope.md` | reference | active | Candidate table and 0.4.1 cleanup scope. |
| `AGENTS.md` | constraint | active | Use HADARA lifecycle and Docker dist refresh for CLI work. |

## Changes

| Area | Summary |
|---|---|
| CLI routing | Removed public routing/stubs for the eight selected retired commands and blocked unknown init subcommands from falling through to plain init. |
| Schemas/services | Removed dead `docs.archivePlan`, `handoff.staleProblems`, and `task.upgrade_scaffold` fixtures/services/tests; preserved internal next-work projection for `task status`. |
| Docs/tests | Updated command-surface, JSON contract, README, schemas, rc0 scope, and focused tests to distinguish fully removed commands from retained migration stubs. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `task next` internals still exist as the next-work projection backing `task status --json`; consider renaming the internal module/schema in a later cleanup if the historical name keeps causing confusion. | Open | `src/task/task-next.ts` |
| RF-2 | Follow-up | Deferred candidates remain: `write preflight`, `policy check-shell`, old `package smoke`, and lifecycle migration stubs. | Open | `tasks/T-0521-command-portfolio-reduction-inventory/COMMAND_PORTFOLIO.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | Done | Removed selected retired compatibility surfaces and validated focused command-surface behavior plus Docker sync-build. |
