# T-0586 0.4.5 init upgrade project identity and gitkeep cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0586 |
| Title | 0.4.5 init upgrade project identity and gitkeep cleanup |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prevent init upgrade from reintroducing 0.4.4 registry/profile drift. | Implement 0.4.5 design capsule 1: preserve HADARA-dev registry identity during `init upgrade` and stop generating `tasks/.gitkeep`. |

## Scope

| Boundary | Items |
|---|---|
| In | `init` / `init upgrade` scaffold behavior, docs registry profile merge compatibility, focused regression tests, generated `dist` refresh. |
| Out | Full docsRegistry v3 migration, registry mutation commands, broad stale-entry cleanup. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract from the 0.4.5 design spec. | Done |
| 2 | Remove `tasks/.gitkeep` from generated scaffold writes. | Done |
| 3 | Preserve existing registry project identity while still adding missing profile seed entries. | Done |
| 4 | Add focused init/init-upgrade regression tests. | Done |
| 5 | Validate, refresh `dist`, and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh `hadara init` creates `tasks/` but does not create `tasks/.gitkeep`. | Done | `ev:T-0586:ba721aeec5fd40a48b5e50e1` | 0.4.5 design capsule 1 |
| AC-2 | `hadara init upgrade --profile governed --execute` does not rewrite top-level docs registry identity from `hadara-dev` to `governed`. | Done | `ev:T-0586:ba721aeec5fd40a48b5e50e1` | 0.4.5 design capsule 1 |
| AC-3 | `init upgrade` still adds missing governed seed document entries when upgrading a standard registry. | Done | `ev:T-0586:ba721aeec5fd40a48b5e50e1` | Compatibility requirement |
| AC-4 | Validation evidence is recorded and `dist` reflects the source change. | Done | `ev:T-0586:ba721aeec5fd40a48b5e50e1` | HADARA-dev workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- tests/unit/init.test.ts` | Yes | Passed | `ev:T-0586:ba721aeec5fd40a48b5e50e1` |
| `npm test -- tests/unit/archive-boundary.test.ts` | Yes | Passed | `ev:T-0586:ba721aeec5fd40a48b5e50e1` |
| `npm run dev:docker-sync-build` | Yes | Passed | `ev:T-0586:ba721aeec5fd40a48b5e50e1` |
| Built CLI `/tmp` init/upgrade smoke | Yes | Passed | `ev:T-0586:ba721aeec5fd40a48b5e50e1` |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | `ev:T-0586:ba721aeec5fd40a48b5e50e1` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` | implementation-source | active | Capsule 1 acceptance source. |
| `src/init/scaffold.ts` | implementation-source | active | Generated scaffold file list. |
| `src/init/upgrade.ts` | implementation-source | active | Upgrade registry merge behavior. |

## Changes

| Area | Summary |
|---|---|
| Init scaffold | Removed `tasks/.gitkeep` from generated scaffold file list; `tasks/` directory is still created by init path setup. |
| Init upgrade | Preserves existing `projectProfile: "hadara-dev"` while still merging missing seed entries for the requested HADARA profile. |
| Tests | Added init upgrade regression coverage and updated archive-boundary spec-line guard for `docs/specs/0.4.5`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | docsRegistry v3 migration remains staged after this compatibility hotfix. | Deferred | `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Started 0.4.5 capsule 1 implementation. |
| 2026-07-13 | Done | Implemented and validated init identity/gitkeep compatibility hotfix. |
