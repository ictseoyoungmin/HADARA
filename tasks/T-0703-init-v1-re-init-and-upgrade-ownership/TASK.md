# T-0703 Init v1 Re-init and Upgrade Ownership

## Identity

| Field | Value |
|---|---|
| ID | T-0703 |
| Title | Init v1 Re-init and Upgrade Ownership |
| Status | Done |
| Created | 2026-07-26T17:34 |
| Updated | 2026-07-26T17:56 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Complete the Init v1 re-init and upgrade ownership boundary. | Base init must no-op or fail closed for initialized/partial projects, while upgrade may repair only canonical managed artifacts without changing configuration or user-authored documents. |

## Scope

| Boundary | Items |
|---|---|
| In | Already-initialized no-op; explicit preset/profile rejection on re-init; partial-install diagnostic; reviewed `init upgrade` plan/apply; missing core repair; managed AGENTS/workflow updates; READ_MAP regeneration; `.gitignore` repair; invalid config/registry/malformed-block fail-closed behavior; optional-document/config preservation; plain/JSON/schema/help metadata alignment. |
| Out | Task Board v1 migration and Close Summary projection; full document-routing resolver; legacy field-by-field migration; feature/document-pack mutation; installed-package final acceptance; publish/release mutation. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Trace the current Init v1 planner/transaction and legacy upgrade callers against K/L/C acceptance. | Done |
| 2 | Route re-init and upgrade through one minimal reviewed Init v1 transaction boundary. | Done |
| 3 | Add focused ownership, preservation, stale-plan, error, CLI, and schema regressions. | Done |
| 4 | Run focused and full Docker validation, refresh `dist`, and record durable evidence. | Done |
| 5 | Update shared state/handoff and close proof-last. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Plain re-init is a checksum-preserving no-op, while an explicit preset/profile on an initialized project fails with `INIT_PRESET_REQUIRES_NEW_PROJECT`. | Met | `ev:T-0703:e4e6a408bb0648aa9cd9d559`; `ev:T-0703:2403b51722de4d178c934c7d` | K-001, K-002, E2E-004 |
| AC-2 | Partial Init v1 installations are not repaired by base init and receive a clear `init upgrade` diagnostic. | Met | `ev:T-0703:e4e6a408bb0648aa9cd9d559`; `ev:T-0703:2403b51722de4d178c934c7d` | K-003 |
| AC-3 | `init upgrade` is dry-run-first, plan-hash guarded, and repairs only missing core, managed templates/blocks, projection, and ignore state. | Met | `ev:T-0703:e4e6a408bb0648aa9cd9d559`; `ev:T-0703:2403b51722de4d178c934c7d` | L-001 through L-005 |
| AC-4 | Upgrade rejects preset/profile configuration changes and invalid config/registry/malformed managed blocks without writes. | Met | `ev:T-0703:2403b51722de4d178c934c7d` | L-006, O-003 through O-005, REG-001 |
| AC-5 | User-authored optional documents and static project/document configuration remain byte-preserved through upgrade. | Met | `ev:T-0703:2403b51722de4d178c934c7d` | C-003, C-006, C-007, L-007, E2E-010, REG-005 |
| AC-6 | Focused regressions, full Docker checks, built CLI JSON smokes, and repository hygiene pass with durable evidence. | Met | `ev:T-0703:e4e6a408bb0648aa9cd9d559`; `ev:T-0703:2403b51722de4d178c934c7d` | `docs/TEST_STRATEGY.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused Init v1 planner/transaction/CLI regressions in Docker | Yes | Passed | Planner 6, transaction 12, upgrade ownership 4; `ev:T-0703:2403b51722de4d178c934c7d`. |
| Full `npm run check` in Docker | Yes | Passed | npm ci 0 vulnerabilities; build/tools type-check; public 141 files/1098 tests; HADARA-dev 16 files/129 tests; `ev:T-0703:2403b51722de4d178c934c7d`. |
| Built CLI re-init/upgrade JSON smoke | Yes | Passed | Init apply, re-init no-op, partial fail-closed, reviewed repair, second-upgrade no-op; `ev:T-0703:e4e6a408bb0648aa9cd9d559`. |
| `git diff --check` and evidence lint | Yes | Passed | Evidence lint: 2 substantive positive records, 0 issues; Task close readiness evidence. |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/redesign/HADARA_INIT_V1_FINAL_FREEZE_SPEC_KO.md` | decision | active | Frozen re-init, upgrade, ownership, transaction, and error contract. |
| `docs/specs/0.5/redesign/HADARA_INIT_V1_ACCEPTANCE.md` | constraint | active | K, L, C, O, E2E-004/010, and regression acceptance. |
| `tasks/T-0698-init-v1-contract-and-characterization/INIT_V1_IMPLEMENTATION_MAP.md` | reference | active | Ordered capsule boundary; Task Board/routing/legacy/installed acceptance remain later. |
| `docs/ARCHITECTURE.md` | constraint | active | Reuse the reviewed Init v1 transaction boundary. |
| `docs/SECURITY_MODEL.md` | constraint | active | Root containment, reviewed hash, non-destructive writes, and rollback ownership. |
| `docs/TEST_STRATEGY.md` | constraint | active | Docker-first validation and built CLI evidence. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Durable evidence and proof-last close. |

## Changes

| Area | Summary |
|---|---|
| Task Capsule | Froze the smallest re-init/upgrade ownership slice from the eight-capsule Init v1 map. |
| Init model/planner | Added current-config-derived core repair files, complete/partial classification, explicit re-init configuration rejection, and deterministic `upgrade` plan/report support. |
| Transaction | Replans upgrade under the existing lock/hash boundary and replaces only the exact AGENTS managed block. |
| CLI/schema/docs | Routed v1 upgrade separately from legacy 0.4 behavior; aligned help, command registry, report schemas, architecture, security, README, and JSON contract. |
| Regression coverage | Added missing-core, managed refresh, config/user preservation, stale plan, invalid authority, malformed marker, configuration rejection, and idempotent no-op tests. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Upgrade must never derive a configuration switch from `presetOrigin`; it may use stored canonical configuration only to reconstruct missing managed artifacts. | Closed | `presetFromProjectConfig()` derives repair shape from current `documentPacks`; upgrade never reads `presetOrigin` as authority. |
| RF-2 | Follow-up | Task Board migration, document routing, legacy isolation, and installed-package acceptance remain separate ordered capsules. | Deferred | `INIT_V1_IMPLEMENTATION_MAP.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-26 | Draft | Initial task scaffold. |
| 2026-07-26 | In Progress | Read the frozen contracts and traced the current Init v1 planner/transaction plus legacy profile-based upgrade path. |
| 2026-07-26 | Done | Implemented and validated re-init/upgrade ownership; clean Docker and built CLI smoke passed, and the next program boundary remains Task Board/Close projection. |
