# T-0793 Correct validation recovery identity and release publication tooling

## Identity

| Field | Value |
|---|---|
| ID | T-0793 |
| Title | Correct validation recovery identity and release publication tooling |
| Status | Done |
| Created | 2026-08-22T17:17 |
| Updated | 2026-08-22T17:32 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make wrapper-failure recovery executable without losing validation identity, and make interrupted npm publication recoverable without republishing immutable bytes. | Direct-result guidance preserves the original non-sensitive command argv; release helper derives the configured remote after parsing and supports a guarded GitHub-only resume from retained artifact bytes. |

## Scope

| Boundary | Items |
|---|---|
| In | `validation run` blocked next-action guidance, generated/current/public validation docs, capability help, release helper argument parsing, partial npm publication reports, retained-artifact lineage, GitHub draft resume, and regression tests. |
| Out | npm/GitHub publication itself, RC6 artifact generation or external release mutation, package metadata identity, broad evidence-schema redesign, and unrelated historical docs. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Map the worker findings to validation recovery, release helper, docs, and test owners. | Done |
| 2 | Preserve original argv in safe direct-result guidance and synchronize current/generated/public docs. | Done |
| 3 | Correct post-parse GitHub remote derivation and add guarded GitHub-only partial-publication recovery. | Done |
| 4 | Run focused, HADARA-dev, Docker, source-hygiene, and recovery dogfood validation; prepare proof-last close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Blocked validation recovery guidance replays the original non-sensitive command argv after `--`, using shell-safe quoting; direct-result mode does not spawn the command again. | Met | ev:T-0793:558ef94618cb46e3adb5da8a | `src/services/validation-run.ts`; `tests/unit/validation-run.test.ts` |
| AC-2 | Current, generated, capability, and public validation docs explain that direct-result must retain original argv for exact check identity. | Met | ev:T-0793:558ef94618cb46e3adb5da8a | `docs/HADARA_WORKFLOW.md`; `src/init/templates.ts`; `src/services/capability-registry.ts`; `docs/site/content/docs/cli-evidence-validation.md` |
| AC-3 | Release helpers derive the default Git remote after parsing `--github-repo`, so an explicit repository cannot be paired with a stale default remote. | Met | ev:T-0793:7659a94c300c43b3a34a8d06 | `scripts/release/manual-publish-rc.sh`; `scripts/release/prepare-publish-env.sh` |
| AC-4 | An interrupted npm publication can resume with `--github-only` only after prior publication, retained bytes, checksum, package metadata, source release-input hash, registry version, and GitHub auth are verified; no second npm publish occurs. | Met | ev:T-0793:7659a94c300c43b3a34a8d06 | `scripts/release/manual-publish-rc.sh`; `tests/unit/manual-publish-script.test.ts`; `docs/RELEASE_READINESS.md` |
| AC-5 | Release publication itself remains out of scope; no RC6 artifact or external npm/GitHub mutation is performed by this capsule. | Met | ev:T-0793:7659a94c300c43b3a34a8d06 | T-0793 validation records and handoff |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Source hygiene | Yes | Passed | Shell syntax checks and git diff --check passed | ev:T-0793:33f6b9b689f246d79b807abd |
| Direct-result CLI recovery guidance | Yes | Passed | validation-run and help focused tests passed, including shell-safe argv recovery and sensitive-argv redaction | ev:T-0793:558ef94618cb46e3adb5da8a |
| Release helper partial-publication recovery | Yes | Passed | HADARA-dev manual publish helper regression passed 10 tests, including GitHub-only resume with no second npm publish | ev:T-0793:7659a94c300c43b3a34a8d06 |
| Docker full check | Yes | Passed | Canonical dev:docker-check passed core 131 files and 1,072 tests plus HADARA-dev 18 files and 145 tests, with build and tools typecheck | ev:T-0793:74671c05dd13448b8e487d83 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0792 HANDOFF and worker review | background | active | Establishes P1 ordering: recovery identity and release publication tooling before fresh RC6 generation. |
| `src/services/validation-run.ts` | implementation-source | active | Canonical validation argv identity and next-action generation. |
| `docs/HADARA_WORKFLOW.md`; `src/init/templates.ts`; `src/services/capability-registry.ts`; `docs/site/content/docs/cli-evidence-validation.md` | constraint | active | Current, generated, capability, and public validation guidance surfaces. |
| `scripts/release/manual-publish-rc.sh`; `scripts/release/prepare-publish-env.sh` | implementation-source | active | Release argument parsing, publication boundary, retained artifact, and recovery path. |
| `docs/RELEASE_READINESS.md` | constraint | active | Canonical release recycle order and partial-publication recovery procedure. |

## Changes

| Area | Summary |
|---|---|
| Validation recovery | Blocked next-action command now appends non-sensitive original argv after `--` with shell-safe quoting; sensitive argv is omitted from printed guidance to preserve redaction guarantees. |
| Validation documentation | Synchronized current workflow, generated templates, capability example, and public Evidence & Validation reference with exact check-identity semantics. |
| Release remote derivation | Default GitHub remote is computed after CLI parsing in both publish helpers; generated operator commands use the selected repository. |
| Partial publication recovery | Added `--github-only`, which validates the prior npm publication report, retained artifact bytes/checksum/package metadata, current source release-input hash, and registry version before the GitHub draft boundary; recovery asserts npm log stability in the fixture. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Fresh RC6 artifact generation and release publication remain intentionally deferred until this capsule closes and the source is frozen. | Open | T-0793 HANDOFF |
| RF-2 | Risk | Sensitive original argv cannot be printed in recovery guidance without violating default argv redaction. | Mitigated | `src/services/validation-run.ts`; sensitive-argv regression |

## Close Summary

This capsule closes the worker-requested P1 corrections: direct-result recovery preserves non-sensitive original command argv for exact validation identity, release helpers derive remotes after argument parsing, and interrupted npm publication has a guarded `--github-only` resume path. No external release mutation or RC6 artifact generation was performed.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-22 | Draft | Initial task scaffold. |
| 2026-08-22 | Draft | Implemented direct-result argv recovery, validation docs synchronization, post-parse remote derivation, and guarded GitHub-only publication recovery; focused tests passed. |
| 2026-08-22 | Done | Completed validation, evidence recording, and proof-last close preparation. |
