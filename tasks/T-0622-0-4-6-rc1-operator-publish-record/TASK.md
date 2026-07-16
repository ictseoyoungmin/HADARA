# T-0622 0.4.6 rc1 operator publish record

## Identity

| Field | Value |
|---|---|
| ID | T-0622 |
| Title | 0.4.6 rc1 operator publish record |
| Status | Done |
| Created | 2026-07-16 |
| Updated | 2026-07-16 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Record completed `0.4.6-rc.1` npm and GitHub prerelease publication. | The operator already completed registry/GitHub mutation outside this workspace; this capsule updates project release status and records evidence. |

## Scope

| Boundary | Items |
|---|---|
| In | README release status, release-readiness publish status, local evidence for npm/GitHub publication, and next recycle guidance. |
| Out | Re-publishing npm, editing the GitHub release, installed-package recycle implementation, stable promotion decision. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Record operator npm/GitHub publication evidence. | Done |
| 2 | Update release-facing status docs from prepared to published rc.1. | Done |
| 3 | Leave installed-package recycle as the next explicit follow-up. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Local release status reflects that `hadara@0.4.6-rc.1` is published on npm `next` and GitHub Release `v0.4.6-rc.1` is public. | Done | `ev:T-0622:5257af08171d4b2795038437` | `README.md`, `docs/RELEASE_READINESS.md` |
| AC-2 | Installed-package recycle remains a separate follow-up rather than being implied complete. | Done | `ev:T-0622:5257af08171d4b2795038437` | `HANDOFF.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Operator npm publish and npm view verification | Yes | Passed | `ev:T-0622:5257af08171d4b2795038437` |
| Operator GitHub Release create/edit verification | Yes | Passed | `ev:T-0622:5257af08171d4b2795038437` |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | command output in session |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User-provided publish transcript | reference | active | npm publish, npm view, GitHub Release create/edit completed for `0.4.6-rc.1`. |
| `tasks/T-0620-*/GITHUB_RELEASE_NOTE.md` | reference | active | Release note source used for GitHub Release. |
| `docs/RELEASE_READINESS.md` | reference | active | Release status source. |

## Changes

| Area | Summary |
|---|---|
| README | Published RC npm/GitHub rows now point at `0.4.6-rc.1`. |
| Release readiness | rc.1 readiness now records completed operator npm/GitHub publication and leaves installed-package recycle as follow-up. |
| Evidence | Added local release evidence for the operator publish transcript. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Run installed-package recycle against `hadara@next` and verify it resolves to `0.4.6-rc.1`. | Open | `tasks/T-0615-0-4-6-rc-0-installed-package-multi-scenario-delegated-dogfood/DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-16 | Draft | Initial task scaffold. |
| 2026-07-16 | Done | Recorded completed `0.4.6-rc.1` npm/GitHub prerelease publication. |
