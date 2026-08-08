# T-0754 Retarget RC3 and Complete Published RC2 Recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0754 |
| Title | Retarget RC3 and Complete Published RC2 Recycle |
| Status | Done |
| Created | 2026-08-08T18:42 |
| Updated | 2026-08-08T18:52 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Retarget the current source line to RC3 and verify the immutable public RC2 through the installed consumer path. | RC2 is not republished; RC3 evidence is regenerated from the current source. |

## Scope

| Boundary | Items |
|---|---|
| In | Exact tarball package smoke binding, strict release provenance, RC3 version/docs/dist retarget, public `hadara@next` RC2 recycle, GitHub asset observation, full check. |
| Out | Republishing RC2, publishing RC3, reconstructing a missing RC2 tarball, or changing unrelated release architecture. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the RC3 retarget, provenance, and RC2 recycle contract. | Done |
| 2 | Enforce exact tarball smoke input and make installed recycle apply reviewed init plans and accept compact close reports. | Done |
| 3 | Run public recycle, full check, and release observations; resolve failed attempts. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Publish helper passes the exact release tarball to package smoke, and release provenance rejects non-tarball or mismatched evidence. | Met | ev:T-0754:40ee5d5caa91445692eec4ec | `scripts/release/manual-publish-rc.sh`, `tools/dev-surface/release-evidence-validation.ts` |
| AC-2 | Current source, package metadata, documentation, and built dist identify `0.5.0-rc.3`; public RC2 remains immutable. | Met | ev:T-0754:ef71628cd6ba40e095f52cec | `package.json`, `README.md`, `docs/RELEASE_READINESS.md` |
| AC-3 | `hadara@next` resolves to `0.5.0-rc.2` and isolated consumer recycle passes init apply, task create/status, close dry-run report, and context slice. | Met | `ev:T-0754:6e8cdb575d774834b9c9983f`, `ev:T-0754:efb7ec1921db4937819a1660` | `artifacts/package-recycle/2026-08-08T09-47-45.596Z-summary.json` |
| AC-4 | RC2 GitHub asset state is observed; missing retained tarball is recorded as historical debt without fabricating an upload. | Met | ev:T-0754:fb343c4bbc0c498fbc66b3aa | `docs/RELEASE_READINESS.md` |
| AC-5 | Full build, tool typecheck, public tests, and HADARA-dev tests pass. | Met | `ev:T-0754:c61de5486a274f649bea2b9f` | `npm run check` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Full npm check | Yes | Passed | exit 0 in 48657ms | ev:T-0754:c61de5486a274f649bea2b9f |
| Installed RC2 consumer recycle | Yes | Passed | Registry package version, isolated install, init plan apply, task/status, close dry-run report, and context slice passed. | ev:T-0754:6e8cdb575d774834b9c9983f |
| RC2 GitHub asset observation | Yes | Passed | Public v0.5.0-rc.2 is a prerelease with zero assets; missing exact tarball is recorded as historical debt. | release observation |
| RC3 provenance and package recycle unit tests | Yes | Passed | exit 0 in 3226ms | ev:T-0754:40ee5d5caa91445692eec4ec |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RELEASE_READINESS.md` | constraint | active | RC2 is immutable; current source is RC3 and must regenerate release evidence. |
| `docs/ROADMAP.md` | constraint | active | RC3 is the current source line; no RC3 publication is part of this task. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Release package smoke must consume the exact artifact tarball. |
| `tools/dev-surface/package-recycle.ts` | implementation-source | active | Installed consumer recycle is the public registry verification path. |

## Changes

| Area | Summary |
|---|---|
| Release provenance | Package smoke now receives `--from "${TARBALL}"`; release evidence requires tarball source and matching SHA-256. |
| Package recycle | JSON init plans are applied with their reviewed hash; compact and full close dry-run schemas are accepted. |
| RC3 retarget | Package metadata, README, roadmap, release notes/readiness, and dist now identify `0.5.0-rc.3`; RC2 remains the published `next` target. |
| Validation | Full `npm run check` and public RC2 installed consumer recycle passed. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | RC2 GitHub Release has no assets and the exact original tarball is not retained locally. | Accepted | Attach only retained exact artifacts; enforce retention/upload from RC3. |

## Close Summary

Current source is retargeted to `0.5.0-rc.3`; published `hadara@next` remains immutable `0.5.0-rc.2`. Exact tarball provenance is enforced for future release helpers. Public RC2 consumer recycle and full checks passed. RC2 GitHub asset absence remains documented historical debt because the original tarball is unavailable.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-08 | Draft | Initial task scaffold. |
| 2026-08-08 | Done | RC3 retarget, strict provenance, RC2 consumer recycle, and full validation completed; ready for proof-last close. |
