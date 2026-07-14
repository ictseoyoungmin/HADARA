# T-0600 0.4.5 release readiness recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0600 |
| Title | 0.4.5 release readiness recycle |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Recycle 0.4.5 release readiness from the current source after T-0598/T-0599. | Refresh build, docs/init, package smoke, release gate, release note, and operator publish handoff evidence without publishing. |

## Scope

| Boundary | Items |
|---|---|
| In | Current-source release validation, GitHub Release note artifact review, package smoke/gate evidence, and operator publish instructions. |
| Out | npm publish, GitHub Release publication, dist-tag mutation, and post-publish installed-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm T-0598/T-0599 are closed and release docs still describe 0.4.5 accurately. | Done |
| 2 | Re-run build, docs/init doctor, package smoke, and strict release gate from current source. | Done |
| 3 | Refresh release note/handoff and leave publish operator-controlled. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | T-0598 safety hardening and T-0599 installed-candidate dogfood are included in release readiness scope. | Done | `docs/RELEASE_READINESS.md`; `docs/RELEASE_NOTES.md` | `docs/RELEASE_READINESS.md` |
| AC-2 | Build, docs/init doctor, package smoke, and release gate pass from current source. | Done | `EVIDENCE.md` | `EVIDENCE.md` |
| AC-3 | GitHub Release note summarizes the final 0.4.5 scope and stale T-0597 warning is cleared. | Done | `GITHUB_RELEASE_NOTE.md` | `GITHUB_RELEASE_NOTE.md` |
| AC-4 | Publish remains operator-controlled. | Done | `HANDOFF.md`; `scripts/release/prepare-publish-env.sh` | `scripts/release/manual-publish-rc.sh` |
| AC-5 | Validation evidence is recorded. | Done | `EVIDENCE.md` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| TypeScript build | Yes | Passed | ev:T-0600:91d4e74557ff4b69b7148f37 |
| Docker build | Yes | Passed | ev:T-0600:e54a559333a9420fb59138f7 |
| Docs and init doctor | Yes | Passed | ev:T-0600:3323520f01584e5695dcf521 |
| Installed-candidate adoption dogfood recycle | Yes | Passed | ev:T-0600:76d390dc31cb49d097da4169 |
| Package smoke regression tests | Yes | Passed | ev:T-0600:f50d17a72417459a85bf697b |
| Package smoke | Yes | Passed | ev:T-0600:16464638954d4ed0b7e80a06 |
| Release gate | Yes | Passed | ev:T-0600:5ce736f726224041853a063e |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0598-0-4-5-brownfield-adoption-safety-gap-closure/HANDOFF.md` | constraint | active | Runtime safety hardening that made T-0597 evidence stale. |
| `tasks/T-0599-0-4-5-installed-candidate-multi-shape-brownfield-dogfood/DOGFOOD_REPORT.md` | constraint | active | Installed-candidate dogfood passed before release readiness recycle. |
| `tasks/T-0597-0-4-5-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` | reference | active | Prior release note to refresh. |

## Changes

| Area | Summary |
|---|---|
| `GITHUB_RELEASE_NOTE.md`, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md` | Refreshed final 0.4.5 scope after T-0598/T-0599 and package-smoke hardening. |
| `src/services/package-smoke.ts`, `tests/unit/package-smoke-dry-run.test.ts` | Fixed successful child-process results that also carry an `EPERM` error object, and added empty-stdout fallback checks for installed command surface and init docs. |
| `scripts/release/prepare-publish-env.sh` | Updated 0.4.5 stable publish example from stale T-0597 to T-0600. |
| Release evidence | Recorded current-source build, Docker build, docs/init doctor, package-smoke regression, package smoke, and strict release gate evidence. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | After operator publication, run installed-package recycle for `hadara@latest` expected `0.4.5`. | Open | `docs/RELEASE_READINESS.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Started current-source release readiness recycle after T-0598/T-0599. |
| 2026-07-13 | Done | Current-source release readiness passed; npm/GitHub publication remains operator-controlled. |
