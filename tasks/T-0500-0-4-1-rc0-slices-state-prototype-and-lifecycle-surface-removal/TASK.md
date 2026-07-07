# T-0500 0.4.1 rc0 slices state prototype and lifecycle surface removal

## Identity

| Field | Value |
|---|---|
| ID | T-0500 |
| Title | 0.4.1 rc0 slices state prototype and lifecycle surface removal |
| Status | Done |
| Created | 2026-07-06 |
| Updated | 2026-07-07 |

## Goal

| Goal | Notes |
|---|---|
| Implement rc0-scope items 5 and 6 (FD-012, FD-013): a bounded `.hadara/state/slices.json` + fully-generated `docs/DEVELOPMENT_SLICES.md` prototype that gates the 0.5 state-first RFC, and removal of the standalone low-level lifecycle command surface (`task finish`/`ready`/`close`/`audit-close`/`complete`, plus `task lifecycle` per direct user instruction) behind structured deprecation stubs now that `--auto` (T-0499) makes finalize the sole low-ceremony orchestration path. | Capsule 3 of 3 for the `docs/specs/0.4.1/rc0-scope.md` budget; closes the budget before release smoke. |

## Scope

| Boundary | Items |
|---|---|
| In | `services/slices-state.ts` (`hadara.slicesState.v1` store, rev CAS, `SliceEntry`, read/write/render/drift-detect); `cli/slice.ts` (`add`/`set`/`list`/`render`/`migrate`) wired into `cli/main.ts`; `slices.status` controlled-vocabulary domain; `doctor` `slices-projection` check (new `drift` status, only active once state exists); `task-next.ts` state-first slice read (fixes the `rows: 0` legacy parsing bug) with md fallback; `hadara.slice.report.v1` + `hadara.commandRemoved.v1` schemas. Deprecation stubs for `task finish`/`ready`/`close`/`audit-close`/`complete`/`lifecycle` (`cli/removed-lifecycle.ts`, exit code 6, `replacementCommand` field, kept one minor release); registry/help/write-preflight/routing removal for those six ids; doc updates (`TASK_WORKFLOW_COMMANDS.md`, `HADARA_WORKFLOW.md`, `README.md`, `AGENTS.md`, `CLI_JSON_CONTRACT.md` migration note); test suite updates (6 removed-surface command-registry ids, 7 stale CLI-routing tests deleted, `removed-lifecycle.test.ts` new, `slices-state.test.ts` new). |
| Out | project.json/global task-state expansion (0.5, post-gate); `TASK_BOARD.md` state-ification (second candidate); Tier-2 hybrid blocks (0.5); refactoring the internal finish/ready/close/audit-close modules (they remain finalize's engine, unchanged); migrating HADARA-dev's own 414-row historical `docs/DEVELOPMENT_SLICES.md` (see Risks RF-1 — its legacy title convention is incompatible with the migrate id-derivation rule; deliberately not forced). |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Author `slices-state.ts` (store, render, drift-detect, add/set/list/render/migrate reports) and the `slices.status` vocabulary domain. | Done |
| 2 | Wire `cli/slice.ts` into `main.ts`; add the `doctor` `slices-projection` check; switch `task-next.ts` to a state-first read with md fallback. | Done |
| 3 | Author `cli/removed-lifecycle.ts` deprecation stubs; remove the six command handlers/imports from `cli/task.ts`; strip registry entries, write-preflight entries, and help routing for the removed ids. | Done |
| 4 | Update `TASK_WORKFLOW_COMMANDS.md`, `HADARA_WORKFLOW.md`, `README.md`, `AGENTS.md`, `CLI_JSON_CONTRACT.md` (removed-surface table + audit-contract migration note). | Done |
| 5 | Register `hadara.slice.report.v1` and `hadara.commandRemoved.v1` schemas (schema core, schema-index, `SCHEMAS.md`). | Done |
| 6 | Fix fallout: `command-registry.test.ts`, `help.test.ts`, `schema-fixtures.test.ts` sort position, delete 7 stale CLI-routing tests, add `removed-lifecycle.test.ts` (stub contract, AC-3 field-level ready↔status-detail parity, AC-4 audit-verdict contract, AC-2 partial-execution recovery) and `slices-state.test.ts` (bootstrap/rev bump, invalid status, unknown id, ownership-contract drift guard, legacy-file bootstrap drift, migrate round-trip incl. decorated capsule cells/depends). Update `task-workflow-docs.test.ts` expectations for the rewritten docs. | Done |
| 7 | Docker ext4 full suite; built-CLI dogfood smoke for slice add/set/render/migrate + doctor drift + all six removed-command stubs; record evidence; update shared state docs; finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A single slice change's git diff is a minimal state+projection diff, and an unchanged re-render is diff 0 (stable render). | Met | `ev:T-0500:250d41efcb9d42c19b6dce6c`; `tests/unit/slices-state.test.ts` "bootstraps state via slice add..." and "detects hand edits as drift... resolves via explicit render" | rc0-scope item 5 AC-1 |
| AC-2 | Existing `DEVELOPMENT_SLICES.md` table → import → render round-trips without loss (field-level comparison), proven with a representative synthetic fixture. | Met | `ev:T-0500:525c1b2552ce4726af350b63`; `tests/unit/slices-state.test.ts` "migrates a legacy hand-authored table round-trip..." | rc0-scope item 5 AC-2 |
| AC-3 | Adding `slices.json` to close-source causes no regression in existing capsule finalize/close-audit workflows. | Met | `ev:T-0500:ef6aa0705a59470099f4de99` (Docker full suite incl. all `task-finalize`/`task-close` fixtures, 1033/1033) | rc0-scope item 5 AC-3 |
| AC-4 | Direct projection edits are detected by `doctor` as drift, and `render` never silently overwrites them. | Met | `ev:T-0500:250d41efcb9d42c19b6dce6c`; `tests/unit/slices-state.test.ts` "detects hand edits as drift..." | rc0-scope item 5 AC-4 |
| AC-5 | `task next` recommends from `slices.json` (replaces the `rows: 0` / `TASK_NEXT_DEVELOPMENT_SLICES_MISSING` path). | Met | `ev:T-0500:250d41efcb9d42c19b6dce6c` (`task next` reads recommendations from slices state in the dogfood smoke) | rc0-scope item 5 AC-5 |
| AC-6 | The slice write path and ownership-contract drift guard (never silently overwrite a hand edit) are implemented and proven; the broader "2+ real dogfooding capsules with zero manual syncs" count from rc0-scope item 5 is out of this capsule's scope (rc0-scope's own release verdict permits Done-or-explicit-exclusion for item 5) and is carried forward as RF-2, not as an unresolved Acceptance gate here. | Met | `ev:T-0500:525c1b2552ce4726af350b63` | rc0-scope item 5 AC-6 (rescoped; see `docs/specs/0.4.1/rc0-scope.md` 릴리스 판정 and Risks RF-1/RF-2) |
| AC-7 | Five removed commands fail with a structured `hadara.commandRemoved.v1` stub carrying `replacementCommand`, removed from registry/help/write-preflight. | Met | Implemented as six commands (`task lifecycle` added per explicit follow-up instruction): `ev:T-0500:250d41efcb9d42c19b6dce6c`; `tests/unit/removed-lifecycle.test.ts` "answers every removed subcommand..." | rc0-scope item 6 AC-1 |
| AC-8 | Recovery-path completeness: a partially-executed-then-blocked fixture reaches `closed-valid` by rerunning finalize alone. | Met | `ev:T-0500:ef6aa0705a59470099f4de99`; `tests/unit/removed-lifecycle.test.ts` "recovers a partially executed finalize run..." | rc0-scope item 6 AC-2 |
| AC-9 | Field-level parity: every `task ready --level done` blocker (code/path/severity/classification) also appears in `task status --detail full`. | Met | `ev:T-0500:ef6aa0705a59470099f4de99`; `tests/unit/removed-lifecycle.test.ts` "keeps field-level ready diagnostics..." | rc0-scope item 6 AC-3 |
| AC-10 | Close audit verdict is a stable, machine-readable field in both finalize dry-run and `task status --detail full`. | Met | `ev:T-0500:ef6aa0705a59470099f4de99`; `tests/unit/removed-lifecycle.test.ts` "exposes a machine-readable close audit verdict..." | rc0-scope item 6 AC-4 |
| AC-11 | Current docs (`TASK_WORKFLOW_COMMANDS.md`, workflow guide, README, AGENTS.md) have low-level command references removed/updated; historical docs excluded. | Met | `ev:T-0500:ef6aa0705a59470099f4de99` (`task-workflow-docs.test.ts` passes against rewritten docs) | rc0-scope item 6 AC-5 |
| AC-12 | The item-1 drift gate passes against the post-removal surface (stubs included). | Met | `ev:T-0500:ef6aa0705a59470099f4de99` (package-smoke suite unaffected: stub commands remain registry entries, only handler bodies changed) | rc0-scope item 6 AC-6 |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Docker ext4 full suite (156 files / 1033 tests) | Yes | Passed | `ev:T-0500:ef6aa0705a59470099f4de99` |
| Docker ext4 TypeScript build | Yes | Passed | `ev:T-0500:b49ef2fac40b43f080c96671` |
| Built-CLI dogfood smoke: slice add/set/render/migrate, doctor drift detection, task next state-first read, all six removed-command stubs (exit 6 + replacementCommand) | Yes | Passed | `ev:T-0500:250d41efcb9d42c19b6dce6c` |
| Read-only inspection: `slice migrate` dry-run against HADARA-dev's own 414-row `DEVELOPMENT_SLICES.md` | No | Blocked | `ev:T-0500:525c1b2552ce4726af350b63` (deliberately not executed; see Risks RF-1) |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.1/rc0-scope.md` | implementation-source | approved | Item 5 and item 6 contracts, including the "fail-visibly, don't force" allowance for item 5 and the T-0496-precedent deprecation-stub instruction for item 6. |
| `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` | constraint | approved | FD-012/FD-013 rows. |
| `docs/specs/0.5/state-first/RFC.md` section 9 | reference | approved | Adoption-gate metrics this capsule's AC set mirrors. |
| `src/task/task-finalize.ts` (T-0499) | implementation-source | implemented | `--auto` must land before item 6 removal (dependency stated in rc0-scope item 6); it did (T-0499). |
| User instruction (this session) | background | approved | "표면제거에 hadara lifecycle도 포함(status 및 finalize에 흡수)" — added `task lifecycle` as a sixth removed command beyond the five in rc0-scope.md's table. |

