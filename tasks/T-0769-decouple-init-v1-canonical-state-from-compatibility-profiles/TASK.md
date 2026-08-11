# T-0769 Decouple Init v1 Canonical State from Compatibility Profiles

## Identity

| Field | Value |
|---|---|
| ID | T-0769 |
| Title | Decouple Init v1 Canonical State from Compatibility Profiles |
| Status | Done |
| Created | 2026-08-11T18:17 |
| Updated | 2026-08-11T18:38 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Re-freeze Init v1 around canonical project/document state and demote profiles to compatibility views. | Preserve T-0768's useful READ_MAP and heuristic regression fixes while removing preset/profile identity from canonical validity and authority selection. |

## Scope

| Boundary | Items |
|---|---|
| In | Current Init v1 routing spec amendment, architecture alignment, canonical feature/pack invariant boundaries, removal of `presetOrigin` mismatch enforcement, compatibility-view naming/behavior, and regression coverage. |
| Out | New profile schemas, persistent current-profile fields, routing authority changes, public CLI surface changes, npm/GitHub publish, and unrelated handoff/readiness work. |

## Capsule Budget

| Budget | Limit / decision |
|---|---|
| Capsule count | One corrective capsule: T-0769. Create a follow-up only for a separately reviewed defect found by validation. |
| Contract docs | Amend the current Init v1 routing spec and architecture note; preserve the retired freeze document unchanged. |
| Runtime surfaces | At most the canonical Init v1 validator/model, Init doctor compatibility projection, and protocol-profile compatibility view. |
| Persistence/schema | No new persistence field, profile enum, schema id, or canonical writer. Keep `project.json` and `documents.json` as the only Init v1 authority pair. |
| Tests | Focused Init model/doctor/protocol suites plus the repository check; include a valid `presetOrigin`/current-capability divergence case. |
| Release boundary | No publish mutation. Because runtime source changes invalidate RC4 evidence, refresh local RC4 readiness only if source changes land. |
| Stop condition | Stop when canonical validity is capability-invariant-only, profile views are non-authoritative, and all consumers fail closed on invalid/partial canonical state. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Re-freeze the current spec and capsule budget. | Done |
| 2 | Separate canonical validation/authority from compatibility profile views. | Done |
| 3 | Add divergence and fail-closed regressions; run full validation. | Done |
| 4 | Refresh RC4 local readiness if source changes invalidate the current artifact, then close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `presetOrigin` is documented and implemented as historical/init provenance, not current profile authority. | Met | ev:T-0769:eab53878796e4f008e2915dc | current Init v1 spec; `project.json` model |
| AC-2 | Init v1 authority and validity depend only on validated `.hadara/project.json` and `.hadara/documents.json`; profile classification is not required. | Met | ev:T-0769:eab53878796e4f008e2915dc | routing authority spec; `readValidatedInitV1State()` |
| AC-3 | Canonical project validation enforces concrete feature/pack schema and dependency invariants without reducing all states to three profiles. | Met | ev:T-0769:eab53878796e4f008e2915dc | `assertInitProjectConfig()` |
| AC-4 | `protocol-profile.ts` no longer emits `presetOrigin` versus inferred capability mismatch as canonical corruption. | Met | ev:T-0769:eab53878796e4f008e2915dc | compatibility view implementation |
| AC-5 | Compatibility labels are diagnostic/UX views only and cannot select routing authority or canonical writes. | Met | ev:T-0769:eab53878796e4f008e2915dc | doctor/profile consumers |
| AC-6 | Valid divergent-origin/current-capability, partial, malformed, and legacy cases have regression coverage. | Met | ev:T-0769:eab53878796e4f008e2915dc | focused tests |
| AC-7 | Capsule budget and release boundary are honored; no publish mutation occurs. | Met | ev:T-0769:f92a98f5a727429ea3564b7e, ev:T-0769:48de85a58c5740bc94d56a3b, ev:T-0769:1cb279e5db344154965e7c3d, ev:T-0769:a20c59e87a444cd3b53f834f, ev:T-0769:c7e61dc6c52a41a6bd1998b7, ev:T-0769:b1903e841095470ba8bc4da8 | task evidence and readiness reports |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused Init model/doctor/profile tests | Yes | Passed | 39 tests passed across Init model, protocol consistency, and doctor suites. | ev:T-0769:eab53878796e4f008e2915dc |
| Full repository validation | Yes | Passed | `npm run check`: 128 public test files (1 skipped), 1042 public tests (8 skipped), 16 HADARA-dev files (1 skipped), 137 HADARA-dev tests (1 skipped). | ev:T-0769:562f4490b7244112af12bfd3 |
| RC4 local readiness refresh | Yes | Passed | Runtime source changed; exact local artifact, package smoke, clean-checkout, gate, and dry-runs passed without publish mutation. | ev:T-0769:f92a98f5a727429ea3564b7e, ev:T-0769:48de85a58c5740bc94d56a3b, ev:T-0769:1cb279e5db344154965e7c3d, ev:T-0769:a20c59e87a444cd3b53f834f, ev:T-0769:c7e61dc6c52a41a6bd1998b7, ev:T-0769:b1903e841095470ba8bc4da8 |
| Evidence lint and task close | Yes | Passed | Proof-last close for T-0769. | ev:T-0769:601f48c4aa604e26a032c815 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5.0-rc3/00_Init_V1_Document_Routing_Authority.md` | constraint | active | Current routing authority and canonical-vs-view boundary. |
| `docs/archive/retired-2026-07-26/specs/0.5/redesign/HADARA_INIT_V1_FINAL_FREEZE_SPEC_KO.md` | reference | archived | Preserve unchanged; use its provenance/no-profile principles as design context. |
| `src/init/model.ts` | implementation | active | Canonical Init v1 state/schema validation. |
| `src/init/doctor.ts` | implementation | active | Init doctor and compatibility diagnostics. |
| `src/services/protocol-profile.ts` | implementation | active | Derived profile/compatibility view. |

## Changes

| Area | Summary |
|---|---|
| Specification | Current routing authority spec and architecture now state that project/documents are canonical, READ_MAP is projection, and profiles are compatibility views. |
| Canonical validation | Added capability classifier and kept `assertInitProjectConfig()` limited to schema/dependency invariants; removed provenance/profile consistency as validity. |
| Compatibility view | Protocol profile, Init doctor, planner, and legacy registry projection now derive from current capabilities; invalid/partial state remains fail-closed. |
| Regression | Added valid minimal-origin/standard-capability regression and retained minimal/standard/governed, READ_MAP, malformed, and legacy profile coverage; full check passed. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | RC4 local artifact/evidence must be refreshed if runtime source changes land. | Closed | `docs/RELEASE_READINESS.md`; ev:T-0769:f92a98f5a727429ea3564b7e |
| RF-2 | Risk | Existing consumers may assume profile labels are authoritative. | Mitigated | Compatibility-view regression and current routing/architecture clarification |

## Close Summary

Spec and capsule budget were re-frozen before implementation. The runtime correction is bounded to canonical Init v1 validation and derived compatibility views; no schema, routing authority, or publish surface was expanded.

RC4 local artifact/readiness was regenerated from commit `67d5935cfb4cd27bc4d79679e25789417917f4c5`; exact tarball SHA-256 is `5ccbb838940af4bad1e65308a7bed9e561ae682401d359df181c04ab89dc30ce`. Package smoke, clean-checkout smoke, strict gate, release dry-run, publish dry-run, and evidence lint passed without publish mutation.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Re-froze Init v1 canonical authority around project/documents state and bounded the capsule to one corrective implementation slice. |
| 2026-08-11 | Done | Implemented the bounded canonical-state/profile-view correction, refreshed RC4 local readiness without publish mutation, and passed evidence lint. |
