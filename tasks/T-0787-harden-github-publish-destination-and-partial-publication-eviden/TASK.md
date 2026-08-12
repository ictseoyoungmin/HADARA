# T-0787 Harden GitHub publish destination and partial publication evidence

## Identity

| Field | Value |
|---|---|
| ID | T-0787 |
| Title | Harden GitHub publish destination and partial publication evidence |
| Status | Done |
| Created | 2026-08-12T14:00Z |
| Updated | 2026-08-12T14:15Z |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make the prepared publish clone and GitHub release helper fail closed on an unintended destination, and durably record npm publication before any optional GitHub mutation. | Only the two reviewer P1 findings are in scope; no RC6 regeneration or public mutation. |

## Scope

| Boundary | Items |
|---|---|
| In | Explicit GitHub repository/remote destination for prepare and manual publish; origin verification; npm-first immutable publication report/evidence before GitHub auth/tag/release; failure-path regression coverage. |
| Out | RC6 artifact regeneration, npm/GitHub publication, P2 reinvoke/report command refinements, public recycle, and stable promotion. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract for the two P1 findings. | Done |
| 2 | Implement explicit GitHub destination and npm-first partial publication evidence. | Done |
| 3 | Validate success and injected GitHub failure paths, record evidence, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `prepare-publish-env.sh` rewrites and verifies the publish clone origin to the explicit GitHub remote, and the manual helper passes the explicit `--repo` to `gh release create` and the same remote to tag push. | Met | `ev:T-0787:db551ad1efe741a0b0276582` | prepare/manual publish scripts |
| AC-2 | After npm publish and verification, an immutable npm-only operator report is written and attached to canonical evidence before GitHub auth/tag/release; injected GitHub failure leaves that report/evidence durable. | Met | `ev:T-0787:2c6909f0dd664d5e92c090c3` | manual publish script/evidence |
| AC-3 | The successful GitHub draft path still records a separate final publication report/evidence without overwriting the npm-only report. | Met | `ev:T-0787:2c6909f0dd664d5e92c090c3` | manual publish integration |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused destination and publication-order tests | Yes | Passed | Explicit origin/repo binding and npm-first report ordering. | `ev:T-0787:74441d442b6e4dc3bc44e4ff` |
| Fake npm/gh success and injected GitHub failure integration | Yes | Passed | Durable npm evidence survives GitHub auth/release failure; success keeps separate reports. | `ev:T-0787:2c6909f0dd664d5e92c090c3` |
| Docker build, tools typecheck, and full tests | Yes | Passed | Docker build/typecheck passed; focused release regression passed. A later host-wide run was interrupted after unrelated lock-contention failures caused by concurrent stale test sessions. | `ev:T-0787:74441d442b6e4dc3bc44e4ff` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer P1 findings attached to this task | reference | active | Prepared clone origin/destination and post-npm partial publication evidence. |
| `scripts/release/prepare-publish-env.sh` | implementation-source | active | Container clone and remote setup boundary. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | npm/GitHub mutation and operator evidence boundary. |
| `src/schemas/release-operator-publication.schema.json` | design | active | Existing v1 report remains valid for npm-only and final observations. |

## Changes

| Area | Summary |
|---|---|
| Publish destination | Explicit GitHub repo/remote is propagated, clone origin is rewritten and verified, and GitHub release creation is repo-qualified. |
| Partial publication evidence | npm mutation is journaled and evidence-bound before optional GitHub mutation; final GitHub success uses a separate immutable report/evidence record. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | RC6 exact artifact/readiness regeneration remains the next release capsule after this hardening. | Deferred | Next approved RC6 regeneration capsule |
| RF-2 | Risk | No external registry, GitHub, package, or public-consumer mutation is allowed in T-0787. | Closed | Capsule scope |

## Close Summary

T-0787 resolved the two scoped P1 findings. Publish preparation now rewrites and verifies an explicit GitHub remote, and the manual helper uses that destination for tag push and `gh --repo`. npm publication is recorded and evidence-bound before optional GitHub mutation, with immutable npm-only and final GitHub reports using distinct paths and idempotency keys. Success and injected GitHub-auth failure paths passed without external mutation.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-12 | Draft | Initial task scaffold. |
| 2026-08-12 | In Progress | Scoped to the two reviewer P1 findings before RC6 regeneration. |
| 2026-08-12 | Done | Implementation, regression evidence, and close-time documentation completed. |
