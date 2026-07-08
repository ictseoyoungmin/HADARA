# T-0512 0.4.1 rc0 post publish evidence sync

## Identity

| Field | Value |
|---|---|
| ID | T-0512 |
| Title | 0.4.1 rc0 post publish evidence sync |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Record final public npm and GitHub Release evidence for `hadara@0.4.1-rc.0`. | The operator completed npm publish and GitHub Release publication after T-0509/T-0510/T-0511; this capsule syncs workspace evidence and shared state without performing publish mutation. |

## Scope

| Boundary | Items |
|---|---|
| In | Verify npm registry metadata, verify GitHub Release metadata, record public release evidence, and update shared current-state docs. |
| Out | Creating or editing release assets, npm publish mutation, GitHub release mutation, installed-package recycle, or code changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Verify npm registry metadata for `hadara@0.4.1-rc.0`. | Done |
| 2 | Verify GitHub Release metadata for `v0.4.1-rc.0`. | Done |
| 3 | Record evidence and update shared state. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | npm registry exposes `hadara@0.4.1-rc.0` with `next=0.4.1-rc.0` and stable `latest=0.4.0`. | Done | `ev:T-0512:873cb873d9a74a2eb374d829` | npm registry |
| AC-2 | GitHub Release `v0.4.1-rc.0` is public, non-draft, and marked prerelease. | Done | `ev:T-0512:8de1c6fc2c0442fdbcbf65cc` | GitHub Releases |
| AC-3 | Shared current-state docs identify `0.4.1-rc.0` as published and point next work at installed-package recycle. | Done | `ev:T-0512:873cb873d9a74a2eb374d829`, `ev:T-0512:8de1c6fc2c0442fdbcbf65cc` | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm view hadara@0.4.1-rc.0 version dist-tags.latest dist-tags.next dist.shasum | Yes | Passed | ev:T-0512:873cb873d9a74a2eb374d829 |
| gh release view v0.4.1-rc.0 --repo ictseoyoungmin/HADARA --json tagName,isDraft,isPrerelease,url,targetCommitish,name | Yes | Passed | ev:T-0512:8de1c6fc2c0442fdbcbf65cc |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Operator publish report | reference | active | `manual-publish-rc.sh T-0509 --execute` completed npm publish and verified `npm view`; GitHub Release publication was then completed by the operator. |
| npm registry | reference | active | `version=0.4.1-rc.0`, `next=0.4.1-rc.0`, `latest=0.4.0`, shasum `8ced2baaf6bbc6e7d407fb9525cf6080109daa8f`. |
| GitHub Release | reference | active | `v0.4.1-rc.0`, `isDraft=false`, `isPrerelease=true`, target `5380df586c8deec1c4a2e504a6203e4a2b028500`. |

## Changes

| Area | Summary |
|---|---|
| Evidence | Recorded npm and GitHub public release verification evidence in this workspace. |
| Shared state | `docs/PROJECT_STATE.md` and `docs/AGENT_HANDOFF.md` now identify `0.4.1-rc.0` as published to npm and GitHub prerelease, with installed-package recycle as the next release-line proof. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Run installed-package recycle for `hadara@0.4.1-rc.0` from a fresh unmounted environment. | Open | Future capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | npm and GitHub public release metadata verified; evidence recorded. |
| 2026-07-08 | Done | Shared state updated for published `0.4.1-rc.0`; next work is installed-package recycle. |
