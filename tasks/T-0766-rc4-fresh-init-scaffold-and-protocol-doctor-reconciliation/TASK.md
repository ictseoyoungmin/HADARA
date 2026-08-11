# T-0766 RC4 Fresh Init Scaffold and Protocol Doctor Reconciliation

## Identity

| Field | Value |
|---|---|
| ID | T-0766 |
| Title | RC4 Fresh Init Scaffold and Protocol Doctor Reconciliation |
| Status | Done |
| Created | 2026-08-11T15:41 |
| Updated | 2026-08-11T15:55 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0766 --json`.

## Goal

| Goal | Notes |
|---|---|
| Make fresh Init v1 minimal/standard/governed projects protocol-doctor clean by unifying generated workflow/Required Reading prose with the active scaffold contract, while preserving the legacy scaffold's context-document behavior. | This is the RC4 remediation required by T-0765 before stable promotion. |

## Scope

| Boundary | Items |
|---|---|
| In | `src/init/model.ts`, shared init templates, Init v1 profile routing, protocol profile/consistency checks, focused tests, fresh profile dogfood, and RC4 release-readiness evidence. |
| Out | Stable or RC4 publication, GitHub/npm mutation, broad protocol redesign, legacy profile contract changes, and unrelated docs/runtime cleanup. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the Init v1 versus legacy scaffold contract and focused regression matrix. | Done |
| 2 | Reuse the rich workflow/agent templates for Init v1 with its `READ_MAP.md` context anchor. | Done |
| 3 | Make protocol profile/consistency checks recognize Init v1 metadata and context paths without changing legacy behavior. | Done |
| 4 | Run focused tests, full check, and fresh minimal/standard/governed dogfood; record RC4 readiness. | Done |
| 5 | Finish capsule docs and close with proof-last evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh Init v1 minimal, standard, and governed scaffolds contain the workflow sections and Required Reading paths expected by protocol doctor. | Met | ev:T-0766:5122cc1df88b4ff5bb5811b7 | `src/init/model.ts`, init templates |
| AC-2 | Init v1 projects use `.hadara/context/READ_MAP.md` as their context anchor; legacy scaffold projects continue using `.hadara/context/HADARA_CONTEXT.md`. | Met | ev:T-0766:4ac86259ec064b47aa7b7fd4 | protocol profile contract and compatibility regression |
| AC-3 | Fresh Init v1 profile dogfood reports no workflow scaffold or required-reading warnings across minimal, standard, and governed presets. | Met | ev:T-0766:5122cc1df88b4ff5bb5811b7 | fresh-project smoke |
| AC-4 | Focused regression tests cover Init v1 generated content and legacy protocol profile compatibility. | Met | ev:T-0766:18de2c638b5140dfb354d2c7 | focused test evidence |
| AC-5 | Full repository validation passes and RC4 release-readiness disposition is recorded without publication mutation. | Met | ev:T-0766:564f2453d3614190b780ec1a; ev:T-0766:1aab3d3d77f44075a346fbcf | validation/release evidence |
| AC-6 | Capsule evidence, handoff, and close-source docs are complete before proof-last close. | Met | ev:T-0766:1aab3d3d77f44075a346fbcf; evidence lint passed | close proof |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Init v1 model/template regression tests | Yes | Passed | ev:T-0766:18de2c638b5140dfb354d2c7 |
| Protocol profile/consistency regression tests | Yes | Passed | ev:T-0766:18de2c638b5140dfb354d2c7 |
| Fresh minimal/standard/governed Init v1 doctor smoke | Yes | Passed | ev:T-0766:5122cc1df88b4ff5bb5811b7 |
| Full repository check | Yes | Passed | ev:T-0766:564f2453d3614190b780ec1a; earlier failed attempt resolved by ev:T-0766:1aab3d3d77f44075a346fbcf |
| Init v1 and protocol consistency focused tests | Yes | Passed | ev:T-0766:18de2c638b5140dfb354d2c7; earlier failed attempt resolved by ev:T-0766:1aab3d3d77f44075a346fbcf |
| Init v1 and protocol consistency focused tests after managed-block correction | Yes | Passed | ev:T-0766:4ac86259ec064b47aa7b7fd4 |
| Build current RC4 CLI | Yes | Failed | ev:T-0766:d10b2ea957574451b000f7e8; superseded by final full repository check and resolved by ev:T-0766:1aab3d3d77f44075a346fbcf |
| Rebuild current RC4 CLI after minimal scaffold fix | Yes | Failed | ev:T-0766:59a385320d0b4630a45ae50e; superseded by final full repository check and resolved by ev:T-0766:1aab3d3d77f44075a346fbcf |
| Focused Init v1 and protocol consistency regressions | Yes | Passed | ev:T-0766:18de2c638b5140dfb354d2c7 |
| Final full repository check after scaffold reconciliation | Yes | Passed | ev:T-0766:564f2453d3614190b780ec1a |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0765-rc3-release-contract-and-current-state-reconciliation/RECONCILIATION_REPORT.md` | constraint | active | RC4-before-stable finding and exact warning root cause. |
| `docs/ARCHITECTURE.md` | constraint | active | Init v1 transaction and project-store boundaries. |
| `docs/DEVELOPMENT_SLICES.md` | reference | active | Development-slice order and release scope. |
| `docs/RELEASE_READINESS.md` | constraint | active | RC4/stable readiness boundary. |
| `src/init/model.ts` | implementation-source | active | Init v1 scaffold generation. |
| `src/init/templates.ts` | implementation-source | active | Rich workflow and agent guide templates. |
| `src/services/protocol-profile.ts` | implementation-source | active | Profile metadata and required-reading contract. |
| `src/services/protocol-consistency.ts` | implementation-source | active | Workflow/project-doc consistency diagnostics. |

## Changes

| Area | Summary |
|---|---|
| Init v1 scaffold | Reuse the canonical rich workflow and agent templates with an Init v1 `READ_MAP.md` context anchor for all presets, including minimal. |
| Protocol profile | Distinguish Init v1 project metadata/context paths from legacy scaffold metadata without weakening legacy checks. |
| Validation | Add focused regression coverage, fresh three-preset dogfood, and full repository validation; no release mutation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Shared legacy and Init v1 templates may have different generated-document contracts. | Mitigated | Template compatibility tests and full check |
| RF-2 | Follow-up | RC4 release candidate should regenerate artifact and public consumer proof after this source change. | Open | `docs/RELEASE_READINESS.md` |
| RF-3 | Follow-up | Stable promotion remains blocked until fresh standard Init v1 doctor is warning-free. | Open | T-0765 decision |

## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Opened from T-0765's RC4-before-stable finding to reconcile Init v1 generated scaffolds with protocol doctor expectations. |
| 2026-08-11 | In Progress | Implemented Init v1 READ_MAP routing, canonical workflow sections, profile-aware required-reading checks, focused regressions, and fresh three-preset dogfood; no publication mutation. |
| 2026-08-11 | Done | Finalized capsule docs and handoff; evidence lint passed and close dry-run is ready for proof-last execution. |
