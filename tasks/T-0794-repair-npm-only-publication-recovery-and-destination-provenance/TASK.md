# T-0794 Repair npm-only publication recovery and destination provenance

## Identity

| Field | Value |
|---|---|
| ID | T-0794 |
| Title | Repair npm-only publication recovery and destination provenance |
| Status | Done |
| Created | 2026-08-22T17:42 |
| Updated | 2026-08-22T17:50 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make npm publication recovery stateful and destination-safe. | Every npm mutation emits an immutable npm-only report; GitHub recovery consumes that report, rejects explicit registry/tag mismatches, and final reports record GitHub repository and git remote. |

## Scope

| Boundary | Items |
|---|---|
| In | Manual publish helper npm/report state transitions, `--github-only` recovery authority, registry/dist-tag mismatch guards, GitHub destination provenance, release schema compatibility, docs/runbook, and regression tests. |
| Out | RC6 artifact generation, npm/GitHub external mutation, package metadata changes, post-publish consumer recycle, and unrelated release history. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Map reviewer P1/P2 findings to report state, recovery authority, schema, docs, and tests. | Done |
| 2 | Always emit npm publication evidence, harden destination authority, and add GitHub provenance fields. | Done |
| 3 | Add npm-only/recovery/mismatch regressions and run full validation. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | npm mutation always writes `<version>-npm-publication-report.json`; GitHub success adds `<version>-operator-publication-report.json`; npm-only output points to `--github-only`. | Met | `ev:T-0794:15935bc2b76e4acb976d635d` | `scripts/release/manual-publish-rc.sh`; `tests/unit/manual-publish-script.test.ts` |
| AC-2 | `--github-only` adopts prior registry/dist-tag authority when no override is given and rejects explicit destination mismatches before GitHub mutation. | Met | `ev:T-0794:15935bc2b76e4acb976d635d` | `scripts/release/manual-publish-rc.sh`; `tests/unit/manual-publish-script.test.ts`; `docs/RELEASE_READINESS.md` |
| AC-3 | Final operator publication reports include GitHub repository and git remote, with schema/runtime compatibility preserved for older reports. | Met | `ev:T-0794:a591b96e657748ff884ea464` | `scripts/release/manual-publish-rc.sh`; `src/schemas/release-operator-publication.schema.json`; schema tests |
| AC-4 | No external release mutation or RC6 generation is performed by this capsule. | Met | `ev:T-0794:833e044b4bf74af798bda985` | T-0794 validation records |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| npm-only publication and GitHub-only recovery fixture | Yes | Passed | Fake npm/GitHub fixture proves npm report persistence, later GitHub recovery, and no second npm publish. | ev:T-0794:15935bc2b76e4acb976d635d |
| Destination mismatch fail-closed fixture | Yes | Passed | Registry A report plus registry B recovery fails before GitHub mutation. | ev:T-0794:15935bc2b76e4acb976d635d |
| Schema/runtime and release-state tests | Yes | Passed | New GitHub destination fields validate while legacy-compatible report shapes remain accepted. | ev:T-0794:a591b96e657748ff884ea464 |
| Docker full check | Yes | Passed | dev:docker-check passed: core 131 files/1072 tests and HADARA-dev 18 files/145 tests, including build and typecheck. | ev:T-0794:833e044b4bf74af798bda985 |
| Source hygiene | Yes | Passed | manual-publish-rc.sh passed bash -n and repository passed git diff --check. | ev:T-0794:2ba8ca10632b4d96bf69b22c |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer P1/P2 findings | background | active | Requires npm-only recovery state machine, destination authority guard, and GitHub destination provenance. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Canonical publication/recovery state transitions and report generation. |
| `src/schemas/release-operator-publication.schema.json`; `src/core/schema.ts` | implementation-source | active | Structured operator report contract and runtime registration. |
| `docs/RELEASE_READINESS.md` | constraint | active | Release recycle and recovery runbook. |

## Changes

| Area | Summary |
|---|---|
| Publication state | npm report is now always written after npm verification; final operator report is written only after GitHub mutation. |
| Destination authority | GitHub-only recovery imports prior registry/dist-tag when unspecified and fail-closes explicit mismatches before GitHub auth/mutation. |
| GitHub provenance | Generated operator reports include `github.repository` and `github.gitRemote`; schema accepts these fields without invalidating historical reports. |
| Documentation | Release readiness runbook now states the two-report state machine and destination checks. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Generate a fresh RC6 artifact and prepare publication in a separate capsule after this correction closes. | Open | T-0794 HANDOFF |
| RF-2 | Risk | Existing historical operator reports may omit GitHub destination fields. | Mitigated | Schema fields remain optional for backward compatibility; new helper output includes them. |

## Close Summary

Repaired npm-only publication recovery: npm evidence is always persisted separately, later `--github-only` recovery is destination-safe, and final operator reports record GitHub repository and git remote. No RC6 artifact or external release mutation was performed.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-22 | Draft | Initial task scaffold. |
| 2026-08-22 | Draft | Implemented npm-only report persistence, prior destination authority checks, GitHub provenance fields, runbook update, and recovery regressions. |
| 2026-08-22 | Done | Completed focused and Docker validation, recorded durable evidence, and prepared proof-last close. |
