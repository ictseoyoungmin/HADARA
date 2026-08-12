# T-0783 Regenerate RC6 artifact and publication readiness after structural hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0783 |
| Title | Regenerate RC6 artifact and publication readiness after structural hardening |
| Status | Done |
| Created | 2026-08-12T19:04 |
| Updated | 2026-08-12T10:18 |

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
| 1 | Retarget source/package/current-state/release notes to RC6 and commit the exact release input. | Done |
| 2 | Generate and retain exact RC6 artifact/checksum/manifest from a clean clone. | Done |
| 3 | Run release gates, bind reduced reports, and prepare the terminal operator handoff. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | package.json, lockfile, built CLI, release notes, and managed current state consistently identify source candidate `0.5.0-rc.6`; public state remains RC5/next and 0.4.6/latest. | Met | `ev:T-0783:f12f21e3e0884a24ade77e45` | source retarget |
| AC-2 | Exact RC6 `.tgz`, checksum, and manifest are generated from one clean committed source root and retained under `$HADARA_RELEASE_WORKSPACE/0.5.0-rc.6/`. | Met | `ev:T-0783:0805a5338ba34c87aefe2100`, `ev:T-0783:f12f21e3e0884a24ade77e45` | artifact report |
| AC-3 | Package smoke, clean-checkout smoke, strict gate, release dry-run, and publish dry-run pass against the RC6 release input with no external mutation. | Met | `ev:T-0783:a73305de831142dfa4faa695`, `ev:T-0783:c5950329c26a495fb8dad272`, `ev:T-0783:f12f21e3e0884a24ade77e45` | release gates |
| AC-4 | Canonical evidence byte-binds sanitized release reports and evidence lint passes. | Met | `ev:T-0783:ef391acdcc3c4eb582916d3a` | evidence artifact binding |
| AC-5 | Post-close HANDOFF creates a separate operator publication/recycle capsule and names the exact logical artifact locator. | Met | `ev:T-0783:f12f21e3e0884a24ade77e45` | operator handoff |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Package/source version and managed current-state reconciliation | Yes | Passed | RC6 source candidate; RC5/0.4.6 public facts retained. The strict gate now consumes the managed source row instead of historical version prose. | `ev:T-0783:f12f21e3e0884a24ade77e45` |
| Exact artifact generation and retention | Yes | Passed | Clean commit `7ccd1634…`; tarball/checksum/manifest retained at the logical locator. | `ev:T-0783:0805a5338ba34c87aefe2100` |
| Package and clean-checkout smokes | Yes | Passed | Fresh exact-tarball smoke and clean-checkout full check passed with matching release-input identity. | `ev:T-0783:a73305de831142dfa4faa695`, `ev:T-0783:c5950329c26a495fb8dad272` |
| Strict gate, release dry-run, publish dry-run | Yes | Passed | Readiness is ready; no npm, GitHub, Docker, latest, or public-consumer mutation occurred. | `ev:T-0783:f12f21e3e0884a24ade77e45` |
| Evidence integrity and lint | Yes | Passed | Nine canonical records are preserved; all attached artifacts are byte-bound and lint reports zero issues. | `ev:T-0783:ef391acdcc3c4eb582916d3a` |

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
| Package/release docs | Retargeted source to RC6 while keeping public RC5/next and stable 0.4.6 as observed state. |
| Release gate | Replaced the duplicated historical `Current version` dependency with the managed `Source version` row and added focused regression coverage. |
| Artifact | Generated exact RC6 tarball/checksum/manifest from clean commit `7ccd1634…` and retained them under the stable logical locator. |
| Evidence/handoff | Byte-bound artifact, smoke, readiness, and lint reports; preserved the failed reused-path attempt and its fresh-path resolution; prepared a separate publication continuation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | npm/GitHub publication and public `--terminal-lifecycle` recycle require a separate approved operator capsule. | Deferred | `ev:T-0783:f12f21e3e0884a24ade77e45` |
| RF-2 | Risk | Any packaged-source change after commit `7ccd1634…` invalidates RC6 readiness. | Open | `ev:T-0783:0805a5338ba34c87aefe2100` |
| RF-3 | Risk | Reusing an initialized explicit smoke-project path makes package smoke fail; the failed record is preserved and a fresh-path rerun passed. | Mitigated | `ev:T-0783:9ec98fa06a184bf5a8c2549f`, `ev:T-0783:a73305de831142dfa4faa695` |

## Close Summary

RC6 release preparation is complete from clean source commit `7ccd1634…`. Exact retained bytes,
full clean-checkout validation, strict/release/publish dry-runs, and byte-bound evidence pass with no
external mutation. Publication and public terminal-lifecycle acceptance belong to a new operator
capsule.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-12 | Draft | Initial task scaffold. |
| 2026-08-12 | In Progress | Scope fixed to RC6 source retarget, exact artifact/readiness evidence, and no external mutation. |
| 2026-08-12 | In Progress | Strict gate exposed a stale historical-version dependency; fixed it to consume the managed source-state projection and invalidated the preliminary artifact evidence. |
| 2026-08-12 | Done | Final clean-source RC6 artifact, smokes, gates, byte-bound evidence, and terminal operator handoff are complete. |
