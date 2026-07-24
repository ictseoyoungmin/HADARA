# T-0699 Init v1 Core Model and Planner

## Identity

| Field | Value |
|---|---|
| ID | T-0699 |
| Title | Init v1 Core Model and Planner |
| Status | Done |
| Created | 2026-07-24T20:33 |
| Updated | 2026-07-24T21:01 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Establish the frozen Init v1 core model and a deterministic, zero-write planner. | Make preset expansion, artifact ownership, project/document persistence contracts, TargetRef validation, plan/report schemas, and strict base-init CLI behavior authoritative before any new apply transaction is added. |

## Scope

| Boundary | Items |
|---|---|
| In | Canonical `minimal`/`standard`/`governed` preset expansion with `basic` alias; Init v1 artifact manifest; `hadara.project.v1`, `hadara.documents.v1`, `hadara.init.plan.v1`, and `hadara.init.report.v1` schemas and runtime validation; TargetRef exact validation; deterministic plan/hash/summary; greenfield `--json` dry-run; strict unknown-option and unknown-preset errors; invalid canonical config/registry fail-closed behavior; generated bootstrap content needed by the plan. |
| Out | Filesystem apply and interactive confirmation; brownfield adoption replacement; re-init/upgrade ownership; Task Board close projection; runtime document resolver migration; legacy artifact migration/removal; installed-package E2E. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Freeze canonical preset, artifact, persistence, TargetRef, plan, report, and CLI-option contracts from the two Init v1 specifications. | Done |
| 2 | Implement the core model, strict parsers, deterministic zero-write planner, report rendering, and base init CLI routing. | Done |
| 3 | Add focused schema/model/planner/CLI tests, refresh `dist` in Docker, run broader regression checks, and record evidence. | Done |
| 4 | Update shared state and handoff, then close this capsule proof-last. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | One canonical expansion defines `minimal`, `standard`, and `governed`; omitted preset equals `standard`; `--profile basic` canonicalizes to `minimal` with a structured deprecation warning. | Met | `ev:T-0699:56198d1528c349c1b2173468` | A-001~A-006 |
| AC-2 | The Init v1 core and preset artifact manifest produces the required core tree, excludes legacy/runtime artifacts, and supplies consistent project/document model values. | Met | `ev:T-0699:56198d1528c349c1b2173468` | B-001~B-003, B-005, E-001~E-004 |
| AC-3 | Project config, document registry, and TargetRef values pass both registered JSON Schema and strict runtime parsing; invalid/duplicate/path/enum/reference combinations fail closed. | Met | `ev:T-0699:b09d3c290b564921891ae5cf`; `ev:T-0699:56198d1528c349c1b2173468` | E, F, O-003, O-004, S-001 |
| AC-4 | Greenfield JSON init is zero-write and returns schema-valid deterministic plan/report data with accurate summaries, allowed action kinds, `applied=0`, and a stable plan hash. | Met | `ev:T-0699:05a40e5c71724071badc21bf`; `ev:T-0699:56198d1528c349c1b2173468` | I-001, M-001~M-004, M-007, S-002 |
| AC-5 | Base init rejects unknown options and presets before writes with stable codes and useful allowed-value/suggestion messages. | Met | `ev:T-0699:05a40e5c71724071badc21bf` | O-001, O-002 |
| AC-6 | Planned AGENTS/workflow bootstrap semantics route sessions through workflow, selected-task status, registered documents, and command-managed ownership. | Met | `ev:T-0699:56198d1528c349c1b2173468` | Q-001~Q-003 |
| AC-7 | Validation evidence is recorded, `dist` reflects source, and the capsule is close-ready. | Met | `ev:T-0699:e91afd1964a64f89817de83c`; `ev:T-0699:05a40e5c71724071badc21bf` | User instruction; task workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Init v1 focused model/planner/schema/CLI tests | Yes | Passed | ev:T-0699:56198d1528c349c1b2173468 |
| External Draft 2020-12 schema compile | Yes | Passed | ev:T-0699:b09d3c290b564921891ae5cf |
| Built CLI zero-write and fail-closed smokes | Yes | Passed | ev:T-0699:05a40e5c71724071badc21bf |
| Full source and HADARA-dev Docker regression | Yes | Passed | ev:T-0699:e91afd1964a64f89817de83c |
| Dist refresh and parity check | Yes | Passed | ev:T-0699:05a40e5c71724071badc21bf |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/redesign/HADARA_INIT_V1_FINAL_FREEZE_SPEC_KO.md` | decision | active | Frozen Init v1 product and design contract. |
| `docs/specs/0.5/redesign/HADARA_INIT_V1_ACCEPTANCE.md` | constraint | active | A, B, E, F, I-001, M, O-001~004, Q-001~003, and S acceptance authority for this capsule. |
| `tasks/T-0698-init-v1-contract-and-characterization/INIT_V1_IMPLEMENTATION_MAP.md` | reference | active | Orders this capsule before apply, re-init, Task Board, routing, compatibility, and installed-package work. |
| `docs/ARCHITECTURE.md` | reference | active | Project-store and local-first boundaries. |
| `docs/SECURITY_MODEL.md` | constraint | active | No-write planning, root containment, and fail-closed requirements. |
| `docs/TEST_STRATEGY.md` | constraint | active | Docker validation and compiled `dist` parity. |
| `docs/SCHEMAS.md` | reference | active | Registered fixture and runtime validation conventions. |

## Changes

| Area | Summary |
|---|---|
| Core model | Added the canonical preset expansion, Init v1 artifact manifest, static project config, document registry, exact TargetRef validation, and generated core bootstrap content without legacy/runtime artifacts. |
| Planner/report | Added deterministic normalized action summaries and hashes, zero-write greenfield/brownfield planning, explicit plain/JSON dry-run/no-op/error reports, and fail-closed canonical-state parsing. |
| CLI | Added reusable strict option validation, typo suggestions, Init-specific structured errors, `--preset`, default-standard behavior, and compatibility profile canonicalization. |
| Schemas | Registered separate `hadara.project.v1`, `hadara.documents.v1`, `hadara.init.plan.v1`, and `hadara.init.report.v1` fixtures and documented persistence field producers/consumers. |
| Tests/build | Added model/planner/CLI/schema acceptance coverage, retained the isolated 0.4 init regression suite, refreshed `dist`, and passed focused/AJV/built/full checks. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Filesystem application, lock/journal recovery, and exact plan/apply parity remain intentionally owned by the next capsule. | Deferred | Init v1 Safe Apply Transaction |
| RF-2 | Risk | Existing legacy init/adoption code remains isolated for brownfield compatibility until its replacement capsule; the new empty/`--preset` path never writes legacy artifacts. | Mitigated | INIT-M0, REG-001 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-24 | Draft | Initial task scaffold. |
| 2026-07-24 | In Progress | Contract authored for the canonical Init v1 model and zero-write planner. |
| 2026-07-24 | In Progress | Implemented the model/planner contracts, refreshed dist, and passed focused, external-schema, built-CLI, and full Docker validation. |
| 2026-07-24 | Done | Completed the canonical Init v1 core model and deterministic zero-write planner capsule with recorded acceptance evidence. |
