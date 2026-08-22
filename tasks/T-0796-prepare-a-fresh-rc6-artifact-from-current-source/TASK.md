# T-0796 Prepare a fresh RC6 artifact from current source

## Identity

| Field | Value |
|---|---|
| ID | T-0796 |
| Title | Prepare a fresh RC6 artifact from current source |
| Status | Done |
| Created | 2026-08-22T22:59 |
| Updated | 2026-08-22T23:26 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Produce and retain a fresh exact `0.5.0-rc.6` release artifact from the current committed source, with release-readiness evidence ready for a separate operator publication capsule. | No npm, GitHub, registry, Docker-image, or public-consumer mutation occurs in this capsule. |

## Scope

| Boundary | Items |
|---|---|
| In | Current source/package version reconciliation, clean Docker ext4 source clone, build, exact tarball/checksum/manifest retention, package and clean-checkout smokes, strict gate, release dry-run, publish dry-run, evidence attachment, and operator handoff. |
| Out | npm/GitHub publication, GitHub tag or release mutation, public package recycle, stable/latest promotion, Docker image publication, and source changes after artifact freeze. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reconcile the current committed source and release target as `0.5.0-rc.6`, then freeze the source commit. | Done |
| 2 | Generate the exact RC6 artifact from a clean sourceRoot and retain its tarball/checksum/manifest under the release workspace. | Done |
| 3 | Run package/readiness gates and dry-runs, attach byte-bound evidence, and prepare the operator handoff. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Current package metadata, built CLI, and managed release state consistently identify the source candidate `0.5.0-rc.6`; public release facts remain unchanged. | Met | `ev:T-0796:ac12337f30834c0eb91ba498`; `ev:T-0796:357e227e41de4da987408220` | `package.json`; `docs/RELEASE_READINESS.md`; managed current-state block |
| AC-2 | Exact `0.5.0-rc.6` `.tgz`, checksum, and manifest are generated from one clean committed sourceRoot and retained at the reviewed `$HADARA_RELEASE_WORKSPACE/T-0796/0.5.0-rc.6` locator. | Met | `ev:T-0796:ac12337f30834c0eb91ba498` | `docs/RELEASE_READINESS.md`; release artifact journal |
| AC-3 | Package smoke, clean-checkout smoke, strict release gate, release dry-run, and publish dry-run pass against the fresh artifact without external mutation. | Met | `ev:T-0796:38d789184a4e4ecaa6b44a09`; `ev:T-0796:8f8a6f0708dc4f7eb56b4f5d`; `ev:T-0796:d6ded1df8b8347b7a9780d13`; `ev:T-0796:357e227e41de4da987408220`; `ev:T-0796:836f37c975164c959252075f`; `ev:T-0796:1b4a0fff88f54a7da7610329` | `docs/RELEASE_READINESS.md`; release reports |
| AC-4 | Sanitized release reports and the artifact journal are attached as byte-bound task evidence, and the handoff records the exact artifact locator and next operator capsule. | Met | `ev:T-0796:ac12337f30834c0eb91ba498`; `ev:T-0796:836f37c975164c959252075f` | T-0796 evidence; `HANDOFF.md` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Source/package/current-state reconciliation | Yes | Passed | Current committed source `e8143c0f` builds as package and CLI version `0.5.0-rc.6`; release dry-run reports the same commit/input hash and readiness. | `ev:T-0796:ac12337f30834c0eb91ba498`; `ev:T-0796:836f37c975164c959252075f` |
| Fresh artifact generation and retention | Yes | Passed | Fresh tarball/checksum/manifest generated from clean sourceRoot and retained under `$HADARA_RELEASE_WORKSPACE/T-0796/0.5.0-rc.6`; tarball SHA-256 `sha256:f078d6edc4529943dd0842b787a6dc98fb04e4bdbefbd7e138dbcfe6c4202e1f`. | `ev:T-0796:ac12337f30834c0eb91ba498` |
| Package and clean-checkout smokes | Yes | Passed | Explicit-root package smoke and retry clean-checkout smoke passed against the same release input hash and tarball; initial default-timeout clean-checkout attempt is preserved and explicitly resolved as environment evidence. | `ev:T-0796:38d789184a4e4ecaa6b44a09`; `ev:T-0796:ad85142b369a420f9083cb7c`; `ev:T-0796:8f8a6f0708dc4f7eb56b4f5d`; `ev:T-0796:3419c1925b564e0f82ef93fa` |
| Strict gate, release dry-run, and publish dry-run | Yes | Passed | All readiness and publish planning checks passed; npm/GitHub/Docker mutation did not execute. | `ev:T-0796:357e227e41de4da987408220`; `ev:T-0796:836f37c975164c959252075f`; `ev:T-0796:1b4a0fff88f54a7da7610329` |
| Evidence integrity and handoff | Yes | Passed | Release artifact, smoke summaries, and validation records are byte-bound in the capsule; exact retained locator and next operator capsule are documented. | `ev:T-0796:ac12337f30834c0eb91ba498`; `ev:T-0796:836f37c975164c959252075f` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RELEASE_READINESS.md` | constraint | active | Canonical recycle order, root separation, artifact retention, and no-mutation boundaries. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Capsule authoring, evidence, and proof-last close semantics. |
| T-0794/T-0795 handoffs | background | active | Recovery is complete; fresh RC6 bytes must be prepared before operator publication. |
| `package.json`; `package-lock.json` | implementation-source | active | Current package identity and reproducible dependency input. |
| `tools/dev-surfaces.ts`; `scripts/release/prepare-publish-env.sh` | implementation-source | active | Canonical artifact, smoke, gate, and release environment command surfaces. |

## Changes

| Area | Summary |
|---|---|
| Source freeze | Freeze the current committed source and reconcile the RC6 package/current-state identity before generating bytes. |
| Artifact | Generate and retain exact RC6 tarball/checksum/manifest from a clean container-native sourceRoot. |
| Readiness | Produce package/clean-checkout smoke, strict gate, release dry-run, and publish dry-run evidence with no external mutation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Publish npm `next`, prepare GitHub draft/tag, and run public package recycle in separate approved capsules. | Open | `HANDOFF.md`; `docs/RELEASE_READINESS.md` |
| RF-2 | Risk | Any source/package change after artifact generation invalidates the retained RC6 readiness evidence. | Open | Artifact source commit and release-input hash |
| RF-3 | Risk | Default clean-checkout run hit the 30-second Vitest timeout under Docker resource contention. | Mitigated | Retry with `HADARA_VITEST_TEST_TIMEOUT_MS=120000` passed; `ev:T-0796:ad85142b369a420f9083cb7c`; `ev:T-0796:8f8a6f0708dc4f7eb56b4f5d`; resolution `ev:T-0796:3419c1925b564e0f82ef93fa` |

## Close Summary

Fresh RC6 artifact preparation is complete from source commit `e8143c0f`. Exact bytes are retained at `$HADARA_RELEASE_WORKSPACE/T-0796/0.5.0-rc.6`, all readiness dry-runs pass, and npm/GitHub publication plus public consumer recycle remain in a separate operator capsule.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-22 | Draft | Initial task scaffold. |
| 2026-08-22 | Draft | Authored the fresh RC6 source-freeze, artifact-retention, readiness-gate, and operator-handoff contract. |
| 2026-08-22 | Done | Generated and retained fresh RC6 bytes, passed package/clean-checkout/readiness validation, and prepared the operator handoff without external mutation. |
