# T-0584 v0.4.4 operator publish and installed-package recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0584 |
| Title | v0.4.4 operator publish and installed-package recycle |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Record completed public `hadara@0.4.4` npm/GitHub publication and verify installed consumer paths resolve to `0.4.4`. | Publish mutation already happened through the operator-controlled boundary; this capsule records the result and runs post-publish recycle only. |

## Scope

| Boundary | Items |
|---|---|
| In | Operator-supplied npm/GitHub publish result, npm registry verification for `hadara@0.4.4` and `hadara@latest`, installed-package recycle for `hadara@latest` expected `0.4.4`, release/state/handoff cleanup. |
| Out | Additional npm publish, GitHub Release mutation, source feature work, or broad release-note rewrites unless recycle finds a blocker. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Record operator-completed npm/GitHub publication result. | Done |
| 2 | Verify npm registry and GitHub Release public state. | Done |
| 3 | Execute installed-package recycle against `hadara@latest` expected `0.4.4`. | Done |
| 4 | Update release current-state/handoff and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Operator-completed npm publish for `hadara@0.4.4` is recorded with registry verification. | Done | `ev:T-0584:8ffea7cd42504ea5a177a54f`, `ev:T-0584:36991318909d46e59d2fce17` | User publish output |
| AC-2 | GitHub Release `v0.4.4` is public and non-draft. | Done | `ev:T-0584:36991318909d46e59d2fce17` | `gh release view` |
| AC-3 | Installed-package recycle for `hadara@latest` expected `0.4.4` passes from an isolated consumer path. | Done | `ev:T-0584:2058d34afba84221849ae6ab` | `hadara package recycle` |
| AC-4 | Current state and handoff describe `0.4.4` as published and recycled, with a sensible next-work candidate. | Done | `ev:T-0584:36991318909d46e59d2fce17`, `ev:T-0584:2058d34afba84221849ae6ab` | `.hadara/state/current.json`, projections |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Installed-package recycle | Yes | Passed | `ev:T-0584:2058d34afba84221849ae6ab` |
| Finalize close | Yes | Not Run | Close proof will be appended by `task finalize --execute --auto`. |
| npm and GitHub release verification | Yes | Passed | ev:T-0584:36991318909d46e59d2fce17 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User publish output | reference | active | npm publish and GitHub Release public publication completed outside this workspace. |
| `docs/RELEASE_READINESS.md` | reference | active | Defines post-publish installed-package recycle command and evidence expectations. |
| `tasks/T-0583-v0-4-4-stable-source-and-release-preparation` | reference | active | Source/readiness capsule that prepared the published artifact. |

## Changes

| Area | Summary |
|---|---|
| Release record | Recorded operator-completed npm publish and GitHub Release public publication. |
| Installed-package recycle | Verified `hadara@latest` resolves to `0.4.4`, installs in an isolated prefix, reports `packageVersion=0.4.4`, exposes 68 command ids, and passes init/task status/session/finalize/context pack/context slice smokes. |
| Current state | Updated structured state, PROJECT_STATE/HANDOFF projections, and RELEASE_READINESS to show stable `0.4.4` publication and recycle complete. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Registry or GitHub verification may require network access outside the sandbox. | Closed | `ev:T-0584:36991318909d46e59d2fce17`, `ev:T-0584:2058d34afba84221849ae6ab` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Recording completed public publish and starting post-publish recycle. |
| 2026-07-13 | In Progress | npm/GitHub verification and installed-package recycle passed; updating close-source docs. |
| 2026-07-13 | Done | Stable 0.4.4 publish and installed-package recycle recorded. |
