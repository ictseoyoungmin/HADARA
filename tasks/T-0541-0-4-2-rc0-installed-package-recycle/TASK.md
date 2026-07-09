# T-0541 0.4.2 rc0 installed package recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0541 |
| Title | 0.4.2 rc0 installed package recycle |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Verify the published `hadara@next` package installs and works as `0.4.2-rc.0` from consumer paths. | This is the post-publish installed-package recycle for the 0.4.2 release candidate after T-0540 recorded npm/GitHub publication. |

## Scope

| Boundary | Items |
|---|---|
| In | `hadara package recycle --execute --package hadara@next --expected-version 0.4.2-rc.0 --task T-0541 --attach-evidence --json`, registry/dist-tag verification, isolated install, installed CLI version, command surface, init/task/status/session/finalize/context pack/context slice smokes, evidence, and shared release state updates. |
| Out | npm publish, GitHub Release mutation, source metadata changes, package version retargeting, release artifact regeneration, Docker/PyPI publish, installer execution, and code changes unless recycle exposes a release-blocking bug. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the installed-package recycle contract from T-0540 handoff and release readiness. | Done |
| 2 | Run recycle dry-run and confirm planned installed consumer checks. | Done |
| 3 | Run live recycle execute against `hadara@next` expected `0.4.2-rc.0`. | Done |
| 4 | Record evidence and update shared release state docs. | Done |
| 5 | Validate, finalize, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Recycle dry-run plans registry, isolated install, installed version, command surface, init/task/status/session/finalize/context pack/context slice, and cleanup checks without mutation. | Done | `ev:T-0541:ca5a53ca899f48ad89cea0db` | `package recycle` dry-run |
| AC-2 | Live recycle verifies npm registry `hadara@next` resolves to `0.4.2-rc.0` and dist-tags keep stable `latest=0.4.1`. | Done | `ev:T-0541:ca5a53ca899f48ad89cea0db` | `package recycle --execute` |
| AC-3 | Live recycle installs `hadara@next` into an isolated prefix and the installed CLI reports `packageVersion=0.4.2-rc.0`. | Done | `ev:T-0541:ca5a53ca899f48ad89cea0db` | `package recycle --execute` |
| AC-4 | Live recycle installed-project smokes pass for current command surface, init, task status, session start, finalize dry-run, context pack, context slice, and cleanup. | Done | `ev:T-0541:ca5a53ca899f48ad89cea0db` | `package recycle --execute` |
| AC-5 | Shared state records `0.4.2-rc.0` installed-package recycle status and next release decision boundary. | Done | `ev:T-0541:ca5a53ca899f48ad89cea0db`, `ev:T-0541:9c836efa7ae74f339bdbb3d8` | `docs/PROJECT_STATE.md`; `docs/AGENT_HANDOFF.md`; `docs/RELEASE_READINESS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `node dist/cli/main.js package recycle --package hadara@next --expected-version 0.4.2-rc.0 --task T-0541 --attach-evidence --json` | Yes | Passed | `ev:T-0541:ca5a53ca899f48ad89cea0db` |
| `node dist/cli/main.js package recycle --execute --package hadara@next --expected-version 0.4.2-rc.0 --task T-0541 --attach-evidence --json` approved network rerun | Yes | Passed | `ev:T-0541:ca5a53ca899f48ad89cea0db` |
| sandboxed `package recycle --execute` first attempt; resolved as environment/network friction by approved rerun | No | Failed | `ev:T-0541:58947308fb1e4c1ab1a1e2e9`, `ev:T-0541:9c836efa7ae74f339bdbb3d8` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0540-0-4-2-rc0-post-publish-evidence-sync/HANDOFF.md` | implementation-source | active | Routes next work to installed-package recycle for `hadara@next` expected `0.4.2-rc.0`. |
| `docs/RELEASE_READINESS.md` | reference | active | Current 0.4.2 RC publish is complete and installed-package recycle is pending. |
| `docs/AGENT_HANDOFF.md` | reference | active | Current phase is 0.4.2 rc0 post-publish recycle. |

## Changes

| Area | Summary |
|---|---|
| Release validation | Run installed-package recycle from the published npm package. |
| Shared state | Update release state from recycle-pending to recycle-verified. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Decide whether to keep observing `0.4.2-rc.0` or proceed toward stable `0.4.2` readiness. | Open | Future capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | In Progress | Started `0.4.2-rc.0` installed-package recycle after npm/GitHub publication. |
| 2026-07-09 | Done | Verified published `hadara@next` installs and works as `0.4.2-rc.0` from consumer paths. |
