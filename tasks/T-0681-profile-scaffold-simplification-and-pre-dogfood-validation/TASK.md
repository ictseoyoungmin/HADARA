# T-0681 Profile scaffold simplification and pre-dogfood validation

## Identity

| Field | Value |
|---|---|
| ID | T-0681 |
| Title | Profile scaffold simplification and pre-dogfood validation |
| Status | Done |
| Created | 2026-07-22T09:11 |
| Updated | 2026-07-22T09:30 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0681 --json`.

## Goal

| Goal | Notes |
|---|---|
| Make basic, standard, and governed init profiles materially distinct and portable, then complete source/profile validation immediately before installed-package dogfood. | Keep the change bounded to generated scaffold ownership, portable prose, initial release semantics, and validation. |

## Scope

| Boundary | Items |
|---|---|
| In | Profile-specific generated file sets and registry entries; conditional AGENTS/read routing; portable workflow prose; `unversioned` greenfield release default; profile and doctor tests; built CLI fresh-scaffold comparison. |
| Out | Installed-package dogfood, publishing, release recycle, removing compatibility readers from existing projects, and adding optional architecture/roadmap/security docs. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define intentional profile file/read-routing increments and author the capsule contract. | Done |
| 2 | Implement profile-specific scaffold/registry/template output and unversioned greenfield state. | Done |
| 3 | Remove consumer workflow leakage and update focused fixtures. | Done |
| 4 | Run focused/full Docker validation and compare fresh built-CLI scaffolds for all profiles. | Done |
| 5 | Update handoff/shared state and close immediately before installed-package dogfood. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Basic contains the agent contract, compact workflow, Task Board, Task Capsule/evidence machinery, but no context router, Project State, or global handoff. | Met | ev:T-0681:17b7b5136b5d4af09bc2dd0d | profile tests and built scaffold |
| AC-2 | Standard adds HADARA_CONTEXT and PROJECT_STATE; governed additionally adds AGENT_HANDOFF. | Met | ev:T-0681:17b7b5136b5d4af09bc2dd0d | profile tests and built scaffold |
| AC-3 | Registry and AGENTS Required Reading contain only files generated for that profile. | Met | ev:T-0681:2119a5ce8388421f8fd2bab6 | docs doctor/profile tests |
| AC-4 | A greenfield project uses `unversioned` as project release while scaffold `createdWith` retains the HADARA package version. | Met | ev:T-0681:17b7b5136b5d4af09bc2dd0d | current-state/init tests |
| AC-5 | Generated Markdown contains no HADARA-dev Docker, WSL/no-bin-links, npm recycle/publish, release-candidate, or publisher guidance. | Met | ev:T-0681:17b7b5136b5d4af09bc2dd0d | portability tests |
| AC-6 | Focused tests, full source validation, profile doctor checks, and built CLI scaffold comparison pass before dogfood. | Met | ev:T-0681:de24e4995fd74537a928a9de | validation evidence |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused init, registry, current-state, doctor, and template tests | Yes | Passed | ev:T-0681:2119a5ce8388421f8fd2bab6 |
| Full source check | Yes | Passed | ev:T-0681:de24e4995fd74537a928a9de |
| Built CLI three-profile scaffold and doctor comparison | Yes | Passed | ev:T-0681:17b7b5136b5d4af09bc2dd0d |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/PRE_STABLE_LIFECYCLE_SIMPLIFICATION.md` | reference | active | Accepted profile surface and portability contract. |
| `src/init/profile.ts` | implementation-source | active | Profile intent and required document sets. |
| `src/init/scaffold.ts` | implementation-source | active | Generated file selection. |
| `src/init/templates.ts` | implementation-source | active | Consumer-facing AGENTS and workflow prose. |
| `src/services/docs-registry.ts` | implementation-source | active | Profile-owned document routing metadata. |

## Changes

| Area | Summary |
|---|---|
| Contract | Defined three cumulative, intentional profile surfaces and pre-dogfood gates. |
| Basic | Reduced fresh output to AGENTS, workflow, Task Board, Task Capsule/evidence support, registries, and compatibility checkpoint. |
| Standard / Governed | Standard adds Markdown project state and routing; governed adds the global handoff. |
| Release semantics | Greenfield project release is `unversioned`; generating HADARA version remains `createdWith`. |
| Portability | Removed installed-package/no-bin-links guidance from generated consumer workflow and aligned doctor/registry expectations. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Existing initialized projects retain their files during upgrade/compatibility handling. | Accepted | Fresh desired state changes do not destructively prune consumer-authored files. |
| RF-2 | Follow-up | Installed-package dogfood remains deliberately unrun. | Open | Start only after this capsule closes successfully. |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-22 | Draft | Initial task scaffold. |
| 2026-07-22 | Draft | Authored accepted profile simplification scope and validation gates. |
| 2026-07-22 | Done | Profile implementation and source-level pre-dogfood validation completed; installed-package dogfood intentionally not started. |
