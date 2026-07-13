# T-0580 v0.4.4-rc.0 operator publish and installed-package recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0580 |
| Title | v0.4.4-rc.0 operator publish and installed-package recycle |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Verify the operator-published `hadara@0.4.4-rc.0` npm/GitHub release and complete installed-package recycle from consumer paths. | Correct GitHub prerelease metadata if needed, record publication evidence, and keep stable `latest` on `0.4.3`. |

## Scope

| Boundary | Items |
|---|---|
| In | npm registry verification for `hadara@0.4.4-rc.0`, GitHub Release verification for `v0.4.4-rc.0`, GitHub prerelease metadata correction, installed-package recycle for `hadara@next` expected `0.4.4-rc.0`, release docs/current-state updates, evidence and close proof. |
| Out | New source version changes, stable `latest` promotion, Docker/PyPI/installer publication, post-RC feature work. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Verify npm registry and GitHub Release publication state. | Done |
| 2 | Correct GitHub Release prerelease metadata if necessary. | Done |
| 3 | Run installed-package recycle from `hadara@next`. | Done |
| 4 | Update release-facing docs/current state and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | npm registry reports `hadara@0.4.4-rc.0` and dist-tags preserve `latest=0.4.3`, `next=0.4.4-rc.0`. | Met | `ev:T-0580:27a8f81a98ab49b28f8c87d2` | `npm view hadara@0.4.4-rc.0 version dist-tags --json` |
| AC-2 | GitHub Release `v0.4.4-rc.0` is public and marked prerelease. | Met | `ev:T-0580:82f354a6e17a4fe08b737138` | `gh release view v0.4.4-rc.0` |
| AC-3 | Installed-package recycle for `hadara@next` expected `0.4.4-rc.0` passes from consumer paths. | Met | `ev:T-0580:aab1eee8f7b449148907312c` | `package recycle --execute` |
| AC-4 | Release-facing docs and current-state projection reflect publish/recycle completion without claiming stable promotion. | Met | `ev:T-0580:27a8f81a98ab49b28f8c87d2` | `README.md`, `docs/RELEASE_READINESS.md`, `docs/RELEASE_NOTES.md`, `.hadara/state/current.json` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm registry verification | Yes | Passed | `ev:T-0580:27a8f81a98ab49b28f8c87d2` |
| GitHub Release verification | Yes | Passed | `ev:T-0580:82f354a6e17a4fe08b737138` |
| Installed-package recycle | Yes | Passed | `ev:T-0580:aab1eee8f7b449148907312c` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0579-v0-4-4-rc-0-release-readiness-and-publish-preparation/TASK.md` | reference | active | Source/readiness and release note capsule for `0.4.4-rc.0`. |
| `tasks/T-0579-v0-4-4-rc-0-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` | reference | active | GitHub Release note used by the operator publish flow. |
| `docs/RELEASE_READINESS.md` | implementation-source | active | Release publication and recycle status source. |
| `README.md` | implementation-source | active | Package-facing release status table. |

## Changes

| Area | Summary |
|---|---|
| npm release | Verified `hadara@0.4.4-rc.0` is published on `next` while `latest` remains `0.4.3`. |
| GitHub Release | Verified `v0.4.4-rc.0` is public prerelease after correcting initial prerelease metadata. |
| Installed recycle | Ran consumer-path recycle for `hadara@next` expected `0.4.4-rc.0`; installed CLI version, command surface, init/status/session/finalize/context pack/context slice smokes passed. |
| Docs/state | Updated README, release notes/readiness, and current-state projections for published RC status. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Decide stable `0.4.4` promotion only after RC observation and any follow-up dogfood judged necessary. | Open | Future Task Capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | Done | Verified npm/GitHub RC publication, corrected GitHub prerelease metadata, completed installed-package recycle, and updated release-facing docs/state. |