## Changes

| Area | Summary |
|---|---|
| Slices state (FD-012) | New `services/slices-state.ts` (`hadara.slicesState.v1` store with rev CAS, `SliceEntry`, render/drift-detect/mutation-with-ownership-guard); new `cli/slice.ts` (`add`/`set`/`list`/`render`/`migrate`); `slices.status` vocabulary domain; `doctor` gains a `slices-projection` check (new `drift` status) that only activates once state exists; `task-next.ts` reads slices state-first with markdown fallback, fixing the long-standing `rows: 0` legacy-regex parsing bug. |
| Lifecycle surface removal (FD-013) | New `cli/removed-lifecycle.ts`: `REMOVED_TASK_SUBCOMMANDS` map for `finish`/`ready`/`close`/`audit close`/`complete`/`lifecycle`, each returning a `hadara.commandRemoved.v1` stub (`code: TASK_LIFECYCLE_COMMAND_REMOVED`, `replacementCommand`, exit code 6) with zero writes; `cli/task.ts` dispatches to the stub before reaching any removed handler; six handler blocks and their imports deleted; registry entries for the six ids removed from `capability-registry.ts`. Internal `task-finish.ts`/`task-ready.ts`/`task-close.ts`/audit-verdict logic are untouched — they remain finalize's engine. |
| Schemas | New `hadara.slice.report.v1` and `hadara.commandRemoved.v1`, registered in `core/schema.ts`, `schemas/schema-index.json`, and `docs/SCHEMAS.md`. |
| Docs | `TASK_WORKFLOW_COMMANDS.md`/`HADARA_WORKFLOW.md`/`README.md` low-level command blocks replaced with a removed-command table + audit-contract migration note; `AGENTS.md` rule line updated; `docs/CLI_JSON_CONTRACT.md` gains a migration note for former `task audit close` consumers (read `state` from finalize or `state.closeState` from `task status --detail full`). |
| Tests | New `tests/unit/slices-state.test.ts` (6 tests) and `tests/unit/removed-lifecycle.test.ts` (4 tests); 7 stale CLI-routing tests deleted from `task-close`/`task-complete-flow`/`task-finish`/`task-lifecycle`/`task-ready` test files; `command-registry.test.ts`, `help.test.ts`, `schema-fixtures.test.ts`, `task-workflow-docs.test.ts` updated for the new surface. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `slice migrate`'s id-derivation rule (first token of the Slice cell, before a colon/pipe) assumes the new `id: title` authoring convention. HADARA-dev's own 414-row `docs/DEVELOPMENT_SLICES.md` predates that convention (plain titles like "Harness validate JSON"), so a dry-run against it produces colliding ids (e.g. two rows both derive `Harness`). Migrating that real file was deliberately not executed in this capsule; AC-2's round-trip losslessness is instead proven with a representative synthetic fixture. Before HADARA-dev's own file can be migrated, `migrate` needs an id-derivation fallback (e.g. slugify the full title, or require `--id-strategy` when no colon is present). | Open | `docs/specs/0.5/state-first/RFC.md` section 9 |
| RF-2 | Follow-up | AC-6 (2+ dogfooding capsules with zero manual slice syncs) is infrastructure-complete but not exercised: this capsule did not adopt `.hadara/state/slices.json` for HADARA-dev's own development tracking (that would require resolving RF-1 first). Real dogfooding evidence for the 0.5 RFC section 9 gate decision should come from a follow-up capsule that either fixes RF-1 or starts a fresh slices.json for new work only. | Open | `docs/specs/0.5/state-first/RFC.md` section 9 |
| RF-3 | Follow-up | The stub deprecation window ("kept for at least one minor release" per rc0-scope item 6) has no tracked expiry; a future capsule should record when 0.4.1 ships and schedule the hard-removal capsule for the following minor. | Open | `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-06 | Draft | Initial task scaffold. |
| 2026-07-06 | In Progress | Contract authored from rc0-scope items 5/6; capsule 1 (T-0497) and capsule 2 (T-0499, `--auto`) landed, unblocking item 6. |
| 2026-07-06 | In Progress | Implemented slices-state prototype (item 5) end to end; end-to-end dogfood smoke passed on first pass. |
| 2026-07-07 | In Progress | Implemented lifecycle surface removal (item 6, six commands including `task lifecycle` per explicit follow-up instruction); fixed test fallout (workflow-docs expectations, CLI_JSON_CONTRACT migration note, recovery fixture); Docker full suite 1033/1033. |
| 2026-07-07 | Done | Authored `slices-state.test.ts` and confirmed `removed-lifecycle.test.ts` 4/4 in Docker; ran built-CLI dogfood smoke for both features; recorded the real-file migrate limitation as RF-1 instead of forcing a lossy migration; closed via `task finalize --execute --auto`. |
