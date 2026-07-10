# T-0571 0.4.3 post-publish installed-package recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0571 |
| Title | 0.4.3 post-publish installed-package recycle |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Verify the published `hadara@latest` consumer path resolves to `0.4.3` and runs the installed-package recycle smoke. | Keep this to post-publish verification only. |

## Scope

| Boundary | Items |
|---|---|
| In | npm registry metadata check, installed-package recycle for `hadara@latest` expected `0.4.3`, release/readme status updates. |
| Out | npm publish, GitHub Release mutation, package version changes, new release features. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define post-publish recycle contract. | Done |
| 2 | Run registry/recycle validation. | Done |
| 3 | Update release status docs and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara@latest` resolves to `0.4.3` from npm. | Done | `ev:T-0571:bbf49f83f20249a38a846f06` | `npm view hadara@latest version` |
| AC-2 | Installed-package recycle passes for `hadara@latest` expected `0.4.3`. | Done | `ev:T-0571:bbf49f83f20249a38a846f06` | `hadara package recycle --execute` |
| AC-3 | Release-facing docs reflect published stable `0.4.3`. | Done | `ev:T-0571:bbf49f83f20249a38a846f06` | `README.md`, `docs/RELEASE_READINESS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm view hadara@latest version` | Yes | Passed | `0.4.3` observed before task creation. |
| `hadara package recycle --execute --package hadara@latest --expected-version 0.4.3` | Yes | Passed | `ev:T-0571:bbf49f83f20249a38a846f06`; sandbox attempt failed on npm lookup after about 70s and was resolved by `ev:T-0571:0f07b67f711c41e089c19019`. |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0570 publish output | reference | active | User provided npm publish and GitHub Release publication output. |
| `docs/RELEASE_READINESS.md` | reference | active | Release status source. |
| `scripts/release/manual-publish-rc.sh` | constraint | active | Publish already completed; this capsule must not publish again. |

## Changes

| Area | Summary |
|---|---|
| Release verification | `hadara@latest` recycle passed from isolated consumer path. |
| Release docs | README and release readiness now name published stable `0.4.3`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Begin v0.4.4 external-repository validation planning after recycle closes. | Open | `.hadara/state/current.json` |
| RF-2 | Risk | Sandboxed recycle hit npm metadata lookup failures after about 70s per lookup; approved network rerun passed. | Closed | `ev:T-0571:0f07b67f711c41e089c19019` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Started post-publish `hadara@latest` recycle verification. |
| 2026-07-10 | Done | Verified `hadara@latest` installs and smokes as 0.4.3, then updated release-facing docs. |
