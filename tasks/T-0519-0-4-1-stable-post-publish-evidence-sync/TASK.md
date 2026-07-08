# T-0519 0.4.1 stable post-publish evidence sync

## Identity

| Field | Value |
|---|---|
| ID | T-0519 |
| Title | 0.4.1 stable post-publish evidence sync |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Record the completed public `hadara@0.4.1` npm and GitHub Release publication. | Keep the already-closed T-0516 preparation capsule immutable and capture post-publish verification in this follow-up capsule. |

## Scope

| Boundary | Items |
|---|---|
| In | Verify npm registry version/dist-tags after operator publish, verify public GitHub Release `v0.4.1`, update release-line shared state, and record evidence. |
| Out | Re-publishing npm/GitHub artifacts, editing the already-closed T-0516 close-source docs, stable installed-package recycle, and any code changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Verify npm registry publication and dist-tags for `hadara@0.4.1`. | Done |
| 2 | Verify GitHub Release `v0.4.1` is public and non-prerelease. | Done |
| 3 | Update shared state docs and close this post-publish sync capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | npm registry exposes `hadara@0.4.1` after operator publish. | Done | ev:T-0519:1aaf3a7a96f548c6accae710 | `npm view hadara@0.4.1 version` |
| AC-2 | npm dist-tags route stable installs to `0.4.1`. | Done | ev:T-0519:0e29abe05a824a629936af35 | `npm view hadara dist-tags --json` |
| AC-3 | GitHub Release `v0.4.1` is public, stable, and targets the release commit. | Done | ev:T-0519:ab35e58cb8dd4809a97242b6 | `gh release view v0.4.1` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm view hadara@0.4.1 version --registry=https://registry.npmjs.org` | Yes | Passed | ev:T-0519:1aaf3a7a96f548c6accae710 |
| `npm view hadara dist-tags --json --registry=https://registry.npmjs.org` | Yes | Passed | ev:T-0519:0e29abe05a824a629936af35 |
| `gh release view v0.4.1 --repo ictseoyoungmin/HADARA --json tagName,isDraft,isPrerelease,url,targetCommitish,name` | Yes | Passed | ev:T-0519:ab35e58cb8dd4809a97242b6 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User publish transcript | reference | active | Operator completed npm publish and GitHub Release creation/publication for `v0.4.1`. |
| `tasks/T-0516-0-4-1-stable-release-readiness-and-publish-preparation` | reference | active | Prepared stable source/readiness and release note artifact before publish. |
| npm registry | reference | active | Public package/version/dist-tag verification source. |
| GitHub Releases | reference | active | Public release verification source. |

## Changes

| Area | Summary |
|---|---|
| Release Evidence | Recorded npm version, npm dist-tags, and GitHub Release public-state verification for stable `0.4.1`. |
| Shared State | Updated project/handoff state so stable `0.4.1` is no longer described as pending publish. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Run stable installed-package recycle for `hadara@latest` expected `0.4.1`. | Open | Future capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | Done | npm `hadara@0.4.1` and public GitHub Release `v0.4.1` verified after operator publish. |
