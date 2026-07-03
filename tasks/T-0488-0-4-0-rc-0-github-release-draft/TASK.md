# T-0488 0.4.0-rc.0 GitHub Release draft

## Identity

| Field | Value |
|---|---|
| ID | T-0488 |
| Title | 0.4.0-rc.0 GitHub Release draft |
| Status | Done |
| Created | 2026-07-03 |
| Updated | 2026-07-03 |

## Goal

| Goal | Notes |
|---|---|
| Prepare or create the skipped GitHub Release draft for `hadara@0.4.0-rc.0`. | The npm RC is already published on `next`; this capsule closes the separate GitHub Release draft decision before stable promotion. |

## Scope

| Boundary | Items |
|---|---|
| In | Finalize a GitHub Release note body for `v0.4.0-rc.0`; verify npm registry metadata; identify the conservative GitHub tag target; check GitHub CLI auth/release state; create the draft if authentication works, otherwise record the exact blocked state and operator command. |
| Out | Publishing stable `0.4.0`, changing npm dist-tags, rebuilding the npm tarball, Docker/PyPI publishing, installer execution, or changing release-line code. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the release-draft contract. | Done |
| 2 | Prepare final release note and command artifact. | Done |
| 3 | Verify registry/GitHub state and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `GITHUB_RELEASE_NOTE_FINAL.md` contains a concrete `v0.4.0-rc.0` draft body with highlights, install command, target commit, npm dist-tag state, tarball shasum, boundaries, and next stable-promotion steps. | Met | `ev:T-0488:32d47dcfa9ae4d9894fc02f0` | `tasks/T-0488-0-4-0-rc-0-github-release-draft/artifacts/GITHUB_RELEASE_NOTE_FINAL.md` |
| AC-2 | GitHub Release handling is explicit: either a draft prerelease exists for `v0.4.0-rc.0`, or the blocked auth/API state and exact operator command are recorded. | Met | `ev:T-0488:32d47dcfa9ae4d9894fc02f0` | GitHub CLI / `artifacts/GITHUB_RELEASE_COMMANDS.md` |
| AC-3 | Registry/release checks, docs diff hygiene, and done-level capsule validation are recorded as evidence. | Met | `ev:T-0488:32d47dcfa9ae4d9894fc02f0`, `ev:T-0488:31555b999fdf425796ee1a1d` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm registry metadata | Yes | Passed | `ev:T-0488:32d47dcfa9ae4d9894fc02f0` |
| GitHub auth/release state | Yes | Passed | `ev:T-0488:32d47dcfa9ae4d9894fc02f0` |
| Markdown/diff/harness validation | Yes | Passed | `ev:T-0488:31555b999fdf425796ee1a1d` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` | reference | implemented | Required capsule 7: `0.4.0-rc.0` GitHub Release draft. |
| `tasks/T-0477-0-4-0-rc-0-release-readiness-and-notes/GITHUB_RELEASE_NOTE.md` | reference | implemented | Original RC GitHub release note draft from source readiness. |
| `docs/RELEASE_NOTES.md` | reference | implemented | Package-facing release notes for `0.4.0-rc.0`. |
| `docs/RELEASE_READINESS.md` | reference | implemented | npm RC publish state and release target boundaries. |

## Changes

| Area | Summary |
|---|---|
| Release note artifact | Added final `v0.4.0-rc.0` GitHub Release draft body with install command, npm metadata, target commit, highlights, boundaries, and next steps. |
| GitHub command artifact | Added create/view commands and recorded the successful draft verification fields. |
| Shared state docs | Updated README, release notes/readiness, Project State, Agent Handoff, and Task Board with the draft release state and next stable readiness decision. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | GitHub draft URLs for unpublished draft releases may use an `untagged-*` URL even while the release view reports `tagName=v0.4.0-rc.0`. | Accepted | `ev:T-0488:32d47dcfa9ae4d9894fc02f0` |
| RF-2 | Follow-up | Stable readiness decision remains a separate pre-stable capsule after this GitHub Release draft decision. | Open | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-03 | Draft | Initial task scaffold. |
| 2026-07-03 | In Progress | Scoped the release capsule to final RC GitHub Release draft handling without stable publish or release-line code changes. |
| 2026-07-03 | Done | Created and verified the `v0.4.0-rc.0` GitHub draft prerelease. |
