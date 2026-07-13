# T-0587 0.4.5 docsRegistry v3 schema and read model

## Identity

| Field | Value |
|---|---|
| ID | T-0587 |
| Title | 0.4.5 docsRegistry v3 schema and read model |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Add docsRegistry v3 read-model compatibility. | Implement staged 0.4.5 capsule 2 without changing default writers: v1/v2/v3 registry files should load into one internal model. |

## Scope

| Boundary | Items |
|---|---|
| In | v3 TypeScript types, v3 normalizer/read path, docs doctor/list compatibility, focused tests. |
| Out | v3 writer migration, registry mutation commands, docs register default ownership changes, broad registry cleanup. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define v3 read-model compatibility boundary. | Done |
| 2 | Add v3 schema/type shape and normalization into existing internal entries. | Done |
| 3 | Add tests for v3 list/doctor/read-map compatibility. | Done |
| 4 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A v3 registry with `project.id` and `project.hadaraProfile` loads through existing docs list/doctor APIs. | Done | `ev:T-0587:58d1d30360b44859ab835db6` | 0.4.5 design capsule 2 |
| AC-2 | v3 document `applicableProfiles` normalizes to internal `profiles` without requiring raw `profiles` in the file. | Done | `ev:T-0587:58d1d30360b44859ab835db6` | 0.4.5 design capsule 2 |
| AC-3 | Existing v1/v2 registry behavior remains compatible. | Done | `ev:T-0587:58d1d30360b44859ab835db6` | Regression suite |
| AC-4 | Validation evidence is recorded. | Done | `ev:T-0587:58d1d30360b44859ab835db6` | HADARA workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- tests/unit/docs-registry.test.ts` | Yes | Passed | `ev:T-0587:58d1d30360b44859ab835db6` |
| `npm test -- tests/unit/init.test.ts` | Yes | Passed | `ev:T-0587:58d1d30360b44859ab835db6` |
| `npm test -- tests/unit/docs-doctor.test.ts` | Yes | Passed | `ev:T-0587:58d1d30360b44859ab835db6` |
| `npm run dev:docker-sync-build` | Yes | Passed | `ev:T-0587:58d1d30360b44859ab835db6` |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | `ev:T-0587:58d1d30360b44859ab835db6` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` | implementation-source | active | Capsule 2 source design. |
| `src/services/docs-registry.ts` | implementation-source | active | Registry read model and doctor/list APIs. |
| `tests/unit/docs-registry.test.ts` | reference | active | Existing docs registry behavior coverage. |

## Changes

| Area | Summary |
|---|---|
| Docs registry read model | Added v3 project/origin/applicableProfiles types and normalized v3 registries into the existing internal entry model. |
| Tests | Added v3 fixture coverage while preserving the existing invalid-profile diagnostic behavior. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | v3 writer migration remains staged after read-model compatibility. | Deferred | `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Started docsRegistry v3 read-model compatibility implementation. |
| 2026-07-13 | Done | Implemented and validated v3 read-model compatibility. |
