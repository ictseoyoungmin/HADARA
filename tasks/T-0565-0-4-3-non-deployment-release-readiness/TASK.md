# T-0565 0.4.3 non-deployment release readiness

## Identity

| Field | Value |
|---|---|
| ID | T-0565 |
| Title | 0.4.3 non-deployment release readiness |
| Status | In Progress |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Retarget source to `hadara@0.4.3` and prove the package from disposable source/consumer paths without deployment mutation. | Include measured local tarball installation, first capsule/close flow, artifact/package/clean-checkout smokes, strict gate, and release dry-run. |

## Scope

| Boundary | Items |
|---|---|
| In | Package/lock/current release version; README/release readiness/GitHub note; full Docker/dist sync; local tarball install measurement; disposable toy lifecycle; release artifact; package and clean-checkout smoke; strict gate; release dry-run; docs currentness. |
| Out | npm publish; npm dist-tag mutation; GitHub Release creation/publication; Docker/PyPI publish; token loading; deploy/publish helper execution; post-publish registry recycle; new public commands. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Retarget source metadata and release-facing state to stable 0.4.3. | Done |
| 2 | Build/test and install the local tarball into a disposable consumer prefix. | In Progress |
| 3 | Measure installed-package init-to-close behavior and run artifact/package/clean-checkout smokes. | Pending |
| 4 | Run strict release/readiness/currentness gates, record evidence, and close. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Package metadata, lockfile, built CLI, structured current release, README, and release docs agree on stable 0.4.3. | Pending | TBD | source/version checks |
| AC-2 | A locally packed 0.4.3 tarball installs into a disposable prefix and completes the measured standard profile lifecycle with package installation included. | Pending | TBD | installed-package measurement |
| AC-3 | Release artifact, package smoke, and clean-checkout smoke succeed from disposable workspaces and attach reduced evidence only. | Pending | TBD | release smoke evidence |
| AC-4 | Full Docker, strict release gate, release dry-run, docs doctor currentness, and diff checks pass. | Pending | TBD | readiness evidence |
| AC-5 | No publish/deployment helper, token load, registry mutation, or GitHub Release mutation runs. | Pending | TBD | command boundary review |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| 0.4.3 source metadata and full Docker | Yes | Passed | ev:T-0565:910e72184029437fb97f5c7e |
| Installed tarball measurement and consumer toy | Yes | Passed | ev:T-0565:e9c78040f1b2478eb6d695fd |
| Artifact/package/clean-checkout smoke | Yes | Passed | ev:T-0565:974b9b78995a42bc9fee14c0 |
| Strict gate, release dry-run, and currentness audit | Yes | Passed | ev:T-0565:f241c2bd2f384a98988f66d4 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RELEASE_READINESS.md` | implementation-source | active | Release and mutation boundaries. |
| `docs/TEST_STRATEGY.md` | implementation-source | active | Docker, package, and installed consumer proof. |
| T-0561 through T-0564 | reference | active | 0.4.3 implementation, measurement, and positioning proof. |
| User deployment exclusion | constraint | active | Do not run publish/deploy helpers or external release mutation. |

## Changes

| Area | Summary |
|---|---|
| source metadata | Retargeted package/lock/current release, onboarding examples, roadmap, release notes/readiness, and GitHub note to stable 0.4.3. |
| validation | Full Docker passed 153 files / 1052 tests and refreshed 0.4.3 dist; docs currentness is clean. |
| artifact preflight | Mounted-workspace artifact attempts recorded a git-status timeout; a clean source checkpoint is required before artifact proof. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | npm/GitHub publication and post-publish registry recycle remain operator-controlled work after this source readiness commit. | Deferred | future release capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Stable 0.4.3 non-deployment source/package/readiness scope accepted. |
| 2026-07-10 | In Progress | Source version and full Docker checkpoint completed before clean-worktree artifact generation. |
