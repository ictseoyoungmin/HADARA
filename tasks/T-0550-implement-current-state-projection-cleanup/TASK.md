# T-0550 Implement current-state projection cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0550 |
| Title | Implement current-state projection cleanup |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Fix current-state projection noise from context graph reports. | Address T-0548 CP-5 and CP-7: historical missing evidence should not degrade current context by default, and release readiness projection should not report `releaseState:"blocked"` after the current stable release line is complete. |

## Scope

| Boundary | Items |
|---|---|
| In | Context graph state projection, release-readiness status derivation, evidence extraction issue severity/scope, focused tests, built CLI smoke. |
| Out | Full cache remediation, code-index restoration, known-problem extraction cleanup, docs registry lifecycle cleanup, release readiness document rewrite. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Adjust release-state and evidence-missing projection semantics. | Done |
| 3 | Validate focused context graph/state behavior and built CLI smoke. | Done |
| 4 | Update handoff/shared state and finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Current release readiness sections that record completed/published/installed current release status produce `releaseState:"current"` even when older or future sections mention blocked/deferred work. | Met | `ev:T-0550:fa1bc6efeca64c8bbd36589d`, `ev:T-0550:d8a8ff99f4424237a302763e` | `src/context/release-extractors.ts`, `src/context/state-projection.ts`, `docs/RELEASE_READINESS.md` |
| AC-2 | Missing `evidence.jsonl` for historical/legacy capsules is informational and does not become `STATE_UNKNOWN` warning in current state projection by default. | Met | `ev:T-0550:fa1bc6efeca64c8bbd36589d`, `ev:T-0550:d8a8ff99f4424237a302763e` | `src/context/evidence-extractors.ts`, `src/context/state-projection.ts` |
| AC-3 | Validation evidence is recorded and includes a built CLI context graph/pack smoke. | Met | `ev:T-0550:fa1bc6efeca64c8bbd36589d`, `ev:T-0550:d587386a0b944079bbdd8e4b`, `ev:T-0550:d8a8ff99f4424237a302763e` | `docs/TASK_WORKFLOW_COMMANDS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused context graph/state tests | Yes | Passed | ev:T-0550:fa1bc6efeca64c8bbd36589d |
| Docker sync-build and TypeScript build | Yes | Passed | ev:T-0550:d587386a0b944079bbdd8e4b |
| Built context pack state projection smoke | Yes | Passed | ev:T-0550:d8a8ff99f4424237a302763e |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md` | reference | active | Source findings CP-5 and CP-7. |
| `src/context/state-projection.ts` | implementation-source | active | Current state projection logic. |
| `src/context/release-extractors.ts` | implementation-source | active | Release readiness section status extraction. |
| `src/context/evidence-extractors.ts` | implementation-source | active | Evidence graph issue extraction. |

## Changes

| Area | Summary |
|---|---|
| Context evidence extraction | Missing `evidence.jsonl` for closed/deferred historical capsules (`Done`, `Partial`, `Superseded`, `Archived`) is now informational, so old capsule gaps do not become current `STATE_UNKNOWN` warnings by default. |
| Release readiness extraction | Completed current stable publish/install wording is classified as `current` even when the same release-readiness document contains older blocked or future deferred wording. |
| State projection | `releaseState` now prefers current completed release readiness over blocked counts from older/future sections. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Cache/extractor freshness, known-problem extraction cleanup, code index routing, and docs registry lifecycle cleanup remain separate requested capsules. | Open | `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | In Progress | Scoped to T-0548 CP-5/CP-7 current-state projection cleanup. |
| 2026-07-09 | Done | Implemented current-state projection cleanup and validated focused tests, Docker sync-build, and built context-pack smoke. |
