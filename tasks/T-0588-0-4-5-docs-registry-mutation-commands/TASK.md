# T-0588 0.4.5 docs registry mutation commands

## Identity

| Field | Value |
|---|---|
| ID | T-0588 |
| Title | 0.4.5 docs registry mutation commands |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Add explicit docs registry desired-state mutation commands. | Implement staged 0.4.5 capsule 3 so common registry cleanup no longer requires raw JSON edits. |

## Scope

| Boundary | Items |
|---|---|
| In | `docs update`, `docs archive`, `docs supersede`, `docs unregister`, `docs render`; dry-run-first execute guards; focused command tests. |
| Out | Full v3 writer migration, docs register ownership defaults, broad registry cleanup. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define mutation command contract from the 0.4.5 design. | Done |
| 2 | Implement registry mutation service/report helpers. | Done |
| 3 | Add CLI routing for explicit mutation commands. | Done |
| 4 | Add focused dry-run/execute guard tests. | Done |
| 5 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `docs update` can dry-run and execute selected field updates with before-hash protection. | Done | ev:T-0588:f14c8ac5b7a9424b9933a5b2 | 0.4.5 design capsule 3 |
| AC-2 | `docs archive`, `docs supersede`, and `docs unregister` provide reason-required desired-state cleanup paths. | Done | ev:T-0588:f14c8ac5b7a9424b9933a5b2 | 0.4.5 design capsule 3 |
| AC-3 | `docs render` can regenerate `docs/DOC_REGISTRY.md` from the JSON registry through a dry-run-first guard. | Done | ev:T-0588:f14c8ac5b7a9424b9933a5b2 | 0.4.5 design capsule 3 |
| AC-4 | Validation evidence is recorded. | Done | ev:T-0588:f14c8ac5b7a9424b9933a5b2 | HADARA workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- tests/unit/docs-registry.test.ts tests/unit/command-surface-drift.test.ts tests/unit/docs-mark.test.ts` | Yes | Passed | ev:T-0588:f14c8ac5b7a9424b9933a5b2 |
| `npm test -- tests/unit/command-registry.test.ts tests/unit/command-surface-drift.test.ts tests/unit/docs-registry.test.ts` | Yes | Passed | ev:T-0588:f14c8ac5b7a9424b9933a5b2 |
| `npm run dev:docker-sync-build` | Yes | Passed | ev:T-0588:f14c8ac5b7a9424b9933a5b2 |
| Built CLI `/tmp` docs mutation smoke | Yes | Passed | ev:T-0588:f14c8ac5b7a9424b9933a5b2 |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | ev:T-0588:f14c8ac5b7a9424b9933a5b2 |
| docs registry mutation commands | Yes | Passed | ev:T-0588:f14c8ac5b7a9424b9933a5b2 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` | implementation-source | active | Capsule 3 source design. |
| `src/cli/docs.ts` | implementation-source | active | Public docs command routing. |
| `src/services/docs-registry.ts` | implementation-source | active | Registry read/write/report helpers. |

## Changes

| Area | Summary |
|---|---|
| Docs registry mutation commands | Added guarded `docs update`, `docs archive`, `docs supersede`, `docs unregister`, and `docs render` reports and CLI routing. |
| Tests | Added dry-run/execute guard coverage for registry field update, archive, supersede, unregister, and render; updated command registry expectations for the reintroduced canonical `docs.archive` mutation surface. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | docs register default ownership changes remain staged after mutation commands. | Deferred | `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Started explicit docs registry mutation command implementation. |
| 2026-07-13 | Done | Implemented and validated guarded docs registry mutation commands. |
