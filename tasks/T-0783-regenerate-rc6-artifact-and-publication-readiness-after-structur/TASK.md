# T-0783 Regenerate RC6 artifact and publication readiness after structural hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0783 |
| Title | Regenerate RC6 artifact and publication readiness after structural hardening |
| Status | Draft |
| Created | 2026-08-12T19:04 |
| Updated | 2026-08-12T19:04 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Produce a fresh exact `0.5.0-rc.6` release input from the completed T-0779 through T-0782 structural hardening and prepare a reviewed operator publication handoff. | No npm, GitHub, Docker-image, or public-consumer mutation occurs in this capsule. |

## Scope

| Boundary | Items |
|---|---|
| In | RC6 package/release metadata; managed current-state source version; clean committed source clone; exact tarball/checksum/manifest and logical locator; package and clean-checkout smokes; strict gate; release/publish dry-runs; byte-bound evidence; GitHub release note and operator handoff. |
| Out | npm/GitHub publication; Docker image mutation; public RC6 recycle; stable/latest promotion; runtime feature changes after artifact generation. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Retarget source/package/current-state/release notes to RC6 and commit the exact release input. | In Progress |
| 2 | Generate and retain exact RC6 artifact/checksum/manifest from a clean clone. | Pending |
| 3 | Run release gates, bind reduced reports, prepare operator handoff, and close. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | package.json, lockfile, built CLI, release notes, and managed current state consistently identify source candidate `0.5.0-rc.6`; public state remains RC5/next and 0.4.6/latest. | Pending | TBD | source retarget |
| AC-2 | Exact RC6 `.tgz`, checksum, and manifest are generated from one clean committed source root and retained under `$HADARA_RELEASE_WORKSPACE/0.5.0-rc.6/`. | Pending | TBD | artifact report |
| AC-3 | Package smoke, clean-checkout smoke, strict gate, release dry-run, and publish dry-run pass against the RC6 release input with no external mutation. | Pending | TBD | release gates |
| AC-4 | Canonical evidence byte-binds sanitized release reports and evidence lint passes. | Pending | TBD | evidence artifact binding |
| AC-5 | Post-close HANDOFF creates a separate operator publication/recycle capsule and names the exact logical artifact locator. | Pending | TBD | operator handoff |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Package/source version and managed current-state reconciliation | Yes | Not Run | RC6 source candidate; RC5/0.4.6 public facts retained. | TBD |
| Exact artifact generation and retention | Yes | Not Run | Clean committed source, tarball/checksum/manifest hashes. | TBD |
| Package and clean-checkout smokes | Yes | Not Run | Exact artifact and clean clone validation. | TBD |
| Strict gate, release dry-run, publish dry-run | Yes | Not Run | No external mutation. | TBD |
| Evidence lint and close | Yes | Not Run | Byte-bound reports and proof-last close. | TBD |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5.0-rc6/00_TERMINAL_LIFECYCLE_EVIDENCE_AND_CLOSE_CURRENTNESS_HARDENING.md` | design | active | RC6 release consequence and final follow-up contract. |
| T-0780 through T-0782 close proofs | constraint | active | Packaged structural hardening requiring a new artifact. |
| `docs/RELEASE_READINESS.md` | reference | active | Root separation, retention, gates, and managed current-state authority. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Later operator capsule must consume retained exact bytes. |

## Changes

| Area | Summary |
|---|---|
| Package/release docs | RC6 source retarget planned; public RC5 and stable 0.4.6 remain observed state. |
| Artifact | Exact clean-source generation and stable logical retention planned. |
| Evidence/handoff | Byte-bound reduced reports and separate operator publication continuation planned. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | npm/GitHub publication and public `--terminal-lifecycle` recycle require a separate approved operator capsule. | Deferred | Post-close HANDOFF. |
| RF-2 | Risk | Any packaged-source change after artifact generation invalidates RC6 readiness. | Open | Regenerate instead of reusing bytes. |

## Close Summary


## History

| Date | State | Note |
|---|---|---|
| 2026-08-12 | Draft | Initial task scaffold. |
| 2026-08-12 | In Progress | Scope fixed to RC6 source retarget, exact artifact/readiness evidence, and no external mutation. |
