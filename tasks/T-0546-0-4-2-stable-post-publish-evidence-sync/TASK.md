# T-0546 0.4.2 stable post-publish evidence sync

## Identity

| Field | Value |
|---|---|
| ID | T-0546 |
| Title | 0.4.2 stable post-publish evidence sync |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Record stable `0.4.2` post-publish state. | Capture completed npm and GitHub Release publication evidence after T-0545, then route the next release-line step to installed-package recycle. |

## Scope

| Boundary | Items |
|---|---|
| In | npm registry verification for `hadara@0.4.2`; public GitHub Release `v0.4.2` verification; release readiness/project/handoff state updates. |
| Out | Running npm publish, creating or editing GitHub Releases, installed-package recycle execution, source/package version changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Record npm and GitHub post-publish evidence. | Done |
| 2 | Update release state docs to point at installed-package recycle. | Done |
| 3 | Validate and close this evidence-sync capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | npm registry state records `hadara@0.4.2` as published stable with `latest=0.4.2` and `next=0.4.2-rc.0`. | Met | `ev:T-0546:3c8c27ba0ba649a492a80c65` | npm registry |
| AC-2 | GitHub Release `v0.4.2` is public stable (`isDraft=false`, `isPrerelease=false`) and targets the T-0545 source-prep commit. | Met | `ev:T-0546:64796a1c07f44c3888f00f0f` | GitHub Release |
| AC-3 | Shared release state docs no longer route operators to publish; they route to installed-package recycle for `hadara@latest` expected `0.4.2`. | Met | `docs/RELEASE_READINESS.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` | `docs/RELEASE_READINESS.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm registry verification | Yes | Passed | `ev:T-0546:3c8c27ba0ba649a492a80c65` |
| GitHub Release verification | Yes | Passed | `ev:T-0546:64796a1c07f44c3888f00f0f` |
| Release state doc diff review | Yes | Passed | `ev:T-0546:1f51fb24afd6411a916434d6` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0545 release readiness capsule | reference | active | Stable source/readiness and GitHub Release note artifact prepared before external publish. |
| npm publish operator output | reference | active | User reported successful publish and npm view verification for `hadara@0.4.2`. |
| GitHub Release operator output | reference | active | User reported draft creation and public release edit for `v0.4.2`; workspace `gh release view` verified final metadata. |

## Changes

| Area | Summary |
|---|---|
| Release evidence | Recorded npm and GitHub post-publish evidence in T-0546. |
| Release state docs | Updated release readiness, project state, and handoff from publish-prep state to post-publish recycle state. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Run stable `0.4.2` installed-package recycle from consumer paths using `hadara@latest` expected `0.4.2`. | Open | `docs/RELEASE_READINESS.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | In Progress | npm and GitHub publication evidence recorded; shared state docs are being updated. |
| 2026-07-09 | In Progress | Release state docs updated and diff hygiene validated. |
