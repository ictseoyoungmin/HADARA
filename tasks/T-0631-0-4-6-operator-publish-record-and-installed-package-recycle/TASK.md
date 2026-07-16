# T-0631 0.4.6 operator publish record and installed-package recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0631 |
| Title | 0.4.6 operator publish record and installed-package recycle |
| Status | Done |
| Created | 2026-07-16 |
| Updated | 2026-07-16 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0631 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Record completed operator npm/GitHub publication for `hadara@0.4.6` and verify the public installed package from consumer paths. | npm/GitHub publication was performed manually by the operator after T-0629/T-0630 source readiness. |

## Scope

| Boundary | Items |
|---|---|
| In | Record npm registry and GitHub Release publication observations; run installed-package recycle for `hadara@latest` expected `0.4.6`; update release/readiness state. |
| Out | Re-publishing npm or GitHub releases, changing package source, broad external dogfood beyond installed-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Record operator-provided npm/GitHub publication output. | Done |
| 2 | Verify npm registry metadata and dist-tags. | Done |
| 3 | Run installed-package recycle from `hadara@latest` expected `0.4.6`. | Done |
| 4 | Close publish/recycle record. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | npm registry returns `hadara@0.4.6` and `latest=0.4.6`. | Met | `ev:T-0631:c31dd280f6af48d6b8918b02` | npm registry |
| AC-2 | GitHub Release `v0.4.6` was published publicly by the operator. | Met | `ev:T-0631:c31dd280f6af48d6b8918b02` | GitHub Release output |
| AC-3 | Installed-package recycle from `hadara@latest` expected `0.4.6` passes. | Met | `ev:T-0631:511bb997c92146bf8ffaf02e` | `package recycle` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm view hadara@0.4.6 version --registry=https://registry.npmjs.org` | Yes | Passed | `ev:T-0631:c31dd280f6af48d6b8918b02` |
| `npm view hadara dist-tags --json --registry=https://registry.npmjs.org` | Yes | Passed | `ev:T-0631:c31dd280f6af48d6b8918b02` |
| `node dist/cli/main.js package recycle --execute --package hadara@latest --expected-version 0.4.6 --task T-0631 --attach-evidence --json` | Yes | Passed | `ev:T-0631:511bb997c92146bf8ffaf02e` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| operator npm publish transcript | reference | active | `hadara@0.4.6` published and `npm view` verified 0.4.6. |
| operator GitHub Release transcript | reference | active | `v0.4.6` draft created and published public. |
| `tasks/T-0629-0-4-6-stable-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` | reference | active | GitHub Release notes source. |

## Changes

| Area | Summary |
|---|---|
| Publication record | npm and GitHub Release publication output recorded from operator transcript. |
| Registry verification | npm registry observed `version=0.4.6`, `latest=0.4.6`, `next=0.4.6-rc.1`. |
| Installed recycle | Approved rerun verified public `hadara@latest` installs as `0.4.6`, exposes installed command surface, initializes a disposable project, and passes task/session/finalize/context smokes. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Initial sandboxed package recycle failed at npm metadata subprocesses after long timeouts; approved rerun passed and resolves the recycle result. | Closed | `ev:T-0631:598918ef009146cc95d3a0f0` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-16 | Draft | Initial task scaffold. |
| 2026-07-16 | In Progress | Recording 0.4.6 operator publication and running installed-package recycle. |
| 2026-07-16 | Done | Public npm/GitHub publication recorded and installed-package recycle passed. |
