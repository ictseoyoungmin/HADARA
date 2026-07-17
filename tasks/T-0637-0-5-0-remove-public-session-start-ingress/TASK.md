# T-0637 0.5.0 remove public session start ingress

## Identity

| Field | Value |
|---|---|
| ID | T-0637 |
| Title | 0.5.0 remove public session start ingress |
| Status | Done |
| Created | 2026-07-17 |
| Updated | 2026-07-17 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0637 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Remove public `session start` as a taught ingress. | Route new sessions through `hadara status --json`, selected work through `hadara task status`, and file routing through `context pack`. |

## Scope

| Boundary | Items |
|---|---|
| In | Public CLI route removal, capability registry/help cleanup, README/current workflow/init scaffold guidance, docs-registry generated text, package recycle smoke replacement, focused tests. |
| Out | Deleting internal `session-start` service/test fixtures, historical release notes, archived specs, TUI terminal `session.start()` API, context graph internals. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define public-session removal boundaries. | Done |
| 2 | Remove public CLI route and registry entry. | Done |
| 3 | Migrate generated/current docs and package recycle smoke guidance. | Done |
| 4 | Update focused tests. | Done |
| 5 | Validate and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara session start --json` is no longer routed as a public CLI command. | Done | `ev:T-0637:454d51cd8209446e83f0f7cd` | 050-C05 |
| AC-2 | Default help/capability registry, README, workflow docs, and init scaffold guidance teach `status`/`task status`/`context pack`, not `session start`. | Done | `ev:T-0637:b7c2c49507b54705a1fcdb94` | 0.5.0 currentness gate |
| AC-3 | Package recycle no longer verifies or recommends `session start`; it verifies status/context replacements. | Done | `ev:T-0637:b7c2c49507b54705a1fcdb94` | package recycle |
| AC-4 | Focused tests and TypeScript build pass. | Done | `ev:T-0637:b7c2c49507b54705a1fcdb94`, `ev:T-0637:7a161d7418904bd296b3ae49` | Validation section |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused session-removal tests | Yes | Passed | `ev:T-0637:b7c2c49507b54705a1fcdb94` |
| TypeScript build | Yes | Passed | `ev:T-0637:7a161d7418904bd296b3ae49` |
| Built CLI route/registry smoke | Yes | Passed | `ev:T-0637:454d51cd8209446e83f0f7cd` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md | implementation-source | active | 050-C05 session-start removal. |
| docs/specs/0.5/all/HADARA_0_5_X_Combined_Agent_Loop_Plan.md | reference | active | Combined status-first ingress plan. |

## Changes

| Area | Summary |
|---|---|
| CLI routing/help | Removed the public `session` dispatcher route and deleted the `session.start` command registry entry. |
| Generated/current docs | Migrated README, Getting Started, HADARA workflow, init templates, docs-registry generated context, and current JSON/schema docs toward `status`, `task status`, and `context pack`. |
| Package recycle/tests | Replaced installed-package `session-start` smoke with a `status-ingress` smoke and updated focused tests. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Internal `session-start` service and historical docs can remain until a deeper cleanup; public route/guidance is removed here. | Open | 050-C05 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-17 | Draft | Initial task scaffold. |
| 2026-07-17 | In Progress | Started public `session start` removal. |
| 2026-07-17 | In Progress | Removed public route/guidance and validated status-first replacements. |
| 2026-07-17 | Done | Completed public `session start` removal and status-first replacement validation. |
