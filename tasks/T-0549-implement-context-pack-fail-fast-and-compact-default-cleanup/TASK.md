# T-0549 Implement context pack fail-fast and compact default cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0549 |
| Title | Implement context pack fail-fast and compact default cleanup |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make `hadara context pack --json` fail fast without broad live graph discovery when no task is selected. | This addresses T-0548 CP-1 and keeps task-scoped `context pack --task` behavior intact. |

## Scope

| Boundary | Items |
|---|---|
| In | Add a lightweight no-task context-pack report, route default no-task CLI calls through it before graph extraction, document the behavior, and cover it with focused tests. |
| Out | Cache shard refresh, stale known-problem cleanup, release-state projection cleanup, code-index restoration, and docs-registry active-spec cleanup. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract from T-0548 CP-1. | Done |
| 2 | Implement lightweight no-task context-pack routing. | Done |
| 3 | Add focused unit coverage and update docs/registry text. | Done |
| 4 | Validate, update shared state, and prepare finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `context pack --json` without `--task` returns a schema-valid task-required report without live graph/source scan metadata. | Done | `ev:T-0549:3aad1c696c184260a6928204` | `src/cli/context.ts`, `src/context/context-pack.ts` |
| AC-2 | `context pack --task T-XXXX --json` remains graph-backed and schema-valid. | Done | `ev:T-0549:94c22577a6384fe2a0e81337` | `tests/unit/context-graph-cli.test.ts` |
| AC-3 | Help/docs make the default no-task behavior and task-scoped usage clear. | Done | `ev:T-0549:af0b3bbac1984ee7a73fe7aa`, `ev:T-0549:37e783e719b042ab9cf6bb37` | `docs/HADARA_WORKFLOW.md`, `src/services/capability-registry.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused context tests | Yes | Passed | `ev:T-0549:af0b3bbac1984ee7a73fe7aa` |
| TypeScript build | Yes | Passed | `ev:T-0549:37e783e719b042ab9cf6bb37` |
| Docker sync-build full validation | Yes | Passed | `ev:T-0549:37e783e719b042ab9cf6bb37` |
| Built CLI no-task smoke | Yes | Passed | `ev:T-0549:3aad1c696c184260a6928204` |
| Built CLI task-scoped smoke | Yes | Passed | `ev:T-0549:94c22577a6384fe2a0e81337` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md` | reference | active | CP-1 defines the fail-fast issue and follow-up scope. |
| `src/cli/context.ts` | implementation-source | active | CLI routing currently calls `buildContextPackReport` before checking task availability. |
| `src/context/context-pack.ts` | implementation-source | active | Report builder currently builds a graph before emitting task-not-found. |
| `src/context/session-start.ts` | reference | active | Existing bounded no-live behavior provides a compatible report pattern. |
| `tests/unit/context-graph-cli.test.ts` | implementation-source | active | CLI-level context pack coverage lives here. |

## Changes

| Area | Summary |
|---|---|
| Context pack | Added a lightweight no-task task-required report and routed default no-task CLI calls through it before graph extraction. |
| CLI/docs | Added explicit `--live` opt-in for no-task project-wide discovery and updated help/current docs/generated init workflow text. |
| Tests/dist | Added CLI regression coverage and refreshed Docker-built `dist`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | T-0548 CP-3 through CP-9 remain separate capsules. | Open | `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md` |
| RF-2 | Follow-up | Evidence redaction partially redacted the harmless technical identifier `task-required-fast-path`; local-only feedback was recorded. | Open | `.hadara/local/feedback/T-0549-evidence-redaction-fast-path.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | Done | Implemented no-task context-pack fail-fast behavior, updated docs/templates, refreshed dist, and recorded validation evidence. |
