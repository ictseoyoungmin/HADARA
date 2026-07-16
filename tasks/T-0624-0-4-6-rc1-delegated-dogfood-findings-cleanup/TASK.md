# T-0624 0.4.6 rc1 delegated dogfood findings cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0624 |
| Title | 0.4.6 rc1 delegated dogfood findings cleanup |
| Status | Done |
| Created | 2026-07-16 |
| Updated | 2026-07-16 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Clean up general-user dogfood findings from the 0.4.6-rc.1 installed-package recycle before stable readiness is rerun. | Focus on scaffold/diagnostic friction that affected a fresh delegated project, not HADARA-dev-only release plumbing. |

## Scope

| Boundary | Items |
|---|---|
| In | Governed/minimal profile diagnostics must not require optional docs that init intentionally does not scaffold.<br>Generated workflow/task guidance must make lifecycle-owned status fields explicit.<br>Generated docs must document the installed-package `--no-bin-links` / direct `node dist/cli/main.js` fallback for environments where npm cannot create bin shims. |
| Out | Re-running rc.1 release readiness/publish helpers.<br>Changing every JSON read-model command string to a configurable entrypoint prefix.<br>Adding new init profile options. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract from T-0623 dogfood findings. | Done |
| 2 | Update profile diagnostics and generated guidance. | Done |
| 3 | Validate focused tests/build and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh governed/minimal projects no longer emit profile-required-doc warnings for optional docs absent by design. | Met | `ev:T-0624:db6bea4aef7543ac804489b0` | `tasks/T-0623-0-4-6-rc1-installed-package-recycle-and-delegated-dogfood/DOGFOOD_REPORT.md` |
| AC-2 | Generated workflow/task guidance tells agents not to hand-edit lifecycle-owned status fields and to use finalize/status instead. | Met | `ev:T-0624:73a022a3a7144cc1b9131563` | `.hadara/local/feedback/T-0623-rc1-delegated-dogfood-findings.md` |
| AC-3 | Generated docs describe the `--no-bin-links` installed-package fallback and direct Node entrypoint for environments without npm bin shims. | Met | `ev:T-0624:73a022a3a7144cc1b9131563` | `tasks/T-0623-0-4-6-rc1-installed-package-recycle-and-delegated-dogfood/DOGFOOD_REPORT.md` |
| AC-4 | Validation evidence is recorded. | Met | `ev:T-0624:73a022a3a7144cc1b9131563`, `ev:T-0624:b866deb7bb2646abb9bb4187`, `ev:T-0624:db6bea4aef7543ac804489b0` | This capsule |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit tests | Yes | Passed | `ev:T-0624:73a022a3a7144cc1b9131563` |
| TypeScript build / Docker sync build | Yes | Passed | `ev:T-0624:b866deb7bb2646abb9bb4187` |
| Fresh governed built-CLI smoke | Yes | Passed | `ev:T-0624:db6bea4aef7543ac804489b0` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0623-0-4-6-rc1-installed-package-recycle-and-delegated-dogfood/DOGFOOD_REPORT.md` | reference | active | Installed-package delegated dogfood findings. |
| `.hadara/local/feedback/T-0623-rc1-delegated-dogfood-findings.md` | reference | active | Local-only detailed UX feedback; not committed. |
| `src/services/protocol-profile.ts` | implementation | active | Profile consistency diagnostics. |
| `src/init/templates.ts` | implementation | active | Generated workflow docs. |
| `src/task/task-capsule.ts` | implementation | active | Task capsule scaffold. |

## Changes

| Area | Summary |
|---|---|
| Profile diagnostics | Optional profile docs are no longer treated as missing merely because a profile exists; only core/generated required docs and present optional docs participate in required-reading/profile diagnostics. |
| Generated workflow docs | Added lifecycle-owned status guidance and package-manager-neutral `--no-bin-links` direct-entrypoint fallback guidance. |
| Task scaffold | Added a lifecycle note that instructs agents not to hand-edit Identity/Task Board status to close work. |
| Tests | Updated profile consistency/init/task-capsule tests to match the minimal init + optional docs-add contract. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | T-0620 rc.1 readiness evidence is stale after later code changes; rerun release readiness in the next release capsule. | Open | T-0620/T-0621/T-0624 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-16 | Draft | Initial task scaffold. |
| 2026-07-16 | In Progress | Scoped T-0623 delegated dogfood cleanup. |
| 2026-07-16 | Done | Implemented and validated delegated dogfood findings cleanup. |
