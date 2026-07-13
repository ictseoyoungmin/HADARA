# T-0594 0.4.5 brownfield managed adoption writer

## Identity

| Field | Value |
|---|---|
| ID | T-0594 |
| Title | 0.4.5 brownfield managed adoption writer |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Implement guarded brownfield adoption execute. | Reviewed `hadara.init.adoption.v1` plans should apply bounded scaffold creates and managed-section patches without overwriting project-owned content. |

## Scope

| Boundary | Items |
|---|---|
| In | Plan-hash checked `init --adopt --execute`, atomic file writes, `.gitignore` and `AGENTS.md` managed blocks, generated scaffold creates, v3 docs registry writes, project-authored reference doc registration, and dist smoke. |
| Out | Origin-aware docs doctor cleanup, idempotent repeated adoption polish, full external dogfood, and stable release readiness. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define writer scope from T-0593 adoption plan and 0.4.5 brownfield spec. | Done |
| 2 | Implement guarded execute writer with managed sections, v3 registry, project version split, and atomic writes. | Done |
| 3 | Validate focused tests, build/Docker build, and dist brownfield execute smoke. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara init --adopt --execute --plan-hash <hash> --json` applies only when the current plan hash matches the reviewed dry-run. | Done | `ev:T-0594:fa8fc333193d4a51a36d6cde` | `src/init/adoption.ts`; `tests/unit/init.test.ts` |
| AC-2 | Existing `.gitignore` and `AGENTS.md` content outside HADARA managed blocks is preserved. | Done | `ev:T-0594:38dde3dbae834bac9bb99e6d` | `tests/unit/init.test.ts` |
| AC-3 | Brownfield adoption writes `.hadara/docs-registry.json` as `hadara.docsRegistry.v3` and registers existing project reference docs as project-authored. | Done | `ev:T-0594:38dde3dbae834bac9bb99e6d` | `src/init/adoption.ts`; `tests/unit/init.test.ts` |
| AC-4 | Brownfield current state uses the project manifest version and adoption-baseline next work instead of the HADARA package version. | Done | `ev:T-0594:38dde3dbae834bac9bb99e6d` | `src/init/adoption.ts`; `tests/unit/init.test.ts` |
| AC-5 | Adoption does not create `tasks/.gitkeep`. | Done | `ev:T-0594:38dde3dbae834bac9bb99e6d` | `tests/unit/init.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused init writer tests | Yes | Passed | `ev:T-0594:fa8fc333193d4a51a36d6cde` |
| Build and Docker build | Yes | Passed | `ev:T-0594:bc8bbe75bbf04b728c121bdd` |
| Dist brownfield execute smoke | Yes | Passed | `ev:T-0594:38dde3dbae834bac9bb99e6d` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.5/brownfield-init-adoption.md` | reference | active | Defines managed merge, v3 registry, project version split, and fail-closed execute behavior. |
| `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` | reference | active | Defines registry v3 project identity/origin model and staged 0.4.5 implementation. |
| T-0593 adoption planner | implementation-source | active | Writer consumes the dry-run action plan and plan hash produced by T-0593. |

## Changes

| Area | Summary |
|---|---|
| Init adoption writer | Added plan-hash checked execute path and removed the temporary execute-not-implemented blocker. |
| Managed patches | Added bounded `.gitignore` local-state block and `AGENTS.md` HADARA workflow managed block while preserving existing content. |
| Brownfield scaffold | Added v3 docs registry generation, project-authored registration for existing docs, brownfield scaffold metadata, and adoption-baseline current state. |
| Tests | Added execute success regression and retained mismatch/missing-plan blockers. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Origin-aware docs doctor and idempotent repeated adoption polish remain for T-0595. | Open | T-0595 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | Done | Implemented and validated guarded brownfield managed adoption writer. |
