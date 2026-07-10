# T-0575 v0.4.4 R1 dogfood UX findings cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0575 |
| Title | v0.4.4 R1 dogfood UX findings cleanup |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Close the R1 generated-doc and basic-profile dogfood UX gaps before v0.4.4. | Fix conventional version aliases, avoid false installed-package stale diagnostics, retire stale bootstrap next-work in current-state/session output, warn on unresolved Product metadata placeholders after task history exists, and harden Done validation for stale plan/handoff evidence placeholders. |

## Scope

| Boundary | Items |
|---|---|
| In | CLI version alias routing; runtime-version stale diagnostic scope; session/current-state bootstrap nextWork cleanup; docs doctor Product metadata placeholder warning; done-level validator checks for Pending/In Progress plan rows and placeholder handoff evidence; focused tests and built-CLI R1 smoke checks. |
| Out | Editing the external R1 dogfood project; changing init Product placeholder defaults; broad docs registry redesign; release packaging. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define R1 UX cleanup scope from T-0573/T-0574 dogfood reports. | Done |
| 2 | Patch CLI routing, runtime/session state, docs doctor, and done-level validation. | Done |
| 3 | Add regression tests for the R1 failure modes. | Done |
| 4 | Rebuild dist in Docker and smoke the fixed built CLI against the R1 project. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara --version` and `hadara -v` route to the version command. | Done | `ev:T-0575:a8e689410ea74b439ad6922e` | `src/cli/main.ts`; `tests/unit/runtime-version.test.ts` |
| AC-2 | Installed/external project `version --json` no longer reports `DIST_LOOKS_STALE` from the target project's own sources. | Done | `ev:T-0575:a8e689410ea74b439ad6922e` | `src/services/runtime-version.ts`; `tests/unit/runtime-version.test.ts` |
| AC-3 | `session start --json` no longer exposes bootstrap `Create first Task Capsule` next-work once task history exists. | Done | `ev:T-0575:a8e689410ea74b439ad6922e` | `src/context/session-start.ts`; `src/services/project-current-state.ts`; `tests/unit/session-start.test.ts` |
| AC-4 | `docs doctor` warns when generated Project metadata still contains Product placeholders after completed task history exists. | Done | `ev:T-0575:a8e689410ea74b439ad6922e` | `src/services/docs-registry.ts`; `tests/unit/docs-doctor.test.ts` |
| AC-5 | Done-level validation rejects closed capsules with Pending/In Progress plan rows or placeholder handoff evidence ids. | Done | `ev:T-0575:a8e689410ea74b439ad6922e` | `src/harness/validate.ts`; `tests/harness/harness-validate.test.ts` |
| AC-6 | Dist was refreshed through the HADARA-dev Docker workflow and the full suite passed. | Done | `ev:T-0575:ded5c44171ac4a719dec415b` | `npm run dev:docker-sync-build` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused regression tests | Yes | Passed | `ev:T-0575:91c5965a97ff4e5c9ad86db2` |
| Docker sync build and full suite | Yes | Passed | `ev:T-0575:ded5c44171ac4a719dec415b` |
| Built CLI R1 smoke checks | Yes | Passed | `ev:T-0575:a8e689410ea74b439ad6922e` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0573-v0-4-4-r1-delegated-agent-basic-profile-dogfood-pilot/R1_DELEGATED_DOGFOOD_REPORT.md` | reference | active | Delegated-agent R1 basic-profile dogfood findings. |
| `tasks/T-0574-v0-4-4-r1-dogfood-generated-docs-audit/R1_GENERATED_DOCS_AUDIT.md` | reference | active | Generated docs and task-capsule audit findings. |
| `/mnt/f/NowWorking/dev/hadara-r1-basic-dogfood` | reference | active | External R1 project used for built-CLI repro/smoke checks; not edited by this capsule. |

## Changes

| Area | Summary |
|---|---|
| CLI routing | Added conventional `--version` and `-v` aliases to the version command. |
| Runtime diagnostics | Scoped stale dist/source comparison to project-local CLI entries so installed CLI runs do not compare against arbitrary target-project sources. |
| Current state/session | Retired bootstrap next-work when completing tasks and scrubbed stale bootstrap next-work from session-start projections once task history exists. |
| Docs doctor | Added Product metadata placeholder warning after completed task history exists. |
| Done validator | Blocked Done capsules with Pending/In Progress plan rows and placeholder handoff evidence references. |
| Tests/dist | Added regression tests, ran focused tests, refreshed dist through Docker, and ran the full suite. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Evidence append supports safe serialization, but independent post-fact evidence records are easy to append in parallel by mistake; consider a future batch append UX. | Open | `.hadara/local/feedback/T-0575-evidence-append-operator-friction.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Implemented R1 dogfood UX cleanup and regression tests. |
| 2026-07-10 | Done | Focused tests, Docker build/full suite, and built-CLI R1 smokes passed. |
