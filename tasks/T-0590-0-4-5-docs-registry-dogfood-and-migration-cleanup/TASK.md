# T-0590 0.4.5 docs registry dogfood and migration cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0590 |
| Title | 0.4.5 docs registry dogfood and migration cleanup |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Dogfood 0.4.5 docs registry and init cleanup changes before release preparation. | Verify fresh profiles, registry mutation/render flow, and HADARA-dev docs registry projection health. |

## Scope

| Boundary | Items |
|---|---|
| In | Fresh `basic`/`standard`/`governed` dogfood, `docs register` project-authored defaults, `docs render` projection sync, HADARA-dev docs doctor. |
| Out | NPM/GitHub release, full docsRegistry v3 writer migration, broad historical document reclassification. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define dogfood and cleanup checks from the 0.4.5 design. | Done |
| 2 | Run fresh profile dogfood and HADARA-dev registry projection cleanup. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh `basic`, `standard`, and `governed` projects initialize without `tasks/.gitkeep` and pass docs doctor. | Done | ev:T-0590:ac51e6af0aba4397a9aef2f2 | 0.4.5 design capsule 5 |
| AC-2 | Fresh project `docs register --execute` writes project-authored metadata and preserves scaffold seed ownership. | Done | ev:T-0590:ac51e6af0aba4397a9aef2f2 | 0.4.5 design capsule 5 |
| AC-3 | `docs render --execute --before-hash` syncs registry projections and HADARA-dev docs doctor remains clean. | Done | ev:T-0590:ac51e6af0aba4397a9aef2f2 | 0.4.5 design capsule 5 |
| AC-4 | Validation evidence is recorded. | Done | ev:T-0590:ac51e6af0aba4397a9aef2f2 | HADARA workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Fresh profile dogfood (`basic`, `standard`, `governed`) | Yes | Passed | ev:T-0590:ac51e6af0aba4397a9aef2f2 |
| `node dist/cli/main.js docs render --json` | Yes | Passed | ev:T-0590:ac51e6af0aba4397a9aef2f2 |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | ev:T-0590:ac51e6af0aba4397a9aef2f2 |
| 0.4.5 docs registry dogfood and migration cleanup | Yes | Passed | ev:T-0590:ac51e6af0aba4397a9aef2f2 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` | implementation-source | active | Capsule 5 source design. |
| `docs/DOC_REGISTRY.md` | implementation-source | active | Human projection refreshed from registry. |
| `.hadara/docs-registry.json` | implementation-source | active | Canonical docs registry desired state. |

## Changes

| Area | Summary |
|---|---|
| Dogfood report | Added fresh profile dogfood and cleanup observations. |
| Docs registry projection | Refreshed `docs/DOC_REGISTRY.md` with guarded `docs render --execute --before-hash`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full docsRegistry v3 writer migration remains outside 0.4.5 cleanup unless explicitly scoped. | Deferred | `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` |
| RF-2 | Follow-up | 0.4.5 release readiness can start after this capsule closes. | Open | `docs/TASK_BOARD.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | Done | Completed fresh profile dogfood and registry projection cleanup. |
