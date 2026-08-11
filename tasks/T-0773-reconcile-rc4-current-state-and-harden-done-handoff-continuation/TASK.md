# T-0773 Reconcile RC4 current-state and harden Done HANDOFF continuation projection.

## Identity

| Field | Value |
|---|---|
| ID | T-0773 |
| Title | Reconcile RC4 current-state and harden Done HANDOFF continuation projection. |
| Status | Done |
| Created | 2026-08-11T20:06 |
| Updated | 2026-08-11T20:10 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Reconcile tracked release readiness with the published RC4 state and freeze the close-time HANDOFF phase contract without changing RC4 runtime/package inputs. | T-0772 remains closed and immutable; its stale pre-close prose is recorded as historical residual while future capsules follow the corrected contract. |

## Scope

| Boundary | Items |
|---|---|
| In | Active docs/RELEASE_READINESS.md current-state correction, workflow handoff contract clarification, T-0773 evidence, and T-0774 stable-acceptance routing. |
| Out | src/**, dist/package inputs, artifact regeneration, npm/GitHub mutation, stable promotion, and rewriting/reclosing T-0772. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the current-state and phase-separation contract. | Done |
| 2 | Reconcile RELEASE_READINESS.md and workflow guidance. | Done |
| 3 | Validate source/artifact boundary and record evidence. | Done |
| 4 | Complete proof-last close with T-0774 continuation. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | RELEASE_READINESS.md records published prerelease RC4, next=RC4, latest=0.4.6, public GitHub prerelease, three assets, parity, and recycle status. | Met | ev:T-0773:76bf8dde3d0d41c8a251473c | docs/RELEASE_READINESS.md |
| AC-2 | The tracked workflow contract states that close does not rewrite worker-owned HANDOFF prose and that Done capsules must not retain same-task pre-close guidance as current continuation. | Met | ev:T-0773:40f2706b078e49628186db20 | docs/TASK_WORKFLOW_COMMANDS.md |
| AC-3 | T-0772's close-source documents are not rewritten and its RC4 release-input identity remains unchanged. | Met | ev:T-0773:7288ba5bcea94e4fae1dc099 | T-0772 close proof; T-0770 artifact hashes |
| AC-4 | T-0774 is explicitly routed for public RC4 close-execute, closed-valid, idempotent retry, and fresh-status acceptance. | Met | ev:T-0773:76bf8dde3d0d41c8a251473c | docs/RELEASE_READINESS.md; HANDOFF.md |
| AC-5 | No src/**, dist, package metadata, release artifact, npm, GitHub, Docker, or stable mutation occurs. | Met | ev:T-0773:7288ba5bcea94e4fae1dc099 | Source/artifact boundary |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Release current-state reconciliation | Yes | Passed | Tracked readiness now matches public RC4 npm/GitHub/recycle state and preserves the stable gate. | docs/RELEASE_READINESS.md |
| Done HANDOFF phase-contract review | Yes | Passed | Workflow guidance distinguishes pre-close prerequisites from post-close continuation; no closed capsule was edited. | docs/TASK_WORKFLOW_COMMANDS.md |
| Source/artifact boundary check | Yes | Passed | Only docs/task capsule files changed; RC4 retained hashes remain unchanged. | ev:T-0773:7288ba5bcea94e4fae1dc099 |
| Evidence lint and task close | Yes | Passed | Evidence lint passed; proof-last close is the terminal capsule step. | ev:T-0773:76bf8dde3d0d41c8a251473c |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0772 publication acceptance | reference | active | RC4 npm/GitHub publication, retained asset parity, and public recycle evidence; close execute remains deferred to T-0774. |
| T-0770 exact artifact handoff | constraint | active | RC4 release-input identity and retained hashes are immutable. |
| docs/RELEASE_READINESS.md | constraint | active | Canonical current release state. |
| docs/TASK_WORKFLOW_COMMANDS.md | constraint | active | Close-time HANDOFF phase contract. |

## Changes

| Area | Summary |
|---|---|
| Current-state docs | Updated RC4 published npm/GitHub/recycle state and stable-promotion boundary. |
| Workflow contract | Clarified that close does not rewrite worker-owned HANDOFF prose and pre-close work must be removed from Done current continuation. |
| Runtime/artifact boundary | No runtime, package, artifact, or external release mutation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Public RC4 close execute and idempotent retry remain stable-acceptance work. | Deferred | T-0774 |
| RF-2 | Follow-up | T-0772 retains historical pre-close prose after close; its close-source document is not rewritten in this capsule. | Accepted | T-0772 close proof |

## Close Summary

RC4 tracked current state is reconciled with the public npm/GitHub/recycle result. The workflow contract now explicitly requires phase-correct HANDOFF prose before close. T-0772 remains immutable, and public RC4 close-execute acceptance is routed to T-0774.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Reconciled scope to docs-only current-state and HANDOFF phase-contract hardening so RC4 artifact identity remains unchanged. |
| 2026-08-11 | Done | Current-state docs, workflow contract, boundary validation, and T-0774 routing completed; no runtime or release-input changes. |
