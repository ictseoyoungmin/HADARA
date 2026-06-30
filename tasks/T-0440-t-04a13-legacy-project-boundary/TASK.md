# T-0440 T-04A13 Legacy Project Boundary

## Identity

| Field | Value |
|---|---|
| ID | T-0440 |
| Title | T-04A13 Legacy Project Boundary |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/11_Legacy_Project_Boundary.md | implementation-source | implementation-source | approved | sha256:e22b215183e9ae944ab419ccfce0f5360821b78657bff125c47f48628bf1e47c | Defines legacy detection and mutation boundary. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | implementation-source | implementation-source | approved | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Places this capsule as T-04A13 and excludes migration/release work. |
| docs/AGENT_HANDOFF.md | reference | normative | approved | sha256:1d9089da3f08e580a0cf9f933a315caad4bc35c21edc992d9bd5035f6f930b15 | Current-state handoff names T-04A14 as next work after T-0440. |

## Goal

| Goal | Notes |
|---|---|
| Detect legacy HADARA project scaffolds and block 0.4 mutation commands before they write. | Implement the smallest shared boundary that prevents 0.4 commands from mutating missing/non-0.4 protocol projects, without adding migration or dual-layout support. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract and source document hashes. | Done | TASK.md |
| 2 | Trace mutation command entry points and existing scaffold metadata helpers. | Done | src/cli/task.ts; src/cli/init.ts; src/cli/docs.ts; src/cli/evidence.ts; src/cli/release-artifact.ts |
| 3 | Add a shared legacy-project guard to the bounded 0.4 mutation surfaces. | Done | ev:T-0440:8ee5f6fde6e74b3e97487556 |
| 4 | Validate with focused tests, built CLI smokes, and done-level harness validation. | Done | ev:T-0440:8ee5f6fde6e74b3e97487556; ev:T-0440:ced75760191e43c8aa18b42a; ev:T-0440:19cb30379ee84df2bb7339c7 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Projects missing `.hadara/scaffold.json` or declaring a non-0.4 protocol are classified as legacy/unsupported for 0.4 mutation purposes. | Yes | Met | ev:T-0440:8ee5f6fde6e74b3e97487556 | Required | docs/specs/0.4.0/productization-redesign/11_Legacy_Project_Boundary.md |
| AC-2 | Representative mutation commands fail closed on legacy projects before writing and return legacy/unsupported diagnostics. | Yes | Met | ev:T-0440:8ee5f6fde6e74b3e97487556; ev:T-0440:ced75760191e43c8aa18b42a | Required | docs/specs/0.4.0/productization-redesign/11_Legacy_Project_Boundary.md |
| AC-3 | Supported 0.4 projects retain existing mutation behavior. | Yes | Met | ev:T-0440:8ee5f6fde6e74b3e97487556; ev:T-0440:ced75760191e43c8aa18b42a | Required | docs/specs/0.4.0/productization-redesign/11_Legacy_Project_Boundary.md |
| AC-4 | No migration command, dual parser behavior, or old-project auto-upgrade path is added. | Yes | Met | ev:T-0440:8ee5f6fde6e74b3e97487556 | Required | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |
| AC-5 | Validation evidence is recorded and the capsule is ready for finalize/audit close proof. | Yes | Met | ev:T-0440:8ee5f6fde6e74b3e97487556; ev:T-0440:ced75760191e43c8aa18b42a; ev:T-0440:19cb30379ee84df2bb7339c7 | Required | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused Docker tests | `npm run build && npm run test:focused -- tests/unit/legacy-boundary.test.ts tests/unit/task-create.test.ts tests/unit/init.test.ts tests/unit/docs-registry.test.ts tests/unit/release-artifact.test.ts` in `hadara-dev` temp copy | Yes | Passed | ev:T-0440:8ee5f6fde6e74b3e97487556 |
| Built CLI smokes | Legacy temp project mutation commands and supported 0.4 project mutation command | Yes | Passed | ev:T-0440:ced75760191e43c8aa18b42a |
| Done-level harness | `hadara harness validate --task T-0440 --level done --json` | Yes | Passed | ev:T-0440:19cb30379ee84df2bb7339c7 |
| Diff hygiene | `git diff --check` | Yes | Passed | ev:T-0440:8db53c4dde49411c9362da60 |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/cli/legacy-boundary.ts | L22-L89 | Add shared 0.4 legacy mutation boundary report/helper. | Detect missing/non-0.4 scaffold metadata before mutation commands write. | ev:T-0440:8ee5f6fde6e74b3e97487556 |
| src/cli/task.ts | L25-L249 | Guard task create and execute-mode task mutations. | Block task lifecycle writes in legacy projects while preserving read-only reports. | ev:T-0440:8ee5f6fde6e74b3e97487556 |
| src/cli/init.ts | L186-L224 | Guard init upgrade/register-doc/enable-integration mutation paths. | Prevent writing 0.4 scaffold/docs over old projects. | ev:T-0440:8ee5f6fde6e74b3e97487556 |
| src/cli/docs.ts | L44-L78 | Guard docs register and managed patch execute paths. | Prevent registry and managed-section mutation in legacy projects. | ev:T-0440:8ee5f6fde6e74b3e97487556 |
| src/cli/evidence.ts | L98-L174 | Guard evidence migration execute and evidence append paths. | Prevent canonical evidence writes in legacy projects. | ev:T-0440:8ee5f6fde6e74b3e97487556 |
| src/cli/release-artifact.ts | L14-L23 | Guard release artifact execute path. | Prevent release artifact mutation in unsupported projects. | ev:T-0440:8ee5f6fde6e74b3e97487556 |
| src/cli/release-publish.ts | L12-L22 | Guard release publish execute path. | Prevent external release mutation in unsupported projects. | ev:T-0440:8ee5f6fde6e74b3e97487556 |
| tests/unit/legacy-boundary.test.ts | L25-L100 | Add missing-scaffold, non-0.4, and supported-0.4 boundary coverage. | Verify fail-closed behavior and supported project preservation. | ev:T-0440:8ee5f6fde6e74b3e97487556 |
| .hadara/scaffold.json | L1-L11 | Add generic 0.4 scaffold metadata for HADARA-dev dogfood. | Let this repository use the same supported-project boundary as normal 0.4 projects. | ev:T-0440:ced75760191e43c8aa18b42a |
| .hadara/context/MEMORY.md | L5-L12 | Record faster no-docker-cp validation copy pattern and scaffold dogfood note. | Preserve useful development learning from this capsule. | ev:T-0440:ced75760191e43c8aa18b42a |
| tests/unit/task-create.test.ts | L4-L121 | Initialize the CLI task-create smoke as a supported 0.4 project. | Align test setup with the new CLI mutation boundary. | ev:T-0440:8ee5f6fde6e74b3e97487556 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Risk | Mutation surfaces are spread across command handlers, so the implementation should reuse a small shared guard instead of duplicating ad hoc checks. | Open | docs/specs/0.4.0/productization-redesign/11_Legacy_Project_Boundary.md |
| RF-2 | Follow-up | Full legacy migration/export support is out of scope for 0.4.0. | Open | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |
