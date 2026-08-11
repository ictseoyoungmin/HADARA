# T-0775 Reconcile RC4 stable-promotion evidence with bound lifecycle report.

## Identity

| Field | Value |
|---|---|
| ID | T-0775 |
| Title | Reconcile RC4 stable-promotion evidence with bound lifecycle report. |
| Status | Done |
| Created | 2026-08-11T20:30 |
| Updated | 2026-08-11T20:52 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Add a shared Evidence Artifact Binding and Release Operation Report Contract so sanitized command reports are automatically copied, policy-checked, and persisted in canonical evidence artifacts[]. | This source-level change invalidates the published RC4 artifact identity; RC5 regeneration is a separate release capsule. |

## Scope

| Boundary | Items |
|---|---|
| In | CLI artifact-file binding, canonical evidence writer integration, reduced operator publication report contract/helper integration, tests, docs, and RC4 invalidation boundary. |
| Out | npm/GitHub/Docker mutation, RC5 publication, stable promotion, runtime HANDOFF validator, and public consumer rerun beyond structural test coverage. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the artifact binding and release operation report contracts. | Done |
| 2 | Implement CLI/evidence writer artifact binding. | Done |
| 3 | Integrate structured operator publication reporting. | Done |
| 4 | Run focused/full validation, document RC4 invalidation, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | evidence add-command can bind a sanitized UTF-8 artifact into canonical evidence artifacts[] with idempotent append behavior. | Met | ev:T-0775:ff29e544e7ac439d955598f0; ev:T-0775:5a073db0ba534805a91e0e27 | Evidence API/CLI |
| AC-2 | Public artifact policy rejects binary and secret-bearing reports before evidence append. | Met | ev:T-0775:6d0d2c5aefab4eecb994f5b7 | Evidence policy |
| AC-3 | Operator publication flow emits a reduced structured report covering npm/GitHub/Docker/stable mutation boundaries and exact asset digests. | Met | ev:T-0775:d5a195f8e1a74a80a29650aa; hadara.releaseOperatorPublication.v1 | Release helper |
| AC-4 | Focused regression tests cover artifact binding, idempotency, policy failures, and operator report shape. | Met | ev:T-0775:5a073db0ba534805a91e0e27; ev:T-0775:6d0d2c5aefab4eecb994f5b7; ev:T-0775:d5a195f8e1a74a80a29650aa | Tests |
| AC-5 | Docs define the contract and explicitly record that RC4 artifact identity is invalidated by these source changes; no external publication occurs. | Met | ev:T-0775:ff29e544e7ac439d955598f0; ev:T-0775:cbb30278a4f249078a14256d; docs/RELEASE_READINESS.md | Release boundary |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Evidence artifact binding focused tests | Yes | Passed | exit 0 in 2773ms | ev:T-0775:5a073db0ba534805a91e0e27 |
| Public artifact policy focused tests | Yes | Passed | exit 0 in 3191ms | ev:T-0775:6d0d2c5aefab4eecb994f5b7 |
| Operator publication report contract tests | Yes | Passed | exit 0 in 1621ms | ev:T-0775:d5a195f8e1a74a80a29650aa |
| Full repository check/build | Yes | Passed | Docker sync-build passed; typecheck:tools and test:all passed. The host npm run check attempt was blocked only by root-owned Docker dist output (TS5033 EACCES), | ev:T-0775:5bf315d39c36437a94013878 |
| Evidence lint and task close | Yes | Passed | exit 0 in 94ms | ev:T-0775:cbb30278a4f249078a14256d |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0774 lifecycle review | constraint | active | Its artifact binding gap is the motivating finding; no external rerun is required for this structural slice. |
| src/evidence/evidence.ts | implementation-source | active | Shared artifact policy and append writer authority. |
| src/cli/evidence.ts | implementation-source | active | Public artifact-file CLI binding surface. |
| scripts/release/manual-publish-rc.sh | implementation-source | active | Operator publication report producer and evidence caller. |
| docs/CLI_JSON_CONTRACT.md | constraint | active | Stable command/report contract documentation. |

## Changes

| Area | Summary |
|---|---|
| Evidence API/CLI | Added artifact-file binding through the shared evidence writer. |
| Release operation report | Added reduced publication mutation/asset boundary contract and helper integration. |
| Documentation | Recorded artifact lineage requirements and RC4 invalidation/RC5 boundary. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Published RC4 artifact no longer represents the post-change source; RC5 regeneration is required before promotion. | Open | docs/RELEASE_READINESS.md |
| RF-2 | Follow-up | HANDOFF validator runtime enforcement remains a separate 0.5.x backlog item. | Deferred | T-0773 contract |

## Close Summary

This capsule implements the structural evidence artifact binding and operator publication report contract. It performs no external release mutation. Because source/CLI behavior changes, the prior RC4 artifact is invalidated and must not be promoted; a later RC5 release capsule must regenerate and revalidate release artifacts.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Reframed from report-only reconciliation to structural evidence artifact binding and release operation report contract. |
| 2026-08-11 | Done | Structural contract, tests, evidence binding, RC4 invalidation, and close preparation completed. |
