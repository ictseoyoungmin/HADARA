# T-0481 Task Capsule human-readable schema cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0481 |
| Title | Task Capsule human-readable schema cleanup |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Goal

| Goal | Notes |
|---|---|
| Make new `TASK.md` capsules read like a task brief before source bookkeeping while preserving legacy 0.4 capsule validation. | Addresses dogfood/operator UX concerns before 0.4.0 stable. |

## Scope

| Boundary | Items |
|---|---|
| In | New Task Capsule scaffold layout; template layout; harness validation compatibility; acceptance parsing; validation-run row sync; authoring suggestions; stable pre-release plan document. |
| Out | Broad migration of historical capsules; changing evidence projection tables; publishing or GitHub Release execution. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Record the 0.4.0 stable pre-release capsule plan in a standalone document. | Done | ev:T-0481:d7ea70a9e2a2468a95aca229 |
| 2 | Update default and template `TASK.md` scaffolds to the human-readable v2 order and column names. | Done | ev:T-0481:15f0b359a90e4732b10c6e5a |
| 3 | Keep harness, acceptance, validation-run, and authoring suggestion code compatible with v1 and v2 tables. | Done | ev:T-0481:d7ea70a9e2a2468a95aca229 |
| 4 | Update focused tests and run validation. | Done | ev:T-0481:d7ea70a9e2a2468a95aca229 |
| 5 | Record evidence and close-source docs before finalize. | Done | ev:T-0481:cea807cf931d46d694652eeb |

## Acceptance

| ID | Criterion | Decision | State | Evidence | Reference |
|---|---|---|---|---|---|
| AC-1 | Fresh `task create` output places Goal, Scope, Plan, Acceptance, and Validation before Inputs / Constraints. | Must | Met | ev:T-0481:15f0b359a90e4732b10c6e5a | Built CLI scaffold smoke |
| AC-2 | Acceptance tables use `Decision` and `State`, avoiding duplicate `Required`/`Disposition=Required` wording. | Must | Met | ev:T-0481:d7ea70a9e2a2468a95aca229 | Scaffold and tests |
| AC-3 | Inputs / Constraints tables place human notes before the hash column. | Must | Met | ev:T-0481:d7ea70a9e2a2468a95aca229 | Scaffold and source hash suggestion tests |
| AC-4 | Legacy v1 Task Capsule tables remain accepted by harness validation. | Must | Met | ev:T-0481:d7ea70a9e2a2468a95aca229 | Docker full check |
| AC-5 | The stable-before-0.4.0 plan is recorded in a standalone doc. | Must | Met | ev:T-0481:d7ea70a9e2a2468a95aca229 | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Docker full check | Yes | Passed | ev:T-0481:d7ea70a9e2a2468a95aca229 |
| Docker sync build and version smoke | Yes | Passed | ev:T-0481:8820c76990b947f2bf0e3a4c |
| Built CLI task scaffold smoke | Yes | Passed | ev:T-0481:15f0b359a90e4732b10c6e5a |
| `git diff --check` | Yes | Passed | ev:T-0481:cea807cf931d46d694652eeb |
| Done-level harness validation | Yes | Passed | ev:T-0481:0562d07842a147eb96d3b41e |

## Inputs / Constraints

| Path / Source | Type | Authority | State | Notes | Hash |
|---|---|---|---|---|---|
| docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md | reference | approved | implemented | Stable pre-release capsule plan created by this task. | sha256:668c617b5c7c29a012bfd4ba833937854cb527abdcbd82f8c0ce8929074f35f2 |
| tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/HANDOFF.md | reference | approved | implemented | T-0479 dogfood friction summary and report pointer. | sha256:0f55d8134665ce17e7d69443f2dab117d16ed9fbafcf15f1e1e5473b87815452 |
| src/task/task-capsule.ts | implementation-source | approved | implemented | Default Task Capsule scaffold generator. | sha256:dc73938bdc57165816d8c26c03c9e7b6da5d9d50bc300ba086c502652d0a5a01 |
| src/task/task-templates.ts | implementation-source | approved | implemented | Template-specific Task Capsule scaffold generator. | sha256:3504896b361cd6d07895b67ca4c3c0c989a4a45da10566e9bbbafb90991ba437 |
| src/harness/validate.ts | implementation-source | approved | implemented | Task table schema validation and compatibility. | sha256:130b43399df5652a271ae0776d7ffba3950c797e5b89e7743347100a4147ae82 |
| src/task/acceptance.ts | implementation-source | approved | implemented | Acceptance readiness parser. | sha256:4a045e98e9c95ea999877e3552b6b197d5cbdcdba7dff6cb740a76229dbc094c |
| src/services/validation-run.ts | implementation-source | approved | implemented | Validation row updater. | sha256:08d49a6921e84cfcab9120100b856cfd86f8145aefebe7f9506dc7f48a0da3c1 |
| src/services/task-workbench.ts | implementation-source | approved | implemented | Authoring suggestion source-hash row generation. | sha256:44c66bcbe5f20b9926b36ea75bb8c805e83a546a8c0f7a0f4641f08d0cd56f2c |
| src/task/authoring-guidance.ts | implementation-source | approved | implemented | Authoring guidance section aliases. | sha256:56675f0dcfbeccab853fbdaf7cefcf60fea8170e83ce87d6fc428cf3c817acd5 |
| src/services/dashboard-bootstrap.ts | implementation-source | approved | implemented | Bootstrap artifact-path redaction exposed by full check. | sha256:2733e3d515d3d201ae0174cd1ee0a21e54033c7b36c3cf8dd9d98a053e6edf7a |

## Changes

| Area | Summary | Evidence |
|---|---|---|
| docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md | Added the pre-stable capsule sequence and promotion gates. | ev:T-0481:d7ea70a9e2a2468a95aca229 |
| module:task-capsule | New default/template `TASK.md` scaffold order and table names. | ev:T-0481:15f0b359a90e4732b10c6e5a |
| module:harness validate | Accept v2 tables while preserving v1 compatibility. | ev:T-0481:d7ea70a9e2a2468a95aca229 |
| module:validation run | Sync validation results into either v1 or v2 Validation tables. | ev:T-0481:d7ea70a9e2a2468a95aca229 |
| module:task status authoring suggestions | Suggest source hash rows in the v2 Inputs / Constraints shape and recognize v2 sections. | ev:T-0481:d7ea70a9e2a2468a95aca229 |
| module:dashboard bootstrap | Redact artifact path strings from compact aggregate bootstrap output. | ev:T-0481:d7ea70a9e2a2468a95aca229 |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Historical docs/spec examples still describe the v1 0.4 schema and should be updated in a broader docs pass if stable adopts v2 wording. | Open | docs/specs/0.4.0/productization-redesign |
