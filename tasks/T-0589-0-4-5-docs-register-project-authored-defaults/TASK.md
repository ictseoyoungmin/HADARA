# T-0589 0.4.5 docs register project-authored defaults

## Identity

| Field | Value |
|---|---|
| ID | T-0589 |
| Title | 0.4.5 docs register project-authored defaults |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make `docs register` default to project-authored document metadata. | Implement staged 0.4.5 capsule 4 so arbitrary project docs no longer look like HADARA scaffold-owned docs. |

## Scope

| Boundary | Items |
|---|---|
| In | `docs register` default `owner`, `origin`, and `editPolicy`; focused tests preserving scaffold-owned seed docs. |
| Out | Full docsRegistry v3 writer migration, broad registry cleanup, new domain-specific profile presets. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract from the 0.4.5 design. | Done |
| 2 | Change user-authored `docs register` defaults while preserving scaffold seed ownership. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Newly registered arbitrary project docs default to `owner: project`, `origin.type: project-authored`, and `editPolicy: agent-editable-with-review`. | Done | ev:T-0589:03ad7e26d0c347388b638d8e | 0.4.5 design capsule 4 |
| AC-2 | HADARA scaffold seed docs remain `owner: hadara-docs` with scaffold provenance. | Done | ev:T-0589:03ad7e26d0c347388b638d8e | 0.4.5 design capsule 4 |
| AC-3 | Validation evidence is recorded. | Done | ev:T-0589:03ad7e26d0c347388b638d8e | HADARA workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- tests/unit/docs-registry.test.ts tests/unit/schema-fixtures.test.ts` | Yes | Passed | ev:T-0589:03ad7e26d0c347388b638d8e |
| `npm run dev:docker-sync-build` | Yes | Passed | ev:T-0589:03ad7e26d0c347388b638d8e |
| Built CLI `/tmp` docs register smoke | Yes | Passed | ev:T-0589:03ad7e26d0c347388b638d8e |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | ev:T-0589:03ad7e26d0c347388b638d8e |
| docs register project-authored defaults | Yes | Passed | ev:T-0589:03ad7e26d0c347388b638d8e |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` | implementation-source | active | Capsule 4 source design. |
| `src/services/docs-registry.ts` | implementation-source | active | `docs register` registry entry builder. |

## Changes

| Area | Summary |
|---|---|
| Docs register defaults | Changed arbitrary project document registration defaults to project ownership, explicit project-authored origin, and agent-editable-with-review edit policy. |
| Tests | Added focused dry-run and execute coverage proving project-authored defaults and scaffold ownership preservation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full v3 writer migration and `applicableProfiles` write semantics remain outside this capsule. | Deferred | `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Started docs register default ownership and origin cleanup. |
| 2026-07-13 | Done | Implemented and validated project-authored docs register defaults. |
