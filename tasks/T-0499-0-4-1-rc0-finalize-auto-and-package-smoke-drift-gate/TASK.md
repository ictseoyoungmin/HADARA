# T-0499 0.4.1 rc0 finalize auto and package smoke drift gate

## Identity

| Field | Value |
|---|---|
| ID | T-0499 |
| Title | 0.4.1 rc0 finalize auto and package smoke drift gate |
| Status | Done |
| Created | 2026-07-06 |
| Updated | 2026-07-06 |

## Goal

| Goal | Notes |
|---|---|
| Implement rc0-scope items 4 and 1 (FD-010, FD-011): a guarded low-ceremony `task finalize --execute --auto` path that folds the dry-run/plan-hash round trip into one call without weakening stale-plan protection, and a package-smoke command-surface drift gate that catches the 0.4.0 class of published-artifact vs source surface drift. | Capsule 2 of 3 for the `docs/specs/0.4.1/rc0-scope.md` budget (capsule 1 was T-0497; items 5/6 land in capsule 3). |

## Scope

| Boundary | Items |
|---|---|
| In | `task finalize --execute --auto`: internal review pass, refusal with no writes when blockers exist, fresh plan recompute + existing plan-hash mismatch guard on the execute pass, mutual exclusion with `--plan-hash`, CLI flag, registry command string, workflow-doc row, focused tests including an evaluation/execution race fixture through a service-level seam. Package smoke drift gate: pure surface-diff helpers (source registry ids vs installed `commands --json` ids, installed registry top-level verbs vs installed `dist/cli/main.js` routing case tokens), a `command-surface-drift` step in the local package-smoke execution path, dry-run step parity, issue codes, fixture tests for both injected drift directions. |
| Out | rc0-scope items 5/6 (capsule 3); removing the manual `--plan-hash` path (stays for external-reviewer workflows); probing sub-command routing beyond top-level verbs (recorded as follow-up); release-gate documentation-marker checks (`PACKAGE_SMOKE_COMMAND_SURFACE` in operational-debt stays as-is — it checks docs, not artifacts). |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Author contract; record the enumeration-strategy spike decision for the drift gate. | Done |
| 2 | Implement `--auto` in `task-finalize.ts` (review pass -> refuse-on-blockers with zero writes -> fresh recompute execute via the existing plan-hash guard) with a test seam between review and execute. | Done |
| 3 | Wire `--auto` through `cli/task.ts`, command registry string, and workflow docs. | Done |
| 4 | Implement surface-diff helpers and the `command-surface-drift` package-smoke step (local execution + dry-run parity). | Done |
| 5 | Focused tests: auto clean/blocked/conflict/race; drift-gate fixture tests both directions; schema updates if needed. | Done |
| 6 | Docker ext4 focused tests + build + built-CLI smokes; record evidence. | Done |
| 7 | Update shared state docs and finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A clean capsule reaches closed-valid with a single `task finalize --task T-X --execute --auto` call. | Met | `ev:T-0499:5f46965124d44ecf95f31f91` (unit fixture); dogfooded by closing this capsule with `--execute --auto` | rc0-scope item 4 AC-1 |
| AC-2 | With known blockers, `--auto` performs no writes and reports the same blockers as a dry-run. | Met | `ev:T-0499:5f46965124d44ecf95f31f91` | rc0-scope item 4 AC-2 |
| AC-3 | A close-source mutation injected between the review pass and the execute pass aborts `--auto` via the existing plan-hash mismatch guard (race fixture). | Met | `ev:T-0499:5f46965124d44ecf95f31f91` | rc0-scope item 4 AC-3 |
| AC-4 | `--auto` and `--plan-hash` are mutually exclusive; the explicit `--plan-hash` path is behaviorally unchanged. | Met | `ev:T-0499:5f46965124d44ecf95f31f91`, `ev:T-0499:eabff0dd3bdc40eea1f3f8f9` | rc0-scope item 4 AC-4 |
| AC-5 | An installed-artifact registry id set that differs from the source registry id set fails the package-smoke drift step (both missing and extra directions, fixture-verified). | Met | `ev:T-0499:5f46965124d44ecf95f31f91` | rc0-scope item 1 AC-1/AC-2 |
| AC-6 | Installed registry top-level verbs and installed dist routing case tokens are compared both directions; mismatches fail the drift step. | Met | `ev:T-0499:5f46965124d44ecf95f31f91` | rc0-scope item 1 AC-1/AC-2 |
| AC-7 | The current real surface passes the drift step (no false positive on main). | Met | `ev:T-0499:5f46965124d44ecf95f31f91` (source-parity test holds on main) | rc0-scope item 1 AC-3 |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Docker ext4 full suite incl. focused areas (task-finalize auto, package-smoke drift, schema, workflow docs) | Yes | Passed | `ev:T-0499:5f46965124d44ecf95f31f91` |
| Docker ext4 TypeScript build | Yes | Passed | `ev:T-0499:89dc28fd462d45c2b364e3ff` |
| Built-CLI smokes: `--auto` flag wiring (deferred-check path, conflict refusal); clean single-call close dogfooded on this capsule | Yes | Passed | `ev:T-0499:eabff0dd3bdc40eea1f3f8f9` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.1/rc0-scope.md` | implementation-source | approved | Items 4 and 1 contracts, including the spike-first note for surface enumeration. |
| `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` | constraint | approved | FD-010/FD-011 rows. |
| `src/task/task-finalize.ts` | reference | implemented | Existing plan-hash guard is reused, not replaced (0.5 RFC section 5.3 principle: fold the round trip, keep the snapshot safety). |
| `src/services/package-smoke.ts` | reference | implemented | Installed-prefix execution path provides the artifact-side probe point. |

## Changes

| Area | Summary |
|---|---|
| Finalize auto path | `task-finalize.ts` gains a guarded `--auto` execute path (internal review, zero-write refusal on known blockers, fresh-recompute execute through the existing plan-hash mismatch guard) with a documented test seam. |
| CLI / docs | `cli/task.ts` passes `--auto`; registry command string and `docs/TASK_WORKFLOW_COMMANDS.md` document the path and its mutual exclusion with `--plan-hash`. |
| Drift gate | New `services/command-surface-drift.ts` pure helpers plus a `command-surface-drift` step in package-smoke local execution (dry-run/skip parity included), comparing installed registry ids against the source registry and installed routing tokens against installed registry verbs. |
| Tests | 4 auto tests, 7 drift helper tests (incl. source-parity guard on main), 2 drift injection fixtures, and updated package-smoke step-list/call-order expectations. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Drift-gate spike decision: enumeration compares (a) installed `commands --json` registry ids against source registry ids and (b) installed registry top-level verbs against `case '<verb>'` tokens statically parsed from the installed `dist/cli/main.js`. Handler-export contracts and `--help` parsing were rejected (invasive / fragile). Sub-command routing parity below the top level is not covered and is deferred. | Open | `docs/specs/0.4.1/rc0-scope.md` |
| RF-2 | Follow-up | The dev-tree-vs-artifact incident class is caught because the drift comparison baseline is the in-process source registry, not the artifact's own projection; a self-consistent stale artifact therefore still fails against current source. | Open | N/A |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-06 | Draft | Initial task scaffold. |
| 2026-07-06 | In Progress | Contract authored from rc0-scope items 4/1; spike decision recorded. |
| 2026-07-06 | Done | Implemented --auto and the drift gate; Docker full suite 1030/1030; built-CLI smokes recorded; capsule closed via --execute --auto as its own AC-1 dogfood. |
