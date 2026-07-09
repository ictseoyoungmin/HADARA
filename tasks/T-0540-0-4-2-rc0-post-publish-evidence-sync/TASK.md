# T-0540 0.4.2 rc0 post publish evidence sync

## Identity

| Field | Value |
|---|---|
| ID | T-0540 |
| Title | 0.4.2 rc0 post publish evidence sync |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Record completed `0.4.2-rc.0` npm and GitHub publication evidence. | The operator already ran the approval-gated publish steps. This capsule verifies/records the public outcomes and updates shared release state without performing additional publish mutation. |

## Scope

| Boundary | Items |
|---|---|
| In | npm registry verification for `hadara@0.4.2-rc.0`, operator-provided GitHub Release verification for `v0.4.2-rc.0`, shared release state updates, and next-step handoff for installed-package recycle. |
| Out | npm publish, GitHub Release create/edit, release artifact regeneration, package smoke execution, installer execution, Docker/PyPI publish, and installed-package recycle execution. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the post-publish evidence sync boundary. | Done |
| 2 | Verify npm registry metadata and record operator GitHub release output. | Done |
| 3 | Update shared state/release docs and next-step handoff. | Done |
| 4 | Validate the capsule and finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | npm registry verification shows `hadara@0.4.2-rc.0` is published and `next=0.4.2-rc.0` while stable `latest=0.4.1` remains unchanged. | Done | `ev:T-0540:7332a4b680584955b8bdad4a` | `npm view hadara@0.4.2-rc.0 version`; `npm view hadara dist-tags --json` |
| AC-2 | GitHub Release `v0.4.2-rc.0` is public and marked prerelease. | Done | `ev:T-0540:9b8f98569d7f4c13acb08bb0` | Operator `gh release view v0.4.2-rc.0` output |
| AC-3 | Shared release state routes the next task to installed-package recycle for `hadara@next` expected `0.4.2-rc.0`. | Done | `ev:T-0540:7332a4b680584955b8bdad4a`, `ev:T-0540:9b8f98569d7f4c13acb08bb0` | `docs/PROJECT_STATE.md`; `docs/AGENT_HANDOFF.md`; `docs/RELEASE_READINESS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm view hadara@0.4.2-rc.0 version --registry=https://registry.npmjs.org` | Yes | Passed | `ev:T-0540:7332a4b680584955b8bdad4a` |
| `npm view hadara dist-tags --json --registry=https://registry.npmjs.org` | Yes | Passed | `ev:T-0540:7332a4b680584955b8bdad4a` |
| Operator `gh release view v0.4.2-rc.0 --json tagName,isDraft,isPrerelease,url,targetCommitish,name` | Yes | Passed | `ev:T-0540:9b8f98569d7f4c13acb08bb0` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0539-0-4-2-rc0-release-readiness-and-publish-preparation/TASK.md` | reference | active | Source/readiness capsule explicitly kept publish mutation out of scope. |
| `tasks/T-0539-0-4-2-rc0-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` | reference | active | Release note used for the public prerelease. |
| Operator npm publish output | reference | active | `+ hadara@0.4.2-rc.0`, npm view verification, and publish-helper evidence `ev:T-0539:818caf27a85f4c9299830988` were supplied by the operator. |
| Operator GitHub Release output | reference | active | `v0.4.2-rc.0` verified with `isDraft=false`, `isPrerelease=true`, and target `bb2c10f6f2dc001cac214f35746070f06c389ca5`. |

## Changes

| Area | Summary |
|---|---|
| Evidence | Recorded public npm registry verification and operator GitHub prerelease verification in T-0540. |
| Shared state | Update release state docs from pre-publish boundary to post-publish / recycle-next status. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Run installed-package recycle for `hadara@next` expected `0.4.2-rc.0` from a dedicated capsule. | Open | `docs/RELEASE_READINESS.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | In Progress | Recording completed npm/GitHub `0.4.2-rc.0` publication evidence and updating shared release state. |
| 2026-07-09 | Done | Recorded npm/GitHub post-publish evidence and routed the next release follow-up to installed-package recycle. |
